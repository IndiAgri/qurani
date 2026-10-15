"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
    Search, MapPin, Star, Sparkles, X,
    SlidersHorizontal,
    ChevronRight, Video, Home, Check,
    LayoutGrid, List, ThumbsUp, Crown, ShieldCheck,
    Languages, Sun, Sunrise, Moon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n, I18nProvider } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { DUMMY_TRAINERS, type Trainer } from "@/data/trainers-data"
import { trainerApi } from "@/lib/trainer-api"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { FavoriteButton } from "@/components/favorites/favorite-button"

import {
    Sheet, SheetContent, SheetTrigger, SheetTitle,
} from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import BannerCarousel from "@/components/marketplace/banner-carousel"

// ─── Constants ────────────────────────────────────────────────────────────────


const TEACHING_METHODS = [
    "Al-Baghdadi", "An-Nahdliyah", "Dirosa", "Grand PQ", "Iqro",
    "Qiroati", "Tafsir", "Talaqqi", "Tartil", "Tilawati",
    "Ummi", "Wafa", "Yanbu'a"
]

const PRICE_RANGES = [
    { id: "all", label: "price_all", min: 0, max: Infinity },
    { id: "u50", label: "price_u50", min: 0, max: 49999 },
    { id: "50_75", label: "price_50_75", min: 50000, max: 75000 },
    { id: "o75", label: "price_o75", min: 75001, max: Infinity },
]

const RATING_OPTIONS = [
    { value: 0, label: "rating_all" },
    { value: 4.5, label: "rating_45" },
    { value: 4.0, label: "rating_40" },
    { value: 3.5, label: "rating_35" },
]

const AVAILABLE_LANGUAGES = [
    "Arab", "Bengali", "Farsi", "German", "Hausa",
    "Indonesia", "Inggris", "Jepang", "Kazakh", "Korea",
    "Mandarin", "Melayu", "Prancis", "Rusia", "Spanyol",
    "Thailand", "Turki", "Urdu", "Uzbek"
].sort()

// demo: trainer ID genap = online only, ganjil = bisa offline juga
const hasOffline = (t: Trainer) => parseInt(t.id) % 2 !== 0

// ─── Filter Sidebar ────────────────────────────────────────────────────────────

interface FilterState {
    methods: string[];
    times: string[];
    rating: number;
    price: string;
    mode: "all" | "online" | "offline";
    languages: string[];
    location: string;
}

interface FSProps {
    initialFilters: FilterState;
    onApply: (filters: FilterState) => void;
    onClose?: () => void;
    onClearAll: () => void;
    t: any;
}

const AVAILABLE_CITIES = Array.from(new Set(DUMMY_TRAINERS.map(t => t.city).filter(Boolean))).sort() as string[]

function FilterSidebar({ initialFilters, onApply, onClose, onClearAll, t }: FSProps) {
    const [tempFilters, setTempFilters] = useState<FilterState>(initialFilters)

    const [openLang, setOpenLang] = useState(false)
    const [openMethod, setOpenMethod] = useState(false)
    const [openLocation, setOpenLocation] = useState(false)
    const [langSearch, setLangSearch] = useState("")
    const [methodSearch, setMethodSearch] = useState("")
    const [locationSearch, setLocationSearch] = useState("")

    const filteredLangs = useMemo(() => {
        const search = langSearch.toLowerCase().trim()
        const items = search ? AVAILABLE_LANGUAGES.filter(l => l.toLowerCase().includes(search)) : AVAILABLE_LANGUAGES
        return [...items].sort((a, b) => {
            const aSelected = tempFilters.languages.includes(a)
            const bSelected = tempFilters.languages.includes(b)
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return a.localeCompare(b)
        })
    }, [langSearch, tempFilters.languages])

    const filteredMethods = useMemo(() => {
        const search = methodSearch.toLowerCase().trim()
        const items = search ? TEACHING_METHODS.filter(m => m.toLowerCase().includes(search)) : TEACHING_METHODS
        return [...items].sort((a, b) => {
            const aSelected = tempFilters.methods.includes(a)
            const bSelected = tempFilters.methods.includes(b)
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return a.localeCompare(b)
        })
    }, [methodSearch, tempFilters.methods])

    const filteredLocations = useMemo(() => {
        const search = locationSearch.toLowerCase().trim()
        const items = search ? AVAILABLE_CITIES.filter(l => l.toLowerCase().includes(search)) : AVAILABLE_CITIES
        return items
    }, [locationSearch])

    const toggleMethod = (m: string) => {
        setTempFilters(prev => ({
            ...prev,
            methods: prev.methods.includes(m) ? prev.methods.filter(x => x !== m) : [...prev.methods, m]
        }))
    }
    const toggleLanguage = (l: string) => {
        setTempFilters(prev => ({
            ...prev,
            languages: prev.languages.includes(l) ? prev.languages.filter(x => x !== l) : [...prev.languages, l]
        }))
    }
    const toggleTime = (tId: string) => {
        setTempFilters(prev => ({
            ...prev,
            times: prev.times.includes(tId) ? prev.times.filter(x => x !== tId) : [...prev.times, tId]
        }))
    }

    const handleReset = () => {
        setTempFilters({
            methods: [], times: [], rating: 0, price: "all", mode: "all", languages: [], location: ""
        })
        onClearAll()
        if (onClose) onClose()
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar pb-24">
                <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 dark:text-white text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> {t("marketplace_main.filter", "Filter")}
                    </h3>
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                {/* Mode */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.mode_belajar", "Mode Belajar")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {([
                            { id: "all", label: t("marketplace_main.semua", "Semua"), Icon: Sparkles },
                            { id: "online", label: t("marketplace_main.online", "Online"), Icon: Video },
                            { id: "offline", label: t("marketplace_main.offline", "Offline"), Icon: Home },
                        ] as const).map(({ id, label, Icon }) => (
                            <button key={id} onClick={() => setTempFilters(prev => ({ ...prev, mode: id }))}
                                className={cn("flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-[10px] font-black transition-all duration-300",
                                    tempFilters.mode === id
                                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm"
                                        : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                                )}>
                                <Icon className={cn("w-4 h-4 transition-transform duration-300", tempFilters.mode === id && "scale-110")} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location Filter when Offline */}
                {tempFilters.mode === "offline" && (
                    <div className="space-y-3 pt-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.lokasi", "Lokasi")}</Label>
                        <Popover open={openLocation} onOpenChange={setOpenLocation}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-11 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 justify-between px-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                                >
                                    <span className={cn(!tempFilters.location ? "text-slate-400" : "text-slate-900 dark:text-white")}>
                                        {tempFilters.location || t("marketplace_main.pilih_lokasi", "Pilih Lokasi")}
                                    </span>
                                    <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", openLocation && "rotate-90 group-hover:text-emerald-500")} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 overflow-hidden" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder={t("marketplace_main.cari_lokasi", "Cari lokasi...")}
                                        className="h-11 text-[11px] px-3 font-medium bg-transparent"
                                        value={locationSearch}
                                        onValueChange={setLocationSearch}
                                    />
                                    <CommandEmpty className="py-6 text-center text-xs text-slate-500 italic">{t("marketplace_main.lokasi_tidak_tersedia", "Lokasi tidak tersedia.")}</CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                                        <AnimatePresence>
                                            {filteredLocations.map((loc) => (
                                                <CommandItem
                                                    key={loc}
                                                    value={loc}
                                                    onSelect={() => {
                                                        setTempFilters(prev => ({ ...prev, location: loc === prev.location ? "" : loc }))
                                                        setOpenLocation(false)
                                                    }}
                                                    className="text-xs rounded-lg cursor-pointer py-2.5 flex items-center justify-between mb-0.5 group"
                                                >
                                                    <span className={cn("transition-colors duration-200 font-medium", tempFilters.location === loc ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400")}>
                                                        {loc}
                                                    </span>
                                                    {tempFilters.location === loc && <Check className="w-4 h-4 text-emerald-500" />}
                                                </CommandItem>
                                            ))}
                                        </AnimatePresence>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}

                {/* Time / Waktu */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.waktu", "Waktu")}</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {([
                            { id: "morning", label: t("marketplace_main.pagi", "Pagi"), Icon: Sunrise },
                            { id: "afternoon", label: t("marketplace_main.siang", "Siang"), Icon: Sun },
                            { id: "night", label: t("marketplace_main.malam", "Malam"), Icon: Moon },
                        ] as const).map(({ id, label, Icon }) => {
                            const isSelected = tempFilters.times.includes(id)
                            return (
                                <button key={id} onClick={() => toggleTime(id)}
                                    className={cn("flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 text-[10px] font-black transition-all duration-300",
                                        isSelected
                                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 shadow-sm"
                                            : "border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}>
                                    <Icon className={cn("w-4 h-4 transition-transform duration-300", isSelected && "scale-110")} />
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Method */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.metode", "Metode")}</Label>
                    <div className="space-y-2">
                        <Popover open={openMethod} onOpenChange={setOpenMethod}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-11 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 justify-between px-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                                >
                                    <span className={cn(tempFilters.methods.length === 0 ? "text-slate-400" : "text-slate-900 dark:text-white")}>
                                        {tempFilters.methods.length === 0 ? t("marketplace_main.pilih_metode", "Pilih Metode") : t("marketplace_main.metode_dipilih", `${tempFilters.methods.length} Metode dipilih`, { count: tempFilters.methods.length.toString() })}
                                    </span>
                                    <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", openMethod && "rotate-90 group-hover:text-emerald-500")} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 overflow-hidden" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder={t("marketplace_main.cari_metode", "Cari metode...")}
                                        className="h-11 text-[11px] px-3 font-medium bg-transparent"
                                        value={methodSearch}
                                        onValueChange={setMethodSearch}
                                    />
                                    <CommandEmpty className="py-6 text-center text-xs text-slate-500 italic">{t("marketplace_main.metode_tidak_tersedia", "Metode tidak tersedia.")}</CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                                        <AnimatePresence>
                                            {filteredMethods.map((m) => (
                                                <CommandItem
                                                    key={m}
                                                    value={m}
                                                    onSelect={() => toggleMethod(m)}
                                                    className="text-xs rounded-lg cursor-pointer py-2.5 flex items-center justify-between mb-0.5 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                                                            tempFilters.methods.includes(m) ? "border-emerald-500 bg-emerald-500" : "border-slate-200 dark:border-slate-700 group-hover:border-emerald-300"
                                                        )}>
                                                            {tempFilters.methods.includes(m) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={cn("transition-colors duration-200", tempFilters.methods.includes(m) ? "font-black text-emerald-700 dark:text-emerald-400" : "font-medium text-slate-600 dark:text-slate-400")}>
                                                            {m}
                                                        </span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </AnimatePresence>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <AnimatePresence mode="popLayout">
                            {tempFilters.methods.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-1.5 pt-1"
                                >
                                    {tempFilters.methods.map(m => (
                                        <motion.div
                                            key={m}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 pl-2.5 pr-1.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                                        >
                                            {m}
                                            <button
                                                onClick={() => toggleMethod(m)}
                                                className="hover:bg-emerald-200 dark:hover:bg-emerald-800 p-0.5 rounded-full transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Language */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.bahasa", "Bahasa")}</Label>
                    <div className="space-y-2">
                        <Popover open={openLang} onOpenChange={setOpenLang}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full h-11 rounded-xl border-2 border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 justify-between px-3 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                                >
                                    <span className={cn(tempFilters.languages.length === 0 ? "text-slate-400" : "text-slate-900 dark:text-white")}>
                                        {tempFilters.languages.length === 0 ? t("marketplace_main.pilih_bahasa", "Pilih Bahasa") : t("marketplace_main.bahasa_dipilih", `${tempFilters.languages.length} Bahasa dipilih`, { count: tempFilters.languages.length.toString() })}
                                    </span>
                                    <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", openLang && "rotate-90 group-hover:text-emerald-500")} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-slate-200 dark:border-slate-800 overflow-hidden" align="start">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder={t("marketplace_main.cari_bahasa", "Cari bahasa...")}
                                        className="h-11 text-[11px] px-3 font-medium bg-transparent"
                                        value={langSearch}
                                        onValueChange={setLangSearch}
                                    />
                                    <CommandEmpty className="py-6 text-center text-xs text-slate-500 italic">{t("marketplace_main.bahasa_tidak_tersedia", "Bahasa tidak tersedia.")}</CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                                        <AnimatePresence>
                                            {filteredLangs.map((lang) => (
                                                <CommandItem
                                                    key={lang}
                                                    value={lang}
                                                    onSelect={() => toggleLanguage(lang)}
                                                    className="text-xs rounded-lg cursor-pointer py-2.5 flex items-center justify-between mb-0.5 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                                                            tempFilters.languages.includes(lang) ? "border-emerald-500 bg-emerald-500" : "border-slate-200 dark:border-slate-700 group-hover:border-emerald-300"
                                                        )}>
                                                            {tempFilters.languages.includes(lang) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={cn("transition-colors duration-200", tempFilters.languages.includes(lang) ? "font-black text-emerald-700 dark:text-emerald-400" : "font-medium text-slate-600 dark:text-slate-400")}>
                                                            {lang}
                                                        </span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </AnimatePresence>
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        <AnimatePresence mode="popLayout">
                            {tempFilters.languages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-1.5 pt-1"
                                >
                                    {tempFilters.languages.map(l => (
                                        <motion.div
                                            key={l}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 pl-2.5 pr-1.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                                        >
                                            {l}
                                            <button
                                                onClick={() => toggleLanguage(l)}
                                                className="hover:bg-emerald-200 dark:hover:bg-emerald-800 p-0.5 rounded-full transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <Separator />

                {/* Rating */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.rating", "Rating")}</Label>
                    <div className="space-y-1.5">
                        {RATING_OPTIONS.map(opt => (
                            <button key={opt.value} onClick={() => setTempFilters(prev => ({ ...prev, rating: prev.rating === opt.value ? 0 : opt.value }))}
                                className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all text-left",
                                    tempFilters.rating === opt.value ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700" : "border-slate-100 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                                )}>
                                <span>{opt.value === 0 ? t("marketplace_main.rating_all", "Semua Rating") : t("marketplace_main.rating_up", `${opt.value} ke atas`, { val: opt.value.toString() })}</span>
                                {opt.value > 0 && (
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={cn("w-2.5 h-2.5", i < Math.floor(opt.value) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Price */}
                <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("marketplace_main.biaya", "Biaya")}</Label>
                    <div className="space-y-1.5">
                        {PRICE_RANGES.map(r => (
                            <button key={r.id} onClick={() => setTempFilters(prev => ({ ...prev, price: r.id }))}
                                className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all text-left",
                                    tempFilters.price === r.id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700" : "border-slate-100 dark:border-slate-800 text-slate-600 hover:border-slate-300"
                                )}>
                                <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                                    tempFilters.price === r.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300")}>
                                    {tempFilters.price === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                {t(`marketplace_main.${r.label}`, r.label)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 z-10 rounded-b-2xl">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                    {t("marketplace_main.reset", "Reset")}
                </Button>
                {onClose && (
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        {t("marketplace_main.batal", "Batal")}
                    </Button>
                )}
                <Button onClick={() => {
                    onApply(tempFilters);
                    if (onClose) onClose();
                }} className="flex-1">
                    {t("marketplace_main.terapkan", "Terapkan")}
                </Button>
            </div>
        </div>
    )
}

const getBadgeStyles = (t: any, type?: string) => {
    switch (type) {
        case "duta-besar":
            return {
                label: t("marketplace_main.duta_besar", "Duta Besar"),
                icon: <Crown className="w-2.5 h-2.5 md:w-3 md:h-3" />,
                className: "bg-indigo-600 text-white border-indigo-400/30 shadow-[0_4px_20px_-2px_rgba(79,70,229,0.5)]"
            }
        case "guru-super":
            return {
                label: t("marketplace_main.guru_super", "Guru Super"),
                icon: <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />,
                className: "bg-emerald-600 text-white border-emerald-400/30 shadow-[0_4px_20px_-2px_rgba(5,150,105,0.5)]"
            }
        case "rekomendasi":
            return {
                label: t("marketplace_main.direkomendasikan", "Direkomendasikan"),
                icon: <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3" />,
                className: "bg-amber-500 text-white border-amber-300/30 shadow-[0_4px_20px_-2px_rgba(245,158,11,0.5)]"
            }
        default:
            return null
    }
}

// ─── Trainer Card ──────────────────────────────────────────────────────────────

function TrainerCard({ trainer, locale, formatPrice, view = "grid", onMethodClick, t }: { trainer: Trainer; locale: string; formatPrice: (p: number) => string; view?: "grid" | "list"; onMethodClick?: (method: string) => void; t: any }) {
    if (view === "list") {
        return (
            <Link href={`/${locale}/teachers/${trainer.id}`} className="group block">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] border border-slate-100 dark:border-slate-800 p-3 sm:p-4 hover:shadow-xl hover:border-emerald-500/20 transition-all duration-500 flex flex-row items-stretch gap-4">
                    {/* Left: Image Section */}
                    <div className="w-28 sm:w-36 lg:w-44 shrink-0 relative rounded-2xl overflow-hidden aspect-square sm:aspect-auto bg-slate-100 dark:bg-slate-800">
                        <img
                            src={trainer.avatar}
                            alt={trainer.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}`;
                            }}
                        />
                        
                        <div className="absolute top-2.5 right-2.5 z-20">
                            <FavoriteButton
                                targetType="teacher"
                                targetId={trainer.id}
                                className="hover:scale-115 transition-transform"
                                iconClassName="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                                unfavoritedClassName="fill-black/40 stroke-white stroke-[2.2] text-white hover:fill-black/60"
                            />
                        </div>

                    </div>

                    {/* Right: Detailed Info Stack */}
                    <div className="flex-1 flex flex-col min-w-0 py-0.5 relative">
                        {/* Badge: Moved to Top Right of Info Stack */}
                        {trainer.badgeType && (
                            <div className={cn(
                                "absolute top-0 right-0 px-2.5 py-1 rounded-xl text-[7px] sm:text-[9px] font-black uppercase tracking-[0.05em] border border-white/20 flex items-center gap-1.5 z-10",
                                getBadgeStyles(t, trainer.badgeType)?.className
                            )}>
                                {getBadgeStyles(t, trainer.badgeType)?.icon}
                                <span className="leading-none">{getBadgeStyles(t, trainer.badgeType)?.label}</span>
                            </div>
                        )}

                        {/* Availability Modes */}
                        <div className="flex gap-1 mb-0.5">
                            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[7px] font-black px-1.5 h-3.5 rounded-full border border-emerald-500/20 uppercase tracking-tighter">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                Online
                            </div>
                            {hasOffline(trainer) && (
                                <div className="flex items-center gap-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[7px] font-black px-1.5 h-3.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-tighter">
                                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                                    Offline
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base lg:text-xl group-hover:text-emerald-600 transition-colors truncate">
                            {trainer.name}
                        </h3>

                        {/* Methods - Moved under Name */}
                        <div className="flex gap-1 flex-wrap mt-1 mb-1">
                            {trainer.methods.slice(0, 3).map(m => (
                                <Badge
                                    key={m}
                                    variant="secondary"
                                    className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] sm:text-[9px] px-2 h-4 sm:h-5 font-bold uppercase border-0 rounded-md"
                                >
                                    {m}
                                </Badge>
                            ))}
                        </div>

                        {/* Rating & Location */}
                        <div className="flex flex-col gap-0.5 sm:gap-1 mt-1">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-slate-900 dark:text-white">{trainer.rating}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400 whitespace-nowrap">{trainer.reviewCount} {t("marketplace_main.ulasan", "ulasan")}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium max-w-full overflow-hidden">
                                    <MapPin className="h-2.5 w-2.5 shrink-0" />
                                    <span className="truncate">{trainer.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mt-auto pt-2 flex items-baseline gap-1.5">
                            <span className="text-sm sm:text-base lg:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                {formatPrice(trainer.pricePerSession)}
                            </span>
                            <span className="text-[10px] sm:text-xs text-slate-400 font-bold leading-none">{t("marketplace_main.per_jam", "/jam")}</span>
                        </div>

                        {/* Recommendation % - Absolute bottom right */}
                        <div className="absolute right-0 bottom-0 flex items-center gap-1 text-emerald-600 dark:text-emerald-400 pb-0.5">
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 fill-emerald-600/10" />
                            <span className="text-[10px] sm:text-sm font-black">{Math.floor(trainer.reviewCount * 0.9) + 5}</span>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={`/${locale}/teachers/${trainer.id}`} className="group block w-full">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* Image - Full cover rectangular photo */}
                <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                    <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trainer.name)}`;
                        }}
                    />

                    <div className="absolute top-2.5 right-2.5 z-20">
                        <FavoriteButton
                            targetType="teacher"
                            targetId={trainer.id}
                            className="hover:scale-115 transition-transform"
                            iconClassName="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                            unfavoritedClassName="fill-black/40 stroke-white stroke-[2.2] text-white hover:fill-black/60"
                        />
                    </div>

                    {/* Desktop Only Badge: Overlay on Image */}
                    {trainer.badgeType && (
                        <div className={cn(
                            "hidden sm:flex absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.05em] border border-white/20 items-center gap-1.5 z-10",
                            getBadgeStyles(t, trainer.badgeType)?.className
                        )}>
                            {getBadgeStyles(t, trainer.badgeType)?.icon}
                            <span className="leading-none">{getBadgeStyles(t, trainer.badgeType)?.label}</span>
                        </div>
                    )}

                    {/* Bottom Left: Location overlay */}
                    <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 text-[8px] font-bold text-white w-fit max-w-[90%] z-10 border border-white/10">
                        <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{trainer.location}</span>
                    </div>

                </div>

                {/* Content - More compact padding */}
                <div className="p-3 flex flex-col flex-1 gap-1">
                    {/* Mobile Only Badge: In content area */}
                    {trainer.badgeType && (
                        <div className={cn(
                            "flex sm:hidden w-fit px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider border items-center gap-1 mb-0.5",
                            getBadgeStyles(t, trainer.badgeType)?.className.replace("shadow-[0_4px_20px_-2px_rgba(79,70,229,0.5)]", "shadow-sm").replace("absolute top-3 left-3", "")
                        )}>
                            {getBadgeStyles(t, trainer.badgeType)?.icon}
                            <span className="leading-none">
                                {getBadgeStyles(t, trainer.badgeType)?.label}
                            </span>
                        </div>
                    )}
                    {/* Availability Modes */}
                    <div className="flex gap-1 mb-1">
                        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[7px] font-black px-1.5 h-3.5 rounded-full border border-emerald-500/20 uppercase tracking-tighter shadow-sm">
                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            Online
                        </div>
                        {hasOffline(trainer) && (
                            <div className="flex items-center gap-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 text-[7px] font-black px-1.5 h-3.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-tighter shadow-sm">
                                <div className="w-1 h-1 rounded-full bg-slate-400" />
                                Offline
                            </div>
                        )}
                    </div>

                    {trainer.name.length > 22 ? (
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight text-[13px] sm:text-sm group-hover:text-emerald-600 transition-colors">
                                        {trainer.name}
                                    </h3>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-slate-900 text-white border-0 font-bold text-xs rounded-xl px-3 py-2 z-[60]">
                                    {trainer.name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight text-[13px] sm:text-sm group-hover:text-emerald-600 transition-colors">
                            {trainer.name}
                        </h3>
                    )}

                    <div className="flex gap-1 flex-wrap">
                        {trainer.methods.slice(0, 2).map(m => (
                            <Badge
                                key={m}
                                variant="secondary"
                                onClick={(e) => {
                                    if (onMethodClick) {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onMethodClick(m)
                                    }
                                }}
                                className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] px-1.5 h-3.5 font-bold uppercase border-0 rounded-md w-fit hover:bg-slate-200 cursor-pointer transition-colors"
                            >
                                {m}
                            </Badge>
                        ))}
                        {trainer.methods.length > 2 && (
                            <span className="text-[8px] font-bold text-slate-400">+{trainer.methods.length - 2}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] pt-1 flex-wrap">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            <span className="text-slate-900 dark:text-white font-bold">{trainer.rating}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-[9px]">{trainer.reviewCount} {t("marketplace_main.ulasan", "ulasan")}</span>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-0.5">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-0.5 cursor-help">
                                            <ThumbsUp className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500/10" />
                                            <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold">
                                                {Math.floor(trainer.reviewCount * 0.9) + 5}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-slate-900 text-white border-0 font-bold text-[10px] rounded-lg px-2 py-1 z-[60]">
                                        {t("marketplace_main.direkomendasikan_oleh", `Direkomendasikan oleh ${Math.floor(trainer.reviewCount * 0.9) + 5} orang`, { count: (Math.floor(trainer.reviewCount * 0.9) + 5).toString() })}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <div className="flex items-end justify-between pt-2 mt-auto border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{t("marketplace_main.mulai_dari", "Mulai dari")}</span>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                                    {formatPrice(trainer.pricePerSession)}
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">{t("marketplace_main.per_jam", "/jam")}</span>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </Link>
    )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

// Komponen utama untuk Halaman Beranda Marketplace, menampilkan daftar guru, kategori, dan banner promosi.
export function MarketplaceMainPage() {
    const { locale, t } = useI18n()
    const { userId } = useAuth()

    const [trainers, setTrainers] = useState(DUMMY_TRAINERS)
    const [isLoadingApi, setIsLoadingApi] = useState(false)

    // Sync Ustadz Rafi's languages from profile (acting as user)
    useEffect(() => {
        let updatedTrainers = DUMMY_TRAINERS.map(t => {
            const languages = t.languages || [];
            return {
                ...t,
                languages: languages.includes("Indonesia") ? languages : ["Indonesia", ...languages]
            };
        });

        if (userId) {
            const savedLangs = localStorage.getItem(`user_languages_${userId}`)
            if (savedLangs) {
                const languages = JSON.parse(savedLangs)
                // Ensure Indonesia is always there for Rafi
                const finalLangs = languages.includes("Indonesia") ? languages : ["Indonesia", ...languages]
                updatedTrainers = updatedTrainers.map(t =>
                    t.id === "1" ? { ...t, languages: finalLangs } : t
                )
            }
        }
        // Sync local edited profile (jika user mengedit profil guru)
        if (typeof window !== 'undefined') {
            try {
                const savedProfileStr = localStorage.getItem('trainer_profile')
                if (savedProfileStr) {
                    const savedProfile = JSON.parse(savedProfileStr)
                    if (savedProfile && savedProfile.id) {
                        updatedTrainers = updatedTrainers.map(t =>
                            t.id === savedProfile.id
                                ? { ...t, pricePerSession: savedProfile.pricePerSession, avatar: savedProfile.avatar || t.avatar, name: savedProfile.name || t.name }
                                : t
                        )
                    }
                }
            } catch (err) { }
        }
        setTrainers(updatedTrainers)
    }, [userId])

    // ── Data guru hanya menggunakan dummy ────────────────────────
    // (Logika fetch API telah dihapus sesuai permintaan agar konsisten menggunakan data dummy)

    // ── Search ──────────────────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("")
    const [tempSearch, setTempSearch] = useState("")

    // ── Applied Filters ─────────────────────────────────────────────────────────
    const [filters, setFilters] = useState<FilterState>({
        methods: [], times: [], rating: 0, price: "all", mode: "all", languages: [], location: ""
    })

    // ── View ────────────────────────────────────────────────────────────────────
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

    // ── Clear All Applied Filters ───────────────────────────────────────────────
    const handleClearAllFilters = () => {
        setFilters({ methods: [], times: [], rating: 0, price: "all", mode: "all", languages: [], location: "" })
    }

    const resetAll = () => { setSearchQuery(""); setTempSearch(""); handleClearAllFilters() }

    // ── Derived: active filter count ────────────────────────────────────────────
    const totalActiveCount = filters.methods.length + filters.times.length +
        (filters.rating > 0 ? 1 : 0) + (filters.price !== "all" ? 1 : 0) +
        (filters.mode !== "all" ? 1 : 0) + filters.languages.length +
        (filters.location ? 1 : 0)

    const formatPrice = (p: number) =>
        new Intl.NumberFormat(locale === "en" ? "en-US" : "id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p)

    // ── Filtered list ──────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return trainers.filter(trainer => {
            const matchesSearch = !searchQuery ||
                trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                trainer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                trainer.methods.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesMethod = filters.methods.length === 0 ||
                trainer.methods.some(m => filters.methods.includes(m))
            const matchesLanguage = filters.languages.length === 0 ||
                (trainer.languages && trainer.languages.some(l => filters.languages.includes(l)))
            // Time: AND condition — trainer must cover ALL selected times
            const matchesTime = filters.times.length === 0 ||
                filters.times.every(ti => trainer.sessions.includes(ti as any))
            const matchesRating = trainer.rating >= filters.rating
            const priceObj = PRICE_RANGES.find(r => r.id === filters.price)
            const matchesPrice = !priceObj ||
                (trainer.pricePerSession >= priceObj.min && trainer.pricePerSession <= priceObj.max)
            let matchesMode = true
            if (filters.mode === "online") matchesMode = true
            else if (filters.mode === "offline") matchesMode = hasOffline(trainer)
            let matchesLocation = true
            if (filters.mode === "offline" && filters.location) {
                matchesLocation = trainer.city === filters.location
            }
            return matchesSearch && matchesMethod && matchesLanguage && matchesTime &&
                matchesRating && matchesPrice && matchesMode && matchesLocation
        })
    }, [trainers, searchQuery, filters])

    const filterSidebarProps: FSProps = {
        initialFilters: filters,
        onApply: setFilters,
        onClearAll: handleClearAllFilters,
        t
    }

    const renderViewModes = (className?: string) => (
        <div className={cn("flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-1 shrink-0", className)}>
            <button
                onClick={() => setViewMode("grid")}
                className={cn("h-9 w-10 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "grid" ? "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600"
                )}>
                <LayoutGrid className="w-4.5 h-4.5" />
            </button>
            <button
                onClick={() => setViewMode("list")}
                className={cn("h-9 w-10 rounded-lg flex items-center justify-center transition-all",
                    viewMode === "list" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-600"
                )}>
                <List className="w-4.5 h-4.5" />
            </button>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50/80 dark:bg-gray-950 pb-20">

            <div className="max-w-7xl mx-auto px-4 pt-6">
                <BannerCarousel />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

                {/* Results Header */}
                <div className="flex flex-col gap-4 mb-6">
                    {/* Mobile Title Row */}
                    <div className="flex items-center justify-between w-full md:hidden">
                        <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight">
                            {t("marketplace_main.title_ngaji", "Guru Ngaji")} <span className="text-emerald-600">{t("marketplace_main.title_guru", "Profesional")}</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            <Link href={`/${locale}/teachers/registers`}>
                                <Button size="sm" className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer">
                                    <Sparkles className="w-3 h-3 text-emerald-200" />
                                    <span>Mengajar</span>
                                </Button>
                            </Link>
                            {renderViewModes()}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        {/* Desktop Title & CTA */}
                        <div className="hidden md:flex items-center justify-between">
                            <h2 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight">
                                {t("marketplace_main.title_ngaji", "Guru Ngaji")} <span className="text-emerald-600">{t("marketplace_main.title_guru", "Profesional")}</span>
                            </h2>
                            <Link href={`/${locale}/teachers/registers`}>
                                <Button className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition flex items-center gap-2 cursor-pointer">
                                    <Sparkles className="w-4 h-4 text-emerald-200" />
                                    <span>Daftar Jadi Pengajar</span>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-stretch gap-2 w-full md:w-auto">
                            <div className="flex w-full md:w-72 lg:w-96 h-11 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 transition-all overflow-hidden bg-gray-50/80 dark:bg-gray-800/20">
                                <div className="relative flex-1 h-full">
                                    <Input
                                        placeholder={t("marketplace_main.search_placeholder", "Cari nama, metode, lokasi")}
                                        className="pr-8 h-full text-sm border-0 focus-visible:ring-0 bg-transparent rounded-none"
                                        value={tempSearch}
                                        onChange={e => setTempSearch(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") setSearchQuery(tempSearch)
                                            else if (e.key === "Escape") {
                                                setTempSearch("")
                                                setSearchQuery("")
                                            }
                                        }}
                                    />
                                    {tempSearch && (
                                        <button
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 z-10"
                                            onClick={() => {
                                                setTempSearch("")
                                                setSearchQuery("")
                                            }}
                                            aria-label="Clear filter"
                                        >
                                            <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                        </button>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setSearchQuery(tempSearch)}
                                    className="h-full px-4 border-0 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-0 flex-shrink-0"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Mobile Filter Sheet Toggle */}
                            <div className="flex md:hidden items-center shrink-0">
                                <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="relative h-11 w-11 p-0 rounded-xl border-2 border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-800">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            {totalActiveCount > 0 && (
                                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                                                    {totalActiveCount}
                                                </span>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-[85%] sm:max-w-sm p-0 flex flex-col z-[100] border-l border-slate-100 dark:border-slate-800 rounded-l-2xl [&>button]:hidden">
                                        <SheetTitle className="sr-only">Filter</SheetTitle>
                                        <FilterSidebar {...filterSidebarProps} onClose={() => setIsMobileFilterOpen(false)} />
                                    </SheetContent>
                                </Sheet>
                            </div>

                            {/* View Modes (Desktop Only here) */}
                            {renderViewModes("hidden md:flex")}
                        </div>
                    </div>
                </div>

                {/* ─── Two-Column Layout ─── */}
                <div className="flex gap-6 items-start">

                    {/* Filter Sidebar – Desktop */}
                    <div className="hidden md:block w-60 lg:w-64 shrink-0 sticky top-24">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-[calc(100vh-140px)] overflow-hidden">
                            <FilterSidebar {...filterSidebarProps} />
                        </div>
                    </div>

                    {/* Trainer List */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Loading indicator saat API sedang dimuat */}
                        {isLoadingApi && (
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2 animate-pulse">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                                <span>Memuat lebih banyak guru dari server...</span>
                            </div>
                        )}

                        {/* Grid / List */}
                        {filtered.length > 0 ? (
                            viewMode === "grid" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                                    {filtered.map(trainer => (
                                        <TrainerCard key={trainer.id} trainer={trainer} locale={locale} formatPrice={formatPrice} view="grid" onMethodClick={(m) => setFilters(prev => ({ ...prev, methods: prev.methods.includes(m) ? prev.methods : [...prev.methods, m] }))} t={t} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {filtered.map(trainer => (
                                        <TrainerCard key={trainer.id} trainer={trainer} locale={locale} formatPrice={formatPrice} view="list" onMethodClick={(m) => setFilters(prev => ({ ...prev, methods: prev.methods.includes(m) ? prev.methods : [...prev.methods, m] }))} t={t} />
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
                                    <Search className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t("marketplace_main.empty_title", "Tidak ada guru ditemukan")}</h3>
                                    <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">{t("marketplace_main.empty_desc", "Coba ubah kata kunci atau reset filter.")}</p>
                                </div>
                                <Button variant="outline" onClick={resetAll}>{t("marketplace_main.reset_all", "Reset Semua Filter")}</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

