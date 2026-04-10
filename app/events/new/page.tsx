"use client";
import { Camera, Link as LinkIcon, X, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type FormState = {
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  formUrl: string;
};

const INITIAL: FormState = {
  thumbnailFile: null,
  thumbnailPreview: null,
  organizer: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  formUrl: "",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

export default function EventNewPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const isValid =
    form.thumbnailFile !== null &&
    form.organizer.trim() !== "" &&
    form.date !== "" &&
    form.startTime !== "" &&
    form.endTime !== "" &&
    form.description.trim() !== "";

  const handleThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((p) => ({ ...p, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) }));
  };

  const removeThumb = () => {
    setForm((p) => ({ ...p, thumbnailFile: null, thumbnailPreview: null }));
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      // TODO: Supabase等にアップロード・INSERT
      await new Promise((r) => setTimeout(r, 800)); // 仮の非同期処理
      router.push("/events");
    } catch {
      alert("投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 h-[60px] border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => router.push("/events")} className="w-9 h-9 flex items-center justify-center text-gray-600">
          <X size={22} />
        </button>
        <span className="text-base font-medium text-gray-700">イベントを作成</span>
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`text-sm font-semibold px-2 transition ${isValid && !submitting ? "text-blue-600" : "text-gray-300"}`}
        >
          {submitting ? "投稿中..." : "投稿"}
        </button>
      </header>

      {/* フォーム */}
      <div className="flex-1 overflow-y-auto pb-8">

        {/* (1) サムネイル */}
        <div
          className="relative w-full aspect-video bg-gray-100 cursor-pointer"
          onClick={() => !form.thumbnailPreview && thumbInputRef.current?.click()}
        >
          {form.thumbnailPreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); removeThumb(); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Camera size={32} />
              <span className="text-sm">タップして画像を追加</span>
            </div>
          )}
          <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumb} />
        </div>

        <div className="px-4 pt-6 space-y-6">

          {/* (2) 主催団体名 */}
          <Field label="主催団体名" required>
            <input
              type="text"
              value={form.organizer}
              onChange={set("organizer")}
              placeholder="例：AI研究三田会"
              className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent"
            />
          </Field>

          {/* (3) 日程 */}
          <Field label="日程" required>
            <div
              className="flex items-center gap-2 border-b border-gray-200 py-2 cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.()}
            >
              <CalendarDays size={16} className="text-gray-400 shrink-0" />
              <span className={`text-sm flex-1 ${form.date ? "text-gray-800" : "text-gray-400"}`}>
                {form.date ? formatDate(form.date) : "日付を選択"}
              </span>
              <input
                ref={dateInputRef}
                type="date"
                value={form.date}
                onChange={set("date")}
                className="sr-only"
              />
            </div>
          </Field>

          {/* (4) 時間 */}
          <Field label="時間" required>
            <div className="flex items-center gap-3 border-b border-gray-200 py-2">
              <input
                type="time"
                value={form.startTime}
                onChange={set("startTime")}
                className="text-sm text-gray-800 focus:outline-none bg-transparent"
              />
              <span className="text-gray-400 text-sm">〜</span>
              <input
                type="time"
                value={form.endTime}
                onChange={set("endTime")}
                className="text-sm text-gray-800 focus:outline-none bg-transparent"
              />
            </div>
          </Field>

          {/* (5) イベント概要 */}
          <Field label="イベント概要" required>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="イベントの内容を入力してください"
              rows={4}
              className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent resize-none"
              style={{ minHeight: "120px" }}
            />
          </Field>

          {/* (6) 申し込みリンク（任意） */}
          <Field label="申し込みリンク" optional>
            <div className="flex items-center gap-2 border-b border-gray-200 py-2">
              <LinkIcon size={15} className="text-gray-400 shrink-0" />
              <input
                type="url"
                value={form.formUrl}
                onChange={set("formUrl")}
                placeholder="https://forms.gle/..."
                className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent"
              />
            </div>
          </Field>

        </div>
      </div>
    </div>
  );
}

function Field({ label, required, optional, children }: {
  label: string; required?: boolean; optional?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[13px] font-medium text-gray-600">{label}</span>
        {required && <span className="text-[11px] text-red-400 font-medium">必須</span>}
        {optional && <span className="text-[11px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">任意</span>}
      </div>
      {children}
    </div>
  );
}
