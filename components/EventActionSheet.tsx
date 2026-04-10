"use client";
import { Globe, Pencil, Trash2, X } from "lucide-react";
import { Event } from "@/lib/events";
import { publishEvent, deleteEvent } from "@/lib/myEventStore";
import { useRouter } from "next/navigation";

type Props = {
  event: Event;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EventActionSheet({ event, onClose, onUpdated }: Props) {
  const router = useRouter();

  const handlePublish = () => {
    if (!confirm("このイベントを公開しますか？")) return;
    publishEvent(event.id);
    onUpdated();
    onClose();
  };

  const handleDelete = () => {
    if (!confirm("このイベントを削除しますか？この操作は取り消せません")) return;
    deleteEvent(event.id);
    onUpdated();
    onClose();
  };

  return (
    <>
      {/* オーバーレイ */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* シート */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl pb-8 animate-slide-up">
        {/* ドラッグハンドル */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* イベント名 */}
        <p className="text-sm font-medium text-gray-800 px-5 pb-3 border-b border-gray-100 line-clamp-2">
          {event.title}
        </p>

        <div className="px-2 pt-2">
          {/* 公開する（下書きのみ） */}
          {event.status === "draft" && (
            <SheetButton icon={<Globe size={18} />} label="公開する" onClick={handlePublish} />
          )}

          {/* 編集する */}
          <SheetButton
            icon={<Pencil size={18} />}
            label="編集する"
            onClick={() => { onClose(); router.push(`/events/my_events/${event.id}`); }}
          />

          {/* 削除する */}
          <SheetButton
            icon={<Trash2 size={18} />}
            label="削除する"
            onClick={handleDelete}
            danger
          />
        </div>

        {/* キャンセル */}
        <div className="px-4 mt-3">
          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-100 text-sm font-medium text-gray-600">
            キャンセル
          </button>
        </div>
      </div>
    </>
  );
}

function SheetButton({ icon, label, onClick, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition hover:bg-gray-50 ${danger ? "text-red-500" : "text-gray-800"}`}>
      {icon}{label}
    </button>
  );
}
