"use client";

import * as React from "react";
import {
  Users,
  User,
  UserCheck,
  Search,
  Filter,
} from "lucide-react";
import { MOCK_FRIENDS } from "@/data/mock-setoran-data";

export function FriendsView() {
  const [activeTab, setActiveTab] = React.useState<"friends" | "following" | "follower">("friends");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showData, setShowData] = React.useState(false); // Default to 0 / empty state matching screenshot

  // Filtered friends if showData is enabled or when searched
  const filteredFriends = React.useMemo(() => {
    if (!showData && !searchQuery.trim()) return [];
    return MOCK_FRIENDS.filter((f) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q)
      );
    });
  }, [showData, searchQuery]);

  const friendsCount = filteredFriends.length;
  const followingCount = 0;
  const followerCount = 0;

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 max-w-[1600px] w-full">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="size-6 text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Friends
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            const input = document.getElementById("friends-search-input");
            input?.focus();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#007a51] text-white text-xs sm:text-sm font-medium shadow-xs transition cursor-pointer"
        >
          <Search className="size-4" />
          <span>Search</span>
        </button>
      </div>

      {/* Main Content Card with visible, crisp shadow and rounded container */}
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 min-h-[520px] flex flex-col justify-between transition-all"
        style={{
          boxShadow:
            "0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <div className="space-y-6">
          {/* Search Bar & Filter Button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center w-full max-w-md">
              <input
                id="friends-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or username..."
                className="h-10 w-full rounded-l-2xl border border-r-0 border-gray-200 bg-white px-4 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                aria-label="Search"
                className="h-10 px-4 rounded-r-2xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center transition cursor-pointer"
              >
                <Search className="size-4" />
              </button>
            </div>

            {/* Filter Funnel Button */}
            <button
              type="button"
              aria-label="Filter"
              className="size-10 rounded-2xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 flex items-center justify-center transition cursor-pointer focus:outline-none"
            >
              <Filter className="size-4" />
            </button>
          </div>

          {/* Tabs: Friends (0), Following (0), Follower (0) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Friends Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                activeTab === "friends"
                  ? "bg-[#00875a] text-white shadow-xs hover:bg-[#007a51]"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="size-4" />
              <span>Friends ({friendsCount})</span>
            </button>

            {/* Following Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                activeTab === "following"
                  ? "bg-[#00875a] text-white shadow-xs hover:bg-[#007a51]"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <UserCheck className="size-4" />
              <span>Following ({followingCount})</span>
            </button>

            {/* Follower Tab */}
            <button
              type="button"
              onClick={() => setActiveTab("follower")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                activeTab === "follower"
                  ? "bg-[#00875a] text-white shadow-xs hover:bg-[#007a51]"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="size-4" />
              <span>Follower ({followerCount})</span>
            </button>
          </div>
        </div>

        {/* Empty State / Center Content */}
        {filteredFriends.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center my-16 select-none">
            {/* Soft Gray/Blue Badge with Users icon */}
            <div className="size-16 rounded-2xl bg-[#edf2f7] text-[#94a3b8] flex items-center justify-center mb-4">
              <Users className="size-8" />
            </div>

            <p className="text-sm font-semibold text-gray-800 text-center">
              No data found
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Please check your search and filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
              >
                <div className="size-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {friend.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    @{friend.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer spacer */}
        <div />
      </div>
    </div>
  );
}
