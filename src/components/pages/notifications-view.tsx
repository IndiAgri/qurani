"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  CheckCheck,
  Trash2,
  ExternalLink,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import {
  RecitationNotification,
  getStoredNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/notifications";

export function NotificationsView() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";

  const [notifications, setNotifications] = useState<RecitationNotification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [mounted, setMounted] = useState(false);

  const loadNotifications = () => {
    setNotifications(getStoredNotifications());
  };

  useEffect(() => {
    setMounted(true);
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("qurani_notifications_updated", handleUpdate);
    window.addEventListener("qurani_new_recitation_notification", handleUpdate);

    return () => {
      window.removeEventListener("qurani_notifications_updated", handleUpdate);
      window.removeEventListener("qurani_new_recitation_notification", handleUpdate);
    };
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
    toast.success(
      currentLocale === "id"
        ? "Semua notifikasi telah ditandai dibaca"
        : "All notifications marked as read"
    );
  };

  const handleItemClick = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "unread") return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 font-sans" suppressHydrationWarning>
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-emerald-50 text-[#00875a] flex items-center justify-center shrink-0">
              <Bell className="size-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                  {currentLocale === "id" ? "Notifikasi" : "Notifications"}
                </h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                    {unreadCount} {currentLocale === "id" ? "baru" : "new"}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentLocale === "id"
                  ? "Pemberitahuan aktivitas setoran hafalan dan tilawah teman"
                  : "Updates on recitation submissions and friend progress"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition cursor-pointer shadow-2xs"
              >
                <CheckCheck className="size-4 text-[#00875a]" />
                <span>
                  {currentLocale === "id"
                    ? "Tandai Semua Dibaca"
                    : "Mark all as read"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[#00875a] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {currentLocale === "id" ? "Semua" : "All"} ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "unread"
                ? "bg-[#00875a] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {currentLocale === "id" ? "Belum Dibaca" : "Unread"} ({unreadCount})
          </button>
        </div>

        {/* List of Notifications */}
        {mounted && filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer ${
                  !item.read
                    ? "bg-blue-50/40 border-blue-100 hover:bg-blue-50/70"
                    : "bg-white border-gray-100 hover:bg-gray-50/80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Sender Avatar with Small Book Badge */}
                  <div className="relative shrink-0">
                    <div className="size-11 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-bold text-lg uppercase select-none shadow-xs overflow-hidden">
                      {item.senderAvatar ? (
                        <Image
                          src={item.senderAvatar}
                          alt={item.senderName}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{item.senderName?.charAt(0) || "i"}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 size-4.5 rounded-full bg-[#00875a] text-white flex items-center justify-center border-2 border-white">
                      <BookOpen className="size-2.5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-950">
                        {item.senderName}
                      </h3>
                      {!item.read && (
                        <span className="size-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-snug">
                      Setoran{" "}
                      <span className="font-bold text-gray-900">
                        {item.recitationType}
                      </span>{" "}
                      kepada{" "}
                      <span className="font-bold text-gray-900">
                        {item.recipientName}
                      </span>{" "}
                      dan hasilnya{" "}
                      <span className="font-bold text-[#00875a]">
                        {item.resultText}
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400 pt-0.5">
                      {new Date(item.createdAt).toLocaleDateString(
                        currentLocale === "id" ? "id-ID" : "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/${currentLocale}/recitation/recap/${item.sessionId || "db63hg6fdq70010hhjmg"}`}
                    className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition"
                  >
                    <Mail className="size-3.5" />
                    <span>Lihat</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl p-6">
            <div className="size-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-3">
              <Bell className="size-6 stroke-[1.8]" />
            </div>
            <h3 className="text-sm font-bold text-gray-800">
              {currentLocale === "id"
                ? "Belum ada notifikasi baru"
                : "No notifications yet"}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
              {currentLocale === "id"
                ? "Notifikasi setoran Al-Qur'an dari teman akan otomatis muncul di sini."
                : "Recitation updates from your friends will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsView;
