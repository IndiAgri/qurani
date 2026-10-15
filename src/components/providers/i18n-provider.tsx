"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, fallback?: string, params?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key, fallback) => fallback || key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<string>("en");

  useEffect(() => {
    if (pathname.startsWith("/id")) {
      setLocaleState("id");
      localStorage.setItem("user_locale", "id");
    } else if (pathname.startsWith("/en")) {
      setLocaleState("en");
      localStorage.setItem("user_locale", "en");
    } else {
      const saved = localStorage.getItem("user_locale");
      if (saved === "id") {
        setLocaleState("id");
      } else {
        setLocaleState("en");
      }
    }
  }, [pathname]);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_locale", newLocale);
    }
  };

  const t = (key: string, fallback?: string, params?: Record<string, any>) => {
    let text = fallback || key;
    if (params) {
      Object.keys(params).forEach((k) => {
        text = text.replace(new RegExp(`{${k}}`, "g"), params[k]);
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
