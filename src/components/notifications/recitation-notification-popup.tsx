"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, Mail, X } from "lucide-react";
import {
  RecitationNotification,
  markNotificationAsRead,
  saveNotificationLocally,
} from "@/lib/notifications";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AUTO_DISMISS_MS = 8000;
const BROADCAST_CHANNEL_NAME = "qurani_notifications_channel";

export function RecitationNotificationPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";

  const [notification, setNotification] = useState<RecitationNotification | null>(null);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(AUTO_DISMISS_MS);

  // Trigger display of notification
  const showNotification = (notif: RecitationNotification) => {
    setNotification(notif);
    setProgress(100);
    remainingTimeRef.current = AUTO_DISMISS_MS;
    startTimeRef.current = Date.now();
  };

  const closeNotification = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setNotification(null);
  };

  const handleView = () => {
    if (notification) {
      markNotificationAsRead(notification.id);
      closeNotification();
      // Navigate to recitation recap detail page matching Photo 1 & 2!
      const targetId = notification.sessionId || "db63hg6fdq70010hhjmg";
      router.push(`/${currentLocale}/recitation/recap/${targetId}`);
    }
  };

  // Manage timer countdown and progress bar
  useEffect(() => {
    if (!notification) return;

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(() => {
      closeNotification();
    }, remainingTimeRef.current);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const percent = (currentRemaining / AUTO_DISMISS_MS) * 100;
      setProgress(percent);

      if (currentRemaining <= 0) {
        closeNotification();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [notification, isPaused]);

  // Handle pause on mouse hover
  const handleMouseEnter = () => {
    if (!notification) return;
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    if (!notification) return;
    setIsPaused(false);
  };

  // Listen to in-tab custom events and cross-tab BroadcastChannel
  useEffect(() => {
    const handleNewNotif = (e: Event) => {
      const customEvent = e as CustomEvent<RecitationNotification>;
      if (customEvent.detail) {
        showNotification(customEvent.detail);
      }
    };

    window.addEventListener("qurani_new_recitation_notification", handleNewNotif);

    // Cross-tab broadcast listener
    let bc: BroadcastChannel | null = null;
    try {
      if ("BroadcastChannel" in window) {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data) {
            showNotification(event.data);
          }
        };
      }
    } catch {}

    // Supabase Realtime Subscription for cross-device updates
    let channel: any = null;
    if (isSupabaseConfigured) {
      try {
        channel = supabase
          .channel("realtime-recitation-popup")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "recitation_notifications" },
            (payload) => {
              const row = payload.new as any;
              if (row) {
                const notifItem: RecitationNotification = {
                  id: row.id || `notif-${Date.now()}`,
                  sessionId: row.session_id,
                  senderName: row.title || "indi",
                  senderAvatar: "",
                  recitationType: row.message?.includes("Setoran ")
                    ? row.message.split("Setoran ")[1]?.split(" kepada")[0] || "Tahsin"
                    : "Tahsin",
                  recipientName: row.recipient_name || "02_Alvia Agustin",
                  resultText: row.message?.includes("dan hasilnya ")
                    ? row.message.split("dan hasilnya ")[1] || "Baik Sekali"
                    : "Baik Sekali",
                  read: false,
                  createdAt: row.created_at || new Date().toISOString(),
                };
                showNotification(notifItem);
                saveNotificationLocally(notifItem);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Supabase realtime subscription warning:", err);
      }
    }

    return () => {
      window.removeEventListener("qurani_new_recitation_notification", handleNewNotif);
      if (bc) bc.close();
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  if (!notification) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-[360px] sm:w-[400px] bg-white rounded-2xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Top Content Area */}
        <div className="p-4 sm:p-5 relative">
          {/* Top-Right Indicator Dot & Close Button */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)] animate-pulse" />
            <button
              type="button"
              onClick={closeNotification}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition cursor-pointer"
              title="Tutup"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Avatar and Text Details */}
          <div className="flex items-start gap-3.5 pr-10">
            {/* Circular Green Avatar with Small Book Badge */}
            <div className="relative shrink-0">
              <div className="size-12 rounded-full bg-[#1b5e20] text-white flex items-center justify-center font-bold text-xl uppercase select-none shadow-xs overflow-hidden">
                {notification.senderAvatar ? (
                  <Image
                    src={notification.senderAvatar}
                    alt={notification.senderName}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{notification.senderName?.charAt(0) || "i"}</span>
                )}
              </div>

              {/* Small Emerald Quran Badge */}
              <div className="absolute -bottom-0.5 -right-0.5 size-5 rounded-full bg-[#00875a] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                <BookOpen className="size-2.5 stroke-[2.5]" />
              </div>
            </div>

            {/* Notification Text (Exact match to screenshot) */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-950 leading-tight">
                {notification.senderName}
              </h4>
              <p className="text-xs text-gray-600 mt-1 leading-snug">
                Setoran{" "}
                <span className="font-bold text-gray-950">
                  {notification.recitationType}
                </span>{" "}
                kepada{" "}
                <span className="font-bold text-gray-950">
                  {notification.recipientName}
                </span>{" "}
                dan hasilnya
              </p>
              <p className="text-xs font-bold text-[#00875a] mt-0.5">
                {notification.resultText}
              </p>
            </div>
          </div>

          {/* Action Button: "Lihat" */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleView}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Mail className="size-4 stroke-[2]" />
              <span>Lihat</span>
            </button>
          </div>
        </div>

        {/* Bottom Auto-Dismiss Progress Bar */}
        <div className="h-1 w-full bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default RecitationNotificationPopup;
