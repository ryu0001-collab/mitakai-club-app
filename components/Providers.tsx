"use client";
import { PresentUsersProvider } from "@/context/PresentUsersContext";
import { CurrentUserProvider } from "@/context/CurrentUserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <PresentUsersProvider>{children}</PresentUsersProvider>
    </CurrentUserProvider>
  );
}
