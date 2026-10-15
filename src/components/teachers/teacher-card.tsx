"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Heart,
  Crown,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Trainer } from "@/data/trainers-data";
import { FavoriteButton } from "@/components/favorites/favorite-button";

interface TeacherCardProps {
  trainer: Trainer;
  viewMode?: "grid" | "list";
}

export function TeacherCard({ trainer, viewMode = "grid" }: TeacherCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = React.useState(false);

  // Determine badge
  const badge =
    trainer.badgeType === "guru-super"
      ? { label: "SUPER TEACHER", bg: "bg-emerald-600", icon: Crown }
      : trainer.badgeType === "duta-besar"
      ? { label: "AMBASSADOR", bg: "bg-indigo-600", icon: Sparkles }
      : trainer.badgeType === "rekomendasi"
      ? { label: "RECOMMENDED", bg: "bg-amber-500", icon: Star }
      : null;

  const displayLocation =
    trainer.city ||
    (trainer.location.length > 25
      ? trainer.location.substring(0, 25) + "..."
      : trainer.location);

  return (
    <div
      onClick={() => router.push(`/en/teachers/${trainer.id}`)}
      className={`group bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 overflow-hidden flex cursor-pointer ${
        viewMode === "list" ? "flex-col sm:flex-row items-stretch" : "flex-col"
      }`}
    >
      {/* Photo Section */}
      <div
        className={`relative overflow-hidden bg-gray-100 shrink-0 ${
          viewMode === "list"
            ? "w-full sm:w-56 h-56 sm:h-auto"
            : "w-full h-56"
        }`}
      >
        <Link href={`/en/teachers/${trainer.id}`} className="block absolute inset-0">
          <Image
            src={trainer.avatar}
            alt={trainer.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges & Wishlist */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          {badge ? (
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold text-white tracking-wider shadow-sm uppercase ${badge.bg}`}
            >
              <badge.icon className="size-3" />
              {badge.label}
            </span>
          ) : (
            <span />
          )}

          <FavoriteButton
            targetId={trainer.id}
            targetType="teacher"
            className="hover:scale-115 transition-transform"
            iconClassName="size-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
            unfavoritedClassName="fill-black/40 stroke-white stroke-[2.2] text-white hover:fill-black/60"
          />
        </div>

        {/* Bottom Location pill */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] max-w-full">
            <MapPin className="size-3 shrink-0 text-white" />
            <span className="truncate">{displayLocation}</span>
          </div>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Modes: Online / Offline */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
            <span className="size-1 rounded-full bg-emerald-600" />
            ONLINE
          </span>
          {trainer.teachingMode !== "Online" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
              <span className="size-1 rounded-full bg-slate-600" />
              OFFLINE
            </span>
          )}
        </div>

        {/* Name */}
        <div>
          <Link
            href={`/en/teachers/${trainer.id}`}
            className="text-sm font-bold text-gray-900 hover:text-emerald-700 transition line-clamp-1"
          >
            {trainer.name}
          </Link>
        </div>

        {/* Methods */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {trainer.methods.slice(0, 2).map((method) => (
            <span
              key={method}
              className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium uppercase"
            >
              {method}
            </span>
          ))}
          {trainer.methods.length > 2 && (
            <span className="px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium">
              +{trainer.methods.length - 2}
            </span>
          )}
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
          <div className="flex items-center gap-1 text-gray-900 font-semibold">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span>{trainer.rating}</span>
          </div>
          <span>·</span>
          <span>{trainer.reviewCount} reviews</span>
          <span>·</span>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ThumbsUp className="size-3" />
            <span>
              {(trainer.packages?.[0] as any)?.students ??
                (trainer.reviewCount > 0 ? Math.round(trainer.reviewCount * 0.9) : 45)}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-gray-100/80 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block">Starts from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-[#00875a]">
                IDR {trainer.pricePerSession.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400">/hour</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
