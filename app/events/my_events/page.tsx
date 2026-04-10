"use client";
import { ChevronLeft, ImageIcon, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Event, formatDate } from "@/lib/events";
import { getMyEvents } from "@/lib/myEventStore";
import EventActionSheet from "@/components/EventActionSheet";

function StatusBadge({ status }: { status: Event["status"] }) {
  return status === "published"
    ? <span className="text-[11px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full shrink-0">リリース済み</span>
    : <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">下書き</span>;
}

export default function MyEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);

  const reload = () => setEvents(getMyEvents());

  useEffect(() => { reload(); }, []);

  return (
    <div className="flex-1 flex flex-col pb-24">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 flex items-center px-4 h-[60px] border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => router.push("/events")}
          className="w-9 h-9 flex items-center justify-center text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="flex-1 text-center text-base font-medium text-gray-700">マイイベント</span>
        <div className="w-9" />
      </header>

      {/* 一覧 */}
      <div className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
            <ImageIcon size={36} />
            <p className="text-sm">作成したイベントはありません</p>
          </div>
        ) : (
          <ul>
            {events.map((ev) => (
              <li key={ev.id}>
                <button
                  onClick={() => setSelected(ev)}
                  className="w-full flex items-center gap-3 px-4 py-4 border-b border-gray-100 text-left active:bg-gray-50"
                >
                  {/* サムネイル */}
                  <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-gray-200">
                    {ev.thumbnailUrl
                      ? <img src={ev.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      : <div className={`w-full h-full ${ev.color} flex items-center justify-center text-white text-xs p-1 text-center`}>{ev.organizer.replace(/[[\]]/g,"")}</div>
                    }
                  </div>
                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(ev.date)}</p>
                  </div>
                  {/* バッジ */}
                  <StatusBadge status={ev.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 新規作成FAB */}
      <button
        onClick={() => router.push("/events/my_events/new")}
        className="fixed z-40 flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg"
        style={{ bottom: "80px", right: "16px" }}
      >
        <Pencil size={16} />
        新規イベントを作成
      </button>

      {/* アクションシート */}
      {selected && (
        <EventActionSheet
          event={selected}
          onClose={() => setSelected(null)}
          onUpdated={reload}
        />
      )}
    </div>
  );
}
