"use client";
import Header from "@/components/Header";
import FacultyRingAvatar from "@/components/FacultyRingAvatar";
import { usePresentUsers, getLastVisitLabel } from "@/context/PresentUsersContext";
import { useCurrentUser, toPresentUser, CURRENT_USER_ID } from "@/context/CurrentUserContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const STATIC_RECENT_USERS = [
  { id: "5", name: "佐藤 健一", faculty: "法学部（法律学科）", dept: "法学部 '98卒", comment: "弁護士やってます", avatarUrl: "https://i.pravatar.cc/150?u=5", lastLogin: "3日前" },
  { id: "6", name: "山本 真由", faculty: "理工学部", dept: "理工学部 '12卒", comment: "エンジニアです", avatarUrl: "https://i.pravatar.cc/150?u=6", lastLogin: "5日前" },
  { id: "7", name: "中村 拓也", faculty: "総合政策学部", dept: "総合政策学部 '07卒", comment: "NPOで活動中", avatarUrl: "https://i.pravatar.cc/150?u=7", lastLogin: "8日前" },
  { id: "8", name: "小林 奈緒", faculty: "看護医療学部", dept: "看護医療学部 '18卒", comment: "よろしくお願いします", avatarUrl: "https://i.pravatar.cc/150?u=8", lastLogin: "11日前" },
  { id: "9", name: "加藤 浩二", faculty: "経済学部", dept: "経済学部 '91卒", comment: "投資が趣味です", avatarUrl: "https://i.pravatar.cc/150?u=9", lastLogin: "15日前" },
  { id: "10", name: "渡辺 さくら", faculty: "文学部", dept: "文学部 '05卒", comment: "出版社に勤めています", avatarUrl: "https://i.pravatar.cc/150?u=10", lastLogin: "20日前" },
  { id: "11", name: "鈴木 一朗", faculty: "商学部", dept: "商学部 '00卒", comment: "起業準備中！", avatarUrl: "https://i.pravatar.cc/150?u=11", lastLogin: "27日前" },
];

function UserRow({ id, name, faculty, dept, comment, avatarUrl, sub }: {
  id: string; name: string; faculty: string; dept: string;
  comment: string; avatarUrl: string | null; sub?: string;
}) {
  return (
    <li>
      <Link href={`/profile/${id}`} className="flex items-center gap-4 active:opacity-70 transition">
        <FacultyRingAvatar avatarUrl={avatarUrl} faculty={faculty} name={name} size={56} ringWidth={3} />
        <div className="flex-1">
          <p className="text-base text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{dept}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">最終来店: {sub}</p>}
        </div>
        <p className="text-sm text-gray-700 text-right max-w-[40%]">{comment}</p>
      </Link>
    </li>
  );
}

export default function HomePage() {
  const { presentUsers, recentVisitors } = usePresentUsers();
  const { profile } = useCurrentUser();
  const [, setTick] = useState(0);

  // ラベルを最大1分ごとに更新
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // 自分の最新プロフィールで来店中・退店済みリストを上書き
  const me = toPresentUser(profile);
  const displayPresentUsers = presentUsers.map((u) => u.id === CURRENT_USER_ID ? me : u);
  const displayRecentVisitors = recentVisitors.map((v) => v.id === CURRENT_USER_ID ? { ...me, lastVisitAt: v.lastVisitAt } : v);

  // 動的な退店ユーザーを先頭に、静的ダミーを後ろに結合
  const recentSection = [
    ...displayRecentVisitors.map((v) => ({
      id: v.id,
      name: v.name,
      faculty: v.faculty,
      dept: v.dept,
      comment: v.comment,
      avatarUrl: v.avatarUrl,
      lastLogin: getLastVisitLabel(v.lastVisitAt),
    })),
    ...STATIC_RECENT_USERS.filter((u) => !recentVisitors.some((v) => v.id === u.id)),
  ];

  return (
    <>
      <Header title="東京三田倶楽部のログイン状況" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-8">

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">現在来店している会員</h2>
          {displayPresentUsers.length === 0 ? (
            <p className="text-sm text-gray-400">現在、来店している会員はいません</p>
          ) : (
            <ul className="space-y-6">
              {displayPresentUsers.map((u) => (
                <UserRow key={u.id} {...u} />
              ))}
            </ul>
          )}
        </section>

        <div className="border-t border-gray-100" />

        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">過去30日以内に来店した人</h2>
          <ul className="space-y-6">
            {recentSection.map((u) => (
              <UserRow key={u.id} {...u} sub={u.lastLogin} />
            ))}
          </ul>
        </section>

      </main>
    </>
  );
}
