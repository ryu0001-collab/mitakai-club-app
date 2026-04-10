"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventFormFields, { EventFormState, EMPTY_FORM } from "@/components/EventFormFields";
import { getMyEventById, updateEvent } from "@/lib/myEventStore";

export default function MyEventEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<EventFormState>(EMPTY_FORM);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const ev = getMyEventById(id);
    if (!ev) { setNotFound(true); return; }
    setStatus(ev.status);
    setForm({
      thumbnailFile: null,
      thumbnailPreview: ev.thumbnailUrl,
      organizer: ev.organizer,
      date: ev.date,
      startTime: ev.startTime,
      endTime: ev.endTime,
      venue: ev.venue ?? "",
      description: ev.description,
      fee: ev.fee != null ? String(ev.fee) : "",
      formUrl: ev.formUrl ?? "",
    });
  }, [id]);

  const update = (patch: Partial<EventFormState>) => setForm((p) => ({ ...p, ...patch }));

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      updateEvent(id, {
        organizer: form.organizer,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        venue: form.venue || null,
        description: form.description,
        thumbnailUrl: form.thumbnailPreview,
        formUrl: form.formUrl || null,
        fee: form.fee !== "" ? parseInt(form.fee, 10) : null,
        status, // published なら維持
      });
      router.push("/events/my_events");
    } finally {
      setSaving(false);
    }
  };

  if (notFound) return (
    <div className="flex-1 flex items-center justify-center text-gray-400">イベントが見つかりません</div>
  );

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-[60px] border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => router.push("/events/my_events")} className="w-9 h-9 flex items-center justify-center text-gray-600">
          <ChevronLeft size={28} />
        </button>
        <span className="text-base font-medium text-gray-700">イベントを編集</span>
        <button onClick={handleSave} disabled={saving}
          className="text-sm font-semibold text-blue-600 px-2 disabled:text-gray-300">
          {saving ? "保存中..." : "保存する"}
        </button>
      </header>
      <div className="flex-1 overflow-y-auto pb-8">
        <EventFormFields form={form} onChange={update} />
      </div>
    </div>
  );
}
