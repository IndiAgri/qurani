"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  BookOpen,
  Users,
  UserCheck,
  MapPin,
  Globe,
  FileText,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

export interface PublicUserProfile {
  username: string;
  name: string;
  initial?: string;
  avatarBg?: string;
  avatarUrl?: string;
  recitationCount: number;
  followersCount: number;
  followingCount: number;
  city: string;
  states: string;
  country: string;
  bio: string;
}

const KNOWN_USERS: Record<string, PublicUserProfile> = {
  nafsil: {
    username: "nafsil",
    name: "nanas nanas",
    initial: "n",
    avatarBg: "#4a3b32",
    recitationCount: 2,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  "nanas nanas": {
    username: "nafsil",
    name: "nanas nanas",
    initial: "n",
    avatarBg: "#4a3b32",
    recitationCount: 2,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  indiagri: {
    username: "indiagri",
    name: "indi",
    initial: "i",
    avatarBg: "#1e3a2b",
    recitationCount: 6,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  indi: {
    username: "indiagri",
    name: "indi",
    initial: "i",
    avatarBg: "#1e3a2b",
    recitationCount: 6,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  alvia: {
    username: "alvia",
    name: "02_Alvia Agustin",
    initial: "A",
    avatarBg: "#3b342f",
    recitationCount: 4,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  "02_alvia agustin": {
    username: "alvia",
    name: "02_Alvia Agustin",
    initial: "A",
    avatarBg: "#3b342f",
    recitationCount: 4,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  fatkul: {
    username: "fatkul",
    name: "fatkul",
    initial: "f",
    avatarBg: "#3b4252",
    recitationCount: 1,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  via: {
    username: "via",
    name: "via",
    initial: "v",
    avatarBg: "#4c566a",
    recitationCount: 1,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  refan: {
    username: "refan",
    name: "Refan",
    initial: "R",
    avatarBg: "#2e3440",
    recitationCount: 1,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
  alvasya: {
    username: "alvasya",
    name: "Alvasya",
    initial: "A",
    avatarBg: "#434c5e",
    recitationCount: 1,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  },
};

export function getUserProfileData(rawUsername: string): PublicUserProfile {
  const decoded = decodeURIComponent(rawUsername).trim();
  const normalizedKey = decoded.toLowerCase().replace(/^@/, "");

  if (KNOWN_USERS[normalizedKey]) {
    return KNOWN_USERS[normalizedKey];
  }

  // Fallback for custom usernames
  const displayName = decoded.replace(/^@/, "");
  return {
    username: normalizedKey,
    name: displayName,
    initial: displayName.charAt(0).toLowerCase() || "u",
    avatarBg: "#4a3b32",
    recitationCount: 0,
    followersCount: 0,
    followingCount: 0,
    city: "Malang",
    states: "Jawa Timur",
    country: "Indonesia",
    bio: "-",
  };
}

export function UserPublicProfileView({ username }: { username: string }) {
  const router = useRouter();
  const profile = getUserProfileData(username);

  const [activeTab, setActiveTab] = useState<"profile" | "recitation" | "followers" | "following">("profile");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      toast.success(next ? `Berhasil mengikuti @${profile.username}` : `Batal mengikuti @${profile.username}`);
      return next;
    });
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full">
      {/* Header: Back arrow + User Profile title */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-3 text-[#1e293b] hover:text-black font-bold text-xl md:text-2xl transition cursor-pointer group"
        >
          <ArrowLeft className="size-5 md:size-6 text-[#1e293b] stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" />
          <span>User Profile</span>
        </button>
      </div>

      {/* Main Profile Card Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 md:p-8 space-y-8">
        {/* Top Profile Header Info */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar with offline/online indicator dot */}
          <div className="relative">
            <div
              className="size-24 md:size-28 rounded-full text-white flex items-center justify-center font-normal text-4xl md:text-5xl select-none shadow-sm"
              style={{ backgroundColor: profile.avatarBg || "#4a3b32" }}
            >
              {profile.initial || profile.name.charAt(0).toLowerCase()}
            </div>
            <span className="absolute bottom-1 right-1.5 size-4 rounded-full bg-[#cbd5e1] ring-3 ring-white" />
          </div>

          {/* Full Name & Username */}
          <h1 className="text-xl md:text-2xl font-bold text-[#1e293b] mt-4 tracking-tight">
            {profile.name}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-normal mt-0.5">
            @{profile.username}
          </p>

          {/* Stats: Recitation, Followers, Following */}
          <div className="flex items-center justify-center gap-10 sm:gap-14 mt-5 text-center">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#1e293b]">
                {profile.recitationCount}
              </div>
              <div className="text-xs text-gray-500 font-normal">Recitation</div>
            </div>

            <div>
              <div className="text-base sm:text-lg font-bold text-[#1e293b]">
                {profile.followersCount + (isFollowing ? 1 : 0)}
              </div>
              <div className="text-xs text-gray-500 font-normal">Followers</div>
            </div>

            <div>
              <div className="text-base sm:text-lg font-bold text-[#1e293b]">
                {profile.followingCount}
              </div>
              <div className="text-xs text-gray-500 font-normal">Following</div>
            </div>
          </div>

          {/* Follow Button & More Options Button */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={handleFollowToggle}
              className={`px-12 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer shadow-xs ${
                isFollowing
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  : "bg-[#00875a] hover:bg-[#007a51] text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button
              type="button"
              aria-label="More options"
              onClick={() => toast.info("Fitur opsi lainnya")}
              className="p-2.5 rounded-xl border border-gray-200/90 bg-white hover:bg-gray-50 text-gray-500 transition cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar">
            {/* Tab: Profile */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 pb-3.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-[#00875a] border-b-2 border-[#00875a] font-semibold -mb-px"
                  : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent -mb-px"
              }`}
            >
              <User className="size-4" />
              <span>Profile</span>
            </button>

            {/* Tab: Recitation */}
            <button
              type="button"
              onClick={() => setActiveTab("recitation")}
              className={`flex items-center gap-2 pb-3.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === "recitation"
                  ? "text-[#00875a] border-b-2 border-[#00875a] font-semibold -mb-px"
                  : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent -mb-px"
              }`}
            >
              <BookOpen className="size-4" />
              <span>Recitation</span>
            </button>

            {/* Tab: Followers */}
            <button
              type="button"
              onClick={() => setActiveTab("followers")}
              className={`flex items-center gap-2 pb-3.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === "followers"
                  ? "text-[#00875a] border-b-2 border-[#00875a] font-semibold -mb-px"
                  : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent -mb-px"
              }`}
            >
              <Users className="size-4" />
              <span>Followers</span>
            </button>

            {/* Tab: Following */}
            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-2 pb-3.5 transition cursor-pointer whitespace-nowrap ${
                activeTab === "following"
                  ? "text-[#00875a] border-b-2 border-[#00875a] font-semibold -mb-px"
                  : "text-gray-500 hover:text-gray-800 border-b-2 border-transparent -mb-px"
              }`}
            >
              <UserCheck className="size-4" />
              <span>Following</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#1e293b]">
              Profile Detail
            </h2>

            {/* Top 3 Cards: City, States, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CITY Card */}
              <div className="bg-[#fff1f2] border border-[#ffe4e6] rounded-2xl p-5 md:p-6 shadow-2xs">
                <div className="size-8 rounded-full bg-[#f43f5e] text-white flex items-center justify-center shadow-xs">
                  <MapPin className="size-4" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-4">
                  CITY
                </div>
                <div className="text-sm sm:text-base font-bold text-[#e11d48] mt-1">
                  {profile.city}
                </div>
              </div>

              {/* STATES Card */}
              <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-5 md:p-6 shadow-2xs">
                <div className="size-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center shadow-xs">
                  <MapPin className="size-4" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-4">
                  STATES
                </div>
                <div className="text-sm sm:text-base font-bold text-[#2563eb] mt-1">
                  {profile.states}
                </div>
              </div>

              {/* COUNTRY Card */}
              <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-2xl p-5 md:p-6 shadow-2xs">
                <div className="size-8 rounded-full bg-[#4f46e5] text-white flex items-center justify-center shadow-xs">
                  <Globe className="size-4" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-4">
                  COUNTRY
                </div>
                <div className="text-sm sm:text-base font-bold text-[#4338ca] mt-1">
                  {profile.country}
                </div>
              </div>
            </div>

            {/* BIO Card: Full width */}
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-5 md:p-6 shadow-2xs">
              <div className="size-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center shadow-xs">
                <FileText className="size-4" />
              </div>
              <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mt-4">
                BIO
              </div>
              <div className="text-sm sm:text-base font-bold text-teal-900 mt-1">
                {profile.bio || "-"}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Recitation */}
        {activeTab === "recitation" && (
          <div className="py-8 text-center text-gray-400 text-sm">
            {profile.recitationCount > 0
              ? `Menampilkan ${profile.recitationCount} data setoran yang telah diselesaikan oleh ${profile.name}.`
              : "Belum ada riwayat setoran."}
          </div>
        )}

        {/* Tab Content: Followers */}
        {activeTab === "followers" && (
          <div className="py-8 text-center text-gray-400 text-sm">
            Belum ada pengikut.
          </div>
        )}

        {/* Tab Content: Following */}
        {activeTab === "following" && (
          <div className="py-8 text-center text-gray-400 text-sm">
            Belum mengikuti siapapun.
          </div>
        )}
      </div>
    </div>
  );
}
