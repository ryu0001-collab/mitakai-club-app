"use client";
import { CalendarDays, ChevronLeft, CircleDollarSign, Clock, ExternalLink, ImageIcon, MapPin } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { MOCK_EVENTS, formatDate } from "@/lib/events";
import { getMyEventById } from "@/lib/myEventStore";
import FacultyRingAvatar from "@/components/FacultyRingAvatar";
import Link from "next/link";
import { useCurrentUser, CURRENT_USER_ID } from "@/context/CurrentUserContext";

export default function EventDetailPage() {
  const router = useRouter();
  const { eventId } = useParams<{ eventId: string }>();
  const { profile } = useCurrentUser();
  const event = MOCK_EVENTS.find((e) => e.id === eventId) ?? getMyEventById(eventId);

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        イベントが見つかりません
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-28">

      {/* サムネイル（戻るボタン付き） */}
      <div className="relative w-full aspect-video bg-gray-100 shrink-0">
        {event.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.thumbnailUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
            <ImageIcon size={36} />
            <span className="text-sm">画像なし</span>
          </div>
        )}
        {/* 戻るボタン */}
        <div className="fixed top-3 left-3 z-50">
          <button
            onClick={() => router.push("/events")}
            className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-700"
          >
            <ChevronLeft size={22} />
          </button>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4">

        {/* イベント名・主催 */}
        <div className="pb-4 border-b border-gray-100">
          <h1 className="text-[20px] font-medium text-gray-900 mb-1">{event.title}</h1>
          <p className="text-sm text-gray-500">{event.organizer}</p>
        </div>

        {/* 日程・時間 */}
        <div className="pb-4 border-b border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays size={16} className="text-gray-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock size={16} className="text-gray-400 shrink-0" />
            <span>{event.startTime}〜{event.endTime}</span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span>{event.venue}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CircleDollarSign size={16} className="text-gray-400 shrink-0" />
            <span>{!event.fee ? "無料" : `¥${event.fee.toLocaleString()}`}</span>
          </div>
        </div>

        {/* 概要 */}
        <div className="pb-4 border-b border-gray-100">
          <p className="text-[13px] font-medium text-gray-400 mb-2">概要</p>
          <p className="text-[15px] text-gray-800 leading-[1.8]">{event.description}</p>
        </div>

        {/* メモ・申し込みリンク */}
        {event.formUrl && (
          <div className="pb-4 border-b border-gray-100">
            <p className="text-[13px] font-medium text-gray-400 mb-2">メモ・申し込みリンク</p>
            <a
              href={event.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 text-sm hover:underline"
            >
              <ExternalLink size={15} />
              申し込みフォームはこちら
            </a>
          </div>
        )}

        {/* 公開した人 */}
        {event.creator && (() => {
          const isMe = event.creator.id === CURRENT_USER_ID;
          const creatorName = isMe ? profile.name : event.creator.name;
          const creatorDept = isMe ? `${profile.dept} '${String(profile.gradYear).slice(-2)}卒` : event.creator.dept;
          const creatorFaculty = isMe ? profile.dept : event.creator.faculty;
          const creatorAvatar = isMe ? profile.avatarImage : event.creator.avatarUrl;
          return (
            <div className="pb-4">
              <p className="text-[13px] font-medium text-gray-400 mb-3">このイベントを公開した人</p>
              <Link
                href={`/profile/${event.creator.id}`}
                className="flex items-center gap-4 active:opacity-70 transition"
              >
                <FacultyRingAvatar
                  avatarUrl={creatorAvatar}
                  faculty={creatorFaculty}
                  name={creatorName}
                  size={56}
                  ringWidth={3}
                />
                <div>
                  <p className="text-base text-gray-800">{creatorName}</p>
                  <p className="text-sm text-gray-500">{creatorDept}</p>
                </div>
              </Link>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
