import { Pencil } from "lucide-react";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import BackButton from "./BackButton";
import FacultyRingAvatar from "./FacultyRingAvatar";

export type UserProfile = {
  name: string;
  dept: string;
  gradYear: string;
  job: string;
  email: string;
  committee: string;
  mitakai: string;
  food: string;
  hobby: string;
  bio: string;
  avatarInitial: string;
  coverImage: string | null;
  avatarImage: string | null;
};

type Props = {
  user: UserProfile;
  isOwnProfile: boolean;  // trueのとき: Profileタブからの自分（編集ボタンあり）
  showBack?: boolean;     // trueのとき: カバー左上に戻るボタンを表示
  isFavorited?: boolean;  // falseのとき: お気に入りボタンを非表示（自分 or 未設定）
};

export default function ProfileView({ user: u, isOwnProfile, showBack = false, isFavorited }: Props) {
  return (
    <div className="flex-1 overflow-y-auto pb-4">

      {/* カバー画像 */}
      <div className="relative h-[140px] bg-gray-200 w-full">
        {u.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.coverImage} alt="cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
        )}

        {/* 戻るボタン（左上） */}
        {showBack && (
          <div className="absolute top-3 left-3">
            <BackButton />
          </div>
        )}

        {/* 自分のみ：編集ボタン（右上） */}
        {isOwnProfile && (
          <Link href="/profile/edit" className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center">
            <Pencil size={16} className="text-gray-600" />
          </Link>
        )}
      </div>

      {/* アバター＋お気に入りボタン行 */}
      <div className="relative px-4">
        {/* アバター */}
        <div className="absolute -top-11 left-4 drop-shadow">
          <FacultyRingAvatar
            avatarUrl={u.avatarImage}
            faculty={u.dept}
            name={u.name}
            initial={u.avatarInitial}
            size={80}
            ringWidth={4}
          />
        </div>

        {/* お気に入りボタン（他人のみ表示） */}
        {isFavorited !== undefined && (
          <div className="flex justify-end pt-3">
            <FavoriteButton initialFavorited={isFavorited} />
          </div>
        )}

        {/* 名前・基本情報 */}
        <div className={isFavorited === undefined && !showBack ? "pt-14" : "pt-3"}>
          <h1 className="text-[22px] font-bold text-gray-900">{u.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {u.dept}　{u.gradYear}／{u.job}
          </p>
        </div>
      </div>

      {/* 区切り線 */}
      <div className="border-t border-gray-100 mx-4 mt-5" />

      {/* セクション1：連絡・所属 */}
      <div className="px-4 mt-4 space-y-4">
        <InfoRow label="連絡先" value={u.email} />
        <InfoRow label="所属委員会" value={u.committee} />
        <InfoRow label="所属三田会" value={u.mitakai} />
      </div>

      {/* 区切り線 */}
      <div className="border-t border-gray-100 mx-4 mt-5" />

      {/* セクション2：自己紹介 */}
      <div className="px-4 mt-4 space-y-4">
        <InfoRow label="好きな食べ物" value={u.food} />
        <InfoRow label="趣味" value={u.hobby} />
        <InfoRow label="ひとこと" value={u.bio} multiline />
      </div>

    </div>
  );
}

function InfoRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      {multiline ? (
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{value || ""}</p>
      ) : (
        <p className="text-sm text-gray-800">{value || ""}</p>
      )}
    </div>
  );
}
