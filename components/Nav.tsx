"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, QrCode, CalendarDays, User } from "lucide-react";
import { useEffect, useState } from "react";

const tabs = [
  { href: "/",        label: "Home",   Icon: Users },
  { href: "/scan",    label: "Scan",   Icon: QrCode },
  { href: "/events",  label: "Events", Icon: CalendarDays },
  { href: "/profile", label: "Profile",Icon: User },
];

function getRootSection(path: string): string {
  if (path === "/") return "/";
  for (const tab of tabs.slice(1)) {
    if (path.startsWith(tab.href)) return tab.href;
  }
  return "/";
}

export default function Nav() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState(() => getRootSection(pathname));

  useEffect(() => {
    // ルートタブ（完全一致）に遷移したときだけアクティブセクションを更新
    const isRoot = tabs.some((t) => t.href === pathname);
    if (isRoot) setActiveSection(pathname);
  }, [pathname]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 flex justify-around items-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = activeSection === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 ${active ? "text-blue-600" : "text-gray-400"}`}
          >
            <Icon size={24} />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
