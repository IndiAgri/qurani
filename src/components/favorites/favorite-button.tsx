"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  id,
  targetId,
  type = "trainer",
  targetType,
  className,
  variant,
  iconClassName,
  unfavoritedClassName,
}: {
  id?: string;
  targetId?: string;
  type?: string;
  targetType?: string;
  className?: string;
  variant?: any;
  iconClassName?: string;
  unfavoritedClassName?: string;
}) {
  const favoriteKey = targetId || id || "default";
  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`favorite_${favoriteKey}`);
        return stored === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    try {
      localStorage.setItem(`favorite_${favoriteKey}`, String(next));
    } catch {}
  };

  const isPlainFloating = !variant && (!className || !className.includes("border"));

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      aria-label="Toggle Wishlist"
      className={cn(
        "cursor-pointer select-none transition-all duration-200 flex items-center justify-center focus:outline-none",
        isPlainFloating
          ? "bg-transparent border-0 p-0.5 hover:scale-115 active:scale-90"
          : "rounded-xl border border-gray-200 hover:bg-gray-50",
        className
      )}
    >
      <Heart
        className={cn(
          "transition-all duration-200",
          iconClassName || "size-6",
          liked
            ? "fill-red-500 stroke-red-500 text-red-500 drop-shadow-[0_2px_6px_rgba(239,68,68,0.5)]"
            : unfavoritedClassName ||
                "fill-black/40 stroke-white stroke-[2.2] text-white hover:fill-black/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        )}
      />
    </button>
  );
}
