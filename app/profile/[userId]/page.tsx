"use client";
import Header from "@/components/Header";
import ProfileView, { type UserProfile } from "@/components/ProfileView";
import { useCurrentUser, toUserProfile, CURRENT_USER_ID } from "@/context/CurrentUserContext";
import { useParams } from "next/navigation";

const SELF_ID = "4"; // ログイン中のユーザーID（後で認証に置き換え）

// モックデータ（後でDB取得に置き換え）
const MOCK_USERS: Record<string, UserProfile> = {
  "4": {
    name: "大森 嘉月",
    dept: "環境情報学部",
    gradYear: "'96卒",
    job: "コンサルティング",
    email: "yoshitsuki@example.com",
    committee: "イベント企画委員会",
    mitakai: "AI研究三田会",
    food: "ラーメン",
    hobby: "登山、読書",
    bio: "スタートアップ支援をしています。気軽に話しかけてください！",
    avatarInitial: "大",
    coverImage: "https://picsum.photos/seed/user4/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=4",
  },
  "1": {
    name: "伊藤 雅子",
    dept: "商学部",
    gradYear: "'15卒",
    job: "マーケティング",
    email: "masako@example.com",
    committee: "広報委員会",
    mitakai: "ファッション&ビューティー三田会",
    food: "パスタ",
    hobby: "ヨガ、映画鑑賞",
    bio: "こんにちは！一緒に楽しみましょう。",
    avatarInitial: "伊",
    coverImage: "https://picsum.photos/seed/ito/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=1",
  },
  "2": {
    name: "大沢 幸雄",
    dept: "経済学部",
    gradYear: "'03卒",
    job: "金融",
    email: "yukio@example.com",
    committee: "",
    mitakai: "若手育成三田会",
    food: "焼肉",
    hobby: "ゴルフ",
    bio: "婚活中です...",
    avatarInitial: "大",
    coverImage: "https://picsum.photos/seed/osawa/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=2",
  },
  "3": {
    name: "田中 みな",
    dept: "文学部",
    gradYear: "'09卒",
    job: "教育",
    email: "mina@example.com",
    committee: "",
    mitakai: "メンター三田会",
    food: "スイーツ",
    hobby: "読書、カフェ巡り",
    bio: "友達が欲しい",
    avatarInitial: "田",
    coverImage: "https://picsum.photos/seed/tanaka/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=3",
  },
  "5": {
    name: "佐藤 健一",
    dept: "法学部（法律学科）",
    gradYear: "'98卒",
    job: "弁護士",
    email: "kenichi@example.com",
    committee: "会員交流委員会",
    mitakai: "法曹三田会",
    food: "寿司",
    hobby: "テニス、読書",
    bio: "弁護士やってます。法律相談があればお気軽に！",
    avatarInitial: "佐",
    coverImage: "https://picsum.photos/seed/sato/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=5",
  },
  "6": {
    name: "山本 真由",
    dept: "理工学部",
    gradYear: "'12卒",
    job: "ソフトウェアエンジニア",
    email: "mayu@example.com",
    committee: "マーケティング委員会",
    mitakai: "理工系三田会",
    food: "ラーメン",
    hobby: "プログラミング、ゲーム",
    bio: "エンジニアです。技術の話が大好きです！",
    avatarInitial: "山",
    coverImage: "https://picsum.photos/seed/yamamoto/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=6",
  },
  "7": {
    name: "中村 拓也",
    dept: "総合政策学部",
    gradYear: "'07卒",
    job: "NPO代表",
    email: "takuya@example.com",
    committee: "運営委員会",
    mitakai: "社会起業家三田会",
    food: "カレー",
    hobby: "旅行、ボランティア",
    bio: "NPOで社会課題解決に取り組んでいます。一緒に世界を変えましょう！",
    avatarInitial: "中",
    coverImage: "https://picsum.photos/seed/nakamura/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=7",
  },
  "8": {
    name: "小林 奈緒",
    dept: "看護医療学部",
    gradYear: "'18卒",
    job: "看護師",
    email: "nao@example.com",
    committee: "国際交流委員会",
    mitakai: "医療従事者三田会",
    food: "和食",
    hobby: "ヨガ、料理",
    bio: "よろしくお願いします。医療の現場から発信しています。",
    avatarInitial: "小",
    coverImage: "https://picsum.photos/seed/kobayashi/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=8",
  },
  "9": {
    name: "加藤 浩二",
    dept: "経済学部",
    gradYear: "'91卒",
    job: "投資家",
    email: "koji@example.com",
    committee: "総務財務委員会",
    mitakai: "投資家三田会",
    food: "焼き鳥",
    hobby: "投資、ゴルフ",
    bio: "投資が趣味です。資産運用の相談乗ります。",
    avatarInitial: "加",
    coverImage: "https://picsum.photos/seed/kato/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=9",
  },
  "10": {
    name: "渡辺 さくら",
    dept: "文学部",
    gradYear: "'05卒",
    job: "編集者",
    email: "sakura@example.com",
    committee: "広報委員会",
    mitakai: "出版・メディア三田会",
    food: "フレンチ",
    hobby: "読書、美術館巡り",
    bio: "出版社に勤めています。本の話をしましょう！",
    avatarInitial: "渡",
    coverImage: "https://picsum.photos/seed/watanabe/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=10",
  },
  "11": {
    name: "鈴木 一朗",
    dept: "商学部",
    gradYear: "'00卒",
    job: "起業家（準備中）",
    email: "ichiro@example.com",
    committee: "企画委員会",
    mitakai: "起業家三田会",
    food: "ステーキ",
    hobby: "筋トレ、ビジネス書",
    bio: "起業準備中！一緒にビジネスできる仲間を探しています。",
    avatarInitial: "鈴",
    coverImage: "https://picsum.photos/seed/suzuki/800/280",
    avatarImage: "https://i.pravatar.cc/150?u=11",
  },
};

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { profile } = useCurrentUser();

  const user: UserProfile | undefined =
    userId === CURRENT_USER_ID ? toUserProfile(profile) : MOCK_USERS[userId];

  if (!user) {
    return (
      <>
        <Header title="プロフィール" />
        <div className="flex-1 flex items-center justify-center text-gray-400">
          ユーザーが見つかりません
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={user.name} />
      <ProfileView user={user} isOwnProfile={false} showBack isFavorited={false} />
    </>
  );
}
