"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-gray-600">
      <ChevronLeft size={22} />
    </button>
  );
}
