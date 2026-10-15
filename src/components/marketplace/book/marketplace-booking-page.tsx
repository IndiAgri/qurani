"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { DUMMY_TRAINERS } from "@/data/trainers-data"
import { getCourseById, ensureSeedData, getCourses } from "@/data/trainers-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

const LEVEL_LABELS: Record<number, string> = {
    1: "Pemula", 2: "Menengah", 3: "Mahir", 4: "Semua Level"
}
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Loader2, ArrowLeft, Shield, Video, CheckCircle, CreditCard, ChevronRight, Check, CalendarIcon, ChevronDown, CheckCircle2, ChevronLeft, MapPin, X, Clock, Star, AlertCircle, Repeat, MoreHorizontal, Edit2, Trash2, SquarePen, ShieldCheck, Receipt, GraduationCap, Users, Home } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CourseDetailModal from "../detail/course-detail-modal"
import { BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    format, addDays, isSameDay, isBefore, startOfDay,
    addWeeks, getDay, addMonths, subMonths,
    startOfMonth, endOfMonth, getDaysInMonth
} from "date-fns"
import { id as idLocale, enUS as enLocale } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"

// ─── helpers ────────────────────────────────────────────────────────────────

const getCategory = (time: string) => {
    const hour = parseInt(time.split(":")[0])
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "night"
}

const DUMMY_LOCATIONS = [
    "Ngreco, Kabupaten Kediri, Jawa Timur, Indonesia",
    "Ngreco, Kabupaten Sukoharjo, Jawa Tengah, Indonesia",
    "Ngreco, Rembang, Kabupaten Kediri, Jawa Timur, Indonesia",
    "Ngreco, Kabupaten Pacitan, Jawa Timur, Indonesia",
    "Ngreco, Kabupaten Blitar, Jawa Timur, Indonesia",
    "Jl. Jenderal Sudirman No. 123, Jakarta Selatan, DKI Jakarta",
    "Jl. Malioboro No. 45, Yogyakarta, DIY",
    "Perumahan Al-Azhar Blok B-12, Bekasi Timur, Jawa Barat",
    "Jl. Diponegoro No. 88, Bandung City, Jawa Barat",
    "Gayam, Kabupaten Bojonegoro, Jawa Timur",
]

const getTrainerTimezone = (trainer: { location: string; timezone?: string; country?: string }) => {
    // Gunakan field timezone dari data trainer jika tersedia
    if (trainer.timezone) {
        try {
            const now = new Date()
            const tzOffset = Intl.DateTimeFormat('en', {
                timeZone: trainer.timezone,
                timeZoneName: 'short'
            }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || ''
            // Hitung offset dalam jam
            const utcMs = now.getTime()
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: trainer.timezone }))
            const offsetHours = Math.round((tzDate.getTime() - utcMs) / 3600000 + now.getTimezoneOffset() / 60)
            return {
                name: tzOffset || trainer.timezone.split('/').pop()?.replace('_', ' ') || 'UTC',
                offset: offsetHours,
                iana: trainer.timezone
            }
        } catch {
            // fallback
        }
    }
    // Fallback: deteksi dari nama kota jika timezone tidak tersedia
    const loc = trainer.location.toLowerCase()
    if (
        loc.includes("makassar") || loc.includes("denpasar") || loc.includes("bali") ||
        loc.includes("lombok") || loc.includes("manado") || loc.includes("balikpapan")
    ) return { name: "WITA", offset: 8, iana: "Asia/Makassar" }
    if (
        loc.includes("jayapura") || loc.includes("ambon") || loc.includes("papua") ||
        loc.includes("maluku") || loc.includes("sorong")
    ) return { name: "WIT", offset: 9, iana: "Asia/Jayapura" }
    return { name: "WIB", offset: 7, iana: "Asia/Jakarta" }
}

// ─── types ───────────────────────────────────────────────────────────────────

interface Slot { date: Date; time: string }

// Edit dialog state
interface EditDialogData {
    originalSlot: Slot
    newDate: Date | null
    newTime: string
    // for the internal mini calendar inside the dialog
    dialogMonth: Date
}

// ─── component ───────────────────────────────────────────────────────────────

interface MarketplaceBookingPageProps { id: string }

export function MarketplaceBookingPage({ id }: MarketplaceBookingPageProps) {
    const { locale, t } = useI18n()
    const router = useRouter()
    const dateLocale = locale === "en" ? enLocale : idLocale
    const { profile, refreshProfile } = useAuth()

    const trainer = DUMMY_TRAINERS.find((tr) => tr.id === id)

    const calendarRef = useRef<HTMLDivElement>(null)
    const timeSlotsRef = useRef<HTMLDivElement>(null)
    const summaryRef = useRef<HTMLDivElement>(null)

    // ── calendar / selection state ──────────────────────────────────────────
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
    const [packages, setPackages] = useState<any[]>([])
    // Baca selectedPackageId dari sessionStorage LANGSUNG saat inisialisasi (lazy init)
    // agar tidak ada race condition antara render pertama dan useEffect
    const [selectedPackageId, setSelectedPackageId] = useState<string>(() => {
        if (typeof window === "undefined") return "single"
        return sessionStorage.getItem(`selected_package_${id}`) || "single"
    })

    useEffect(() => {
        ensureSeedData()
        if (trainer) {
            const allCourses = getCourses(trainer.id)
            const published = allCourses.filter(c => c.isPublic && c.isActive)
            setPackages(published)

            // Validasi selectedPackageId yang sudah di-init dari sessionStorage
            // Jika tidak ada di published packages, fallback ke paket pertama
            setSelectedPackageId(prev => {
                if (prev !== "single" && published.find(p => p.id === prev)) {
                    return prev // valid — pertahankan pilihan dari sessionStorage
                }
                return published.length > 0 ? published[0].id : "single"
            })
        }
    }, [trainer])
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([])
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [detailPackageId, setDetailPackageId] = useState<string | null>(null)

    // ── edit dialog state ───────────────────────────────────────────────────
    const [editDialogData, setEditDialogData] = useState<EditDialogData | null>(null)

    // ── delete state ────────────────────────────────────────────────────────
    const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null)

    // ── tooltip state (read-only time slot) ─────────────────────────────────
    const [readonlyTooltipSlot, setReadonlyTooltipSlot] = useState<string | null>(null) // key = date+time

    // ── dialog flags ────────────────────────────────────────────────────────
    const [showLimitDialog, setShowLimitDialog] = useState(false)
    const [showCalendarLimitDialog, setShowCalendarLimitDialog] = useState(false)
    const [showRecurrenceDialog, setShowRecurrenceDialog] = useState(false)
    const [showClearAllDialog, setShowClearAllDialog] = useState(false)
    const [recurrenceMode, setRecurrenceMode] = useState<"daily" | "weekly" | "">("")

    // ── detail state ────────────────────────────────────────────────────────
    const [isChangingPackage, setIsChangingPackage] = useState(false)
    const [mode, setMode] = useState<"online" | "offline">("online")
    const [offlineLocationType, setOfflineLocationType] = useState<"student" | "teacher">("student")
    const [notes, setNotes] = useState("")
    const [address, setAddress] = useState("") // Used as location string
    const [detailAddress, setDetailAddress] = useState("") // Used for detailed address
    const [phoneNumber, setPhoneNumber] = useState("")

    // ── teacher availability state ──────────────────────────────────────────
    const [teacherHolidays, setTeacherHolidays] = useState<{ date: Date; reason: string }[]>([])
    const [offDays, setOffDays] = useState<string[]>(["Minggu"])
    const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, { time: string; method: string }[]>>({})
    const [profileHourlyRate, setProfileHourlyRate] = useState<number | null>(null)

    // ── load saved state ────────────────────────────────────────────────────
    useEffect(() => {
        const savedHolidays = localStorage.getItem("teacher_holidays")
        if (savedHolidays) {
            try {
                setTeacherHolidays(
                    JSON.parse(savedHolidays).map((h: any) => ({ date: new Date(h.date), reason: h.reason }))
                )
            } catch (_) { }
        }
        const savedOffDays = localStorage.getItem("teacher_off_days")
        if (savedOffDays) { try { setOffDays(JSON.parse(savedOffDays)) } catch (_) { } }

        const savedAvailability = localStorage.getItem("teacher_weekly_availability")
        if (savedAvailability) { try { setWeeklyAvailability(JSON.parse(savedAvailability)) } catch (_) { } }
        
        // Baca harga per jam dari profil guru (jika guru id 1)
        if (trainer?.id === "1") {
            try {
                const profileStr = localStorage.getItem("trainer_profile")
                if (profileStr) {
                    const profile = JSON.parse(profileStr)
                    if (profile && !isNaN(profile.pricePerSession)) {
                        setProfileHourlyRate(Number(profile.pricePerSession))
                    }
                }
            } catch (e) {}
        }

        if (trainer) {
            // Restore state if coming back from checkout
            try {
                const checkoutData = JSON.parse(sessionStorage.getItem("checkout_data") || "{}")
                if (checkoutData._restore && checkoutData.bookings?.[0]?.courseId === trainer.id) {
                    const r = checkoutData._restore
                    if (r.packageId) setSelectedPackageId(r.packageId)
                    if (r.selectedSlots) {
                        const restoredSlots = r.selectedSlots.map((s: any) => ({
                            date: new Date(s.d),
                            time: s.t
                        }))
                        setSelectedSlots(restoredSlots)
                        const uniqueDates = Array.from(
                            new Map(restoredSlots.map((s: any) => [new Date(s.date).setHours(0, 0, 0, 0), new Date(new Date(s.date).setHours(0, 0, 0, 0))])).values()
                        ) as Date[]
                        setSelectedDates(uniqueDates)
                    }
                    if (r.mode) setMode(r.mode)
                    if (r.notes) setNotes(r.notes)
                }
            } catch (e) {
                console.error("Failed to restore checkout data", e)
            }
        }
    }, [trainer])

    // ── pre-fill from user profile ───────────────────────────────────────────
    useEffect(() => {
        // Fetch fresh profile data from API once on mount.
        // refreshProfile is now referentially stable (via useRef in AuthProvider),
        // so using [] is correct and will never trigger an infinite loop.
        refreshProfile?.(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (profile) {
            // Susun lokasi dari data profil: cityName, stateName, countryName
            const locationParts = [
                profile.cityName,
                profile.stateName,
                profile.countryName,
            ].filter(Boolean)
            const profileLocation = locationParts.length > 0 ? locationParts.join(", ") : ""
            setAddress(profileLocation)
            setDetailAddress(profile.address || "")
            // Pre-fill phone number
            if (profile.hp) {
                // Hapus awalan +62 atau 62 untuk ditampilkan tanpa kode negara
                const cleanPhone = profile.hp.replace(/^\+62|^62/, "0")
                setPhoneNumber(cleanPhone)
            } else {
                setPhoneNumber("")
            }
        }
    }, [profile])

    useEffect(() => {
        if (trainer) {
            const title = `${t("title_meta.booking_prefix", "Pesan")} - ${trainer.name} | Qurani`;
            document.title = title;
            const headElement = document.querySelector('head');
            if (!headElement) return;

            const observer = new MutationObserver(() => {
                if (document.title !== title) document.title = title;
            });

            observer.observe(headElement, { childList: true, subtree: true, characterData: true });

            return () => {
                observer.disconnect();
            };
        }
    }, [trainer, t])

    if (!trainer) return null
    const teacherHasOffline = parseInt(trainer.id) % 2 !== 0

    // ── derived ─────────────────────────────────────────────────────────────
    const trainerTz = getTrainerTimezone(trainer)

    // Deteksi zona waktu user
    const userTzName = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta"
    let userOffset = 7 // Default WIB
    try {
        const now = new Date()
        const userTzDate = new Date(now.toLocaleString('en-US', { timeZone: userTzName }))
        userOffset = Math.round((userTzDate.getTime() - now.getTime()) / 3600000 + now.getTimezoneOffset() / 60)
    } catch {
        userOffset = -new Date().getTimezoneOffset() / 60
    }

    const tzOffsetDiff = userOffset - trainerTz.offset

    let foundPkg = packages.find((p) => p.id === selectedPackageId) as any
    if (!foundPkg && packages.length > 0) foundPkg = packages[0]

    let calculatedPrice = trainer.pricePerSession;
    if (foundPkg) {
        const isTrainer1 = String(trainer.id) === "1";
        const rateToUse = isTrainer1
            ? (profileHourlyRate ?? foundPkg.hourlyRate ?? 0)
            : (foundPkg.hourlyRate ?? 0);
        const runtimeSessionPrice = isTrainer1 && rateToUse > 0 && foundPkg.duration > 0
            ? Math.round(rateToUse * (foundPkg.duration / 60))
            : foundPkg.sessionPrice || 0;
        const runtimePackagePrice = isTrainer1 && runtimeSessionPrice > 0 && foundPkg.totalSessions > 0
            ? Math.round(runtimeSessionPrice * foundPkg.totalSessions)
            : foundPkg.packagePrice || 0;
        const runtimeBasePrice = foundPkg.totalSessions > 1 ? runtimePackagePrice : runtimeSessionPrice;

        // ── Selalu gunakan discountPrice yang tersimpan dari data kursus ──
        // Tidak override dengan persentase hardcoded agar sinkron dengan halaman guru
        const storedDiscountPrice = foundPkg.discountPrice ?? null;
        const isDiscountValid = Boolean(
            storedDiscountPrice &&
            storedDiscountPrice > 0 &&
            storedDiscountPrice < runtimeBasePrice &&
            (!foundPkg.discountUntil || new Date(foundPkg.discountUntil) > new Date())
        );
        calculatedPrice = isDiscountValid ? storedDiscountPrice! : runtimeBasePrice;
    }

    const selectedPackage = foundPkg ? {
        id: foundPkg.id,
        name: foundPkg.title,
        sessionCount: foundPkg.totalSessions,
        price: calculatedPrice,
        description: foundPkg.shortDescription,
        features: foundPkg.features && foundPkg.features.length > 0 ? foundPkg.features : [
            "Video Conference", 
            ...(foundPkg.hasCertificate ? ["Bersertifikat"] : []), 
            "Catatan Evaluasi"
        ],
        mode: foundPkg.mode === 1 ? "online" : "offline"
    } : {
        id: "single",
        name: "Sesi Satuan",
        sessionCount: 1,
        price: trainer.pricePerSession,
        description: "1x Pertemuan",
        features: ["Bayar per pertemuan"],
        mode: "online"
    }

    const PLATFORM_FEE = Math.round(selectedPackage.price * 0.12)
    const TOTAL_PRICE = selectedPackage.price + PLATFORM_FEE

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)

    // ── holiday helpers ─────────────────────────────────────────────────────
    const getHolidayReason = (date: Date) => {
        const holiday = teacherHolidays.find((h) => isSameDay(h.date, date))
        if (holiday) return holiday.reason
        if (trainer.id === "1") {
            const dayName = format(date, "EEEE", { locale: idLocale })
            if (offDays.includes(dayName)) return "Libur"
        } else if (trainer.availability) {
            const dayOfWeek = getDay(date)
            const dayAvail = trainer.availability.find((a: any) => a.day === dayOfWeek)
            if (!dayAvail || !dayAvail.slots || dayAvail.slots.length === 0) {
                return "Libur"
            }
            const validSlots = dayAvail.slots.filter((slot: any) => 
                trainer.sessions.includes(getCategory(slot.start) as any)
            )
            if (validSlots.length === 0) {
                return "Libur"
            }
        } else {
            if (getDay(date) === 0) return "Libur"
        }
        if (trainer.id !== "1" && trainer.holidays) {
            if (trainer.holidays.includes(format(date, "yyyy-MM-dd"))) return "Libur Khusus"
        }
        return null
    }
    const isHoliday = (date: Date) => !!getHolidayReason(date)

    // ── available slots ─────────────────────────────────────────────────────
    const getAvailableSlotsForDate = (date: Date) => {
        if (isHoliday(date) || isBefore(date, startOfDay(new Date()))) return []

        const dayOfWeek = getDay(date)
        let slots: { start: string; end: string; isBooked?: boolean; bookedBy?: string }[] = []

        if (trainer.id === "1" && Object.keys(weeklyAvailability).length > 0) {
            const dayName = format(date, "EEEE", { locale: idLocale })
            slots = (weeklyAvailability[dayName] || []).map((s) => {
                const [start, end] = s.time.split(" - ")
                return { start, end }
            })
        } else if (trainer.availability) {
            slots = (trainer.availability.find((a) => a.day === dayOfWeek)?.slots || []).filter((slot) =>
                trainer.sessions.includes(getCategory(slot.start) as any)
            )
        } else if (dayOfWeek !== 0) {
            const defaultSlots = [
                { start: "05:00", end: "06:00", cat: "morning" },
                { start: "07:00", end: "08:00", cat: "morning" },
                { start: "08:00", end: "09:00", cat: "morning" },
                { start: "09:00", end: "10:00", cat: "morning" },
                { start: "10:00", end: "11:00", cat: "morning" },
                { start: "13:00", end: "14:00", cat: "afternoon" },
                { start: "14:00", end: "15:00", cat: "afternoon" },
                { start: "15:00", end: "16:00", cat: "afternoon" },
                { start: "16:00", end: "17:00", cat: "afternoon" },
                { start: "18:00", end: "19:00", cat: "night" },
                { start: "19:00", end: "20:00", cat: "night" },
                { start: "20:00", end: "21:00", cat: "night" },
                { start: "21:00", end: "22:00", cat: "night" },
            ]
            slots = defaultSlots
                .filter((s) => trainer.sessions.includes(s.cat as any))
                .map(({ cat, ...rest }) => rest)
        }

        // Terapkan konversi zona waktu (dari trainer ke user)
        if (tzOffsetDiff !== 0) {
            slots = slots.map(slot => {
                const [startH, startM] = slot.start.split(":").map(Number)
                const [endH, endM] = slot.end.split(":").map(Number)

                let newStartH = startH + tzOffsetDiff
                let newEndH = endH + tzOffsetDiff

                // Normalisasi jam jika melewati batas hari (0-23)
                if (newStartH >= 24) newStartH -= 24
                if (newStartH < 0) newStartH += 24
                if (newEndH >= 24) newEndH -= 24
                if (newEndH < 0) newEndH += 24

                return {
                    start: `${String(Math.floor(newStartH)).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
                    end: `${String(Math.floor(newEndH)).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
                }
            })
            // Sort ulang karena jam bisa acak setelah perpindahan hari
            slots.sort((a, b) => a.start.localeCompare(b.start))
        }

        const addedToSchedule = JSON.parse(localStorage.getItem("added_to_schedule") || "[]")
        const formattedDate = format(date, "d MMMM yyyy", { locale: idLocale })

        return slots.map((slot) => {
            const conflict = addedToSchedule.find(
                (b: any) => b.trainerId === trainer.id && b.date === formattedDate && b.rawTime === slot.start
            )
            return conflict ? { ...slot, isBooked: true, bookedBy: conflict.student } : slot
        })
    }

    // ── recurrence helpers ──────────────────────────────────────────────────
    const handleWeeklyRecurrence = (baseSlots: Slot[], sessionCount: number) => {
        let newSlots = [...selectedSlots]
        let safetyCount = 0
        let weekOffset = 1
        while (newSlots.length < sessionCount && safetyCount < 100) {
            safetyCount++
            for (const base of baseSlots) {
                if (newSlots.length >= sessionCount) break
                const nextDate = addWeeks(base.date, weekOffset)
                if (isHoliday(nextDate)) continue
                const available = getAvailableSlotsForDate(nextDate)
                const ok = available.some((s) => s.start === base.time && !s.isBooked)
                if (ok && !newSlots.some((s) => isSameDay(s.date, nextDate) && s.time === base.time)) {
                    newSlots.push({ date: nextDate, time: base.time })
                }
            }
            weekOffset++
        }
        return newSlots
    }

    const handleDailyRecurrence = (baseSlots: Slot[], sessionCount: number) => {
        let newSlots = [...selectedSlots]
        const targetTimes = Array.from(new Set(baseSlots.map((s) => s.time)))
        const currentDate = new Date(baseSlots[baseSlots.length - 1].date)
        let safetyCount = 0
        let daysOffset = 1
        while (newSlots.length < sessionCount && safetyCount < 365) {
            safetyCount++
            const nextDate = addDays(currentDate, daysOffset)
            if (!isHoliday(nextDate)) {
                const available = getAvailableSlotsForDate(nextDate)
                for (const time of targetTimes) {
                    if (newSlots.length >= sessionCount) break
                    const ok = available.some((s) => s.start === time && !s.isBooked)
                    if (ok && !newSlots.some((s) => isSameDay(s.date, nextDate) && s.time === time)) {
                        newSlots.push({ date: nextDate, time })
                        break
                    }
                }
            }
            daysOffset++
        }
        return newSlots
    }

    const handleApplyRecurrence = () => {
        const unselectedDate = selectedDates.find((d) => !selectedSlots.some((s) => isSameDay(s.date, d)))
        if (unselectedDate) return

        const sessionCount = selectedPackage.sessionCount
        const baseSlots = [...selectedSlots].sort((a, b) => a.date.getTime() - b.date.getTime())
        const newSlots =
            recurrenceMode === "weekly"
                ? handleWeeklyRecurrence(baseSlots, sessionCount)
                : handleDailyRecurrence(baseSlots, sessionCount)

        setSelectedSlots(newSlots)
        setShowRecurrenceDialog(false)

        const uniqueDates = Array.from(
            new Map(newSlots.map((s) => [startOfDay(s.date).getTime(), startOfDay(s.date)])).values()
        )
        setSelectedDates(uniqueDates)

        if (newSlots.length === sessionCount) {
            toast.success("Berhasil membuat jadwal berulang otomatis!")
        } else {
            toast.info(`Berhasil membuat ${newSlots.length} jadwal. Beberapa dilewati karena jadwal penuh/libur.`)
        }
    }

    // ── slot click (normal mode only) ───────────────────────────────────────
    const handleSlotClick = (date: Date, time: string, isBooked: boolean) => {
        if (isBooked || isHoliday(date)) return

        const isSelected = selectedSlots.some((s) => isSameDay(s.date, date) && s.time === time)
        if (isSelected) {
            setSelectedSlots((prev) => prev.filter((s) => !(isSameDay(s.date, date) && s.time === time)))
        } else {
            if (selectedSlots.length >= selectedPackage.sessionCount) {
                setShowLimitDialog(true)
                return
            }
            setSelectedSlots((prev) => [...prev, { date, time }])
        }
    }

    // ── package select ──────────────────────────────────────────────────────
    const handlePackageSelect = (pkgId: string) => {
        if (pkgId !== selectedPackageId) {
            setSelectedPackageId(pkgId)
            setSelectedSlots([])
            setSelectedDates([])
            toast.info("Paket berubah. Silakan pilih jadwal ulang sesuai jumlah pertemuan.")
        }
    }

    // ── remove slot ─────────────────────────────────────────────────────────
    const handleRemoveSlot = (slotToRemove: Slot) => {
        const updatedSlots = selectedSlots.filter(
            (s) => !(isSameDay(s.date, slotToRemove.date) && s.time === slotToRemove.time)
        )
        setSelectedSlots(updatedSlots)

        // Hapus tanggal dari selectedDates tanpa syarat setiap kali slot dihapus
        setSelectedDates((prev) => prev.filter((d) => !isSameDay(d, slotToRemove.date)))

        // Scroll ke kalender
        const remaining = selectedPackage.sessionCount - updatedSlots.length
        if (remaining > 0) {
            setTimeout(() => {
                calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                toast.info(`Pilih ${remaining} jadwal lagi`, {
                    duration: 4000,
                    icon: "📅",
                })
            }, 200)
        }
    }

    // ── edit dialog handlers ─────────────────────────────────────────────────
    const openEditDialog = (slot: Slot) => {
        setEditDialogData({
            originalSlot: slot,
            newDate: null,
            newTime: "",
            dialogMonth: startOfMonth(slot.date),
        })
    }

    const handleEditSave = () => {
        if (!editDialogData) return
        const { originalSlot, newDate, newTime } = editDialogData
        if (!newDate || !newTime) return

        // Update selectedSlots
        setSelectedSlots((prev) =>
            prev.map((s) =>
                isSameDay(s.date, originalSlot.date) && s.time === originalSlot.time
                    ? { date: newDate, time: newTime }
                    : s
            )
        )

        // Update selectedDates
        setSelectedDates((prev) => {
            const filtered = prev.filter((d) => !isSameDay(d, originalSlot.date))
            // add new date if not already present
            if (!filtered.some((d) => isSameDay(d, newDate))) {
                filtered.push(newDate)
            }
            return filtered
        })

        toast.success("Jadwal berhasil diubah!")
        setEditDialogData(null)
    }

    // ── booking ─────────────────────────────────────────────────────────────
    const handleBooking = () => {
        if (selectedSlots.length !== selectedPackage.sessionCount) {
            toast.error(`Mohon pilih ${selectedPackage.sessionCount} jadwal pertemuan sesuai paket yang dipilih`)
            return
        }
        if (mode === "offline" && offlineLocationType === "student" && !address.trim()) {
            toast.error("Mohon pastikan lokasi Anda telah diatur di profil")
            return
        }

        const finalLocation = mode === "offline"
            ? (offlineLocationType === "student" ? address : (trainer?.location || ""))
            : "Online"

        const bookingsPayload = selectedSlots.map((s) => {
            const [h, m] = s.time.split(":").map(Number)
            return {
                courseId: trainer.id,
                scheduledDate: format(s.date, "yyyy-MM-dd'T'00:00:00'Z'"),
                startTime: h * 60 + m,
                mode: mode === "online" ? 1 : 2,
                timezone: trainerTz.name,
                location: finalLocation,
                address: "",
                countryCode: "ID",
                city: "",
                latitude: 0,
                longitude: 0,
                notes,
                discountCode: "",
                isRecurring: recurrenceMode ? 1 : 0,
                recurrenceRule: recurrenceMode,
            }
        })

        // Simpan data ke sessionStorage (termasuk slots untuk restore saat kembali)
        const checkoutPayload = {
            packageId: selectedPackageId,
            bookings: bookingsPayload,
            mode,
            offlineLocationType,
            // Data tambahan untuk restore state saat user kembali
            _restore: {
                packageId: selectedPackageId,
                selectedSlots: selectedSlots.map(s => ({ d: format(s.date, "yyyy-MM-dd"), t: s.time })),
                mode,
                offlineLocationType,
                notes,
                address,
                detailAddress,
            }
        }
        sessionStorage.setItem("checkout_data", JSON.stringify(checkoutPayload))
        router.push(`/${locale}/teachers/${id}/checkouts`)
    }

    // ── calendar grid ────────────────────────────────────────────────────────
    const monthStart = startOfMonth(currentMonth)
    const startOffset = (getDay(monthStart) + 6) % 7
    const totalDays = getDaysInMonth(currentMonth)
    const calendarDays: (Date | null)[] = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: totalDays }, (_, i) => addDays(monthStart, i)),
    ]
    while (calendarDays.length % 7 !== 0) calendarDays.push(null)

    const DAY_LABELS =
        locale === "en"
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

    const remainingSlots = selectedPackage.sessionCount - selectedSlots.length

    // ── edit dialog calendar grid ────────────────────────────────────────────
    const editMonthStart = editDialogData ? startOfMonth(editDialogData.dialogMonth) : startOfMonth(new Date())
    const editStartOffset = (getDay(editMonthStart) + 6) % 7
    const editTotalDays = getDaysInMonth(editMonthStart)
    const editCalendarDays: (Date | null)[] = [
        ...Array(editStartOffset).fill(null),
        ...Array.from({ length: editTotalDays }, (_, i) => addDays(editMonthStart, i)),
    ]
    while (editCalendarDays.length % 7 !== 0) editCalendarDays.push(null)

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <div className="pb-24 bg-slate-50/50 dark:bg-gray-950 min-h-screen">
            {/* ── Header ── */}
            <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        {t("marketplace_book.book_teacher", "Pesan Guru:")} {trainer.name}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ══════════════════════════════════════════════════════════
                        LEFT COLUMN
                    ══════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* ── Package Section ── */}
                        <section className="bg-white dark:bg-gray-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-emerald-600" />
                                    {t("marketplace_book.learning_package", "Kursus Pilihan Anda")}
                                </h3>
                                {!isChangingPackage && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-emerald-600 font-bold hover:text-emerald-700 hover:bg-emerald-50 h-8 rounded-lg text-xs"
                                        onClick={() => setIsChangingPackage(true)}
                                    >
                                        {t("marketplace_book.change_package", "Ganti Paket")}
                                    </Button>
                                )}
                            </div>

                            {!isChangingPackage ? (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500 rounded-[2rem] p-5 md:p-8 relative overflow-hidden shadow-sm">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                            <div className="flex-1 space-y-4 w-full">
                                                <div>
                                                    <Badge className="bg-emerald-500 text-white border-0 font-bold text-[10px] uppercase tracking-wider px-3 mb-2">
                                                        {t("marketplace_book.package_selected", "KURSUS PILIHAN ANDA")}
                                                    </Badge>
                                                    <h4 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                                        {selectedPackage.name}
                                                    </h4>
                                                    <p className="text-slate-500 text-[10px] md:text-xs mt-1 font-medium">{selectedPackage.description}</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                                    {selectedPackage.features.map((feat: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                                                <Check className="h-2.5 w-2.5 text-emerald-600" />
                                                            </div>
                                                            <span className="text-[10px] md:text-[11px] font-bold text-slate-700 dark:text-slate-300">{feat}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl shadow-xl shadow-emerald-500/5 w-full md:min-w-[220px] md:w-auto text-center border border-emerald-100 dark:border-emerald-800/50">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                                    {t("marketplace_book.total_price", "Total Harga")}
                                                </p>
                                                <div className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tighter flex items-center justify-center gap-1.5 leading-none py-1">
                                                    <span className="text-sm font-black opacity-50">Rp</span>
                                                    <span>{selectedPackage.price.toLocaleString("id-ID")}</span>
                                                </div>
                                                <div className="mt-2 text-[10px] font-black text-slate-400 bg-slate-50 dark:bg-slate-900 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    {t("marketplace_book.sessions_count", `${selectedPackage.sessionCount}x Pertemuan`, { count: selectedPackage.sessionCount.toString() })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
                                    {packages?.map((pkg: any) => {
                                        // Hitung harga runtime untuk trainer ID 1 dari profil guru
                                        const isTrainer1 = String(trainer.id) === "1";
                                        const rateToUse = isTrainer1
                                            ? (profileHourlyRate ?? pkg.hourlyRate ?? 0)
                                            : (pkg.hourlyRate ?? 0);
                                        const runtimeSessionPrice = isTrainer1 && rateToUse > 0 && pkg.duration > 0
                                            ? Math.round(rateToUse * (pkg.duration / 60))
                                            : pkg.sessionPrice || 0;
                                        const runtimePackagePrice = isTrainer1 && runtimeSessionPrice > 0 && pkg.totalSessions > 0
                                            ? Math.round(runtimeSessionPrice * pkg.totalSessions)
                                            : pkg.packagePrice || 0;
                                        const runtimeBasePrice = pkg.totalSessions > 1 ? runtimePackagePrice : runtimeSessionPrice;

                                        // Selalu gunakan discountPrice tersimpan (tidak override hardcoded)
                                        const storedDiscount = pkg.discountPrice ?? null;
                                        const isDiscountValid = Boolean(
                                            storedDiscount &&
                                            storedDiscount > 0 &&
                                            storedDiscount < runtimeBasePrice &&
                                            (!pkg.discountUntil || new Date(pkg.discountUntil) > new Date())
                                        );
                                        const currentPrice = isDiscountValid ? storedDiscount! : runtimeBasePrice;
                                        const originalPrice = isDiscountValid ? runtimeBasePrice : null;
                                        const discountPct = isDiscountValid && originalPrice
                                            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
                                            : 0;
                                        const features = pkg.features || [];

                                        return (
                                        <div
                                            key={pkg.id}
                                            onClick={() => { handlePackageSelect(pkg.id); setIsChangingPackage(false) }}
                                            className={cn(
                                                "relative p-4 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between",
                                                selectedPackageId === pkg.id
                                                    ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/20 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-slate-900"
                                            )}
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <div className="flex-1 min-w-0 pr-12">
                                                        <p className={cn(
                                                            "text-sm font-bold leading-tight transition-colors duration-300 line-clamp-2",
                                                            "text-slate-900 dark:text-white"
                                                        )}>
                                                            {pkg.title}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5 shrink-0">
                                                        {Boolean(pkg.hasCertificate) && (
                                                            <Badge variant="outline" className="text-[9px] px-1.5 h-4 font-bold border-emerald-300 text-emerald-600">
                                                                <BadgeCheck className="h-2.5 w-2.5 mr-0.5" />
                                                                Bersertifikat
                                                            </Badge>
                                                        )}
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0",
                                                            selectedPackageId === pkg.id
                                                                ? "border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200 dark:shadow-none"
                                                                : "border-slate-300 dark:border-slate-600 group-hover:border-emerald-400"
                                                        )}>
                                                            {selectedPackageId === pkg.id && <Check className="h-3 w-3 text-white stroke-[3.5] animate-in zoom-in duration-300" />}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                                                    <TooltipProvider delayDuration={0}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Badge variant="outline" className="text-[9px] px-1.5 h-4 border-slate-200 text-slate-500 font-bold cursor-help">
                                                                    <GraduationCap className="h-2.5 w-2.5 mr-0.5" />
                                                                    {LEVEL_LABELS[pkg.level] ?? "Pemula"}
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Tingkat Kursus</TooltipContent>
                                                        </Tooltip>

                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Badge variant="outline" className="text-[9px] px-1.5 h-4 border-slate-200 text-slate-500 font-bold cursor-help">
                                                                    <Clock className="h-2.5 w-2.5 mr-0.5" />
                                                                    {pkg.duration} mnt
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Durasi Kursus</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>

                                            <div className="mt-auto flex items-end justify-between gap-2">
                                                <div className="flex flex-col gap-0.5">
                                                    {originalPrice && (
                                                        <span className="text-[12px] text-slate-500 line-through font-semibold">
                                                            Rp{originalPrice.toLocaleString('id-ID')}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <div className="flex items-baseline">
                                                            <span className={cn(
                                                                "text-sm font-bold transition-colors duration-300 mr-0.5",
                                                                "text-emerald-600 dark:text-emerald-400"
                                                            )}>Rp</span>
                                                            <span className={cn(
                                                                "text-xl font-bold transition-colors duration-300 leading-none",
                                                                "text-emerald-600 dark:text-emerald-400"
                                                            )}>
                                                                {currentPrice.toLocaleString('id-ID')}
                                                            </span>
                                                            <span className="text-[11px] text-slate-500 font-medium ml-1">
                                                                / {pkg.totalSessions || 1} sesi
                                                            </span>
                                                        </div>
                                                        {originalPrice && discountPct > 0 && (
                                                            <Badge variant="secondary" className="bg-rose-100 text-rose-500 dark:bg-rose-900/40 dark:text-rose-400 border-none font-bold text-[8px] px-1 py-0 h-3 rounded-full">
                                                                -{discountPct}%
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    className="text-[10px] px-2 h-6 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline shrink-0 mb-0.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setDetailPackageId(pkg.id)
                                                    }}
                                                >
                                                    Detail
                                                </button>
                                            </div>
                                        </div>
                                        )
                                    })}
                                    <Button
                                        variant="outline"
                                        className="md:col-span-2 rounded-xl border-dashed border-slate-300 text-slate-500 font-bold"
                                        onClick={() => setIsChangingPackage(false)}
                                    >
                                        {t("marketplace_book.cancel_change", "Batal Ganti")}
                                    </Button>
                                </div>
                            )}
                        </section>

                        {/* ── Schedule Section ── */}
                        <section className="bg-white dark:bg-gray-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">

                            {/* header */}
                            <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-emerald-600" />
                                            {t("marketplace_book.select_schedules", `Pilih ${selectedPackage.sessionCount} Jadwal`, { count: selectedPackage.sessionCount.toString() })}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                                {selectedSlots.length} / {selectedPackage.sessionCount} sesi dipilih
                                            </p>
                                            <span className="text-slate-300 hidden sm:inline">•</span>
                                            <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                                </span>
                                                {trainer.country ? `${trainer.country} • ` : ""}{trainerTz.name}
                                            </div>
                                        </div>
                                    </div>
                                    {selectedSlots.length === selectedPackage.sessionCount && (
                                        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            {t("marketplace_book.complete", "Lengkap!")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 md:p-5 space-y-5">

                                {/* month nav */}
                                <div className="flex items-center justify-between">
                                    <h4 className="text-base font-semibold text-slate-800 dark:text-white capitalize">
                                        {format(currentMonth, "MMMM yyyy", { locale: dateLocale })}
                                    </h4>
                                    <div className="flex gap-1.5">
                                        <button
                                            onClick={() => {
                                                const nm = subMonths(currentMonth, 1)
                                                if (!isBefore(nm, startOfMonth(new Date()))) setCurrentMonth(nm)
                                            }}
                                            disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(new Date()))}
                                            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                            className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all shadow-sm"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* ── Calendar Grid ── */}
                                <div className="space-y-1.5" ref={calendarRef}>
                                    {/* Notifikasi sisa slot setelah hapus */}
                                    {remainingSlots > 0 && selectedSlots.length > 0 && (
                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2 mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                                Kamu masih perlu memilih <span className="text-amber-900 dark:text-amber-200">{remainingSlots} jadwal lagi</span>. Pilih dari kalender di atas.
                                            </p>
                                        </div>
                                    )}
                                    {selectedSlots.length === 0 && selectedDates.length === 0 && (
                                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-2 mb-3">
                                            <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                                            <p className="text-xs font-bold text-slate-500">
                                                Pilih <span className="text-slate-700 dark:text-slate-300">{selectedPackage.sessionCount} jadwal</span> pertemuan dari kalender di bawah
                                            </p>
                                        </div>
                                    )}

                                    {/* day-of-week header */}
                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {DAY_LABELS.map((label) => (
                                            <div key={label} className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 py-1">
                                                {label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* date cells */}
                                    <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                                        {calendarDays.map((date, i) => {
                                            if (!date) return <div key={`empty-${i}`} />

                                            const hasSelectedSlots = selectedSlots.some((s) => isSameDay(s.date, date))
                                            const isSelectedDate = selectedDates.some((d) => isSameDay(date, d))
                                            const isToday = isSameDay(date, new Date())
                                            const isUnavailable = isHoliday(date)
                                            const isPast = isBefore(date, startOfDay(new Date()))

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (isPast) return

                                                        const unsavedDatesCount = selectedDates.filter(d => !selectedSlots.some(s => isSameDay(s.date, d))).length
                                                        const remainingSlots = selectedPackage.sessionCount - selectedSlots.length

                                                        if (!isSelectedDate && unsavedDatesCount >= remainingSlots) {
                                                            setShowCalendarLimitDialog(true)
                                                            return
                                                        }

                                                        setSelectedDates((prev) => {
                                                            if (prev.some((d) => isSameDay(d, date))) {
                                                                return prev.filter((d) => !isSameDay(d, date))
                                                            }
                                                            return [...prev, date]
                                                        })
                                                    }}
                                                    disabled={isPast}
                                                    title={isUnavailable && !isPast ? (getHolidayReason(date) || "Libur") : undefined}
                                                    className={cn(
                                                        "relative flex flex-col items-center justify-center py-1.5 md:py-2 rounded-xl transition-all duration-200 border aspect-square",
                                                        isPast
                                                            ? "opacity-25 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                                            : hasSelectedSlots
                                                                ? isUnavailable
                                                                    ? "bg-rose-500 border-rose-500 text-white shadow-sm"
                                                                    : "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200/50"
                                                                : isSelectedDate
                                                                    ? isUnavailable
                                                                        ? "bg-rose-500 border-rose-500 text-white shadow-sm"
                                                                        : "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200/50"
                                                                    : isUnavailable
                                                                        ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 text-rose-500"
                                                                        : isToday
                                                                            ? "bg-white dark:bg-slate-800 border-emerald-400 text-slate-800 dark:text-white"
                                                                            : "bg-white dark:bg-slate-800 border-slate-200 shadow-sm dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                    )}
                                                >
                                                    <span className={cn(
                                                        "text-[11px] md:text-xs font-black leading-none",
                                                        (hasSelectedSlots || isSelectedDate) ? "text-white"
                                                            : isToday ? "text-emerald-600" : ""
                                                    )}>
                                                        {format(date, "d")}
                                                    </span>
                                                    {isUnavailable && !hasSelectedSlots && !isSelectedDate && !isPast && (
                                                        <span className="text-[6px] md:text-[7px] font-black text-rose-400 uppercase mt-0.5 leading-none">off</span>
                                                    )}
                                                    {isToday && !hasSelectedSlots && !isSelectedDate && (
                                                        <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-500" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {/* legend */}
                                    <div className="flex items-center gap-3 pt-2 px-1 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-md bg-emerald-600 border border-emerald-600" />
                                            <span className="text-[10px] font-bold text-slate-400">{locale === "en" ? "Selected" : "Dipilih"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-md bg-rose-50 border border-rose-200" />
                                            <span className="text-[10px] font-bold text-slate-400">{locale === "en" ? "Day off" : "Libur"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-md bg-white border-2 border-emerald-400" />
                                            <span className="text-[10px] font-bold text-slate-400">{locale === "en" ? "Today" : "Hari ini"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-md bg-slate-100 opacity-30" />
                                            <span className="text-[10px] font-bold text-slate-400">{locale === "en" ? "Past" : "Sudah lewat"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 dark:border-slate-700" />

                                {/* ── Time Slots ── */}
                                <div className="space-y-5 animate-in fade-in duration-300" ref={timeSlotsRef}>

                                    {selectedDates.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <CalendarIcon className="h-10 w-10 text-slate-200 mb-3" />
                                            <p className="text-slate-400 text-sm font-medium">
                                                {t("marketplace_book.select_date", "Pilih tanggal untuk melihat jam tersedia")}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {(() => {
                                                const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())
                                                const groups = new Map<number, Date[]>()
                                                for (const d of sortedDates) {
                                                    const dow = getDay(d)
                                                    if (!groups.has(dow)) groups.set(dow, [])
                                                    groups.get(dow)!.push(d)
                                                }
                                                const sortedGroups = Array.from(groups.entries()).sort(
                                                    (a, b) => a[0] - b[0]
                                                )

                                                return sortedGroups.map(([dow, groupDates]) => {
                                                    const dayLabel = format(groupDates[0], "EEEE", { locale: dateLocale })
                                                    const firstActive = groupDates.find(
                                                        (d) => !isHoliday(d) && !isBefore(d, startOfDay(new Date()))
                                                    )
                                                    const slots = firstActive ? getAvailableSlotsForDate(firstActive) : []
                                                    const morningSlots = slots.filter((s) => getCategory(s.start) === "morning")
                                                    const afternoonSlots = slots.filter((s) => getCategory(s.start) === "afternoon")
                                                    const nightSlots = slots.filter((s) => getCategory(s.start) === "night")

                                                    const activeDates = groupDates.filter(
                                                        (d) => !isHoliday(d) && !isBefore(d, startOfDay(new Date()))
                                                    )
                                                    const targetDates = activeDates

                                                    // ── grouped slot click ───────────────────────────────────────
                                                    const handleGroupSlotClick = (time: string, isBooked: boolean, date: Date) => {
                                                        if (isBooked) return

                                                        // Check if ALL active dates in this group are already saved
                                                        const isGroupSaved = activeDates.length > 0 && activeDates.every(d => selectedSlots.some(s => isSameDay(s.date, d)))
                                                        if (isGroupSaved) {
                                                            const key = `${format(date, "yyyy-MM-dd")}-${time}`
                                                            setReadonlyTooltipSlot(key)
                                                            setTimeout(() => setReadonlyTooltipSlot(null), 2500)
                                                            return
                                                        }

                                                        const unsavedTargetDates = activeDates.filter(d => !selectedSlots.some(s => isSameDay(s.date, d)))

                                                        const allSelected = unsavedTargetDates.length > 0 && unsavedTargetDates.every((d) =>
                                                            selectedSlots.some((s) => isSameDay(s.date, d) && s.time === time)
                                                        )
                                                        if (allSelected) {
                                                            // deselect all unsaved target dates
                                                            setSelectedSlots((prev) =>
                                                                prev.filter(
                                                                    (s) => !unsavedTargetDates.some((d) => isSameDay(s.date, d) && s.time === time)
                                                                )
                                                            )
                                                        } else {
                                                            setSelectedSlots((prev) => {
                                                                let updated = [...prev]
                                                                for (const d of unsavedTargetDates) {
                                                                    if (!updated.some(s => isSameDay(s.date, d))) {
                                                                        if (updated.length >= selectedPackage.sessionCount) {
                                                                            setShowLimitDialog(true)
                                                                            break
                                                                        }
                                                                        updated.push({ date: d, time })
                                                                    }
                                                                }
                                                                return updated
                                                            })
                                                        }
                                                    }

                                                    // ── render slot section ──────────────────────────────────
                                                    const renderGroupSlotSection = (
                                                        title: string,
                                                        icon: React.ReactNode,
                                                        groupSlots: typeof morningSlots
                                                    ) => {
                                                        if (groupSlots.length === 0) return null
                                                        return (
                                                            <div className="space-y-2.5">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-base">{icon}</span>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {groupSlots.map((slot, index) => {
                                                                        // For each target date, determine if slot is saved/readonly
                                                                        // We use the first targetDate for tooltip key (single group)
                                                                        const firstTargetDate = targetDates[0]
                                                                        const tooltipKey = firstTargetDate
                                                                            ? `${format(firstTargetDate, "yyyy-MM-dd")}-${slot.start}`
                                                                            : null

                                                                        // Is this date group's slot saved (read-only)?
                                                                        const isDateGroupSaved = activeDates.length > 0 && activeDates.every((d) =>
                                                                            selectedSlots.some((s) => isSameDay(s.date, d))
                                                                        )

                                                                        const unsavedTargetDates = activeDates.filter(d => !selectedSlots.some(s => isSameDay(s.date, d)))

                                                                        // Normal selection states
                                                                        const allSelected =
                                                                            unsavedTargetDates.length > 0 &&
                                                                            unsavedTargetDates.every((d) =>
                                                                                selectedSlots.some((s) => isSameDay(s.date, d) && s.time === slot.start)
                                                                            )
                                                                        const someSelected =
                                                                            !allSelected &&
                                                                            unsavedTargetDates.some((d) =>
                                                                                selectedSlots.some((s) => isSameDay(s.date, d) && s.time === slot.start)
                                                                            )

                                                                        const isFull = selectedSlots.length >= selectedPackage.sessionCount
                                                                        const isDisabledFull = isFull && !allSelected && !someSelected && !isDateGroupSaved

                                                                        const showReadonlyTooltip = tooltipKey && readonlyTooltipSlot === tooltipKey

                                                                        return (
                                                                            <TooltipProvider key={index} delayDuration={0}>
                                                                                <Tooltip open={showReadonlyTooltip || undefined}>
                                                                                    <TooltipTrigger asChild>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                if (slot.isBooked) return
                                                                                                // Use first target date for read-only check
                                                                                                const firstDate = targetDates[0]
                                                                                                if (firstDate) {
                                                                                                    handleGroupSlotClick(slot.start, !!slot.isBooked, firstDate)
                                                                                                }
                                                                                            }}
                                                                                            disabled={(!!slot.isBooked && !allSelected) || isDisabledFull}
                                                                                            className={cn(
                                                                                                "relative flex flex-col items-center justify-center gap-0.5 px-5 py-3.5 rounded-2xl font-bold transition-all duration-200 border-2 min-w-[90px]",
                                                                                                allSelected
                                                                                                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                                                                    : someSelected
                                                                                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 text-emerald-700"
                                                                                                        : slot.isBooked
                                                                                                            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                                                                                            : isDateGroupSaved
                                                                                                                ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 text-slate-700 dark:text-slate-300 cursor-default"
                                                                                                                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
                                                                                            )}
                                                                                        >
                                                                                            {allSelected && (
                                                                                                <div className="absolute top-1.5 right-1.5">
                                                                                                    <Check className="w-2.5 h-2.5 text-emerald-200" />
                                                                                                </div>
                                                                                            )}
                                                                                            {slot.isBooked && !allSelected && (
                                                                                                <div className="absolute -top-2 -right-1 bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                                                                                                    PENUH
                                                                                                </div>
                                                                                            )}
                                                                                            <span className={cn(
                                                                                                "tabular-nums font-black text-base leading-tight",
                                                                                                slot.isBooked && !allSelected && "line-through opacity-50"
                                                                                            )}>
                                                                                                {slot.start}
                                                                                            </span>
                                                                                            <span className={cn(
                                                                                                "text-xs font-semibold leading-tight",
                                                                                                allSelected ? "text-emerald-100"
                                                                                                    : slot.isBooked ? "text-slate-400"
                                                                                                        : "text-slate-500 dark:text-slate-400"
                                                                                            )}>
                                                                                                – {slot.end}
                                                                                            </span>
                                                                                        </button>
                                                                                    </TooltipTrigger>
                                                                                    {slot.isBooked && !allSelected && (
                                                                                        <TooltipContent className="bg-rose-600 text-white border-none font-bold text-xs">
                                                                                            Maaf, jam ini sudah dipesan murid lain
                                                                                        </TooltipContent>
                                                                                    )}
                                                                                    {showReadonlyTooltip && (
                                                                                        <TooltipContent className="bg-slate-800 text-white border-none font-bold text-xs">
                                                                                            Gunakan menu edit untuk mengubah jam.
                                                                                        </TooltipContent>
                                                                                    )}
                                                                                </Tooltip>
                                                                            </TooltipProvider>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )
                                                    }

                                                    return (
                                                        <div key={dow} className="space-y-4 pt-2 animate-in fade-in duration-300">
                                                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                                                <CalendarIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                                                                <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 capitalize">{dayLabel}</h4>
                                                                <span className="text-slate-300 dark:text-slate-600">·</span>
                                                                <span className="text-xs font-bold text-slate-400">{groupDates.length}x pertemuan</span>
                                                            </div>


                                                            {firstActive ? (
                                                                <div className="space-y-5 pb-2">
                                                                    {renderGroupSlotSection(t("marketplace_book.morning", "Pagi"), "🌅", morningSlots)}
                                                                    {renderGroupSlotSection(t("marketplace_book.afternoon", "Siang"), "☀️", afternoonSlots)}
                                                                    {renderGroupSlotSection(t("marketplace_book.night", "Malam"), "🌙", nightSlots)}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center py-6 text-slate-400 text-xs font-medium italic">
                                                                    Semua tanggal tidak tersedia
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            })()}

                                            {/* recurring button */}
                                            {selectedPackage.sessionCount > 1 &&
                                                selectedDates.length > 0 &&
                                                selectedDates.every((d) => selectedSlots.some((s) => isSameDay(s.date, d))) &&
                                                selectedSlots.length < selectedPackage.sessionCount && (
                                                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 border border-slate-100 dark:border-slate-800">
                                                            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
                                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                                                        <Repeat className="w-5 h-5 text-emerald-600" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-black text-slate-800 dark:text-white">Buat Jadwal Berulang</h4>
                                                                        <p className="text-[10px] text-slate-400 font-medium">Ulangi jadwal otomatis sesuai sisa kuota</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                    onClick={() => setShowRecurrenceDialog(true)}
                                                                >
                                                                    Jadwal Berulang
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ── Meeting Details Section ── */}
                        <section className="bg-white dark:bg-gray-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                <Video className="h-5 w-5 text-emerald-600" />
                                {t("marketplace_book.meeting_details", "Detail Pertemuan")}
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-slate-900 dark:text-white">{t("marketplace_book.learning_mode", "Mode Belajar")}</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                                        {(teacherHasOffline ? ["online", "offline"] : ["online"] as const).map((m) => (
                                            <div
                                                key={m}
                                                onClick={() => setMode(m as any)}
                                                className={cn(
                                                    "cursor-pointer rounded-xl p-3 border-2 flex items-center gap-3 transition-all",
                                                    mode === m
                                                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                                                        : "border-slate-100 dark:border-slate-700 hover:border-emerald-200"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-full shrink-0 transition-all", mode === m ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300" : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500")}>
                                                    {m === "online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                                                        {m === "online"
                                                            ? t("marketplace_book.online_meeting", "Online Meeting")
                                                            : t("marketplace_book.offline_meeting", "Offline / Tatap Muka")}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 block">
                                                        {m === "online"
                                                            ? t("marketplace_book.online_meeting_desc", "Video call via Google Meet / Zoom")
                                                            : t("marketplace_book.offline_meeting_desc", "Belajar tatap muka secara langsung")}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {mode === "offline" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="space-y-3">
                                            <Label className="text-sm font-bold text-slate-900 dark:text-white">Pilihan Lokasi Offline</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                <div
                                                    onClick={() => setOfflineLocationType("student")}
                                                    className={cn(
                                                        "cursor-pointer rounded-xl px-4 py-3 border flex items-center gap-3 transition-all",
                                                        offlineLocationType === "student"
                                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 hover:border-emerald-200"
                                                    )}
                                                >
                                                    <MapPin className="w-5 h-5 shrink-0" />
                                                    <span className="font-medium text-sm">
                                                        Di lokasi Anda
                                                    </span>
                                                </div>
                                                <div
                                                    onClick={() => setOfflineLocationType("teacher")}
                                                    className={cn(
                                                        "cursor-pointer rounded-xl px-4 py-3 border flex items-center gap-3 transition-all",
                                                        offlineLocationType === "teacher"
                                                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                                            : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300 hover:border-emerald-200"
                                                    )}
                                                >
                                                    <Home className="w-5 h-5 shrink-0" />
                                                    <span className="font-medium text-sm">
                                                        Di lokasi Guru
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                                            {/* ── Kiri: Lokasi ── */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {offlineLocationType === "student" ? t("marketplace_book.your_location", "Lokasi Anda") : "Lokasi Guru"}
                                                </Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                    <Input
                                                        readOnly
                                                        value={offlineLocationType === "student" ? (address || detailAddress || "") : (trainer?.location || "")}
                                                        placeholder={offlineLocationType === "student" ? "Lokasi belum diatur di profil Anda" : "Lokasi guru tidak tersedia"}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>

                                            {/* ── Kanan: Nomor HP ── */}
                                            <div className="space-y-3">
                                                <Label className="text-sm font-bold text-slate-900 dark:text-white">{t("marketplace_book.phone_number", "Nomor HP")}</Label>
                                                <div className="relative flex items-center">
                                                    <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none z-10">
                                                        <img src="https://flagcdn.com/w20/id.png" alt="ID" className="w-4 h-3 rounded-sm" />
                                                        <span className="text-sm font-medium text-slate-500">+62</span>
                                                    </div>
                                                    <Input
                                                        readOnly
                                                        value={phoneNumber || ""}
                                                        placeholder="Belum diatur di profil"
                                                        className="pl-[4.5rem]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-slate-900 dark:text-white">{t("marketplace_book.notes_for_teacher", "Catatan")}</Label>
                                    <Textarea
                                        placeholder={t("marketplace_book.note_placeholder", "Contoh: Saya ingin fokus belajar makhroj huruf...")}
                                        className="resize-none"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                        RIGHT COLUMN – Summary
                    ══════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6" ref={summaryRef}>
                        <div className="bg-white dark:bg-gray-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 overflow-hidden relative">
                            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                                {t("marketplace_book.order_summary", "Ringkasan Pesanan")}
                            </h3>

                            {/* trainer mini profile */}
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-14 w-14 border-2 border-emerald-100 dark:border-emerald-900 shrink-0">
                                    <AvatarImage src={trainer.avatar} className="object-cover" />
                                    <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">{trainer.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{trainer.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        {trainer.rating} <span className="opacity-50">•</span> {trainer.reviewCount} ulasan
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                                        <MapPin className="w-3 h-3 text-emerald-500/70" />
                                        {trainer.location}
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-slate-100 dark:bg-slate-700 mb-6" />

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-start">
                                    <span className="text-slate-500">{t("marketplace_book.package", "Paket Belajar")}</span>
                                    <span className="font-bold text-slate-900 dark:text-white text-right max-w-[150px]">
                                        {selectedPackage.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-slate-500">{t("marketplace_book.mode", "Mode")}</span>
                                    <span className="font-bold text-slate-900 dark:text-white capitalize">{mode}</span>
                                </div>


                                {/* selected slots list */}
                                <div className="py-3 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            Jadwal Terpilih ({selectedSlots.length})
                                        </span>
                                        {selectedPackage.sessionCount > 1 && selectedSlots.length > 0 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-3 text-[11px] font-bold text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 rounded-lg transition-all"
                                                onClick={() => setShowClearAllDialog(true)}
                                            >
                                                Hapus
                                            </Button>
                                        )}
                                    </div>

                                    {selectedSlots.length > 0 ? (
                                        <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                                            {[...selectedSlots]
                                                .sort((a, b) => a.date.getTime() - b.date.getTime())
                                                .map((slot, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex justify-between text-xs items-center p-2.5 rounded-xl border animate-in fade-in slide-in-from-right-2 duration-300 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900 dark:text-white">
                                                                {format(slot.date, "EEEE, d MMMM yyyy", { locale: dateLocale })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="h-6 px-2 text-[11px] font-black border-emerald-100 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                                                                {slot.time}
                                                            </Badge>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
                                                                    >
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-36 rounded-xl border-slate-100 dark:border-slate-800 p-1.5 shadow-xl">
                                                                    {/* Edit */}
                                                                    <DropdownMenuItem
                                                                        className="text-xs font-bold gap-2 text-slate-600 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 mb-0.5"
                                                                        onClick={() => openEditDialog(slot)}
                                                                    >
                                                                        <SquarePen className="w-3.5 h-3.5 text-slate-500" /> Edit
                                                                    </DropdownMenuItem>
                                                                    {/* Hapus */}
                                                                    <DropdownMenuItem
                                                                        className="text-xs font-bold gap-2 text-rose-500 rounded-lg cursor-pointer focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
                                                                        onClick={() => setSlotToDelete(slot)}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">{t("marketplace_book.no_schedule_selected", "Belum ada jadwal dipilih")}</p>
                                    )}

                                    {selectedSlots.length < selectedPackage.sessionCount && (
                                        <div className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-2">
                                            <AlertCircle className="w-3 h-3" />
                                            {selectedSlots.length === 0
                                                ? `Pilih ${selectedPackage.sessionCount} jadwal pertemuan`
                                                : `Pilih ${selectedPackage.sessionCount - selectedSlots.length} jadwal lagi`}
                                        </div>
                                    )}
                                </div>

                                <Separator className="bg-slate-100 dark:bg-slate-700" />

                                <div className="flex justify-between items-center text-slate-500 text-xs">
                                    <span>Harga Paket</span>
                                    <span>{formatPrice(selectedPackage.price)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 text-xs">
                                    <div className="flex items-center gap-1">
                                        <span>Pajak</span>
                                        <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-slate-100 text-slate-400 border-0">12%</Badge>
                                    </div>
                                    <span>{formatPrice(PLATFORM_FEE)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 text-xs">
                                    <span>Layanan</span>
                                    <span>{formatPrice(0)}</span>
                                </div>

                                <div className="pt-4 flex justify-between items-center border-t border-slate-100 dark:border-slate-700 mt-2">
                                    <p className="text-sm font-bold text-slate-500">Total</p>
                                    <p className="text-2xl font-black text-emerald-600">{formatPrice(TOTAL_PRICE)}</p>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={handleBooking}
                                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={selectedSlots.length !== selectedPackage.sessionCount}
                            >
                                {selectedSlots.length === selectedPackage.sessionCount
                                    ? `${t("marketplace_book.continue_payment", "Lanjut ke Pembayaran")}`
                                    : selectedSlots.length === 0
                                        ? `Pilih ${selectedPackage.sessionCount} Jadwal`
                                        : `Pilih ${selectedPackage.sessionCount - selectedSlots.length} Jadwal Lagi`}
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                DIALOGS
            ════════════════════════════════════════════════════════════════ */}

            {/* ── Edit Dialog ── */}
            <Dialog open={!!editDialogData} onOpenChange={(open) => !open && setEditDialogData(null)}>
                <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="p-6 pb-0 shrink-0">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white text-left flex items-center gap-2">
                                <SquarePen className="w-5 h-5 text-emerald-600" />
                                Edit Jadwal
                            </DialogTitle>
                            <DialogDescription className="text-left text-slate-500 font-medium pt-1">
                                {editDialogData && (
                                    <>
                                        Mengubah jadwal{" "}
                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                            {format(editDialogData.originalSlot.date, "EEEE, d MMMM yyyy", { locale: dateLocale })}
                                        </span>{" "}
                                        pukul{" "}
                                        <span className="font-bold text-emerald-600">{editDialogData.originalSlot.time}</span>
                                    </>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {editDialogData && (
                            <>
                                {/* ── Mini Calendar ── */}
                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                        Pilih Tanggal Baru
                                    </p>

                                    {/* Month nav */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-800 dark:text-white capitalize">
                                            {format(editDialogData.dialogMonth, "MMMM yyyy", { locale: dateLocale })}
                                        </span>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => setEditDialogData((prev) => prev ? {
                                                    ...prev,
                                                    dialogMonth: subMonths(prev.dialogMonth, 1)
                                                } : null)}
                                                disabled={isBefore(subMonths(editDialogData.dialogMonth, 1), startOfMonth(new Date()))}
                                                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setEditDialogData((prev) => prev ? {
                                                    ...prev,
                                                    dialogMonth: addMonths(prev.dialogMonth, 1)
                                                } : null)}
                                                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Day labels */}
                                    <div className="grid grid-cols-7 gap-1 mb-1">
                                        {DAY_LABELS.map((label) => (
                                            <div key={label} className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400 py-0.5">
                                                {label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Date cells */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {editCalendarDays.map((date, i) => {
                                            if (!date) return <div key={`edit-empty-${i}`} />

                                            const isPast = isBefore(date, startOfDay(new Date()))
                                            const isUnavailable = isHoliday(date)
                                            const isToday = isSameDay(date, new Date())
                                            const isNewDateSelected = editDialogData.newDate && isSameDay(date, editDialogData.newDate)
                                            const isOriginalDate = isSameDay(date, editDialogData.originalSlot.date)
                                            // Block dates already occupied by other slots (not the original)
                                            const isOccupied = selectedSlots.some(
                                                (s) => isSameDay(s.date, date) && !isSameDay(s.date, editDialogData.originalSlot.date)
                                            )
                                            const isDisabled = isPast || isUnavailable || isOccupied

                                            return (
                                                <button
                                                    key={`edit-date-${i}`}
                                                    disabled={isDisabled}
                                                    onClick={() => {
                                                        if (isDisabled) return
                                                        setEditDialogData((prev) => prev ? {
                                                            ...prev,
                                                            newDate: date,
                                                            newTime: "", // reset time when date changes
                                                        } : null)
                                                    }}
                                                    title={isUnavailable ? (getHolidayReason(date) || "Libur") : isOccupied ? "Sudah dipilih" : undefined}
                                                    className={cn(
                                                        "relative flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-200 border aspect-square text-[11px] font-black",
                                                        isDisabled
                                                            ? "opacity-25 cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800"
                                                            : isNewDateSelected
                                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                                                : isOriginalDate
                                                                    ? "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400"
                                                                    : isToday
                                                                        ? "bg-white dark:bg-slate-800 border-emerald-400 text-emerald-600"
                                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                                    )}
                                                >
                                                    {format(date, "d")}
                                                    {isOriginalDate && !isNewDateSelected && (
                                                        <span className="text-[6px] font-black text-slate-400 uppercase mt-0.5 leading-none">lama</span>
                                                    )}
                                                    {isToday && !isNewDateSelected && !isOriginalDate && (
                                                        <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-500" />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {editDialogData.newDate && (
                                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 mt-1">
                                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                                {format(editDialogData.newDate, "EEEE, d MMMM yyyy", { locale: dateLocale })}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* ── Time Slot Picker ── */}
                                {editDialogData.newDate && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                            Pilih Jam Baru
                                        </p>

                                        {(() => {
                                            const availableSlots = getAvailableSlotsForDate(editDialogData.newDate!)
                                            const morningSlots = availableSlots.filter((s) => getCategory(s.start) === "morning")
                                            const afternoonSlots = availableSlots.filter((s) => getCategory(s.start) === "afternoon")
                                            const nightSlots = availableSlots.filter((s) => getCategory(s.start) === "night")

                                            if (availableSlots.length === 0) {
                                                return (
                                                    <div className="flex items-center justify-center py-6 text-slate-400 text-xs font-medium italic">
                                                        Tidak ada jam tersedia untuk tanggal ini
                                                    </div>
                                                )
                                            }

                                            const renderEditSlotSection = (title: string, icon: string, slotsArr: typeof morningSlots) => {
                                                if (slotsArr.length === 0) return null
                                                return (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-base">{icon}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{title}</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {slotsArr.map((slot, idx) => {
                                                                const isSelected = editDialogData.newTime === slot.start
                                                                const isBooked = !!slot.isBooked
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        disabled={isBooked}
                                                                        onClick={() => {
                                                                            if (isBooked) return
                                                                            setEditDialogData((prev) => prev ? { ...prev, newTime: slot.start } : null)
                                                                        }}
                                                                        className={cn(
                                                                            "relative flex flex-col items-center justify-center gap-0.5 px-4 py-3 rounded-2xl font-bold transition-all duration-200 border-2 min-w-[80px] text-sm",
                                                                            isSelected
                                                                                ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                                                                : isBooked
                                                                                    ? "bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                                                                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50"
                                                                        )}
                                                                    >
                                                                        {isBooked && (
                                                                            <div className="absolute -top-2 -right-1 bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
                                                                                PENUH
                                                                            </div>
                                                                        )}
                                                                        {isSelected && (
                                                                            <div className="absolute top-1.5 right-1.5">
                                                                                <Check className="w-2.5 h-2.5 text-emerald-200" />
                                                                            </div>
                                                                        )}
                                                                        <span className={cn("tabular-nums font-black text-base leading-tight", isBooked && "line-through opacity-50")}>
                                                                            {slot.start}
                                                                        </span>
                                                                        <span className={cn("text-xs font-semibold", isSelected ? "text-emerald-100" : "text-slate-500")}>
                                                                            – {slot.end}
                                                                        </span>
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    {renderEditSlotSection("Pagi", "🌅", morningSlots)}
                                                    {renderEditSlotSection("Siang", "☀️", afternoonSlots)}
                                                    {renderEditSlotSection("Malam", "🌙", nightSlots)}
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-700 shrink-0 flex flex-row gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setEditDialogData(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={!editDialogData?.newDate || !editDialogData?.newTime}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Simpan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Slot limit (from time slots) */}
            <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
                <DialogContent className="sm:max-w-md p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <DialogHeader className="flex-1 text-left space-y-1">
                                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                    {t("marketplace_book.limit_reached", "Batas Jadwal Tercapai!")}
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500">
                                    Paket {selectedPackage.name} hanya untuk {selectedPackage.sessionCount} pertemuan.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-none">
                            <CardContent className="p-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Silakan hapus salah satu jadwal yang sudah dipilih jika ingin mengganti dengan waktu yang baru.
                                </p>
                            </CardContent>
                        </Card>

                        <DialogFooter className="flex flex-row justify-end w-full mt-2 sm:justify-end">
                            <Button
                                onClick={() => setShowLimitDialog(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                            >
                                {t("marketplace_book.understood", "Mengerti")}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Calendar limit dialog */}
            <Dialog open={showCalendarLimitDialog} onOpenChange={setShowCalendarLimitDialog}>
                <DialogContent className="sm:max-w-md p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <DialogHeader className="flex-1 text-left space-y-1">
                                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                    Batas Jadwal Tercapai!
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500">
                                    Paket <span className="font-bold text-slate-700 dark:text-slate-300">{selectedPackage.name}</span> hanya untuk <span className="font-bold text-slate-700 dark:text-slate-300">{selectedPackage.sessionCount} pertemuan</span>. Semua jadwal sudah terisi.
                                </DialogDescription>
                            </DialogHeader>
                        </div>

                        <Card className="bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-none">
                            <CardContent className="p-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Untuk mengganti jadwal, gunakan menu <span className="font-bold text-slate-700 dark:text-slate-300">⋯ (tiga titik)</span> di ringkasan jadwal, lalu pilih <span className="font-bold text-slate-700 dark:text-slate-300">Edit</span>.
                                </p>
                            </CardContent>
                        </Card>

                        <DialogFooter className="flex flex-row justify-end w-full mt-2 sm:justify-end">
                            <Button
                                onClick={() => setShowCalendarLimitDialog(false)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6"
                            >
                                Mengerti
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Recurrence dialog */}
            <Dialog open={showRecurrenceDialog} onOpenChange={setShowRecurrenceDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="items-center">
                        <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white text-center">
                            Buat Jadwal Berulang?
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 font-medium px-4">
                            Sistem akan otomatis membuatkan jadwal untuk sisa pertemuan berdasarkan jadwal yang telah dipilih.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 my-2 space-y-4">
                        <div className="flex gap-2">
                            {(["daily", "weekly"] as const).map((rm) => (
                                <div
                                    key={rm}
                                    onClick={() => setRecurrenceMode(rm)}
                                    className={cn(
                                        "flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all",
                                        recurrenceMode === rm
                                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-emerald-200"
                                    )}
                                >
                                    <h4 className={cn("text-xs font-black mb-1", recurrenceMode === rm ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300")}>
                                        {rm === "daily" ? "Ulangi Harian" : "Ulangi Mingguan"}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-tight">
                                        {rm === "daily" ? "Ulangi setiap hari pada jam yang sama" : "Ulangi setiap minggu pada hari yang sama"}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-center text-slate-500 leading-relaxed font-medium">
                                Jadwal patokan:{" "}
                                <span className="font-bold text-slate-700 dark:text-slate-300">
                                    {selectedSlots.map((s) => `${format(s.date, "EEEE", { locale: dateLocale })} ${s.time}`).join(", ")}
                                </span>
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row gap-2 justify-end pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowRecurrenceDialog(false)}
                        >
                            Tidak
                        </Button>
                        <Button
                            disabled={recurrenceMode === ""}
                            onClick={handleApplyRecurrence}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            Ya
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Clear all dialog */}
            <Dialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white text-left">
                            Hapus Semua Jadwal?
                        </DialogTitle>
                        <DialogDescription className="text-left text-slate-500 font-medium pt-2">
                            Apakah Anda yakin ingin menghapus seluruh{" "}
                            <span className="font-bold text-slate-900 dark:text-white">{selectedSlots.length} jadwal</span> yang telah dipilih?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-2 justify-end pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowClearAllDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setSelectedSlots([])
                                setSelectedDates([])
                                setShowClearAllDialog(false)
                                toast.success("Semua jadwal berhasil dihapus")
                                setTimeout(() => {
                                    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                                    toast.info(`Pilih ${selectedPackage.sessionCount} jadwal pertemuan`, {
                                        duration: 4000,
                                        icon: "📅",
                                    })
                                }, 300)
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


            {/* Single delete dialog */}
            <Dialog open={!!slotToDelete} onOpenChange={(open) => !open && setSlotToDelete(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white text-left">
                            Hapus Jadwal?
                        </DialogTitle>
                        <DialogDescription className="text-left text-slate-500 font-medium pt-2">
                            Hapus jadwal ini? Kamu bisa memilih ulang jadwal pengganti dari kalender.
                        </DialogDescription>
                        {slotToDelete && (
                            <div className="mt-3 flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-3 py-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                                    {format(slotToDelete.date, "EEEE, d MMMM yyyy", { locale: dateLocale })} — {slotToDelete.time}
                                </span>
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-2 justify-end pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setSlotToDelete(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (slotToDelete) {
                                    handleRemoveSlot(slotToDelete)
                                    setSlotToDelete(null)
                                    toast.success("Jadwal berhasil dihapus")
                                }
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Course Detail Modal */}
            <CourseDetailModal
                pkg={packages.find((p: any) => p.id === detailPackageId) || null}
                trainer={trainer}
                open={!!detailPackageId}
                onClose={() => setDetailPackageId(null)}
                onSelect={(id) => setSelectedPackageId(id)}
                selectedPackageId={selectedPackageId}
            />
        </div>
    )
}