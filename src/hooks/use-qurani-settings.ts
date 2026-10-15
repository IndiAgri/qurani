"use client";

import * as React from "react";

export interface VerseErrorCategory {
  id: string;
  label: string;
  bg: string;
  text: string;
  border?: string;
  enabled: boolean;
}

export interface QuraniSettings {
  layout: "flexible" | "mushaf_uthmani";
  fontType: "utsmani" | "indopak";
  fontSize: number; // 1 - 10
  pageSummary: "show" | "hide";
  verseErrors: VerseErrorCategory[];
  wordErrors: VerseErrorCategory[];
}

export const DEFAULT_VERSE_ERRORS: VerseErrorCategory[] = [
  {
    id: "ayat_waqaf_washal",
    label: "Ayat Waqaf atau Washal",
    bg: "#93c5fd",
    text: "#0f172a",
    enabled: true,
  },
  {
    id: "ayat_waqaf_ibtida",
    label: "Ayat Waqaf dan Ibtida",
    bg: "#bef264",
    text: "#0f172a",
    enabled: true,
  },
  {
    id: "ayat_tertukar",
    label: "Ayat Tertukar",
    bg: "#fca5a5",
    text: "#0f172a",
    enabled: true,
  },
  {
    id: "lainnya_global",
    label: "Lainnya(Global)",
    bg: "#fb923c",
    text: "#0f172a",
    enabled: true,
  },
  {
    id: "testing",
    label: "testing",
    bg: "#991b1b",
    text: "#ffffff",
    enabled: true,
  },
  {
    id: "ayat_lupa",
    label: "Ayat Lupa",
    bg: "#e2e8f0",
    text: "#0f172a",
    enabled: true,
  },
];

export const DEFAULT_WORD_ERRORS: VerseErrorCategory[] = [
  { id: "gharib", label: "Gharib", bg: "#fed7aa", text: "#0f172a", enabled: true },
  { id: "ghunnah", label: "Ghunnah", bg: "#fdba74", text: "#0f172a", enabled: true },
  { id: "harakat", label: "Harakat tertukar", bg: "#fde047", text: "#0f172a", enabled: true },
  { id: "huruf_tam_kur", label: "Huruf Tambah Kurang", bg: "#f87171", text: "#0f172a", enabled: true },
  { id: "lupa", label: "Lupa", bg: "#bfdbfe", text: "#0f172a", enabled: true },
  { id: "mad", label: "Mad", bg: "#fda4af", text: "#0f172a", enabled: true },
  { id: "makhroj", label: "Makhroj", bg: "#99f6e4", text: "#0f172a", enabled: true },
  { id: "nun_mati", label: "Nun Mati Tanwin", bg: "#a7f3d0", text: "#0f172a", enabled: true },
  { id: "qalqalah", label: "Qalqalah", bg: "#fb923c", text: "#0f172a", enabled: true },
  { id: "tasydid", label: "Tasydid", bg: "#fda4af", text: "#0f172a", enabled: true },
  { id: "urutan", label: "Urutan Huruf / Kata", bg: "#86efac", text: "#0f172a", enabled: true },
  { id: "waqof_washal", label: "Waqof Washal", bg: "#fde047", text: "#0f172a", enabled: true },
  { id: "waqaf_ibtida", label: "Waqaf Ibtida", bg: "#d8b4fe", text: "#0f172a", enabled: true },
  { id: "lainnya", label: "Lainnya", bg: "#cbd5e1", text: "#0f172a", enabled: true },
];

export const DEFAULT_QURANI_SETTINGS: QuraniSettings = {
  layout: "flexible",
  fontType: "utsmani",
  fontSize: 3,
  pageSummary: "hide",
  verseErrors: DEFAULT_VERSE_ERRORS,
  wordErrors: DEFAULT_WORD_ERRORS,
};

const STORAGE_KEY = "qurani_user_settings";
const SETTINGS_EVENT = "qurani-settings-changed";

export function getStoredQuraniSettings(): QuraniSettings {
  if (typeof window === "undefined") return DEFAULT_QURANI_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_QURANI_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      layout: parsed.layout || DEFAULT_QURANI_SETTINGS.layout,
      fontType: parsed.fontType || DEFAULT_QURANI_SETTINGS.fontType,
      fontSize: typeof parsed.fontSize === "number" ? Math.min(10, Math.max(1, parsed.fontSize)) : DEFAULT_QURANI_SETTINGS.fontSize,
      pageSummary: parsed.pageSummary || DEFAULT_QURANI_SETTINGS.pageSummary,
      verseErrors: Array.isArray(parsed.verseErrors) && parsed.verseErrors.length > 0
        ? parsed.verseErrors
        : DEFAULT_VERSE_ERRORS,
      wordErrors: Array.isArray(parsed.wordErrors) && parsed.wordErrors.length > 0
        ? parsed.wordErrors
        : DEFAULT_WORD_ERRORS,
    };
  } catch {
    return DEFAULT_QURANI_SETTINGS;
  }
}

export function saveStoredQuraniSettings(settings: QuraniSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event(SETTINGS_EVENT));
  } catch (e) {
    console.error("Failed to save Qurani settings:", e);
  }
}

export function useQuraniSettings() {
  const [settings, setSettings] = React.useState<QuraniSettings>(DEFAULT_QURANI_SETTINGS);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load from localStorage on mount & listen to changes
  React.useEffect(() => {
    const current = getStoredQuraniSettings();
    setSettings(current);
    setIsLoaded(true);

    const handleSync = () => {
      setSettings(getStoredQuraniSettings());
    };

    window.addEventListener(SETTINGS_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateSettings = React.useCallback(
    (updater: Partial<QuraniSettings> | ((prev: QuraniSettings) => QuraniSettings)) => {
      setSettings((prev) => {
        const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
        saveStoredQuraniSettings(next);
        return next;
      });
    },
    []
  );

  const toggleVerseError = React.useCallback((id: string) => {
    setSettings((prev) => {
      const nextErrors = prev.verseErrors.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      );
      const next = { ...prev, verseErrors: nextErrors };
      saveStoredQuraniSettings(next);
      return next;
    });
  }, []);

  const updateVerseError = React.useCallback(
    (id: string, patch: Partial<VerseErrorCategory>) => {
      setSettings((prev) => {
        const nextErrors = prev.verseErrors.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        );
        const next = { ...prev, verseErrors: nextErrors };
        saveStoredQuraniSettings(next);
        return next;
      });
    },
    []
  );

  const toggleWordError = React.useCallback((id: string) => {
    setSettings((prev) => {
      const nextErrors = prev.wordErrors.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      );
      const next = { ...prev, wordErrors: nextErrors };
      saveStoredQuraniSettings(next);
      return next;
    });
  }, []);

  const updateWordError = React.useCallback(
    (id: string, patch: Partial<VerseErrorCategory>) => {
      setSettings((prev) => {
        const nextErrors = prev.wordErrors.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        );
        const next = { ...prev, wordErrors: nextErrors };
        saveStoredQuraniSettings(next);
        return next;
      });
    },
    []
  );

  const addVerseError = React.useCallback(
    (newCategory: Omit<VerseErrorCategory, "id">) => {
      setSettings((prev) => {
        const id = `cat_${Date.now()}`;
        const nextErrors = [...prev.verseErrors, { ...newCategory, id }];
        const next = { ...prev, verseErrors: nextErrors };
        saveStoredQuraniSettings(next);
        return next;
      });
    },
    []
  );

  const deleteVerseError = React.useCallback((id: string) => {
    setSettings((prev) => {
      const nextErrors = prev.verseErrors.filter((item) => item.id !== id);
      const next = { ...prev, verseErrors: nextErrors };
      saveStoredQuraniSettings(next);
      return next;
    });
  }, []);

  const resetSettings = React.useCallback(() => {
    setSettings(DEFAULT_QURANI_SETTINGS);
    saveStoredQuraniSettings(DEFAULT_QURANI_SETTINGS);
  }, []);

  const saveSettings = React.useCallback(() => {
    setSettings((current) => {
      saveStoredQuraniSettings(current);
      return current;
    });
  }, []);

  return {
    settings,
    isLoaded,
    updateSettings,
    toggleVerseError,
    updateVerseError,
    toggleWordError,
    updateWordError,
    addVerseError,
    deleteVerseError,
    resetSettings,
    saveSettings,
  };
}
