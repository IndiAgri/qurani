"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { toast } from "sonner"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    Check,
    Clock,
    MessageSquare,
    Receipt,
    Star,
    Hash,
    CalendarRange,
    CalendarCheck,
    CreditCard,
    Package,
    BookOpen,
    XCircle as XCircleIcon,
    Plus,
    MoreVertical,
    Link as LinkIcon,
    Video,
    User,
    Copy,
    Wallet,
    AlertCircle,
    FileText,
    MapPin,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { DUMMY_TRAINERS, getCourses } from "@/data/trainers-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { isBefore, startOfDay, getDay, isSameDay, startOfMonth, addMonths, subMonths, getDaysInMonth, addDays } from "date-fns"
import { submitReview, getReviewsByTeacherId } from "@/lib/booking"
import { SubmitReviewModal } from "@/components/marketplace/reviews/submit-review-modal"
import { ViewReviewModal } from "@/components/marketplace/reviews/view-review-modal"
import { ReviewCard } from "@/components/marketplace/reviews/review-card"
import { CancellationRefundFlow, useCancellationState, type CancellationResult, type RefundResult, CancellationDetailModal } from "@/components/marketplace/orders/cancellation-refund-flow"
import { ChatDialog } from "@/components/marketplace/chat-dialog"
import { useAuth } from "@/components/providers/auth-provider"

// --- helpers ---
const getCategory = (time: string) => {
    const hour = parseInt(time.split(":")[0])
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "night"
}

// Dummy data — 4 pesanan, 4 guru, 4 status berbeda (sinkron dengan marketplace-orders-page.tsx)
const DUMMY_ORDERS = [
    {
        // STATUS: Menunggu Pembayaran — Nur Aisyah (ID 2, Tahsin)
        id: "INV-1789973730001",
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        trainerName: "Nur Aisyah",
        trainerAvatar: "https://c.superprof.com/i/m/21187269/600/20251128151124/21187269.webp",
        trainerId: "2",
        packageName: "Tahsin Dasar",
        method: "Ummi",
        mode: "Online",
        description: "4x Pertemuan",
        features: ["Jadwal fleksibel", "Konsultasi chat", "Modul PDF Gratis"],
        sessions: 4,
        price: 201600,
        subtotal: 180000,
        serviceFee: 0,
        tax: 21600,
        status: "pending",
        paymentMethod: "Qurani Wallet",
        paymentStatus: "Menunggu Pembayaran",
        expiryDate: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
        packageId: "paket4-4x-2",
        sessionDetails: [
            { id: 1, title: "Pertemuan 1", status: "scheduled", date: "03 Sep 2026", time: "09:00" },
            { id: 2, title: "Pertemuan 2", status: "scheduled", date: "06 Sep 2026", time: "09:00" },
            { id: 3, title: "Pertemuan 3", status: "scheduled", date: "10 Sep 2026", time: "09:00" },
            { id: 4, title: "Pertemuan 4", status: "scheduled", date: "13 Sep 2026", time: "09:00" },
        ]
    },
    {
        // STATUS: Dibatalkan — Fatima Hassan (ID 4, Tafsir)
        id: "INV-1789973730002",
        date: "2026-08-01T09:00:00Z",
        trainerName: "Fatima Hassan",
        trainerAvatar: "https://c.superprof.com/i/m/24071303/600/20240614004928/24071303.webp",
        trainerId: "4",
        packageName: "Tafsir Juz Amma",
        method: "Qiroati",
        mode: "Online",
        description: "4x Pertemuan",
        features: ["Jadwal fleksibel", "Modul Digital", "Konsultasi chat"],
        sessions: 4,
        price: 179200,
        subtotal: 160000,
        serviceFee: 0,
        tax: 19200,
        status: "cancelled",
        paymentMethod: "E-Wallet (OVO)",
        paymentStatus: "Gagal/Kedaluwarsa",
        packageId: "paket4-4x-4",
        sessionDetails: [
            { id: 1, title: "Pertemuan 1", status: "cancelled", date: "03 Agu 2026", time: "15:00" },
            { id: 2, title: "Pertemuan 2", status: "cancelled", date: "06 Agu 2026", time: "15:00" },
            { id: 3, title: "Pertemuan 3", status: "cancelled", date: "10 Agu 2026", time: "15:00" },
            { id: 4, title: "Pertemuan 4", status: "cancelled", date: "13 Agu 2026", time: "15:00" },
        ]
    },
    {
        // STATUS: Selesai — Rafi Andika (ID 1, Tahfidz) — murid dapat submit ulasan
        id: "INV-1789973730003",
        date: "2026-07-01T10:00:00Z",
        trainerName: "Rafi Andika",
        trainerAvatar: "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp",
        trainerId: "1",
        packageName: "Tahfidz Intensif",
        method: "Talaqqi",
        mode: "Online",
        description: "8x Pertemuan (Hemat 10%)",
        features: ["Prioritas jadwal", "Konsultasi 24 jam", "Sertifikat Bulanan", "Modul Digital"],
        sessions: 8,
        price: 403200,
        subtotal: 360000,
        serviceFee: 0,
        tax: 43200,
        status: "completed",
        paymentMethod: "Bank Transfer (BCA)",
        paymentStatus: "Lunas",
        packageId: "paket4-8x-1",
        sessionDetails: [
            { id: 1, title: "Pertemuan 1", status: "completed", date: "03 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 2, title: "Pertemuan 2", status: "completed", date: "06 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 3, title: "Pertemuan 3", status: "completed", date: "09 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 4, title: "Pertemuan 4", status: "completed", date: "13 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 5, title: "Pertemuan 5", status: "completed", date: "16 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 6, title: "Pertemuan 6", status: "completed", date: "19 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 7, title: "Pertemuan 7", status: "completed", date: "22 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
            { id: 8, title: "Pertemuan 8", status: "completed", date: "25 Jul 2026", time: "10:00", meetingPlatform: "Zoom", videoConferenceUrl: "https://zoom.us/j/123456789" },
        ]
    },
    {
        // STATUS: Aktif — Zain Ali (ID 3, Tahfidz/Sanad)
        id: "INV-1789973730004",
        date: "2026-08-20T08:00:00Z",
        trainerName: "Zain Ali",
        trainerAvatar: "https://c.superprof.com/i/m/17384281/600/20230520125508/17384281.webp",
        trainerId: "3",
        packageName: "Tahfidz Intensif",
        method: "Talaqqi",
        mode: "Online",
        description: "8x Pertemuan (Hemat 10%)",
        features: ["Jadwal fleksibel", "Modul PDF Gratis", "Evaluasi Mingguan", "Konsultasi chat"],
        sessions: 8,
        price: 403200,
        subtotal: 360000,
        serviceFee: 0,
        tax: 43200,
        status: "success",
        paymentMethod: "Bank Transfer (Mandiri)",
        paymentStatus: "Lunas",
        packageId: "paket4-8x-3",
        sessionDetails: [
            { id: 1, title: "Pertemuan 1", status: "completed", date: "22 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
            { id: 2, title: "Pertemuan 2", status: "completed", date: "25 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
            { id: 3, title: "Pertemuan 3", status: "completed", date: "28 Agu 2026", time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
            { id: 4, title: "Pertemuan 4", status: "scheduled", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), time: "09:00", meetingPlatform: "Google Meet", videoConferenceUrl: "https://meet.google.com/abc-def-ghi" },
            { id: 5, title: "Pertemuan 5", status: "scheduled", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), time: "09:00" },
            { id: 6, title: "Pertemuan 6", status: "scheduled", date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), time: "09:00" },
            { id: 7, title: "Pertemuan 7", status: "scheduled", date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), time: "09:00" },
            { id: 8, title: "Pertemuan 8", status: "scheduled", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }), time: "09:00" },
        ]
    },
]


const getOrderStatusConfig = (status: string) => {
    switch (status) {
        case "active":
        case "accepted":
        case "success": return { label: "Aktif", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" }
        case "completed": return { label: "Selesai", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" }
        case "pending": return { label: "Menunggu Bayar", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" }
        case "cancelled": return { label: "Dibatalkan", bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" }
        case "rejected": return { label: "Ditolak Guru", bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" }
        case "waiting_approval": return { label: "Menunggu Persetujuan", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" }
        default: return { label: status, bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" }
    }
}

const getSessionStatusConfig = (status: string) => {
    switch (status) {
        case "completed":
            return {
                label: "Selesai",
                cardBg: "bg-white border-emerald-100 hover:border-emerald-500 hover:shadow-emerald-50",
                numBg: "bg-emerald-500 text-white",
                badge: "bg-emerald-100 text-emerald-700"
            }
        case "scheduled":
            return {
                label: "Terjadwal",
                cardBg: "bg-white border-blue-100 hover:border-blue-500 hover:shadow-blue-50",
                numBg: "bg-blue-500 text-white",
                badge: "bg-blue-100 text-blue-700"
            }
        case "cancelled":
            return {
                label: "Dibatalkan",
                cardBg: "bg-gray-50 border-gray-200 hover:border-gray-400 hover:shadow-gray-100",
                numBg: "bg-gray-300 text-gray-500",
                badge: "bg-gray-100 text-gray-500"
            }
        default:
            return {
                label: status,
                cardBg: "bg-gray-50 border-gray-100",
                numBg: "bg-gray-200 text-gray-400",
                badge: "bg-gray-100 text-gray-500"
            }
    }
}

interface MarketplaceOrdersDetailPageProps {
    id: string
}

// Komponen utama untuk halaman Detail Pesanan, melihat rincian sesi, invoice, dan aksi untuk sebuah pesanan spesifik.
export function MarketplaceOrdersDetailPage({ id: orderId }: MarketplaceOrdersDetailPageProps) {
    const router = useRouter()
    const { locale, t } = useI18n()
    const { profile } = useAuth()

    // ── DATA LOADING LOGIC ──
    const [order, setOrder] = React.useState<any>(null)
    const [sessionDetails, setSessionDetails] = React.useState<any[]>([])
    const [teacherDefaults, setTeacherDefaults] = React.useState<any>({})
    const [isChatDialogOpen, setIsChatDialogOpen] = React.useState(false)

    const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false)
    const [selectedCancellation, setSelectedCancellation] = React.useState<CancellationResult | null>(null)
    const [selectedRefund, setSelectedRefund] = React.useState<RefundResult | null>(null)

    React.useEffect(() => {
        if (order?.trainerName) {
            const title = `${t("title_meta.order_prefix", "Pesanan")} - ${order.trainerName} | Qurani`;
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
    }, [order, t])

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                // Assuming lightboxPhoto is defined somewhere here
                // We'll close it by simulating a click on the close button or checking if setLightboxPhoto exists
                const closeBtn = document.getElementById("lightbox-close-btn");
                if (closeBtn) closeBtn.click();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    React.useEffect(() => {
        try {
            setTeacherDefaults(JSON.parse(localStorage.getItem('teacher_meeting_defaults') || '{}'))
        } catch (e) { }

        const storedRequests = JSON.parse(localStorage.getItem('teacher_requests') || '[]')
        const mappedLocalOrders = storedRequests.map((req: any) => {
            const rawId = req.id || req.transactionId;
            const formattedId = rawId?.toString().startsWith('ORD-') || rawId?.toString().startsWith('INV-') ? rawId.toString() : `INV-${rawId}`;

            return {
                id: formattedId,
                originalId: req.id,
                transactionId: req.transactionId,
                date: req.createdAt || req.dateApplied || req.timestamp || new Date().toISOString(),
                trainerName: req.trainerName || req.teacherName || req.trainer?.name || "Guru My Qurani",
                trainerAvatar: req.trainerAvatar || req.teacherAvatar || req.trainer?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=MQ",
                packageName: req.duration || req.course || "Paket Sesi",
                method: req.course || "Tahsin",
                description: `${req.sessions || 1}x Pertemuan (${req.mode || req.method || 'Online'})`,
                features: ["Jadwal fleksibel", "Konsultasi chat", "Modul Digital"],
                sessions: req.sessions || 1,
                price: typeof req.price === 'string' ? parseInt(req.price.replace(/[^\d]/g, '')) : req.price || 0,
                subtotal: req.subtotal ?? (typeof req.price === 'string' ? parseInt(req.price.replace(/[^\d]/g, '')) : req.price || 0),
                serviceFee: req.serviceFee || 0,
                tax: 0,
                status: (req.status === 'accepted' || req.status === 'active' || req.status === 'success') ? 'success' : req.status || "success",
                rejectionReason: req.rejectionReason || null,
                mode: req.mode || req.method || "Online",
                offlineLocationType: req.offlineLocationType || null,
                address: req.address || req.detailAddress || req.location || "",
                notes: req.message || req.notes || req.note || "",
                trainerId: req.trainerId || req.teacherId || "1",
                packageId: req.packageId || req.courseId || "single",
                slots: req.slots || [],
                paymentMethod: "Qurani Wallet",
                paymentStatus: "Success",
                sessionDetails: (req.slots || []).map((slot: any, index: number) => {
                    let formattedDate = slot.d;
                    if (formattedDate && (formattedDate.includes('T') || formattedDate.includes('-'))) {
                        try {
                            const dateObj = new Date(formattedDate);
                            if (!isNaN(dateObj.getTime())) {
                                formattedDate = format(dateObj, "d MMM yyyy", { locale: idLocale }).replace("Agt", "Agu");
                            }
                        } catch (e) { }
                    } else if (formattedDate) {
                        formattedDate = formattedDate.replace("Januari", "Jan")
                            .replace("Februari", "Feb")
                            .replace("Maret", "Mar")
                            .replace("April", "Apr")
                            .replace("Agustus", "Agu")
                            .replace("September", "Sep")
                            .replace("Oktober", "Okt")
                            .replace("November", "Nov")
                            .replace("Desember", "Des");
                    }

                    // Determine session status dynamically
                    let sessionStatus = "scheduled";

                    // If teacher has uploaded photo evidence, it's completed
                    if (slot.uploadedPhoto) {
                        sessionStatus = "completed";
                    }

                    return {
                        id: index + 1,
                        title: `Pertemuan ${index + 1}`,
                        status: sessionStatus,
                        date: formattedDate,
                        time: slot.t,
                        videoConferenceUrl: slot.link,
                        meetingPlatform: slot.meetingPlatform,
                        meetingId: slot.meetingId,
                        meetingPassword: slot.meetingPassword,
                        uploadedPhoto: slot.uploadedPhoto || null,
                        notes: slot.notes || null
                    };
                })
            }
        })

        const allPossibleOrders = [...mappedLocalOrders, ...DUMMY_ORDERS]
        const foundOrder = allPossibleOrders.find(o => 
            o.id === orderId || 
            o.id?.toLowerCase() === orderId.toLowerCase() ||
            String(o.originalId) === String(orderId) ||
            o.transactionId === orderId ||
            `INV-${o.originalId}` === orderId
        )

        if (foundOrder) {
            // Hitung ulang harga untuk trainer 1 agar selalu up-to-date
            if (String(foundOrder.trainerId) === "1") {
                try {
                    const profileStr = localStorage.getItem("trainer_profile")
                    let profileHourlyRate = null
                    if (profileStr) {
                        const profile = JSON.parse(profileStr)
                        if (profile && !isNaN(profile.pricePerSession)) {
                            profileHourlyRate = Number(profile.pricePerSession)
                        }
                    }
                    
                    const allCourses = getCourses("1")
                    const foundPkg = allCourses.find((p: any) => p.id === foundOrder.packageId || p.title === foundOrder.packageName)
                    if (foundPkg) {
                        const rateToUse = profileHourlyRate ?? foundPkg.hourlyRate ?? 0;
                        const runtimeSessionPrice = rateToUse > 0 && foundPkg.duration > 0
                            ? Math.round(rateToUse * (foundPkg.duration / 60))
                            : foundPkg.sessionPrice || 0;
                        const runtimePackagePrice = runtimeSessionPrice > 0 && foundPkg.totalSessions > 0
                            ? Math.round(runtimeSessionPrice * foundPkg.totalSessions)
                            : foundPkg.packagePrice || 0;
                        const runtimeBasePrice = foundPkg.totalSessions > 1 ? runtimePackagePrice : runtimeSessionPrice;
                        
                        let discountPct = 0;
                        if (foundPkg.id && foundPkg.id.startsWith("paket")) {
                            if (foundPkg.totalSessions >= 20) discountPct = 25;
                            else if (foundPkg.totalSessions >= 10) discountPct = 20;
                            else if (foundPkg.totalSessions >= 5) discountPct = 10;
                        } else if (foundPkg.discountPrice && foundPkg.packagePrice && foundPkg.discountPrice < foundPkg.packagePrice) {
                            discountPct = Math.round(((foundPkg.packagePrice - foundPkg.discountPrice) / foundPkg.packagePrice) * 100);
                        } else if (foundPkg.discountPrice && foundPkg.sessionPrice && foundPkg.discountPrice < foundPkg.sessionPrice) {
                            discountPct = Math.round(((foundPkg.sessionPrice - foundPkg.discountPrice) / foundPkg.sessionPrice) * 100);
                        }
                        
                        const calculatedPrice = discountPct > 0 
                            ? Math.floor((runtimeBasePrice * (100 - discountPct)) / 100)
                            : foundPkg.discountPrice ?? runtimeBasePrice;
                        
                        // Update order price
                        foundOrder.subtotal = calculatedPrice;
                        const PLATFORM_FEE = Math.round(calculatedPrice * 0.12);
                        foundOrder.serviceFee = PLATFORM_FEE;
                        foundOrder.price = calculatedPrice + PLATFORM_FEE;
                    }
                } catch (e) {}
            }

            // Fetch session notes explicitly from teacher_session_notes as a fallback
            let sessionNotesMap: any = {};
            try {
                const rawNotes = localStorage.getItem('teacher_session_notes');
                if (rawNotes) sessionNotesMap = JSON.parse(rawNotes);
            } catch (e) { }

            const getTeacherNote = (index: number) => {
                const reqId = orderId.replace('ORD-', '');
                const cleanTx = String(reqId).replace(/^QRN-/i, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                return (
                    sessionNotesMap[reqId]?.[index] ||
                    sessionNotesMap[`ORD-QRN-${reqId}`]?.[index] ||
                    sessionNotesMap[cleanTx]?.[index] ||
                    sessionNotesMap[`ORD-QRN-${cleanTx}`]?.[index] ||
                    sessionNotesMap[orderId]?.[index] ||
                    null
                );
            };

            // Merge meeting link data from teacher_requests (latest) with saved orders
            const teacherReqSlots = storedRequests.find(
                (r: any) => (r.transactionId || r.id)?.toString() === orderId.replace('ORD-', '')
            )?.slots || [];

            const enhancedFoundOrderSessions = (foundOrder.sessionDetails || []).map((s: any, i: number) => {
                const slot = teacherReqSlots[i] || {};
                return {
                    ...s,
                    videoConferenceUrl: slot.link || s.videoConferenceUrl || "",
                    meetingPlatform: slot.meetingPlatform || s.meetingPlatform || "",
                    meetingId: slot.meetingId || s.meetingId || "",
                    meetingPassword: slot.meetingPassword || s.meetingPassword || "",
                    uploadedPhoto: slot.uploadedPhoto || s.uploadedPhoto || null,
                    notes: slot.notes || s.notes || getTeacherNote(i) || null,
                    recapId: slot.recapId || s.recapId || null,
                }
            });
            foundOrder.sessionDetails = enhancedFoundOrderSessions;

            try {
                const savedOrders = JSON.parse(localStorage.getItem('updated_orders_details') || '{}')
                if (savedOrders[orderId]) {
                    // Merge saved sessions with latest teacher_requests slot data
                    const mergedSessions = (savedOrders[orderId].sessionDetails || []).map((s: any, i: number) => {
                        const slot = teacherReqSlots[i] || {};
                        return {
                            ...s,
                            videoConferenceUrl: slot.link || s.videoConferenceUrl || "",
                            meetingPlatform: slot.meetingPlatform || s.meetingPlatform || "",
                            meetingId: slot.meetingId || s.meetingId || "",
                            meetingPassword: slot.meetingPassword || s.meetingPassword || "",
                            uploadedPhoto: slot.uploadedPhoto || s.uploadedPhoto || null,
                            notes: slot.notes || s.notes || getTeacherNote(i) || null,
                            recapId: slot.recapId || s.recapId || null,
                        };
                    });
                    setOrder({ ...savedOrders[orderId], sessionDetails: mergedSessions })
                    setSessionDetails(mergedSessions)
                } else {
                    setOrder(foundOrder)
                    setSessionDetails(enhancedFoundOrderSessions)
                }
            } catch (e) {
                setOrder(foundOrder)
                setSessionDetails(enhancedFoundOrderSessions)
            }
        } else {
            setOrder(DUMMY_ORDERS[0])
            setSessionDetails(DUMMY_ORDERS[0].sessionDetails || [])
        }

        // ── Seed dummy cancellation data untuk INV-1789973730002 (Fatima Hassan — cancelled) ──
        if (typeof window !== 'undefined') {
            try {
                const CANCELLATION_KEY = "qurani_cancellations"
                const REFUND_KEY = "qurani_refunds"
                const existingCancellations: any[] = JSON.parse(localStorage.getItem(CANCELLATION_KEY) || "[]")
                const hasDummyCancellation = existingCancellations.some((c: any) => c.orderId === "INV-1789973730002")
                if (!hasDummyCancellation) {
                    const dummyCancellation = {
                        id: "CXL-DUMMY-002",
                        orderId: "INV-1789973730002",
                        sessionIds: [1, 2, 3, 4],
                        type: "future",
                        reason: "Kendala biaya",
                        note: "",
                        cancelledAt: "2026-08-05T10:30:00.000Z",
                        status: "success",
                    }
                    localStorage.setItem(CANCELLATION_KEY, JSON.stringify([...existingCancellations, dummyCancellation]))
                    const existingRefunds: any[] = JSON.parse(localStorage.getItem(REFUND_KEY) || "[]")
                    const dummyRefund = {
                        id: "RFD-DUMMY-002",
                        orderId: "INV-1789973730002",
                        cancellationId: "CXL-DUMMY-002",
                        amount: 179200,
                        method: "qurani_wallet",
                        status: "success",
                        createdAt: "2026-08-05T10:31:00.000Z",
                    }
                    localStorage.setItem(REFUND_KEY, JSON.stringify([...existingRefunds, dummyRefund]))
                }
            } catch (_) {}
        }
    }, [orderId])

    const [confirmSessionId, setConfirmSessionId] = React.useState<number | null>(null)
    const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false)
    const [rescheduleSession, setRescheduleSession] = React.useState<any>(null)
    const [rescheduleDate, setRescheduleDate] = React.useState<Date | undefined>(undefined)
    const [rescheduleTime, setRescheduleTime] = React.useState("")
    const [rescheduleReason, setRescheduleReason] = React.useState("")
    const [rescheduleNote, setRescheduleNote] = React.useState("")
    const [dialogMonth, setDialogMonth] = React.useState(startOfMonth(new Date()))

    const [teacherHolidays, setTeacherHolidays] = React.useState<{ date: Date; reason: string }[]>([])
    const [offDays, setOffDays] = React.useState<string[]>(["Minggu"])
    const [weeklyAvailability, setWeeklyAvailability] = React.useState<Record<string, { time: string; method: string }[]>>({})

    const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false)
    const [existingReview, setExistingReview] = React.useState<any>(null)

    React.useEffect(() => {
        if (order) {
            const reviews = getReviewsByTeacherId(order.trainerId);
            const found = reviews.find(r => r.bookingId === order.id);
            setExistingReview(found || null);
        }
    }, [order, isReviewModalOpen])

    const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false)
    const [selectedDetailSession, setSelectedDetailSession] = React.useState<any>(null)
    const [lightboxPhoto, setLightboxPhoto] = React.useState<string | null>(null)

    React.useEffect(() => {
        const savedHolidays = localStorage.getItem("teacher_holidays")
        if (savedHolidays) {
            try { setTeacherHolidays(JSON.parse(savedHolidays).map((h: any) => ({ date: new Date(h.date), reason: h.reason }))) } catch (_) { }
        }
        const savedOffDays = localStorage.getItem("teacher_off_days")
        if (savedOffDays) { try { setOffDays(JSON.parse(savedOffDays)) } catch (_) { } }

        const savedAvailability = localStorage.getItem("teacher_weekly_availability")
        if (savedAvailability) { try { setWeeklyAvailability(JSON.parse(savedAvailability)) } catch (_) { } }
    }, [])

    const trainer = React.useMemo(() => {
        if (!order) return DUMMY_TRAINERS[0]
        const trainerName = order.trainerName
        return DUMMY_TRAINERS.find((t) => t.name === trainerName) || DUMMY_TRAINERS[0]
    }, [order])

    const getHolidayReason = (date: Date) => {
        const holiday = teacherHolidays.find((h) => isSameDay(h.date, date))
        if (holiday) return holiday.reason
        if (trainer.id === "1") {
            const dayName = format(date, "EEEE", { locale: idLocale })
            if (offDays.includes(dayName)) return "Libur"
        } else {
            if (getDay(date) === 0) return "Libur"
        }
        if (trainer.id !== "1" && trainer.holidays) {
            if (trainer.holidays.includes(format(date, "yyyy-MM-dd"))) return "Libur Khusus"
        }
        return null
    }
    const isHoliday = (date: Date) => !!getHolidayReason(date)

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

        const addedToSchedule = JSON.parse(localStorage.getItem("added_to_schedule") || "[]")
        const formattedDate = format(date, "d MMM yyyy", { locale: idLocale })

        return slots.map((slot) => {
            const conflict = addedToSchedule.find(
                (b: any) => b.trainerId === trainer.id && b.date === formattedDate && b.rawTime === slot.start
            )
            return conflict ? { ...slot, isBooked: true, bookedBy: conflict.student } : slot
        })
    }

    const DAY_LABELS = locale === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
    const editMonthStart = startOfMonth(dialogMonth)
    const editStartOffset = (getDay(editMonthStart) + 6) % 7
    const editTotalDays = getDaysInMonth(editMonthStart)
    const editCalendarDays: (Date | null)[] = [
        ...Array(editStartOffset).fill(null),
        ...Array.from({ length: editTotalDays }, (_, i) => addDays(editMonthStart, i)),
    ]
    while (editCalendarDays.length % 7 !== 0) editCalendarDays.push(null)

    // New cancellation & refund flow
    const [isCancellationFlowOpen, setIsCancellationFlowOpen] = React.useState(false)
    const [cancelScope, setCancelScope] = React.useState<"single" | "future">("future")
    const [targetSessionIds, setTargetSessionIds] = React.useState<number[]>([])
    const { cancellations, refunds, refresh: refreshCancellation } = useCancellationState(orderId)

    if (!order) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    const openCancelFlow = (scope: "single" | "future", sessionIds: number[]) => {
        setCancelScope(scope)
        setTargetSessionIds(sessionIds)
        setIsCancellationFlowOpen(true)
    }

    const handleOpenReschedule = (session: any) => {
        setRescheduleSession(session)

        let d = new Date()
        if (session.date) {
            try {
                // try parsing existing date
                const pDate = new Date(session.date)
                if (!isNaN(pDate.getTime()) && !isBefore(pDate, startOfDay(new Date()))) {
                    d = pDate
                }
            } catch (e) { }
        }

        setRescheduleDate(undefined)
        setDialogMonth(startOfMonth(new Date()))
        setRescheduleTime("")
        setRescheduleReason("")
        setRescheduleNote("")
        setIsRescheduleOpen(true)
    }

    const handleReschedule = () => {
        if (!rescheduleSession || !rescheduleDate || !rescheduleTime || !rescheduleReason) {
            toast.error("Pilih tanggal, jam baru, dan isi alasan reschedule terlebih dahulu")
            return
        }

        const finalReason = rescheduleReason === 'Lainnya' && rescheduleNote.trim() 
            ? `Lainnya: ${rescheduleNote.trim()}` 
            : rescheduleReason;

        const formattedDate = format(rescheduleDate, "d MMM yyyy", { locale: idLocale })
        const availableSlots = getAvailableSlotsForDate(rescheduleDate)
        const slot = availableSlots.find(s => s.start === rescheduleTime)
        const fullTime = slot ? `${slot.start} - ${slot.end}` : rescheduleTime

        setSessionDetails(prev => {
            const updated = prev.map(s =>
                s.id === rescheduleSession.id
                    ? { ...s, date: formattedDate, time: fullTime, status: 'scheduled' as const, isRescheduled: true, rescheduleReason: finalReason, rescheduledDate: formattedDate, rescheduledTime: fullTime }
                    : s
            )

            try {
                const savedOrders = JSON.parse(localStorage.getItem('updated_orders_details') || '{}')
                savedOrders[order.id] = { ...order, sessionDetails: updated }
                localStorage.setItem('updated_orders_details', JSON.stringify(savedOrders))
            } catch (e) {
                console.error("Gagal menyimpan detail pesanan", e)
            }

            // Sync to teacher_requests for students-page-detail
            try {
                const savedRequests = localStorage.getItem('teacher_requests');
                if (savedRequests) {
                    const reqs = JSON.parse(savedRequests);
                    const reqId = order.id.replace('ORD-', '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    const reqIndex = reqs.findIndex((r: any) => {
                        const rid = String(r.transactionId || r.id).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        return rid === reqId;
                    });

                    if (reqIndex >= 0) {
                        const sessionIndex = rescheduleSession.id - 1;
                        if (reqs[reqIndex].slots && reqs[reqIndex].slots[sessionIndex]) {
                            reqs[reqIndex].slots[sessionIndex] = {
                                ...reqs[reqIndex].slots[sessionIndex],
                                isRescheduled: true,
                                rescheduleReason: finalReason,
                                rescheduledDate: formattedDate,
                                rescheduledTime: fullTime,
                                d: formattedDate,
                                t: fullTime
                            };
                            localStorage.setItem('teacher_requests', JSON.stringify(reqs));
                        }
                    }
                }
            } catch (e) {
                console.error("Gagal sync reschedule ke teacher_requests", e)
            }

            return updated
        })
        toast.success(`Jadwal ${rescheduleSession.title} berhasil diubah ke ${formattedDate}`)
        setIsRescheduleOpen(false)
        setRescheduleSession(null)
    }

    const handleConfirmSession = () => {
        if (confirmSessionId !== null) {
            const updated = sessionDetails.map(s =>
                s.id === confirmSessionId ? { ...s, status: "completed" as const } : s
            )
            setSessionDetails(updated)

            // Persist to localStorage
            try {
                const savedOrders = JSON.parse(localStorage.getItem('updated_orders_details') || '{}')
                savedOrders[order.id] = { ...order, sessionDetails: updated }
                localStorage.setItem('updated_orders_details', JSON.stringify(savedOrders))
            } catch (e) {
                console.error("Gagal menyimpan konfirmasi sesi", e)
            }

            // Sync back to teacher_requests
            try {
                const savedRequests = localStorage.getItem('teacher_requests')
                if (savedRequests) {
                    const reqs = JSON.parse(savedRequests)
                    const reqId = order.id.replace('ORD-', '')
                    const reqIndex = reqs.findIndex((r: any) => (r.transactionId || r.id)?.toString() === reqId)
                    if (reqIndex >= 0) {
                        const confSession = sessionDetails.find(s => s.id === confirmSessionId)
                        const sessionIndex = confirmSessionId - 1
                        if (confSession && reqs[reqIndex].slots?.[sessionIndex]) {
                            reqs[reqIndex].slots[sessionIndex].studentConfirmed = true
                            localStorage.setItem('teacher_requests', JSON.stringify(reqs))
                        }
                    }
                }
            } catch (e) {
                console.error("Gagal sync konfirmasi ke teacher_requests", e)
            }

            setConfirmSessionId(null)
            toast.success("Sesi berhasil dikonfirmasi!", { description: "Terima kasih telah mengonfirmasi penyelesaian sesi ini." })
        }
    }

    const handleReviewSubmit = (rating: number, comment: string, isRecommended?: boolean, recommendationText?: string) => {
        if (order) {
            const res = submitReview({
                bookingId: order.id,
                courseId: order.packageId || 'course-default',
                teacherId: order.trainerId,
                studentName: profile?.name || 'Andi (Murid)',
                rating,
                comment,
                createdAt: new Date().toISOString(),
                isRecommended,
                recommendationText
            });
            if (res.success) {
                toast.success("Ulasan terkirim!", { description: "Terima kasih atas ulasan yang Anda berikan." })
                setIsReviewModalOpen(false)
            } else {
                toast.error(res.message || "Gagal mengirim ulasan.")
            }
        }
    }

    const handleViewDetail = (session: any) => {
        // Try to enrich session with teacher-saved notes/photo from localStorage
        let enriched = { ...session };
        try {
            // Get session index (0-based) from session id or num
            const sessionIndex = (session.num !== undefined ? session.num : parseInt(session.id?.split('-').pop() || '1')) - 1;

            // Read from teacher_requests first - coba berbagai format key untuk match orderId
            const savedReqs = localStorage.getItem('teacher_requests');
            if (savedReqs) {
                const reqs = JSON.parse(savedReqs);

                // Coba match dengan berbagai format orderId
                const rawOrderId = String(order.id);
                const cleanOrderId = rawOrderId.replace(/^INV-/i, '').replace(/^ORD-QRN-/i, '').replace(/^ORD-/i, '').replace(/^QRN-/i, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                const req = reqs.find((r: any) => {
                    // Match by transactionId
                    if (r.transactionId) {
                        const cleanTx = String(r.transactionId).replace(/^INV-/i, '').replace(/^ORD-QRN-/i, '').replace(/^ORD-/i, '').replace(/^QRN-/i, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        if (cleanTx === cleanOrderId || String(r.transactionId) === rawOrderId) return true;
                    }
                    // Match by raw id
                    const rid = String(r.id).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                    return rid === cleanOrderId || String(r.id) === rawOrderId;
                });

                if (req && req.slots && req.slots[sessionIndex]) {
                    const slot = req.slots[sessionIndex];
                    enriched = {
                        ...enriched,
                        uploadedPhoto: slot.uploadedPhoto || enriched.uploadedPhoto || null,
                        notes: slot.notes || enriched.notes || '',
                        meetingPlatform: slot.meetingPlatform || enriched.meetingPlatform || '',
                        meetingId: slot.meetingId || enriched.meetingId || '',
                        meetingPassword: slot.meetingPassword || enriched.meetingPassword || '',
                        videoConferenceUrl: slot.link || enriched.videoConferenceUrl || '',
                        isRescheduled: slot.isRescheduled !== undefined ? slot.isRescheduled : enriched.isRescheduled,
                        rescheduleReason: slot.rescheduleReason || enriched.rescheduleReason || '',
                        rescheduledDate: slot.rescheduledDate || enriched.rescheduledDate || '',
                        rescheduledTime: slot.rescheduledTime || enriched.rescheduledTime || '',
                    };
                    // Juga simpan alamat dari request jika mode offline
                    if (!enriched.address) {
                        enriched.address = req.address || req.detailAddress || req.location || '';
                    }
                }

                // TIDAK GABUNGKAN DENGAN BLOCK IKUT MEMBACA teacher_session_notes UNTUK MENGHINDARI TULISAN KOSONG
                // BACA KELOMPOK NOTE YANG DIBACA TERAKHIR SAJA UNTUK PERFORMA KONSISTEN
            }

            // Also check teacher_session_notes (keyed by orderId and sessionIndex)
            const sessionNotesRaw = localStorage.getItem('teacher_session_notes');
            if (sessionNotesRaw) {
                const sessionNotes = JSON.parse(sessionNotesRaw);
                const rawOrderId = String(order.id);

                // Coba berbagai format key
                const cleanId = rawOrderId.replace(/^INV-/i, '').replace(/^ORD-QRN-/i, '').replace(/^ORD-/i, '').replace(/^QRN-/i, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const note = sessionNotes[cleanId]?.[sessionIndex]
                    ?? sessionNotes[rawOrderId]?.[sessionIndex]
                    ?? sessionNotes[`ORD-QRN-${cleanId}`]?.[sessionIndex]
                    ?? null;
                if (note !== null && note !== undefined) {
                    enriched = { ...enriched, notes: note };
                }
            }
        } catch (_) { }

        setSelectedDetailSession(enriched);
        setIsDetailDialogOpen(true);
    }

    const isPastSchedule = (session: any) => {
        if (!session) return false;
        if (session.status !== "scheduled") return false;

        if (!session.date || !session.time) return false;
        try {
            const dateStr = session.date;
            const timeStr = session.time.split(" - ")[0];
            const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
            const parts = dateStr.split(" ");
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                let monthIdx = months.findIndex(m => m.toLowerCase() === parts[1].toLowerCase() || parts[1].toLowerCase().startsWith(m.toLowerCase()));
                if (monthIdx === -1) {
                    const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    monthIdx = enMonths.findIndex(m => parts[1].toLowerCase().startsWith(m.toLowerCase()));
                }
                if (monthIdx === -1) monthIdx = 0;
                const year = parseInt(parts[2]);
                const [hours, minutes] = timeStr.split(":").map(Number);
                const sessionDate = new Date(year, monthIdx, day, hours, minutes);
                return isBefore(sessionDate, new Date());
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    const orderStatusConfig = getOrderStatusConfig(order.status)
    const completedCount = sessionDetails.filter(s => s.status === 'completed').length
    const progressPercent = Math.round((completedCount / order.sessions) * 100)

    return (
        <div className="min-h-screen bg-transparent font-sans">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => router.back()}
                            className="shrink-0 mt-0.5 sm:mt-0 h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-tight">Detail Pesanan</h1>
                                <span className={cn("shrink-0 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg", orderStatusConfig.bg, orderStatusConfig.text)}>
                                    <span className={cn("shrink-0 w-1.5 h-1.5 rounded-full", orderStatusConfig.dot)} />
                                    {orderStatusConfig.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="text-xs sm:text-sm font-medium text-gray-500">No. Invoice</span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                                    {order.id.startsWith("INV") ? order.id : `INV-${order.id.split('-').pop()}`}
                                </span>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(order.id.startsWith("INV") ? order.id : `INV-${order.id.split('-').pop()}`);
                                        toast.success("Nomor invoice berhasil disalin!");
                                    }}
                                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 transition-colors ml-1"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span className="text-sm font-medium">Salin</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!(order.status === "pending" || order.status === "waiting_payment") && (
                            <Link href={`/${locale}/orders/${order.id}/invoice`} target="_blank">
                                <Button variant="outline" className="h-9 px-5 rounded-xl border-gray-200 text-gray-600 font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all gap-2">
                                    <Receipt className="w-4 h-4" />
                                    Lihat Invoice
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
                    <div className="space-y-6">
                        {(order.status === "waiting_approval" || order.status === "pending" || order.status === "waiting_payment") ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                            <CalendarCheck className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900">Ringkasan Pemesanan</h3>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        {order.sessions} Pertemuan
                                    </span>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                        {sessionDetails.map((session, index) => (
                                            <div
                                                key={session.id}
                                                className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col gap-3 shadow-sm"
                                            >
                                                <div className="flex items-start justify-between mb-1">
                                                    <span className="text-sm font-bold text-gray-900 tracking-tight">Pertemuan {index + 1}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                        <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                                        <span>{session.date || "Jadwal belum ditentukan"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-1 rounded-lg">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs font-bold text-gray-600">{session.time?.split(" - ")[0] || "00:00"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Catatan</h4>
                                            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-600 italic font-medium">
                                                &quot;{order.notes || order.note || order.message || "Tidak ada catatan khusus dari murid."}&quot;
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mode</h4>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-xs w-fit">
                                                    {order.mode?.toLowerCase() === "offline" ? <User className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                                                    <span className="uppercase">{order.mode}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {order.mode?.toLowerCase() === "offline" && order.address && (
                                                    <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                                                        {order.offlineLocationType && (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                                {order.offlineLocationType === "student" ? "Guru datang ke lokasi Anda" : "Anda datang ke lokasi guru"}
                                                            </span>
                                                        )}
                                                        <div className="flex items-start gap-2">
                                                            <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                                            <span className="text-xs font-medium text-emerald-800">{order.address}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : order.status !== "rejected" && (
                            <>
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                <BookOpen className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <span className="text-base font-bold text-gray-900">Progress Belajar</span>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600">{completedCount}/{order.sessions} Selesai</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mt-2">{progressPercent}% perjalanan belajar selesai</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900">Jadwal Belajar</h3>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                            {order.sessions} Pertemuan
                                        </span>
                                    </div>

                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {sessionDetails.map((session) => {
                                            const cfg = getSessionStatusConfig(session.status)
                                            return (
                                                <div
                                                    key={session.id}
                                                    className={cn(
                                                        "rounded-xl border p-4 flex flex-col justify-between gap-3 transition-all duration-300 shadow-sm",
                                                        cfg.cardBg
                                                    )}
                                                >
                                                    <div className="flex items-start justify-between mb-1">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-sm font-bold text-gray-900 tracking-tight">{session.title}</span>
                                                            <span className={cn(
                                                                "inline-flex items-center w-fit gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                                                                session.status === "completed"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : session.status === "cancelled"
                                                                        ? "bg-red-100 text-red-600"
                                                                        : "bg-blue-100 text-blue-700"
                                                            )}>
                                                                {session.status === "completed"
                                                                    ? "Selesai"
                                                                    : session.status === "cancelled"
                                                                        ? "Dibatalkan"
                                                                        : "Terjadwal"}
                                                            </span>
                                                        </div>
                                                        {session.status === "cancelled" && (cancellations.find(c => c.sessionIds.includes(session.id))?.type === "single") ? (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                                                                    <DropdownMenuItem
                                                                        className="text-xs font-medium cursor-pointer gap-2 text-gray-700 focus:text-gray-900 focus:bg-gray-50"
                                                                        onClick={() => {
                                                                            // Temukan cancellation yang sesuai dengan sesi ini
                                                                            const relatedCancel = cancellations.find(c => c.sessionIds.includes(session.id)) || cancellations[cancellations.length - 1] || null
                                                                            setSelectedCancellation(relatedCancel)
                                                                            setSelectedRefund(relatedCancel ? (refunds.find(r => r.cancellationId === relatedCancel.id) || null) : null)
                                                                            setIsDetailModalOpen(true)
                                                                        }}
                                                                    >
                                                                        <FileText className="w-3.5 h-3.5" /> Rincian Pembatalan
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : (session.status === "scheduled") && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-auto min-w-[160px] rounded-xl shadow-lg border-gray-100">
                                                                    <DropdownMenuItem
                                                                        className="text-xs font-semibold cursor-pointer gap-2.5 py-2.5 text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                                                                        onClick={() => handleOpenReschedule(session)}
                                                                    >
                                                                        <CalendarIcon className="w-3.5 h-3.5" /> Jadwal Ulang
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-xs font-semibold cursor-pointer gap-2.5 py-2.5 text-red-500 focus:text-red-600 focus:bg-red-50 mt-1"
                                                                        onClick={() => openCancelFlow("single", [session.id])}
                                                                    >
                                                                        <XCircleIcon className="w-3.5 h-3.5" /> Batalkan Sesi Ini
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-3 mt-1 mb-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                                <CalendarIcon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                                                <span>{session.date || "Jadwal belum ditentukan"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2 py-1 rounded-lg">
                                                                <Clock className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs font-bold text-gray-600">{session.time?.split(" - ")[0] || "00:00"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                className="w-auto px-6 h-8 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewDetail(session);
                                                                }}
                                                            >
                                                                Detail
                                                            </Button>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Riwayat Pembatalan dihapus — akses detail via dropdown titik tiga pada kartu sesi yang dibatalkan */}

                        {order.status === "rejected" && (
                            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mb-2">
                                    <XCircleIcon className="w-10 h-10 text-rose-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Pesanan Ditolak</h3>
                                    <div className="max-w-md mx-auto p-5 bg-rose-50/50 rounded-2xl border border-rose-100">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">Alasan Penolakan</p>
                                        <p className="text-base font-bold text-rose-600 italic">
                                            &quot;{order.rejectionReason || "Guru sedang berhalangan saat ini"}&quot;
                                        </p>
                                    </div>
                                </div>
                                <p className="text-slate-500 font-medium text-sm">
                                    Dana telah dikembalikan ke <span className="text-emerald-600 font-bold">Qurani Wallet</span> Anda.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-5 sticky top-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-20 bg-gradient-to-br from-emerald-500 to-emerald-600" />
                            <div className="px-5 pb-5">
                                <div 
                                    className="flex items-end gap-4 -mt-9 mb-4 cursor-pointer group w-fit"
                                    onClick={() => router.push(`/${locale}/teachers/${order.trainerId}`)}
                                >
                                    <div className="w-[72px] h-[72px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 shrink-0 transition-transform group-hover:scale-105">
                                        <Avatar className="w-full h-full">
                                            <AvatarImage src={order.trainerAvatar} className="object-cover" />
                                            <AvatarFallback className="text-xl font-bold">{order.trainerName[0]}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div 
                                    className="space-y-0.5 cursor-pointer group w-fit"
                                    onClick={() => router.push(`/${locale}/teachers/${order.trainerId}`)}
                                >
                                    <h2 className="text-base font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">{order.trainerName}</h2>
                                    <p className="text-[11px] font-bold text-emerald-600 tracking-tight">@{order.trainerName.toLowerCase().replace("ustadzah ", "").replace("ustadz ", "").replace(/\s+/g, "_")}</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {(order.features || []).map((feature: string, idx: number) => (
                                        <span key={idx} className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                                        <Button
                                            disabled={order.status === "rejected"}
                                            variant="outline"
                                            className={cn("w-full h-10 rounded-xl font-bold text-sm gap-2 transition-all",
                                                order.status === "rejected" ? "bg-gray-100 text-gray-400 border-gray-200" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (order.status !== "rejected") {
                                                    setIsChatDialogOpen(true);
                                                }
                                            }}
                                        >
                                            {order.status === "rejected" ? (
                                                <>
                                                    <MessageSquare className="w-4 h-4" />
                                                    Chat Dinonaktifkan
                                                </>
                                            ) : (
                                                <>
                                                    <MessageSquare className="w-4 h-4" />
                                                    Chat Guru
                                                </>
                                            )}
                                        </Button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-emerald-600" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Ringkasan Pembayaran</h3>
                            </div>
                            <div className="px-5 py-4 space-y-3">
                                {(() => {
                                    const cancelledCount = sessionDetails.filter(s => (s as any).status === 'cancelled').length;
                                    const pricePerSession = order.sessions > 0 ? Math.floor(order.price / order.sessions) : 0;
                                    const refundAmount = cancelledCount * pricePerSession;
                                    const adjustedTotal = order.price - refundAmount;
                                    return (
                                        <>
                                            {!(order.status === "pending" || order.status === "waiting_payment") && (
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 font-medium">Metode Bayar</span>
                                                    <span className="text-xs font-bold text-gray-800">{order.paymentMethod}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">Paket</span>
                                                <span className="text-xs font-bold text-gray-800 text-right max-w-[140px]">{order.packageName}</span>
                                            </div>
                                            <Separator className="bg-gray-100" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">Harga Paket</span>
                                                <span className="text-xs font-semibold text-gray-700">Rp {order.subtotal.toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">Pajak (12%)</span>
                                                <span className="text-xs font-semibold text-gray-700">Rp {order.tax.toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-500 font-medium">Biaya Layanan</span>
                                                <span className="text-xs font-semibold text-emerald-600">Gratis</span>
                                            </div>
                                            {cancelledCount > 0 && (
                                                <div className="flex items-center justify-between bg-red-50 -mx-5 px-5 py-2 border-t border-b border-red-100">
                                                    <div>
                                                        <span className="text-xs text-red-600 font-bold">Refund ({cancelledCount} Sesi)</span>
                                                        <p className="text-[10px] text-red-400 font-medium mt-0.5">Rp {pricePerSession.toLocaleString("id-ID")} × {cancelledCount}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-red-600">- Rp {refundAmount.toLocaleString("id-ID")}</span>
                                                </div>
                                            )}
                                            <Separator className="bg-gray-100" />
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-sm font-bold text-gray-900">Total</span>
                                                <div className="text-right">
                                                    {cancelledCount > 0 && (
                                                        <p className="text-[10px] text-gray-400 line-through font-medium">Rp {order.price.toLocaleString("id-ID")}</p>
                                                    )}
                                                    <span className="text-lg font-black text-emerald-600">Rp {adjustedTotal.toLocaleString("id-ID")}</span>
                                                </div>
                                            </div>
                                            {(order.status === "pending" || order.status === "waiting_payment") && (
                                                <div className="pt-3 border-t border-gray-100 mt-2">
                                                    <Button
                                                        className="w-full h-10 rounded-xl font-bold text-sm shadow-md transition-all"
                                                        variant="default"
                                                        onClick={() => {
                                                            sessionStorage.setItem('checkout_data', JSON.stringify({
                                                                packageId: order.packageId,
                                                                trainerId: order.trainerId,
                                                                mode: order.mode?.toLowerCase() === "online" ? 1 : 2,
                                                                offlineLocationType: order.offlineLocationType,
                                                                orderId: order.originalId || order.id,
                                                                bookings: order.slots?.map((s: any) => {
                                                                    const timeParts = s.t ? s.t.split(":") : ["00", "00"];
                                                                    return {
                                                                        scheduledDate: s.d,
                                                                        startTime: parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]),
                                                                        courseId: order.trainerId,
                                                                        mode: order.mode?.toLowerCase() === "online" ? 1 : 2,
                                                                        address: order.address
                                                                    };
                                                                }) || []
                                                            }));
                                                            router.push(`/${locale}/teachers/${order.trainerId}/checkouts`);
                                                        }}
                                                    >
                                                        Bayar Sekarang
                                                    </Button>
                                                </div>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>
                        </div>

                        {!(order.status === "pending" || order.status === "waiting_payment") && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Package className="w-4 h-4 text-blue-600" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">Info Pesanan</h3>
                            </div>
                            <div className="px-5 py-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Tanggal Pesan</span>
                                    <span className="text-xs font-semibold text-gray-800">
                                        {(() => {
                                            try {
                                                const d = new Date(order.date);
                                                if (!isNaN(d.getTime())) {
                                                    return format(d, "d MMMM yyyy", { locale: idLocale });
                                                }
                                                return order.date;
                                            } catch { return order.date; }
                                        })()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Total Sesi</span>
                                    <span className="text-xs font-semibold text-gray-800">{order.sessions} Pertemuan</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 font-medium">Sesi Selesai</span>
                                    <span className="text-xs font-semibold text-emerald-600">{completedCount} / {order.sessions}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-50 flex flex-col gap-2">
                                    {/* SECTION: Review Submission & Reorder */}
                                    {order.status === "completed" ? (
                                        <div className="flex gap-2">
                                            {existingReview ? (
                                                <>
                                                    <Button 
                                                        variant="outline" 
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={() => setIsReviewModalOpen(true)}
                                                    >
                                                        Lihat Ulasan
                                                    </Button>
                                                    <Button 
                                                        variant="default"
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/${locale}/teachers/${order.trainerId}?orderAgain=true`)
                                                        }}
                                                    >
                                                        Pesan Lagi
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button 
                                                        variant="outline" 
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/${locale}/teachers/${order.trainerId}?orderAgain=true`)
                                                        }}
                                                    >
                                                        Pesan Lagi
                                                    </Button>
                                                    <Button 
                                                        variant="default"
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={() => setIsReviewModalOpen(true)}
                                                    >
                                                        Nilai
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ) : order.status === "cancelled" ? (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 font-bold text-xs"
                                                onClick={() => {
                                                    const lastCancel = cancellations[cancellations.length - 1] || null
                                                    if (lastCancel) {
                                                        setSelectedCancellation(lastCancel)
                                                        setSelectedRefund(refunds.find(r => r.cancellationId === lastCancel.id) || null)
                                                        setIsDetailModalOpen(true)
                                                    }
                                                }}
                                            >
                                                <FileText className="w-3.5 h-3.5 mr-1.5" />
                                                Rincian
                                            </Button>
                                            <Button
                                                variant="default"
                                                className="flex-1 font-bold text-xs"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/${locale}/teachers/${order.trainerId}?orderAgain=true`);
                                                }}
                                            >
                                                Pesan Lagi
                                            </Button>
                                        </div>
                                    ) : (() => {
                                        // Hitung sesi yang masih terjadwal (belum dibatalkan)
                                        const scheduledSessions = sessionDetails.filter((s: any) => s.status === 'scheduled')
                                        const allSessionsCancelled = scheduledSessions.length === 0 && sessionDetails.some((s: any) => s.status === 'cancelled')

                                        if (allSessionsCancelled) {
                                            // Semua sesi dibatalkan → tampilkan Pesan Lagi + Rincian Pembatalan
                                            const lastCancel = cancellations[cancellations.length - 1] || null
                                            return (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 font-bold text-xs"
                                                        disabled={!lastCancel}
                                                        onClick={() => {
                                                            if (lastCancel) {
                                                                setSelectedCancellation(lastCancel)
                                                                setSelectedRefund(refunds.find(r => r.cancellationId === lastCancel.id) || null)
                                                                setIsDetailModalOpen(true)
                                                            }
                                                        }}
                                                    >
                                                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                                                        Rincian
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        className="flex-1 font-bold text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/${locale}/teachers/${order.trainerId}?orderAgain=true`)
                                                        }}
                                                    >
                                                        Pesan Lagi
                                                    </Button>
                                                </div>
                                            )
                                        }

                                        // Masih ada sesi terjadwal → tampilkan Batalkan Semua Sesi Mendatang
                                        return scheduledSessions.length > 0 ? (
                                            <Button
                                                variant="outline"
                                                className="w-full font-bold text-xs border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                                onClick={() => openCancelFlow("future", scheduledSessions.map((s: any) => s.id))}
                                            >
                                                <XCircleIcon className="w-3.5 h-3.5 mr-2" />
                                                Batalkan
                                            </Button>
                                        ) : null
                                    })()}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={confirmSessionId !== null} onOpenChange={(open) => !open && setConfirmSessionId(null)}>
                <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 gap-0 overflow-y-auto overflow-x-hidden max-h-[85vh] no-scrollbar">
                    <DialogHeader className="px-8 pt-8 pb-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Konfirmasi Selesai</DialogTitle>
                                <DialogDescription className="text-xs text-slate-500 mt-1 font-medium">
                                    Pastikan sesi mengaji telah dilaksanakan
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="px-8 py-6 space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            Apakah Anda yakin pertemuan ngaji ini telah selesai sesuai jadwal dan pelaksanaan? Konfirmasi ini akan menambah progress belajar Anda.
                        </p>

                        {(() => {
                            const confSession = sessionDetails.find(s => s.id === confirmSessionId);
                            if (!confSession) return null;
                            return (
                                <>
                                    {/* Meeting Link Info */}
                                    {confSession.videoConferenceUrl && (
                                        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4 space-y-1.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-1.5">
                                                <LinkIcon className="w-3 h-3" /> Link Pertemuan dari Guru
                                            </p>
                                            <div className="text-xs text-blue-700 font-medium space-y-0.5">
                                                <p><span className="font-bold">URL:</span> {confSession.videoConferenceUrl}</p>
                                                {confSession.meetingPlatform && <p><span className="font-bold">Platform:</span> {confSession.meetingPlatform}</p>}
                                                {confSession.meetingId && <p><span className="font-bold">ID:</span> {confSession.meetingId}</p>}
                                                {confSession.meetingPassword && <p><span className="font-bold">Password:</span> {confSession.meetingPassword}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Photo Proof */}
                                    {confSession.uploadedPhoto && (
                                        <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-1.5">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bukti Pertemuan (dari Guru)</p>
                                            <img src={confSession.uploadedPhoto} alt="Bukti Pertemuan" className="w-full max-h-40 object-contain rounded-xl border border-gray-200" />
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    <DialogFooter className="px-8 pb-8 flex gap-3">
                        <Button variant="outline" onClick={() => setConfirmSessionId(null)} className="flex-1 h-12 rounded-2xl border-slate-200 font-bold text-slate-600">
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirmSession}
                            variant="default"
                            className="flex-1 h-12 rounded-2xl font-bold shadow-lg"
                        >
                            Ya, Selesai
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {existingReview ? (
                <ViewReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    courseName={order?.packageName}
                    teacherName={order?.trainerName}
                    review={existingReview}
                />
            ) : (
                <SubmitReviewModal 
                    isOpen={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)} 
                    onSubmit={handleReviewSubmit}
                    courseName={order?.packageName}
                    teacherName={order?.trainerName}
                />
            )}

            {/* Chat Dialog Popup */}
            {order && (
                <ChatDialog
                    isOpen={isChatDialogOpen}
                    onClose={() => setIsChatDialogOpen(false)}
                    trainer={{
                        id: order.trainerId,
                        name: order.trainerName,
                        avatar: order.trainerAvatar
                    }}
                    locale={locale}
                />
            )}

            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                <DialogContent className="max-w-sm rounded-3xl border-none shadow-2xl bg-white p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="px-5 py-4 border-b border-gray-100 bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                <CalendarRange className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <DialogTitle className="text-lg font-bold text-gray-900 tracking-tight">Jadwal Ulang Sesi</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500 font-medium mt-0.5">
                                    {rescheduleSession?.title} — {order.trainerName}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 p-5 flex flex-col gap-6 overflow-y-auto bg-slate-50/30">
                        <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                Pilih Tanggal Baru
                            </p>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-black text-slate-800 dark:text-white capitalize">
                                    {format(dialogMonth, "MMMM yyyy", { locale: idLocale })}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setDialogMonth((prev) => subMonths(prev, 1))}
                                        disabled={isBefore(subMonths(dialogMonth, 1), startOfMonth(new Date()))}
                                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setDialogMonth((prev) => addMonths(prev, 1))}
                                        className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-1">
                                {DAY_LABELS.map((label) => (
                                    <div key={label} className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400 py-0.5">
                                        {label}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {editCalendarDays.map((date, i) => {
                                    if (!date) return <div key={`edit-empty-${i}`} />

                                    const isPast = isBefore(date, startOfDay(new Date()))
                                    const isUnavailable = isHoliday(date)
                                    const isToday = isSameDay(date, new Date())
                                    const isNewDateSelected = rescheduleDate && isSameDay(date, rescheduleDate)

                                    let isOriginalDate = false
                                    if (rescheduleSession?.date) {
                                        try {
                                            const pDate = new Date(rescheduleSession.date)
                                            if (!isNaN(pDate.getTime())) {
                                                isOriginalDate = isSameDay(date, pDate)
                                            }
                                        } catch (e) { }
                                    }

                                    const isDisabled = isPast || isUnavailable

                                    return (
                                        <button
                                            key={`edit-date-${i}`}
                                            disabled={isDisabled}
                                            onClick={() => {
                                                if (isDisabled) return
                                                setRescheduleDate(date)
                                                setRescheduleTime("")
                                            }}
                                            title={isUnavailable ? (getHolidayReason(date) || "Libur") : undefined}
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

                            {rescheduleDate && (
                                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 mt-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        {format(rescheduleDate, "EEEE, d MMMM yyyy", { locale: idLocale })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {rescheduleDate && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    Pilih Jam Baru
                                </p>

                                {(() => {
                                    const availableSlots = getAvailableSlotsForDate(rescheduleDate)
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
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{icon}</span>
                                                    <span className="text-sm font-semibold text-gray-700">{title}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {slotsArr.map((slot, idx) => {
                                                        const isSelected = rescheduleTime === slot.start
                                                        const isBooked = !!slot.isBooked
                                                        return (
                                                            <button
                                                                key={idx}
                                                                disabled={isBooked}
                                                                onClick={() => {
                                                                    if (isBooked) return
                                                                    setRescheduleTime(slot.start)
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

                        {(rescheduleDate && rescheduleTime) && (
                            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-4 mt-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Perubahan Jadwal</p>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                                            <span className="line-through">{rescheduleSession?.date} · {rescheduleSession?.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span>{format(rescheduleDate, "d MMM yyyy", { locale: idLocale })} · {rescheduleTime}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 pt-4 border-t border-emerald-100/50">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">Alasan Reschedule <span className="text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">Wajib</span></Label>
                                    <RadioGroup
                                        value={rescheduleReason}
                                        onValueChange={(val) => {
                                            setRescheduleReason(val)
                                            if (val !== 'Lainnya') setRescheduleNote("")
                                        }}
                                        className="flex flex-col gap-2 mt-2"
                                    >
                                        {['Ada keperluan mendadak', 'Sedang kurang sehat', 'Jadwal bentrok dengan kegiatan lain', 'Kendala teknis/koneksi', 'Lainnya'].map((reason, idx) => {
                                            const id = `reschedule-reason-${idx}`
                                            return (
                                                <div key={id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300 transition-all">
                                                    <RadioGroupItem value={reason} id={id} className="text-emerald-500 data-[state=checked]:border-emerald-500" />
                                                    <Label htmlFor={id} className="text-sm font-medium cursor-pointer text-gray-700 flex-1 leading-none">
                                                        {reason}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                    {rescheduleReason === 'Lainnya' && (
                                        <Textarea
                                            autoFocus
                                            placeholder="Catatan tambahan (opsional)..."
                                            className="min-h-[80px] mt-3"
                                            value={rescheduleNote}
                                            onChange={(e) => setRescheduleNote(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="px-5 py-4 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                            Batal
                        </Button>
                        <Button 
                            disabled={!rescheduleDate || !rescheduleTime || !rescheduleReason}
                            onClick={handleReschedule}
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── DIALOG DETAIL SESI ── */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="sm:max-w-4xl rounded-3xl border-none shadow-2xl p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="px-6 py-5 border-b border-gray-100 bg-white shrink-0 sticky top-0 z-10 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                <BookOpen className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-black text-gray-900 tracking-tight">
                                    {selectedDetailSession?.title || "Detail Pertemuan"}
                                </DialogTitle>
                                <DialogDescription className="text-sm font-semibold text-emerald-600 mt-0.5">
                                    {order.packageName}
                                </DialogDescription>
                            </div>
                        </div>
                        <div className={cn(
                            "px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-sm",
                            selectedDetailSession?.status === "completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                selectedDetailSession?.status === "cancelled" ? "bg-red-50 border-red-200 text-red-600" :
                                    "bg-blue-50 border-blue-200 text-blue-700"
                        )}>
                            {selectedDetailSession?.status === "completed" ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Selesai</>
                            ) : selectedDetailSession?.status === "cancelled" ? (
                                <><XCircleIcon className="w-3.5 h-3.5" /> Dibatalkan</>
                            ) : (
                                <><CalendarCheck className="w-3.5 h-3.5" /> Terjadwal</>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50/50 p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                            {/* Kiri: Jadwal & Pelaksanaan dan Informasi Pesanan */}
                            <div className="flex flex-col gap-6 lg:gap-8">
                                {/* Jadwal & Pelaksanaan & Link */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                                    <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <CalendarRange className="w-4 h-4 text-emerald-600" />
                                            <h3 className="text-sm font-bold text-gray-900">Jadwal & Pelaksanaan</h3>
                                        </div>
                                        {selectedDetailSession?.isRescheduled && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">Reschedule</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Guru</span>
                                            <div className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                                <Avatar className="w-6 h-6 border">
                                                    <AvatarImage src={order.trainerAvatar} />
                                                    <AvatarFallback>{order.trainerName[0]}</AvatarFallback>
                                                </Avatar>
                                                {order.trainerName}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Metode</span>
                                            <div className="text-sm font-bold text-emerald-600">
                                                {(order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline") ? "Offline" : "Online"}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tanggal</span>
                                            <div className="text-sm font-bold text-gray-700">
                                                {selectedDetailSession?.date || "-"}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Waktu</span>
                                            <div className="text-sm font-bold text-gray-700">
                                                {selectedDetailSession?.time ? `${selectedDetailSession.time} WIB` : "-"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Link / Location appended */}
                                    {/* Untuk mode offline: alamat selalu ditampilkan. Untuk online: hanya saat scheduled */}
                                    {((order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline") || selectedDetailSession?.status === "scheduled") && (
                                        <div className="pt-3 mt-3 border-t border-gray-50">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <LinkIcon className="w-3 h-3" />
                                                {(order.mode?.toLowerCase() === "offline" || order.method?.toLowerCase() === "offline") ? "Lokasi Pertemuan" : "Link Pertemuan"}
                                            </h4>
                                            {(order.mode?.toLowerCase() !== "offline" && order.method?.toLowerCase() !== "offline") ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Row 1: Platform | URL */}
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Platform</span>
                                                        <div className="p-2.5 rounded-xl border bg-gray-50/50 text-sm font-bold text-gray-700 h-[46px] flex items-center">
                                                            {selectedDetailSession?.meetingPlatform || teacherDefaults?.meetingPlatform || "-"}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">URL</span>
                                                        <div className={cn(
                                                            "p-2.5 rounded-xl border text-sm font-semibold flex items-center justify-between h-[46px]",
                                                            (selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl) ? "bg-emerald-50 border-emerald-100 text-blue-600" : "bg-gray-50 border-gray-100 text-gray-400"
                                                        )}>
                                                            {(selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl) ? (
                                                                <>
                                                                    <a href={selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-[85%]">
                                                                        {selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl}
                                                                    </a>
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(selectedDetailSession?.videoConferenceUrl || teacherDefaults?.videoConferenceUrl || "");
                                                                            toast.success("URL berhasil disalin");
                                                                        }}
                                                                        className="p-1.5 hover:bg-emerald-100 rounded-md transition-colors"
                                                                    >
                                                                        <Copy className="w-3.5 h-3.5 text-emerald-600" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="italic truncate">Belum disetting</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Row 2: Password | ID Pertemuan */}
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</span>
                                                        <div className="p-2.5 rounded-xl border bg-gray-50/50 text-sm font-bold text-gray-700 h-[46px] flex items-center">
                                                            {selectedDetailSession?.meetingPassword || teacherDefaults?.meetingPassword || "-"}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">ID Pertemuan</span>
                                                        <div className="p-2.5 rounded-xl border bg-gray-50/50 text-sm font-bold text-gray-700 h-[46px] flex items-center">
                                                            {selectedDetailSession?.meetingId || teacherDefaults?.meetingId || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Alamat</span>
                                                    <div className="p-3 rounded-xl border bg-gray-50 border-gray-100 text-sm font-medium text-gray-600">
                                                        {selectedDetailSession?.address || order.address || order.location || "Alamat disepakati secara privat."}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedDetailSession?.isRescheduled && selectedDetailSession?.rescheduleReason && (
                                        <div className="pt-3 mt-3 border-t border-gray-50">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <FileText className="w-3 h-3" />
                                                Alasan Reschedule
                                            </h4>
                                            <div className="p-3 rounded-xl border bg-orange-50 border-orange-100 text-sm font-medium text-orange-800 leading-relaxed">
                                                {selectedDetailSession.rescheduleReason}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Informasi Pesanan Snippet (Dipindah ke bawah Jadwal Pelaksanaan) */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                                        <Receipt className="w-4 h-4 text-emerald-600" />
                                        <h3 className="text-sm font-bold text-gray-900">Informasi Pesanan</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-500">ID Pesanan</span>
                                            <span className="text-xs font-bold text-gray-900">{order.id}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-500">Waktu Pemesanan</span>
                                            <span className="text-xs font-bold text-gray-900">{order.date || "-"}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                            <span className="text-xs font-semibold text-gray-500">Harga Paket</span>
                                            <span className="text-xs font-bold text-emerald-600">Rp {order.subtotal?.toLocaleString("id-ID") || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Hasil Pelaksanaan */}
                            <div className="flex flex-col gap-6 lg:gap-8">
                                {/* Hasil Pelaksanaan (Bukti + Catatan) */}
                                {(selectedDetailSession?.status === "completed" || selectedDetailSession?.status === "scheduled" || (selectedDetailSession && isPastSchedule(selectedDetailSession) && selectedDetailSession.status !== "completed") || selectedDetailSession?.notes) && (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5 h-full">
                                        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
                                            <FileText className="w-4 h-4 text-emerald-600" />
                                            <h3 className="text-sm font-bold text-gray-900">Hasil Pelaksanaan</h3>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {selectedDetailSession?.recapId && (
                                                <Button
                                                    variant="default"
                                                    className="w-full font-bold h-11 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                                                    onClick={() => router.push(`/${locale}/recitation/recap/${selectedDetailSession.recapId}`)}
                                                >
                                                    <BookOpen className="w-5 h-5" />
                                                    Lihat Hasil Penilaian
                                                </Button>
                                            )}
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bukti Foto</span>
                                                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-2 flex justify-center min-h-[160px]">
                                                    {selectedDetailSession?.uploadedPhoto ? (
                                                        <img
                                                            src={selectedDetailSession.uploadedPhoto}
                                                            alt="Bukti Pertemuan"
                                                            className="w-full max-h-[300px] object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity shadow-sm"
                                                            onClick={() => setLightboxPhoto(selectedDetailSession.uploadedPhoto)}
                                                        />
                                                    ) : (
                                                        <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                                                            <FileText className="w-8 h-8 mb-2 text-gray-300" />
                                                            <span className="text-xs font-semibold text-center">Guru belum<br />mengunggah bukti</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3 sticky bottom-0 z-10">
                        <Button
                            onClick={() => setIsDetailDialogOpen(false)}
                            variant="default"
                            className="px-8 h-10 rounded-xl font-bold"
                        >
                            Kembali
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Lightbox Photo Preview */}
            {lightboxPhoto && (
                <div
                    className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => {
                        const closeBtn = document.getElementById("lightbox-close-btn");
                        if (closeBtn) closeBtn.click();
                    }}
                >
                    <button
                        id="lightbox-close-btn"
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                        onClick={() => setLightboxPhoto(null)}
                    >
                        <span className="text-xl font-bold">✕</span>
                    </button>
                    <img
                        src={lightboxPhoto}
                        alt="Bukti Pertemuan"
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
            {/* ── NEW: Cancellation & Refund Flow ── */}
            {order && (
                <CancellationRefundFlow
                    isOpen={isCancellationFlowOpen}
                    onClose={() => setIsCancellationFlowOpen(false)}
                    order={order}
                    cancelScope={cancelScope}
                    targetSessionIds={targetSessionIds}
                    onCancellationComplete={(result: any, refundResult: any) => {
                        // Refresh order from local storage so we get the accurate status and session changes
                        try {
                            const updatedOrders = JSON.parse(localStorage.getItem("updated_orders_details") || "{}")
                            if (updatedOrders[order.id]) {
                                setOrder(updatedOrders[order.id])
                                setSessionDetails(updatedOrders[order.id].sessionDetails || [])
                            }
                        } catch (e) {
                            // fallback if local storage failed
                            const isAllCancelled = order.sessionDetails?.filter((s: any) => !result.sessionIds.includes(s.id) && s.status === 'scheduled').length === 0
                            setOrder((prev: any) => prev ? {
                                ...prev,
                                status: isAllCancelled ? "cancelled" : prev.status,
                                cancelReason: result.reason
                            } : prev)

                            setSessionDetails((prev: any[]) => prev.map(s =>
                                result.sessionIds.includes(s.id)
                                    ? { ...s, status: "cancelled" as const, cancelReason: result.reason }
                                    : s
                            ))
                        }

                        // Refresh cancellation state from localStorage
                        refreshCancellation()
                    }}
                />
            )}

            {/* View Cancellation Detail Modal */}
            <CancellationDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setTimeout(() => {
                        setSelectedCancellation(null)
                        setSelectedRefund(null)
                    }, 300)
                }}
                order={order}
                cancellation={selectedCancellation}
                refund={selectedRefund}
            />
        </div>
    )
}
