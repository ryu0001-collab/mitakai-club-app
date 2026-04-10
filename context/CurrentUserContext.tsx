"use client";
import { createContext, useContext, useState } from "react";
import { type UserProfile } from "@/components/ProfileView";
import { type PresentUser } from "@/context/PresentUsersContext";

export const CURRENT_USER_ID = "4";

export type ProfileData = {
  name: string;
  dept: string;
  gradYear: number;
  job: string;
  email: string;
  committee: string;
  mitakai: string;
  food: string;
  hobby: string;
  bio: string;
  avatarImage: string | null;
  coverImage: string | null;
};

const INITIAL_PROFILE: ProfileData = {
  name: "大森 嘉月",
  dept: "環境情報学部",
  gradYear: 1996,
  job: "コンサルティング",
  email: "yoshitsuki@example.com",
  committee: "イベント企画委員会",
  mitakai: "AI研究三田会",
  food: "ラーメン",
  hobby: "登山、読書",
  bio: "スタートアップ支援をしています。気軽に話しかけてください！",
  avatarImage: "https://i.pravatar.cc/150?u=4",
  coverImage: "https://picsum.photos/seed/user4/800/280",
};

export function toPresentUser(p: ProfileData): PresentUser {
  return {
    id: CURRENT_USER_ID,
    name: p.name,
    faculty: p.dept,
    dept: `${p.dept} '${String(p.gradYear).slice(-2)}卒`,
    comment: p.bio,
    avatarUrl: p.avatarImage,
  };
}

export function toUserProfile(p: ProfileData): UserProfile {
  return {
    name: p.name,
    dept: p.dept,
    gradYear: `'${String(p.gradYear).slice(-2)}卒`,
    job: p.job,
    email: p.email,
    committee: p.committee,
    mitakai: p.mitakai,
    food: p.food,
    hobby: p.hobby,
    bio: p.bio,
    avatarInitial: p.name[0] ?? "?",
    avatarImage: p.avatarImage,
    coverImage: p.coverImage,
  };
}

type ContextValue = {
  profile: ProfileData;
  updateProfile: (data: ProfileData) => void;
};

const CurrentUserContext = createContext<ContextValue | null>(null);

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

  const updateProfile = (data: ProfileData) => setProfile(data);

  return (
    <CurrentUserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) throw new Error("useCurrentUser must be used within CurrentUserProvider");
  return ctx;
}
