import Image from "next/image";
import BackButton from "./BackButton";

export default function Header({ title, showBack = false }: { title: string; showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-50 flex items-center gap-3 px-4 h-[60px] border-b border-gray-200 bg-white shrink-0">
      {showBack && <BackButton />}
      <Image
        src="/mitaclub.png"
        alt="Mita Club Logo"
        width={48}
        height={48}
        className="rounded-md object-contain shrink-0"
      />
      <span className="text-[18px] font-medium text-gray-700">{title}</span>
    </header>
  );
}
