export type EventStatus = "draft" | "published";

export type EventCreator = {
  id: string;
  name: string;
  faculty: string;
  dept: string;
  avatarUrl: string | null;
};

export type Event = {
  id: string;
  userId: string;
  title: string;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string | null;
  description: string;
  thumbnailUrl: string | null;
  formUrl: string | null;
  fee: number | null;
  status: EventStatus;
  color: string;
  createdAt: string;
  updatedAt: string;
  creator?: EventCreator;
};

// 公開済みモックイベント（一覧表示用）
export const MOCK_EVENTS: Event[] = [
  { id: "1", userId: "1", title: "環境学部卒AIアーティストで大活躍中の草刈果穂さん講演会", organizer: "[ファッション&ビューティー三田会]", date: "2026-01-20", startTime: "19:00", endTime: "20:00", venue: "三田キャンパス南校舎3階 萬來舍", description: "AIアートの最前線で活躍する草刈果穂さんをお招きし、テクノロジーとファッション・ビューティーの交差点についてお話いただきます。", thumbnailUrl: null, formUrl: "https://example.com/form/1", fee: 1000, status: "published", color: "bg-blue-500", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", creator: { id: "1", name: "伊藤 雅子", faculty: "商学部", dept: "商学部 '15卒", avatarUrl: "https://i.pravatar.cc/150?u=1" } },
  { id: "2", userId: "3", title: "起業家を育てる！スタートアップアイディアブラッシュアップ会", organizer: "[メンター三田会]", date: "2026-01-20", startTime: "19:00", endTime: "20:00", venue: "俱楽部ルーム", description: "スタートアップのアイディアをお持ちの方を対象に、経験豊富なメンターがアイディアのブラッシュアップをサポートします。", thumbnailUrl: null, formUrl: null, fee: 0, status: "published", color: "bg-gray-700", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", creator: { id: "3", name: "田中 みな", faculty: "文学部", dept: "文学部 '09卒", avatarUrl: "https://i.pravatar.cc/150?u=3" } },
  { id: "3", userId: "2", title: "婚活に悩める同士のための、お食事&交流会", organizer: "[若手育成三田会]", date: "2026-01-26", startTime: "19:00", endTime: "20:00", venue: "芝浦公園", description: "同じ悩みを持つ仲間が集まるカジュアルな交流会です。食事をしながら自然な出会いの場を提供します。", thumbnailUrl: null, formUrl: "https://example.com/form/3", fee: 3000, status: "published", color: "bg-red-500", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", creator: { id: "2", name: "大沢 幸雄", faculty: "経済学部", dept: "経済学部 '03卒", avatarUrl: "https://i.pravatar.cc/150?u=2" } },
  { id: "4", userId: "6", title: "アレキサンダー氏が語る、AIの今とこれからの資本主義社会", organizer: "[AI研究三田会]", date: "2026-02-12", startTime: "19:00", endTime: "20:00", venue: "俱楽部ルーム", description: "AIが資本主義社会に与える影響について、第一線で研究するアレキサンダー氏が語ります。", thumbnailUrl: null, formUrl: "https://example.com/form/4", fee: 0, status: "published", color: "bg-purple-600", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", creator: { id: "6", name: "山本 真由", faculty: "理工学部", dept: "理工学部 '12卒", avatarUrl: "https://i.pravatar.cc/150?u=6" } },
  { id: "5", userId: "9", title: "初心者必見！ゴルフの打ち方講座", organizer: "[ゴルフ三田会]", date: "2026-02-21", startTime: "19:00", endTime: "20:00", venue: "東京ゴルフ倶楽部", description: "ゴルフを始めたい方向けの入門講座です。プロインストラクターによる丁寧な指導で、スイングの基本からラウンドのマナーまでを学べます。", thumbnailUrl: null, formUrl: null, fee: 5000, status: "published", color: "bg-green-600", createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-01-01T00:00:00Z", creator: { id: "9", name: "加藤 浩二", faculty: "経済学部", dept: "経済学部 '91卒", avatarUrl: "https://i.pravatar.cc/150?u=9" } },
];

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${days[d.getDay()]}）`;
}
