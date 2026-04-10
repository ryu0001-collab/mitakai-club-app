"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FABButton({ href }: { href: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="fixed z-40 w-14 h-14 rounded-full bg-blue-600 shadow-lg flex items-center justify-center text-white hover:bg-blue-700 transition"
      style={{ bottom: "80px", right: "20px" }}
      aria-label="新規作成"
    >
      <Plus size={28} />
    </button>
  );
}
