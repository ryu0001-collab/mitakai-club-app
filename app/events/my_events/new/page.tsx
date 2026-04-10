"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EventFormFields, { EventFormState, EMPTY_FORM } from "@/components/EventFormFields";
import { createEvent } from "@/lib/myEventStore";
import { useCurrentUser, toPresentUser } from "@/context/CurrentUserContext";

export default function MyEventNewPage() {
  const router = useRouter();
  const { profile } = useCurrentUser();
  const [form, setForm] = useState<EventFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<EventFormState>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const me = toPresentUser(profile);
      // TODO: 画像をStorageにアップロードしてURLを取得
      createEvent({
        title: form.organizer ? `${form.organizer}のイベント` : "（タイトル未設定）",
        organizer: form.organizer,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        description: form.description,
        thumbnailUrl: form.thumbnailPreview, // 本番はStorageのURL
        venue: form.venue || null,
        formUrl: form.formUrl || null,
        fee: form.fee !== "" ? parseInt(form.fee, 10) : null,
        status: "draft",
      }, me);
      router.push("/events/my_events");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-[60px] border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => router.push("/events/my_events")} className="w-9 h-9 flex items-center justify-center text-gray-600">
          <X size={22} />
        </button>
        <span className="text-base font-medium text-gray-700">イベントを作成</span>
        <button onClick={handleSave} disabled={saving}
          className="text-sm font-semibold text-blue-600 px-2 disabled:text-gray-300">
          {saving ? "保存中..." : "下書き保存"}
        </button>
      </header>
      <div className="flex-1 overflow-y-auto pb-8">
        <EventFormFields form={form} onChange={update} />
      </div>
    </div>
  );
}
