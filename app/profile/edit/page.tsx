"use client";
import Header from "@/components/Header";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCurrentUser } from "@/context/CurrentUserContext";

const FACULTIES = [
  {
    group: "学部",
    options: [
      "文学部", "経済学部", "法学部（法律学科）", "法学部（政治学科）",
      "商学部", "医学部", "理工学部", "総合政策学部",
      "環境情報学部", "看護医療学部", "薬学部（薬学科）", "薬学部（薬科学科）",
    ],
  },
  {
    group: "大学院",
    options: [
      "文学研究科", "経済学研究科", "法学研究科", "社会学研究科",
      "商学研究科", "医学研究科", "理工学研究科", "政策・メディア研究科",
      "健康マネジメント研究科", "薬学研究科", "経営管理研究科（KBS）",
      "システムデザイン・マネジメント研究科（SDM）", "メディアデザイン研究科（KMD）",
      "法務研究科（ロースクール）",
    ],
  },
];

const COMMITTEES = [
  "企画委員会", "会員交流委員会", "国際交流委員会", "運営委員会",
  "広報委員会", "会員拡大委員会", "総務財務委員会", "マーケティング委員会",
];

const GRADUATION_YEARS = Array.from({ length: 2030 - 1868 + 1 }, (_, i) => 2030 - i);

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile } = useCurrentUser();
  const [form, setForm] = useState(profile);
  const [coverPreview, setCoverPreview] = useState<string | null>(profile.coverImage);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarImage);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleImageChange = (type: "cover" | "avatar") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "cover") setCoverPreview(url);
    else setAvatarPreview(url);
  };

  const handleSave = () => {
    updateProfile({ ...form, coverImage: coverPreview, avatarImage: avatarPreview });
    router.push("/profile");
  };

  return (
    <>
      <Header title="プロフィール編集" />
      <div className="flex-1 overflow-y-auto pb-6">

        {/* カバー画像 */}
        <div
          className="relative h-[140px] bg-gray-200 cursor-pointer"
          onClick={() => coverInputRef.current?.click()}
        >
          {coverPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <Camera size={28} className="text-white opacity-70" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-black/30 px-3 py-1 rounded-full">カバー画像を変更</span>
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange("cover")} />
        </div>

        {/* アバター */}
        <div className="px-4 relative">
          <div
            className="absolute -top-11 left-4 w-[90px] h-[90px] rounded-full border-4 border-white bg-blue-100 flex items-center justify-center overflow-hidden shadow cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="text-blue-600 font-bold text-3xl">{form.name[0] ?? "?"}</span>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-full">
                  <Camera size={20} className="text-white" />
                </div>
              </>
            )}
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange("avatar")} />
          <div className="pt-14" />
        </div>

        {/* フォーム */}
        <div className="px-4 space-y-5 mt-2">
          <Section label="基本情報">
            <Field label="氏名" value={form.name} onChange={handleChange("name")} />
            <SelectField label="学部" value={form.dept} onChange={(v) => setForm((p) => ({ ...p, dept: v }))} />
            <GradYearField value={form.gradYear} onChange={(v) => setForm((p) => ({ ...p, gradYear: v }))} />
            <Field label="職種" value={form.job} onChange={handleChange("job")} />
          </Section>

          <div className="border-t border-gray-100" />

          <Section label="連絡・所属">
            <Field label="連絡先（メール・LINE URL・instagramなど）" value={form.email} onChange={handleChange("email")} type="email" />
            <SelectField label="所属委員会" value={form.committee} onChange={(v) => setForm((p) => ({ ...p, committee: v }))} options={COMMITTEES} placeholder="所属委員会を選択してください" />
            <Field label="所属三田会" value={form.mitakai} onChange={handleChange("mitakai")} />
          </Section>

          <div className="border-t border-gray-100" />

          <Section label="自己紹介">
            <Field label="好きな食べ物" value={form.food} onChange={handleChange("food")} />
            <Field label="趣味" value={form.hobby} onChange={handleChange("hobby")} />
            <TextAreaField label="ひとこと" value={form.bio} onChange={handleChange("bio")} />
          </Section>
        </div>

        {/* 保存ボタン */}
        <div className="px-4 mt-8">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 transition"
          >
            保存
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent"
      />
    </div>
  );
}

function GradYearField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">卒業年</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent appearance-none"
      >
        <option value="" disabled>卒業年を選択してください</option>
        {GRADUATION_YEARS.map((year) => (
          <option key={year} value={year}>{year}年卒</option>
        ))}
      </select>
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options?: string[]; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent appearance-none"
      >
        <option value="" disabled>{placeholder ?? `${label}を選択してください`}</option>
        {options
          ? options.map((opt) => <option key={opt} value={opt}>{opt}</option>)
          : FACULTIES.map(({ group, options: opts }) => (
              <optgroup key={group} label={group}>
                {opts.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </optgroup>
            ))}
      </select>
    </div>
  );
}

const BIO_MAX = 30;

function TextAreaField({
  label, value, onChange,
}: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const over = value.length > BIO_MAX;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-xs text-gray-400">{label}</label>
        <span className={`text-xs ${over ? "text-red-500 font-medium" : "text-gray-400"}`}>
          {value.length}/{BIO_MAX}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= BIO_MAX) onChange(e);
        }}
        rows={3}
        maxLength={BIO_MAX}
        className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent resize-none"
      />
    </div>
  );
}
