"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export type PresentUser = {
  id: string;
  name: string;
  faculty: string;
  dept: string;
  comment: string;
  avatarUrl: string | null;
  leaveTime: string | null; // 例："22:00"、未設定はnull
};

export type RecentVisitor = PresentUser & {
  lastVisitAt: Date;
};

type PresentUserWithTime = PresentUser & {
  checkedInAt: Date;
};

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function getLastVisitLabel(lastVisitAt: Date): string {
  const elapsed = Date.now() - lastVisitAt.getTime();
  const hours = elapsed / (1000 * 60 * 60);
  if (hours < 12) return "たった今";
  return `${Math.max(1, Math.floor(elapsed / (1000 * 60 * 60 * 24)))}日前`;
}

const INITIAL_USERS: PresentUser[] = [
  { id: "1", name: "伊藤 雅子", faculty: "商学部", dept: "商学部 '15卒", comment: "こんにちは！", avatarUrl: "https://i.pravatar.cc/150?u=1", leaveTime: "21:30" },
  { id: "2", name: "大沢 幸雄", faculty: "経済学部", dept: "経済学部 '03卒", comment: "婚活中です...", avatarUrl: "https://i.pravatar.cc/150?u=2", leaveTime: "22:00" },
  { id: "3", name: "田中 みな", faculty: "文学部", dept: "文学部 '09卒", comment: "友達が欲しい", avatarUrl: "https://i.pravatar.cc/150?u=3", leaveTime: null },
];

type ContextValue = {
  presentUsers: PresentUser[];
  recentVisitors: RecentVisitor[];
  addUser: (user: PresentUser) => void;
  removeUser: (id: string) => void;
  checkOutUser: (user: PresentUser) => void;
};

const PresentUsersContext = createContext<ContextValue | null>(null);

export function PresentUsersProvider({ children }: { children: React.ReactNode }) {
  const [presentUsersWithTime, setPresentUsersWithTime] = useState<PresentUserWithTime[]>(
    () => INITIAL_USERS.map((u) => ({ ...u, checkedInAt: new Date() }))
  );
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);

  const presentRef = useRef<PresentUserWithTime[]>([]);
  useEffect(() => { presentRef.current = presentUsersWithTime; }, [presentUsersWithTime]);

  // 12時間超の来店者を自動退店（1分ごとにチェック）
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const expired = presentRef.current.filter(
        (u) => now - u.checkedInAt.getTime() >= TWELVE_HOURS_MS
      );
      if (expired.length === 0) return;

      setPresentUsersWithTime((prev) =>
        prev.filter((u) => now - u.checkedInAt.getTime() < TWELVE_HOURS_MS)
      );
      setRecentVisitors((prev) => {
        const expiredIds = new Set(expired.map((u) => u.id));
        const filtered = prev.filter(
          (v) => !expiredIds.has(v.id) && now - v.lastVisitAt.getTime() < THIRTY_DAYS_MS
        );
        return [...expired.map((u) => ({ ...u, lastVisitAt: new Date() })), ...filtered];
      });
    }, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const addUser = (user: PresentUser) => {
    setPresentUsersWithTime((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev
        : [...prev, { ...user, checkedInAt: new Date() }]
    );
    setRecentVisitors((prev) => prev.filter((v) => v.id !== user.id));
  };

  const removeUser = (id: string) => {
    setPresentUsersWithTime((prev) => prev.filter((u) => u.id !== id));
  };

  const checkOutUser = (user: PresentUser) => {
    removeUser(user.id);
    setRecentVisitors((prev) => {
      const now = new Date();
      const filtered = prev.filter(
        (v) => v.id !== user.id && Date.now() - v.lastVisitAt.getTime() < THIRTY_DAYS_MS
      );
      return [{ ...user, lastVisitAt: now }, ...filtered];
    });
  };

  const presentUsers: PresentUser[] = presentUsersWithTime.map(
    ({ checkedInAt: _, ...u }) => u
  );

  return (
    <PresentUsersContext.Provider value={{ presentUsers, recentVisitors, addUser, removeUser, checkOutUser }}>
      {children}
    </PresentUsersContext.Provider>
  );
}

export function usePresentUsers() {
  const ctx = useContext(PresentUsersContext);
  if (!ctx) throw new Error("usePresentUsers must be used within PresentUsersProvider");
  return ctx;
}
