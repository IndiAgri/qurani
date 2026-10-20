"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  Sun,
  Moon,
  Heart,
  ShoppingBag,
  Bell,
  ChevronDown,
  PanelLeft,
  Check,
  User,
  Settings,
  LogOut,
  Receipt,
  BookOpen,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IndonesiaFlag, UsaFlag } from "@/components/ui/flags";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const isOrdersActive = pathname.includes("/orders");
  const [selectedLang, setSelectedLang] = React.useState(currentLocale === "id" ? "Indonesia" : "English");
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Sync theme
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
      setIsDarkMode(isDark);
      if (isDark) document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      toast.success("Mode Gelap aktif");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      toast.success("Mode Terang aktif");
    }
  };

  const languages = [
    { label: "Indonesia", code: "id" },
    { label: "English", code: "en" },
  ];

  const handleLanguageChange = (lang: (typeof languages)[0]) => {
    setSelectedLang(lang.label);
    if (typeof window !== "undefined") {
      localStorage.setItem("user_locale", lang.code);
    }
    if (lang.code !== currentLocale) {
      const newPath = pathname.startsWith("/" + currentLocale)
        ? pathname.replace(new RegExp(`^/${currentLocale}`), `/${lang.code}`)
        : `/${lang.code}${pathname}`;
      router.push(newPath);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-3.5 sm:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/70 dark:border-slate-800 transition-all">
      {/* Left side: Toggle button & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          type="button"
          aria-label="Toggle Sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition focus:outline-none cursor-pointer"
        >
          <PanelLeft className="size-5" />
        </button>

        {/* Search bar for desktop only */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <input
            type="text"
            placeholder={pathname.includes("/teachers") ? "Cari user..." : "Cari surah, guru, teman..."}
            className="h-10 w-full rounded-[10px] border border-gray-200/90 dark:border-slate-700 bg-white/95 dark:bg-slate-800 px-3.5 pr-9 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 shadow-2xs transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        </div>
      </div>

      {/* Right side: Language, Theme, Actions, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language selector (Hidden on mobile) */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-10 items-center gap-2 rounded-[10px] border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-2xs hover:bg-gray-50/80 dark:hover:bg-slate-700/60 transition focus:outline-none cursor-pointer">
              {selectedLang === "Indonesia" ? (
                <IndonesiaFlag className="size-5" />
              ) : (
                <UsaFlag className="size-5" />
              )}
              <span className="font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                {selectedLang}
              </span>
              <ChevronDown className="size-3.5 text-slate-400 stroke-[2] shrink-0 ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border border-gray-100 dark:border-slate-800 shadow-xl p-1 bg-white dark:bg-slate-900"
            >
              {languages.map((lang) => {
                const isSelected = selectedLang === lang.label;
                return (
                  <DropdownMenuItem
                    key={lang.label}
                    onClick={() => handleLanguageChange(lang)}
                    className={cn(
                      "flex items-center gap-2.5 text-xs sm:text-sm px-2.5 py-2 cursor-pointer rounded-lg font-medium transition-colors",
                      isSelected
                        ? "bg-gray-100/90 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center justify-center size-4 shrink-0">
                      {isSelected ? (
                        <Check className="size-3.5 text-slate-500 dark:text-slate-400 stroke-[2.5]" />
                      ) : (
                        <span className="size-3.5" />
                      )}
                    </div>
                    {lang.code === "id" ? (
                      <IndonesiaFlag className="size-5" />
                    ) : (
                      <UsaFlag className="size-5" />
                    )}
                    <span className="text-xs sm:text-sm font-semibold">{lang.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme Toggle Button */}
        <Tooltip>
          <TooltipTrigger
            onClick={toggleTheme}
            className="flex size-9 sm:size-10 items-center justify-center rounded-[10px] border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-gray-50/80 dark:hover:bg-slate-700/60 transition focus:outline-none cursor-pointer"
          >
            {isDarkMode ? <Moon className="size-4 sm:size-4.5 text-emerald-400 stroke-[1.8]" /> : <Sun className="size-4 sm:size-4.5 text-slate-800 dark:text-slate-200 stroke-[1.8]" />}
          </TooltipTrigger>
          <TooltipContent side="bottom">{isDarkMode ? "Dark Mode" : "Light Mode"}</TooltipContent>
        </Tooltip>

        {/* Wishlist / Favorites dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="flex size-9 sm:size-10 items-center justify-center rounded-[10px] border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-gray-50/80 dark:hover:bg-slate-700/60 transition focus:outline-none cursor-pointer">
                <Heart className="size-4 sm:size-4.5 text-slate-800 dark:text-slate-200 stroke-[1.8]" />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Guru & Surah Favorit</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <DropdownMenuLabel className="text-xs font-bold text-gray-800 dark:text-gray-200">Favorit Tersimpan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1.5 py-1">
              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="size-7 rounded-lg bg-emerald-50 text-[#00875a] flex items-center justify-center">
                  <BookOpen className="size-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Al-Kahfi (Ayat 1-10)</p>
                  <p className="text-[10px] text-gray-400">Target Muraja&apos;ah Jumat</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="size-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Sparkles className="size-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900 dark:text-white">Ust. Dawoud Yahya</p>
                  <p className="text-[10px] text-gray-400">Tahsin & Sanad Al-Jazariyyah</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bag / Orders button */}
        <Tooltip>
          <TooltipTrigger
            onClick={() => router.push(`/${currentLocale}/orders`)}
            className={cn(
              "flex size-9 sm:size-10 items-center justify-center rounded-[10px] transition focus:outline-none cursor-pointer",
              isOrdersActive
                ? "bg-[#00875a] text-white shadow-xs hover:bg-[#00734c]"
                : "border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-gray-50/80 dark:hover:bg-slate-700/60"
            )}
          >
            <ShoppingBag
              className={cn(
                "size-4 sm:size-4.5 stroke-[1.8]",
                isOrdersActive ? "text-white" : "text-slate-800 dark:text-slate-200"
              )}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Pesanan Saya</TooltipContent>
        </Tooltip>

        {/* Notifications Bell dropdown (Always visible on mobile) */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger className="flex size-9 sm:size-10 items-center justify-center rounded-[10px] border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs hover:bg-gray-50/80 dark:hover:bg-slate-700/60 transition focus:outline-none cursor-pointer">
                <Bell className="size-4 sm:size-4.5 text-slate-800 dark:text-slate-200 stroke-[1.8]" />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Notifikasi</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-72 rounded-xl p-2 shadow-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <DropdownMenuLabel className="text-xs font-bold text-gray-800 dark:text-gray-200">Notifikasi Terbaru</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-1.5 py-1">
              <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer space-y-0.5">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Setoran Tahsin Diverifikasi</p>
                <p className="text-[11px] text-gray-500">Ustadzah Alvia menyetujui evaluasi QS Al-Fatihah.</p>
                <span className="text-[10px] text-emerald-600 font-medium">10 menit yang lalu</span>
              </div>
              <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer space-y-0.5">
                <p className="text-xs font-bold text-gray-900 dark:text-white">Top Up Saldo Sukses</p>
                <p className="text-[11px] text-gray-500">Saldo Rp 250.000 telah masuk ke Wallet Anda.</p>
                <span className="text-[10px] text-gray-400 font-medium">1 jam yang lalu</span>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative size-9 sm:size-10 rounded-full overflow-hidden border border-gray-200 shadow-2xs hover:ring-2 hover:ring-emerald-500/20 transition focus:outline-none ml-0.5 cursor-pointer shrink-0">
            {user?.avatar && (user.avatar.startsWith("/") || user.avatar.startsWith("http")) ? (
              <Image
                src={
                  pathname.includes("/teachers")
                    ? "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp"
                    : user.avatar
                }
                alt={pathname.includes("/teachers") ? "Rafi Andika" : user?.name || "indi"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full bg-[#1e5d22] text-white flex items-center justify-center font-bold text-xs sm:text-sm uppercase select-none">
                {(user?.name || "indi").charAt(0)}
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-0 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                {pathname.includes("/teachers") ? "Rafi Andika" : user?.name || "indi"}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 font-medium">
                {pathname.includes("/teachers")
                  ? "@rafi_andika"
                  : user?.username
                  ? user.username.startsWith("@")
                    ? user.username
                    : `@${user.username}`
                  : "@indiagri"}
              </p>
            </div>
            <div className="p-1 space-y-0.5">
              <DropdownMenuItem
                onClick={() => router.push(`/${currentLocale}/teachers/1/dashboard`)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
              >
                <GraduationCap className="size-4.5 text-gray-600 dark:text-gray-400 shrink-0" />
                <span>Dashboard Guru</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    pathname.includes("/teachers")
                      ? `/${currentLocale}/teachers/1/profile`
                      : `/${currentLocale}/profile`
                  )
                }
                className="flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
              >
                <User className="size-4.5 text-gray-600 dark:text-gray-400 shrink-0" />
                <span>Profil</span>
              </DropdownMenuItem>

              {/* Mobile Only: Pesanan Saya */}
              <DropdownMenuItem
                onClick={() => router.push(`/${currentLocale}/orders`)}
                className="sm:hidden flex items-center gap-3 px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
              >
                <ShoppingBag className="size-4.5 text-gray-600 dark:text-gray-400 shrink-0" />
                <span>Pesanan Saya</span>
              </DropdownMenuItem>

              {/* Mobile Only: Dark / Light Mode Toggle */}
              <DropdownMenuItem
                onClick={toggleTheme}
                className="sm:hidden flex items-center justify-between px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon className="size-4.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Sun className="size-4.5 text-amber-500 shrink-0" />
                  )}
                  <span>Mode {isDarkMode ? "Gelap" : "Terang"}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                  {isDarkMode ? "Dark" : "Light"}
                </span>
              </DropdownMenuItem>

              {/* Mobile Only: Language Switcher */}
              <DropdownMenuItem
                onClick={() => {
                  const nextLang = languages.find((l) => l.code !== currentLocale) || languages[0];
                  handleLanguageChange(nextLang);
                }}
                className="md:hidden flex items-center justify-between px-3 py-2 text-sm font-normal text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800/70 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {currentLocale === "id" ? (
                    <IndonesiaFlag className="size-4.5 shrink-0" />
                  ) : (
                    <UsaFlag className="size-4.5 shrink-0" />
                  )}
                  <span>Bahasa</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedLang}
                </span>
              </DropdownMenuItem>

              {pathname.includes("/teachers") && (
                <DropdownMenuItem
                  onClick={() => router.push(`/${currentLocale}/dashboard`)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 rounded-xl cursor-pointer"
                >
                  <Users className="size-4.5 text-emerald-600 shrink-0" />
                  <span>Akun Santri (fatkul)</span>
                </DropdownMenuItem>
              )}
            </div>
            <div className="border-t border-gray-100 dark:border-slate-800 p-1">
              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl cursor-pointer"
              >
                <LogOut className="size-4.5 text-red-500 shrink-0" />
                <span>Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
