"use client";
import Header from "@/components/Header";
import ProfileView from "@/components/ProfileView";
import { useCurrentUser, toUserProfile } from "@/context/CurrentUserContext";

export default function ProfilePage() {
  const { profile } = useCurrentUser();
  return (
    <>
      <Header title="マイプロフィール" />
      <ProfileView user={toUserProfile(profile)} isOwnProfile={true} />
    </>
  );
}
