"use client";

import { supabase, isSupabaseConfigured } from "./supabase";

export interface RecitationNotification {
  id: string;
  sessionId?: string;
  senderName: string;
  senderAvatar?: string;
  recitationType: string;
  recipientName: string;
  resultText: string;
  read: boolean;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = "qurani_user_notifications_v1";
const BROADCAST_CHANNEL_NAME = "qurani_notifications_channel";

export function mapConclusionIndo(conclusion: string): string {
  switch (conclusion) {
    case "Excellent":
      return "Sangat Baik";
    case "Very Good":
      return "Baik Sekali";
    case "Good":
      return "Baik";
    case "Pass":
      return "Cukup";
    case "Not Pass":
      return "Perlu Mengulang";
    default:
      return conclusion || "Baik Sekali";
  }
}

export function getStoredNotifications(): RecitationNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveNotificationLocally(notif: RecitationNotification) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredNotifications();
    const updated = [notif, ...existing.filter((item) => item.id !== notif.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("qurani_notifications_updated"));
  } catch {}
}

export function markNotificationAsRead(id: string) {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredNotifications();
    const updated = existing.map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("qurani_notifications_updated"));
  } catch {}
}

export function markAllNotificationsAsRead() {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredNotifications();
    const updated = existing.map((item) => ({ ...item, read: true }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("qurani_notifications_updated"));
  } catch {}
}

export function getUnreadNotificationsCount(): number {
  const all = getStoredNotifications();
  return all.filter((n) => !n.read).length;
}

export interface NotificationContact {
  id: string;
  name: string;
  username: string;
  location: string;
  avatar: string;
}

export function getSendRecipients(): NotificationContact[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("qurani_send_notifications");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      id: "notif-rec-1",
      name: "02_Alvia Agustin",
      username: "@alvia",
      location: "Malang - Jawa Timur",
      avatar: "/img/avatar-alvia.jpg",
    },
  ];
}

export function getReceiveSenders(): NotificationContact[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("qurani_receive_notifications");
    if (saved) return JSON.parse(saved);
  } catch {}
  return [
    {
      id: "notif-send-1",
      name: "02_Alvia Agustin",
      username: "@alvia",
      location: "Malang - Jawa Timur",
      avatar: "/img/avatar-alvia.jpg",
    },
  ];
}

// Main function to trigger notification locally, broadcast across tabs, and sync to Supabase
export async function dispatchRecitationNotification(payload: {
  sessionId?: string;
  senderName: string;
  senderAvatar?: string;
  recitationType: string;
  recipientName: string;
  resultText: string;
}): Promise<RecitationNotification> {
  const notif: RecitationNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionId: payload.sessionId,
    senderName: payload.senderName || "indi",
    senderAvatar: payload.senderAvatar || "",
    recitationType: payload.recitationType || "Tahsin",
    recipientName: payload.recipientName || "02_Alvia Agustin",
    resultText: payload.resultText || "Baik Sekali",
    read: false,
    createdAt: new Date().toISOString(),
  };

  // 1. Save locally
  saveNotificationLocally(notif);

  // 2. Dispatch custom window event for instant in-tab popup
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("qurani_new_recitation_notification", { detail: notif })
    );

    // 3. Broadcast to other open browser tabs
    try {
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.postMessage(notif);
        bc.close();
      }
    } catch {}
  }

  // 4. Sync to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      await supabase.from("recitation_notifications").insert({
        id: notif.id,
        session_id: notif.sessionId || null,
        recipient_type: "teacher",
        recipient_name: notif.recipientName,
        title: notif.senderName,
        message: `Setoran ${notif.recitationType} kepada ${notif.recipientName} dan hasilnya ${notif.resultText}`,
        read: false,
      });
    } catch (e) {
      console.warn("Supabase notification insert warning:", e);
    }
  }

  return notif;
}

// Dispatches notification to ALL friends in the user's "Send Notification to" list
export async function dispatchRecitationToAllRecipients(payload: {
  sessionId?: string;
  senderName: string;
  senderAvatar?: string;
  recitationType: string;
  fallbackRecipientName?: string;
  resultText: string;
}): Promise<RecitationNotification[]> {
  const contacts = getSendRecipients();
  const results: RecitationNotification[] = [];

  if (contacts.length === 0) {
    const single = await dispatchRecitationNotification({
      sessionId: payload.sessionId,
      senderName: payload.senderName,
      senderAvatar: payload.senderAvatar,
      recitationType: payload.recitationType,
      recipientName: payload.fallbackRecipientName || "02_Alvia Agustin",
      resultText: payload.resultText,
    });
    results.push(single);
    return results;
  }

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const item = await dispatchRecitationNotification({
      sessionId: payload.sessionId,
      senderName: payload.senderName,
      senderAvatar: payload.senderAvatar,
      recitationType: payload.recitationType,
      recipientName: contact.name,
      resultText: payload.resultText,
    });
    results.push(item);
  }

  return results;
}

