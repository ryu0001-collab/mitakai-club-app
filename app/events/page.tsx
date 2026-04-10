"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Event, MOCK_EVENTS } from "@/lib/events";
import { getMyEvents } from "@/lib/myEventStore";
import { useEffect, useState } from "react";

function groupByDate(events: Event[]) {
  const map = new Map<string, Event[]>();
  for (const ev of events) {
    if (!map.has(ev.date)) map.set(ev.date, []);
    map.get(ev.date)!.push(ev);
  }
  // 日付昇順でソート
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function formatSectionDate(dateStr: string) {
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}

export default function EventsPage() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const load = () => {
    const myPublished = getMyEvents().filter((e) => e.status === "published");
    const combined = [...MOCK_EVENTS, ...myPublished];
    setAllEvents(combined);
  };

  useEffect(() => {
    load();
    // ページに戻ってきたとき（タブ切り替え・フォーカス）に再読み込み
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  const grouped = groupByDate(allEvents);

  return (
    <>
      <Header title="イベント情報" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 overflow-y-auto">
        {Array.from(grouped.entries()).map(([date, events]) => (
          <div key={date} className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">{formatSectionDate(date)}</h2>
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id}>
                  <Link href={`/events/${ev.id}`} className="flex gap-4 items-start border-b border-gray-100 pb-4 active:opacity-70 transition">
                    <div className={`w-20 h-20 rounded-lg shrink-0 overflow-hidden ${ev.thumbnailUrl ? "" : ev.color + " flex items-center justify-center text-white text-xs text-center p-1"}`}>
                      {ev.thumbnailUrl
                        ? <img src={ev.thumbnailUrl} alt={ev.title} className="w-full h-full object-cover" />
                        : ev.organizer.replace(/[[\]]/g, "")
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">{ev.startTime}〜{ev.endTime}</p>
                      <p className="text-xs text-gray-500 mb-1">{ev.organizer}</p>
                      <p className="text-sm font-bold text-gray-800 leading-snug">{ev.title}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      {/* イベントを追加ボタン */}
      <Link
        href="/events/my_events"
        className="fixed z-40 flex items-center gap-2 bg-white border border-blue-600 text-blue-600 text-sm font-medium px-4 py-2.5 rounded-full shadow-md"
        style={{ bottom: "80px", right: "16px" }}
      >
        <CalendarDays size={16} />
        イベントを追加
      </Link>
    </>
  );
}
