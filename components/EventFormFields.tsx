"use client";
import { Camera, CalendarDays, Link as LinkIcon, MapPin, X } from "lucide-react";
import { useRef } from "react";
import { formatDate } from "@/lib/events";

export type EventFormState = {
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
  fee: string;
  formUrl: string;
};

export const EMPTY_FORM: EventFormState = {
  thumbnailFile: null, thumbnailPreview: null,
  organizer: "", date: "", startTime: "", endTime: "",
  venue: "", description: "", fee: "", formUrl: "",
};

type Props = {
  form: EventFormState;
  onChange: (updated: Partial<EventFormState>) => void;
};

export default function EventFormFields({ form, onChange }: Props) {
  const thumbRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof EventFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    onChange({ [key]: e.target.value });

  const handleThumb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange({ thumbnailFile: file, thumbnailPreview: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeThumb = () => {
    onChange({ thumbnailFile: null, thumbnailPreview: null });
    if (thumbRef.current) thumbRef.current.value = "";
  };

  return (
    <>
      {/* サムネイル */}
      <div
        className="relative w-full aspect-video bg-gray-100 cursor-pointer"
        onClick={() => !form.thumbnailPreview && thumbRef.current?.click()}
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
        <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumb} />
      </div>

      <div className="px-4 pt-6 space-y-6">
        {/* 主催団体名 */}
        <Field label="主催団体名" required>
          <input type="text" value={form.organizer} onChange={set("organizer")}
            placeholder="例：AI研究三田会"
            className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent" />
        </Field>

        {/* 日程 */}
        <Field label="日程" required>
          <div className="flex items-center gap-2 border-b border-gray-200 py-2 cursor-pointer"
            onClick={() => dateRef.current?.showPicker?.()}>
            <CalendarDays size={16} className="text-gray-400 shrink-0" />
            <span className={`text-sm flex-1 ${form.date ? "text-gray-800" : "text-gray-400"}`}>
              {form.date ? formatDate(form.date) : "日付を選択"}
            </span>
            <input ref={dateRef} type="date" value={form.date} onChange={set("date")} className="sr-only" />
          </div>
        </Field>

        {/* 時間 */}
        <Field label="時間" required>
          <div className="flex items-center gap-3 border-b border-gray-200 py-2">
            <input type="time" value={form.startTime} onChange={set("startTime")}
              className="text-sm text-gray-800 focus:outline-none bg-transparent" />
            <span className="text-gray-400 text-sm">〜</span>
            <input type="time" value={form.endTime} onChange={set("endTime")}
              className="text-sm text-gray-800 focus:outline-none bg-transparent" />
          </div>
        </Field>

        {/* 場所 */}
        <Field label="開催場所" required>
          <div className="flex items-center gap-2 border-b border-gray-200 py-2">
            <MapPin size={15} className="text-gray-400 shrink-0" />
            <input type="text" value={form.venue} onChange={set("venue")}
              placeholder="例：俱楽部ルーム"
              className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent" />
          </div>
        </Field>

        {/* イベント概要 */}
        <Field label="イベント概要" required>
          <textarea value={form.description} onChange={set("description")}
            placeholder="イベントの内容を入力してください" rows={4}
            className="w-full border-b border-gray-200 py-2 text-sm text-gray-800 focus:outline-none focus:border-blue-400 bg-transparent resize-none"
            style={{ minHeight: "120px" }} />
        </Field>

        {/* 参加費 */}
        <Field label="参加費" optional>
          <div className="flex items-center gap-2 border-b border-gray-200 py-2">
            <input
              type="number" min="0" step="1"
              value={form.fee}
              onChange={set("fee")}
              placeholder="0"
              className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent"
            />
            <span className="text-sm text-gray-500 shrink-0">円</span>
          </div>
        </Field>

        {/* 申し込みリンク */}
        <Field label="申し込みリンク" optional>
          <div className="flex items-center gap-2 border-b border-gray-200 py-2">
            <LinkIcon size={15} className="text-gray-400 shrink-0" />
            <input type="url" value={form.formUrl} onChange={set("formUrl")}
              placeholder="https://forms.gle/..."
              className="flex-1 text-sm text-gray-800 focus:outline-none bg-transparent" />
          </div>
        </Field>
      </div>
    </>
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
