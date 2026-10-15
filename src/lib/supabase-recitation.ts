import { supabase, isSupabaseConfigured } from "./supabase";
import { RecitationRecord } from "@/components/recitation/recitation-results";

export interface RecitationSettingConfig {
  id?: string;
  type: "global" | "group" | "user";
  target_id: string; // "default" for global, group_id for group, user_id/name for user
  target_name?: string;
  passing_grade: number; // e.g. 75 (%)
  max_tajweed_mistakes: number;
  max_makhraj_mistakes: number;
  max_harakat_mistakes: number;
  strictness: "easy" | "medium" | "strict";
  auto_notify_parent: boolean;
  auto_notify_admin: boolean;
  auto_notify_teacher: boolean;
  mushaf_display_format: "madinah" | "indonesia" | "kemenag";
  updated_at?: string;
}

export interface RecitationQueueItem {
  id: string;
  student_name: string;
  student_avatar?: string;
  type: "Tahsin" | "Tahfidz" | "Pra-Quran";
  mode: "surah" | "juz" | "page";
  surah_id?: number;
  juz_id?: number;
  page_id?: number;
  surah_name?: string;
  verse_range?: string;
  submitted_at: string;
  status: "pending" | "in_review" | "completed";
  group_name?: string;
  assigned_to?: string;
}

export interface RecitationNotificationItem {
  id: string;
  session_id?: string;
  recipient_type: "parent" | "teacher" | "group_admin";
  recipient_email?: string;
  recipient_name?: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const LOCAL_STORAGE_SETTINGS_KEY = "qurani_recitation_settings_v2";
const LOCAL_STORAGE_QUEUE_KEY = "qurani_recitation_queue_v2";
const LOCAL_STORAGE_RESULTS_KEY = "qurani_recitation_results";
const LOCAL_STORAGE_NOTIFS_KEY = "qurani_recitation_notifications_v2";

export const DEFAULT_GLOBAL_SETTINGS: RecitationSettingConfig = {
  type: "global",
  target_id: "default",
  target_name: "Setting Global Qurani",
  passing_grade: 80,
  max_tajweed_mistakes: 3,
  max_makhraj_mistakes: 2,
  max_harakat_mistakes: 3,
  strictness: "medium",
  auto_notify_parent: true,
  auto_notify_admin: true,
  auto_notify_teacher: true,
  mushaf_display_format: "madinah",
  updated_at: new Date().toISOString(),
};

export const DEFAULT_QUEUE: RecitationQueueItem[] = [
  {
    id: "q-101",
    student_name: "Ahmad Fauzan",
    student_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    type: "Tahfidz",
    mode: "surah",
    surah_id: 67,
    surah_name: "Al-Mulk",
    verse_range: "Ayat 1-15",
    submitted_at: "10 menit lalu",
    status: "pending",
    group_name: "Kelas Tahfidz Subuh",
  },
  {
    id: "q-102",
    student_name: "Nabila Zahra",
    student_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    type: "Tahsin",
    mode: "surah",
    surah_id: 55,
    surah_name: "Ar-Rahman",
    verse_range: "Ayat 1-30",
    submitted_at: "25 menit lalu",
    status: "pending",
    group_name: "Grup Santri Akhwat",
  },
  {
    id: "q-103",
    student_name: "Muhammad Rizky",
    student_avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
    type: "Tahfidz",
    mode: "juz",
    juz_id: 30,
    surah_name: "Juz 30 (An-Naba - An-Nas)",
    verse_range: "1 Juz Lengkap",
    submitted_at: "1 jam lalu",
    status: "pending",
    group_name: "Kajian Komunitas Qurani",
  },
];

// -------------------------------------------------------------
// SETTINGS REPOSITORY
// -------------------------------------------------------------

export async function fetchRecitationSettings(): Promise<RecitationSettingConfig[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("recitation_settings")
        .select("*")
        .order("type", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as RecitationSettingConfig[];
      }
    } catch (e) {
      console.warn("Supabase fetchRecitationSettings failed, using fallback:", e);
    }
  }

  // Fallback localStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
  }

  return [DEFAULT_GLOBAL_SETTINGS];
}

export async function saveRecitationSetting(setting: RecitationSettingConfig): Promise<boolean> {
  const updated = { ...setting, updated_at: new Date().toISOString() };

  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      const currentList = await fetchRecitationSettings();
      const existingIdx = currentList.findIndex(
        (s) => s.type === updated.type && s.target_id === updated.target_id
      );
      if (existingIdx >= 0) {
        currentList[existingIdx] = updated;
      } else {
        currentList.push(updated);
      }
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(currentList));
      window.dispatchEvent(new Event("qurani_settings_updated"));
    } catch {}
  }

  // Sync to Supabase
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("recitation_settings")
        .upsert(
          {
            type: updated.type,
            target_id: updated.target_id,
            target_name: updated.target_name,
            passing_grade: updated.passing_grade,
            max_tajweed_mistakes: updated.max_tajweed_mistakes,
            max_makhraj_mistakes: updated.max_makhraj_mistakes,
            max_harakat_mistakes: updated.max_harakat_mistakes,
            strictness: updated.strictness,
            auto_notify_parent: updated.auto_notify_parent,
            auto_notify_admin: updated.auto_notify_admin,
            auto_notify_teacher: updated.auto_notify_teacher,
            mushaf_display_format: updated.mushaf_display_format,
            updated_at: updated.updated_at,
          },
          { onConflict: "type,target_id" }
        );
      if (error) {
        console.warn("Supabase upsert settings error:", error.message);
      }
    } catch (e) {
      console.warn("Supabase saveRecitationSetting caught error:", e);
    }
  }

  return true;
}

// -------------------------------------------------------------
// INCOMING QUEUE (PROSES TERIMA SETORAN)
// -------------------------------------------------------------

export async function fetchRecitationQueue(): Promise<RecitationQueueItem[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("recitation_queue")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as RecitationQueueItem[];
      }
    } catch (e) {
      console.warn("Supabase fetchRecitationQueue fallback:", e);
    }
  }

  // Fallback localStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_QUEUE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(LOCAL_STORAGE_QUEUE_KEY, JSON.stringify(DEFAULT_QUEUE));
    } catch {}
  }

  return DEFAULT_QUEUE;
}

export async function updateQueueStatus(
  queueId: string,
  newStatus: "pending" | "in_review" | "completed"
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      const list = await fetchRecitationQueue();
      const updated = list.map((item) =>
        item.id === queueId ? { ...item, status: newStatus } : item
      );
      localStorage.setItem(LOCAL_STORAGE_QUEUE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_queue_updated"));
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("recitation_queue")
        .update({ status: newStatus })
        .eq("id", queueId);
    } catch (e) {
      console.warn("Supabase updateQueueStatus error:", e);
    }
  }
}

// -------------------------------------------------------------
// RECITATION NOTIFICATIONS
// -------------------------------------------------------------

export async function sendRecitationNotifications(
  payload: {
    sessionId: string;
    studentName: string;
    recite: string;
    result: string;
    parentEmail?: string;
    notifyParent: boolean;
    notifyTeacher: boolean;
    notifyAdmin: boolean;
  }
): Promise<void> {
  const notifs: RecitationNotificationItem[] = [];
  const now = new Date().toISOString();

  if (payload.notifyParent && payload.parentEmail) {
    notifs.push({
      id: `notif-${Date.now()}-parent`,
      session_id: payload.sessionId,
      recipient_type: "parent",
      recipient_email: payload.parentEmail,
      recipient_name: `Orang Tua ${payload.studentName}`,
      title: `Hasil Setoran ${payload.studentName}: ${payload.result}`,
      message: `Setoran Al-Qur'an (${payload.recite}) telah selesai dinilai dengan hasil ${payload.result}. Tampilan mushaf dapat dilihat langsung di aplikasi.`,
      read: false,
      created_at: now,
    });
  }

  if (payload.notifyTeacher) {
    notifs.push({
      id: `notif-${Date.now()}-teacher`,
      session_id: payload.sessionId,
      recipient_type: "teacher",
      recipient_name: "Guru Pembimbing",
      title: `Evaluasi Tersimpan: ${payload.studentName}`,
      message: `Catatan umum dan catatan per halaman untuk santri ${payload.studentName} telah berhasil disimpan ke database.`,
      read: false,
      created_at: now,
    });
  }

  if (payload.notifyAdmin) {
    notifs.push({
      id: `notif-${Date.now()}-admin`,
      session_id: payload.sessionId,
      recipient_type: "group_admin",
      recipient_name: "Admin Grup Qurani",
      title: `Laporan Setoran Baru: ${payload.studentName}`,
      message: `Santri ${payload.studentName} telah menyelesaikan setoran ${payload.recite} dengan predikat ${payload.result}.`,
      read: false,
      created_at: now,
    });
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTIFS_KEY) || "[]");
      localStorage.setItem(LOCAL_STORAGE_NOTIFS_KEY, JSON.stringify([...notifs, ...existing]));
    } catch {}
  }

  // Sync to Supabase
  if (isSupabaseConfigured && notifs.length > 0) {
    try {
      await supabase.from("recitation_notifications").insert(notifs);
    } catch (e) {
      console.warn("Supabase sendRecitationNotifications error:", e);
    }
  }
}
