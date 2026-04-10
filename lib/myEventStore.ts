import { Event, EventCreator } from "./events";

const SELF_USER_ID = "4";
const COLORS = ["bg-blue-500", "bg-purple-600", "bg-red-500", "bg-green-600", "bg-gray-700"];

// メモリのみ保持（ページリロード・サーバー再起動でリセット）
let store: Event[] = [];

export function getMyEvents(): Event[] {
  return [...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getMyEventById(id: string): Event | undefined {
  return store.find((e) => e.id === id);
}

export function createEvent(
  data: Omit<Event, "id" | "userId" | "createdAt" | "updatedAt" | "color" | "creator">,
  creator?: EventCreator
): Event {
  const event: Event = {
    ...data,
    id: crypto.randomUUID(),
    userId: SELF_USER_ID,
    color: COLORS[store.length % COLORS.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...(creator ? { creator } : {}),
  };
  store = [...store, event];
  return event;
}

export function updateEvent(id: string, data: Partial<Omit<Event, "id" | "userId" | "createdAt" | "color">>): void {
  store = store.map((e) =>
    e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e
  );
}

export function deleteEvent(id: string): void {
  store = store.filter((e) => e.id !== id);
}

export function publishEvent(id: string): void {
  updateEvent(id, { status: "published" });
}
