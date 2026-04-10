"use client";
import { Bell, BellOff } from "lucide-react";
import { useState } from "react";

export default function FavoriteButton({ initialFavorited = false }: { initialFavorited?: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited);

  return (
    <button
      onClick={() => setFavorited((prev) => !prev)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition
        ${favorited
          ? "bg-blue-600 border-blue-600 text-white"
          : "bg-white border-gray-300 text-gray-700"
        }`}
    >
      {!favorited && <Bell size={15} />}
      {favorited ? "登録済み" : "+お気に入り"}
    </button>
  );
}
