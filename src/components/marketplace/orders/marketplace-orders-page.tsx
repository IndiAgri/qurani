"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Search,
    ReceiptText,
    Calendar,
    MessageSquare,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    X,
    CreditCard,
    Star,
    History as LucideHistory,
    Ban as LucideBan,
    FileText,
    UserCog,
    Undo2,
    CalendarRange,
    Undo,
    Plus,
    ShoppingBag,
    Wallet,
    Box,
    Sparkles,
    Banknote,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CancellationRefundFlow, CancellationDetailModal, type CancellationResult, type RefundResult } from "@/components/marketplace/orders/cancellation-refund-flow"
import { ChatDialog } from "@/components/marketplace/chat-dialog"

import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { getInitials } from "@/utils/helpers/get-initials"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { fetchTimezones } from "@/utils/api/timezones/fetch"
import { TimezoneData } from "@/types/timezones"
import { getCourses } from "@/data/trainers-data"
import { SubmitReviewModal } from "@/components/marketplace/reviews/submit-review-modal"
import { ViewReviewModal } from "@/components/marketplace/reviews/view-review-modal"
import { submitReview, getReviewByBookingId } from "@/lib/booking"
import { marketplaceApi } from "@/lib/marketplace-api"

// Dummy Data untuk Pesanan — 4 status berbeda, 4 guru berbeda
const DUMMY_ORDERS = [
    {
        // STATUS: Menunggu Pembayaran — Nur Aisyah (ID 2, Tahsin)
        id: "ORD-1789973730001",
        orderId: "ORD-1789973730001",
        invoiceNo: "INV-1789973730001",
        date: "2026-04-15T09:00:00Z",
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
        id: "ORD-1789973730002",
        orderId: "ORD-1789973730002",
        invoiceNo: "INV-1789973730002",
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
        id: "ORD-1789973730003",
        orderId: "ORD-1789973730003",
        invoiceNo: "INV-1789973730003",
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
        id: "ORD-1789973730004",
        orderId: "ORD-1789973730004",
        invoiceNo: "INV-1789973730004",
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

// Komponen utama untuk halaman Daftar Pesanan, menampilkan status pesanan murid (aktif, selesai, batal).
export function MarketplaceOrdersPage() {
    const { profile, userId: authUserId } = useAuth()
    const { locale } = useI18n()
    const [activeTab, setActiveTab] = useState("all")

    const [searchQuery, setSearchQuery] = useState("")
    const [tempSearchQuery, setTempSearchQuery] = useState("")
    const [walletBalance, setWalletBalance] = useState(0)
    const [allOrders, setAllOrders] = useState<any[]>(
        [...DUMMY_ORDERS].sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            if (isNaN(dateA) && isNaN(dateB)) return 0
            if (isNaN(dateA)) return 1
            if (isNaN(dateB)) return -1
            return dateB - dateA
        })
    )

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedTx = localStorage.getItem('myqurani_mock_wallet_tx')
                const txs = savedTx ? JSON.parse(savedTx) : [
                    { type: "topup", amount: 250000, status: "success" },
                    { type: "topup", amount: 500000, status: "success" },
                    { type: "payment", amount: 125000, status: "success" },
                    { type: "transfer", amount: 100000, status: "success" },
                    { type: "refund", amount: 80000, status: "success" }
                ]

                const topup = txs.filter((t: any) => t.type === "topup" && t.status === "success").reduce((a: number, c: any) => a + c.amount, 0)
                const spent = txs.filter((t: any) => t.type === "payment" && t.status === "success").reduce((a: number, c: any) => a + c.amount, 0)
                const transfers = txs.filter((t: any) => t.type === "transfer" && t.status === "success").reduce((a: number, c: any) => a + c.amount, 0)
                const withdraws = txs.filter((t: any) => t.type === "withdraw" && t.status === "success").reduce((a: number, c: any) => a + c.amount, 0)
                const refunds = txs.filter((t: any) => t.type === "refund" && t.status === "success").reduce((a: number, c: any) => a + c.amount, 0)

                setWalletBalance((topup + refunds) - (spent + transfers + withdraws))
            } catch (e) {
                setWalletBalance(0)
            }

            // ── Seed dummy cancellation data untuk order yang sudah dibatalkan (ORD-1789973730002) ──
            // Hanya di-seed jika belum ada data untuk order tersebut
            try {
                const CANCELLATION_KEY = "qurani_cancellations"
                const REFUND_KEY = "qurani_refunds"
                const existingCancellations: any[] = JSON.parse(localStorage.getItem(CANCELLATION_KEY) || "[]")
                const hasDummyCancellation = existingCancellations.some((c: any) => c.orderId === "ORD-1789973730002" || c.orderId === "INV-1789973730002")

                if (!hasDummyCancellation) {
                    // Dummy cancellation — semua 4 sesi dibatalkan sekaligus
                    const dummyCancellation = {
                        id: "CXL-DUMMY-002",
                        orderId: "ORD-1789973730002",
                        sessionIds: [1, 2, 3, 4],
                        type: "future",
                        reason: "Kendala biaya",
                        note: "",
                        cancelledAt: "2026-08-05T10:30:00.000Z",
                        status: "success",
                    }
                    localStorage.setItem(CANCELLATION_KEY, JSON.stringify([...existingCancellations, dummyCancellation]))

                    // Dummy refund untuk cancellation tersebut
                    const existingRefunds: any[] = JSON.parse(localStorage.getItem(REFUND_KEY) || "[]")
                    const dummyRefund = {
                        id: "RFD-DUMMY-002",
                        orderId: "ORD-1789973730002",
                        cancellationId: "CXL-DUMMY-002",
                        amount: 179200, // full refund semua sesi
                        method: "qurani_wallet",
                        status: "success",
                        createdAt: "2026-08-05T10:31:00.000Z",
                    }
                    localStorage.setItem(REFUND_KEY, JSON.stringify([...existingRefunds, dummyRefund]))
                }
            } catch (_) { }
        }
    }, [])

    // Synchronize all orders from marketplaceApi (local storage + Supabase)
    React.useEffect(() => {
        let isMounted = true;
        async function loadOrders() {
            try {
                const orders = await marketplaceApi.getAllOrders();
                if (isMounted && orders.length > 0) {
                    setAllOrders(orders);
                }
            } catch (e) {
                console.error("Failed to load orders from marketplaceApi", e);
            }
        }
        loadOrders();
        return () => { isMounted = false; };
    }, []);

    // Timezones for resolving ID to IANA string
    const [timezones, setTimezones] = useState<TimezoneData[]>([])
    React.useEffect(() => {
        const loadTz = async () => {
            const res = await fetchTimezones()
            if (res.success && res.data) {
                setTimezones(res.data)
            }
        }
        loadTz()
    }, [])


    // Rating state
    const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)
    const [selectedOrderForRating, setSelectedOrderForRating] = useState<any>(null)
    const [ratingValue, setRatingValue] = useState(0)
    const [ratingComment, setRatingComment] = useState("")
    const [orderReviews, setOrderReviews] = useState<Record<string, { rating: number, comment: string }>>({})
    const [hoverRating, setHoverRating] = useState<{ orderId: string, rating: number } | null>(null)

    // SubmitReviewModal state (wired to booking.ts)
    const [isSubmitReviewOpen, setIsSubmitReviewOpen] = useState(false)
    const [selectedOrderForReview, setSelectedOrderForReview] = useState<any>(null)

    // ViewReviewModal state
    const [isViewReviewOpen, setIsViewReviewOpen] = useState(false)
    const [selectedOrderForViewReview, setSelectedOrderForViewReview] = useState<any>(null)

    // Chat Dialog state
    const [isChatDialogOpen, setIsChatDialogOpen] = useState(false)
    const [selectedTrainerForChat, setSelectedTrainerForChat] = useState<{ id: string, name: string, avatar: string } | null>(null)

    // Cancellation Flow state (CancellationRefundFlow)
    const [isCancellationFlowOpen, setIsCancellationFlowOpen] = useState(false)
    const [selectedOrderForCancellationFlow, setSelectedOrderForCancellationFlow] = useState<any>(null)

    // View cancellation detail state (CancellationDetailModal)
    const [isCancelDetailOpen, setIsCancelDetailOpen] = useState(false)
    const [selectedCancellationForDetail, setSelectedCancellationForDetail] = useState<CancellationResult | null>(null)
    const [selectedRefundForDetail, setSelectedRefundForDetail] = useState<RefundResult | null>(null)
    const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<any>(null)

    // Favourites state
    const [favoritedTeacherIds, setFavoritedTeacherIds] = useState<string[]>([])

    // Auto-refresh timer to update timeAgo
    const [now, setNow] = useState(new Date())
    React.useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [])

    // Load additional orders from localStorage
    React.useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('teacher_requests') || '[]')

        const mappedOrders = storedRequests
            .filter((req: any) => {
                const hasTrainer = req.trainerName || req.teacherName || (req.trainer && req.trainer.name);
                const isCurrentUser = !req.userId || req.userId === 'unknown' || !authUserId || req.userId === authUserId || req.userId === profile?.id;
                return hasTrainer && isCurrentUser;
            })
            .map((req: any) => {
                let status = req.status;
                if (req.status === "accepted" || req.status === "success" || req.status === "active") {
                    status = "success";
                } else if (req.status === "rejected") {
                    status = "rejected";
                } else if (req.status === "waiting_approval" || req.status === "pending") {
                    status = req.status;
                }

                const tName = req.trainerName || req.teacherName || req.trainer?.name || "Guru My Qurani";
                const tAvatar = req.trainerAvatar || req.teacherAvatar || req.trainer?.avatar || req.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=MQ";

                const rawId = req.id || req.transactionId;
                const orderId = rawId?.toString().startsWith('ORD-') || rawId?.toString().startsWith('INV-') ? rawId.toString() : `INV-${rawId}`;

                // Cari tanggal pemesanan: gunakan createdAt, timestamp, dateApplied, atau saat ini
                const bookingDate = req.createdAt || req.timestamp || req.dateApplied || new Date().toISOString()

                // Hasilkan struktur sessionDetails dari slots yang dipilih agar modal bisa membaca rentang waktunya (anti hardcode)
                const sessionsList = (req.slots || []).map((slot: any, index: number) => {
                    let formattedDate = slot.d || "TBD";
                    try {
                        if (slot.d) {
                            const dObj = new Date(slot.d);
                            if (!isNaN(dObj.getTime())) {
                                formattedDate = dObj.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
                            }
                        }
                    } catch (e) { }
                    return {
                        id: index + 1,
                        title: `Pertemuan ${index + 1}`,
                        status: "scheduled",
                        date: formattedDate,
                        time: slot.t || "00:00"
                    }
                });

                return {
                    id: orderId,
                    originalId: req.id,
                    transactionId: req.transactionId,
                    date: bookingDate,
                    trainerName: tName,
                    trainerAvatar: tAvatar,
                    packageName: req.duration || req.course || "Paket Sesi",
                    sessions: req.sessions || (req.duration?.includes('10x') ? 10 : req.duration?.includes('5x') ? 5 : 1),
                    price: typeof req.price === 'string' ? parseInt(req.price.replace(/[^\d]/g, '')) : req.price || 0,
                    status: status,
                    expiryDate: "Segera",
                    isLocal: true,
                    trainerId: req.trainerId || "1",
                    packageId: req.packageId || "single",
                    slots: req.slots || [],
                    sessionDetails: sessionsList, // <-- Tambahkan ini untuk simulasi baru
                    mode: req.method || req.mode || "Online",
                    offlineLocationType: req.offlineLocationType || null,
                    address: req.address || ""
                }
            })

        let combined = [...mappedOrders, ...DUMMY_ORDERS];

        // Hitung ulang harga untuk trainer 1 agar selalu up-to-date
        combined = combined.map(order => {
            if (String(order.trainerId) === "1") {
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
                    const foundPkg = allCourses.find((p: any) => p.id === order.packageId)
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

                        // Termasuk platform fee 12% untuk harga total order
                        const PLATFORM_FEE = Math.round(calculatedPrice * 0.12)
                        return { ...order, price: calculatedPrice + PLATFORM_FEE }
                    }
                } catch (e) { }
            }
            return order
        })

        // Apply any updates (like cancellation, reschedule) from updated_orders_details
        try {
            const savedOrdersDetails = JSON.parse(localStorage.getItem('updated_orders_details') || '{}');
            combined = combined.map(order => {
                if (savedOrdersDetails[order.id]) {
                    return { ...order, ...savedOrdersDetails[order.id] };
                }
                return order;
            });
        } catch (e) { }

        // Urutkan semua pesanan berdasarkan tanggal — terbaru di atas tanpa pengecualian
        const sortedOrders = combined.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (isNaN(dateA) && isNaN(dateB)) return 0;
            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;
            return dateB - dateA;
        });

        setAllOrders(sortedOrders);

        const savedFavs = localStorage.getItem('mq_favorites')
        if (savedFavs) {
            setFavoritedTeacherIds(JSON.parse(savedFavs))
        }
    }, [authUserId, profile?.id])

    const toggleFavorite = (teacherId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        let newFavs = [...favoritedTeacherIds]
        if (newFavs.includes(teacherId)) {
            newFavs = newFavs.filter(id => id !== teacherId)
            toast.success("Dihapus dari favorit")
        } else {
            newFavs.push(teacherId)
            toast.success("Ditambah ke favorit")
        }
        setFavoritedTeacherIds(newFavs)
        localStorage.setItem('mq_favorites', JSON.stringify(newFavs))
    }



    const handleOpenRating = (order: any, initialRating: number) => {
        setSelectedOrderForRating(order)
        setRatingValue(initialRating)
        setRatingComment(orderReviews[order.id]?.comment || "")
        setIsRatingDialogOpen(true)
    }

    const handleSubmitRating = () => {
        if (!selectedOrderForRating) return

        setOrderReviews(prev => ({
            ...prev,
            [selectedOrderForRating.id]: { rating: ratingValue, comment: ratingComment }
        }))
        setIsRatingDialogOpen(false)
        toast.success("Ulasan terkirim!", {
            description: "Terima kasih telah berbagi pengalaman belajarmu."
        })
    }

    const handleOpenSubmitReview = (order: any, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedOrderForReview(order)
        setIsSubmitReviewOpen(true)
    }

    const handleOpenViewReview = (order: any, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedOrderForViewReview(order)
        setIsViewReviewOpen(true)
    }

    const handleReviewSubmit = (rating: number, comment: string, isRecommended?: boolean, recommendationText?: string) => {
        if (!selectedOrderForReview) return
        submitReview({
            bookingId: selectedOrderForReview.id,
            courseId: selectedOrderForReview.packageId || selectedOrderForReview.trainerId,
            teacherId: selectedOrderForReview.trainerId,
            studentName: profile?.name || "Murid",
            rating,
            comment,
            createdAt: new Date().toISOString(),
            isRecommended,
            recommendationText
        })
        setIsSubmitReviewOpen(false)
        toast.success("Ulasan berhasil dikirim!", {
            description: "Terima kasih telah memberikan penilaian."
        })
    }

    const router = useRouter()

    const handleOpenChat = (order: any, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedTrainerForChat({
            id: order.trainerId,
            name: order.trainerName,
            avatar: order.trainerAvatar
        });
        setIsChatDialogOpen(true);
    }

    const handleOpenCancel = (order: any, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedOrderForCancellationFlow(order)
        setIsCancellationFlowOpen(true)
    }

    // Buka CancellationDetailModal untuk order yang sudah dibatalkan
    const handleViewCancellationDetail = (order: any, e: React.MouseEvent) => {
        e.stopPropagation()
        // Ambil cancellation data dari localStorage
        try {
            const allCancellations: CancellationResult[] = JSON.parse(localStorage.getItem("qurani_cancellations") || "[]")
            const allRefunds: RefundResult[] = JSON.parse(localStorage.getItem("qurani_refunds") || "[]")
            const orderCancellations = allCancellations.filter((c: any) => c.orderId === order.id)
            const lastCancel = orderCancellations[orderCancellations.length - 1] || null
            const lastRefund = lastCancel ? (allRefunds.find((r: any) => r.cancellationId === lastCancel.id) || null) : null
            setSelectedCancellationForDetail(lastCancel)
            setSelectedRefundForDetail(lastRefund)
            setSelectedOrderForDetail(order)
            setIsCancelDetailOpen(true)
        } catch (_) { }
    }

    const getIanaTimezone = (rawTzInput: string | number): string => {
        if (!rawTzInput) return "";

        let tzInput = String(rawTzInput);

        // Resolusi ID menjadi string nama timezone jika memungkinkan
        if (timezones.length > 0) {
            const found = timezones.find(t => String(t.id) === tzInput || t.code === tzInput || t.name === tzInput)
            if (found && (found.name || found.code)) {
                tzInput = found.name || found.code || tzInput
            }
        }

        let lower = tzInput.toLowerCase().replace(/[\s_/]+/g, '');
        // Direct IANA timezone strings (from API)
        if (lower.includes("america") && lower.includes("newyork")) return "America/New_York";
        if (lower.includes("asia") && lower.includes("jakarta")) return "Asia/Jakarta";
        if (lower.includes("asia") && lower.includes("makassar")) return "Asia/Makassar";
        if (lower.includes("asia") && lower.includes("jayapura")) return "Asia/Jayapura";
        if (lower.includes("asia") && lower.includes("riyadh")) return "Asia/Riyadh";
        // Keyword-based mapping for profile strings
        if (lower.includes("newyork") || lower.includes("new_york")) return "America/New_York";
        if (lower.includes("arab") || lower.includes("riyadh") || lower.includes("makkah")) return "Asia/Riyadh";
        if (lower.includes("jayapura") || lower.includes("wit")) return "Asia/Jayapura";
        if (lower.includes("bali") || lower.includes("wita") || lower.includes("makassar") || lower.includes("denpasar")) return "Asia/Makassar";
        if (lower.includes("malang") || lower.includes("jakarta") || lower.includes("wib") || lower.includes("surabaya")) return "Asia/Jakarta";
        // Try using it as a raw IANA tz directly
        try {
            Intl.DateTimeFormat(undefined, { timeZone: tzInput });
            return tzInput;
        } catch (e) {
            return "";
        }
    }

    const formatOrderDate = (dateStr: string, customTz?: string) => {
        try {
            let d = new Date(dateStr)
            let isInvalid = false

            if (isNaN(d.getTime())) {
                d = new Date()
                isInvalid = true
            }

            // Hitung selisih waktu secara manual untuk label khusus
            const diffMs = now.getTime() - d.getTime()
            const diffSec = Math.floor(diffMs / 1000)
            const diffMin = Math.floor(diffMs / 60000)
            const diffHour = Math.floor(diffMs / 3600000)
            const diffDay = Math.floor(diffMs / 86400000)

            let timeAgo: string
            if (isInvalid && dateStr.toLowerCase() === "baru saja") {
                timeAgo = "Baru Saja"
            } else if (isInvalid) {
                timeAgo = dateStr
            } else if (diffSec < 60) {
                // Kurang dari 1 menit → Baru Saja
                timeAgo = "Baru Saja"
            } else if (diffDay === 1) {
                // Tepat 1 hari yang lalu → Kemarin
                timeAgo = "Kemarin"
            } else {
                // Gunakan date-fns untuk selain itu, hapus prefix "sekitar " dan "lebih dari "
                timeAgo = formatDistanceToNow(d, { addSuffix: true, locale: idLocale })
                    .replace("sekitar ", "")
                    .replace("lebih dari ", "")
            }

            // Baca timezone langsung dari localStorage (paling up-to-date) dengan fallback ke profile state
            let storedTz = '';
            try {
                const stored = JSON.parse(localStorage.getItem('myqurani_auth') || '{}');
                storedTz = stored.timezone || '';
            } catch (_) { }
            const rawTz = customTz || storedTz || profile?.timezone || '';
            let tz = getIanaTimezone(rawTz) || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta'

            let exactDate = ""
            try {
                exactDate = new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: tz,
                    hour12: false
                }).format(d)
            } catch (err) {
                // Fallback jika timezone invalid dari Intl bawaan
                tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta'
                exactDate = new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: tz,
                    hour12: false
                }).format(d)
            }

            // Biarkan format id-ID default yang memisahkan tanggal dan waktu dengan koma, atau pastikan koma
            exactDate = exactDate.replace(' pukul ', ', ').replace('pukul', ', ')

            return { timeAgo, exactDate }
        } catch (e) {
            return { timeAgo: dateStr, exactDate: dateStr }
        }
    }

    const filteredOrders = allOrders
        .filter(order => {
            const matchesTab = activeTab === "all" || order.status === activeTab
            const trainerName = (order.trainerName || "").toLowerCase()
            const packageName = (order.packageName || "").toLowerCase()
            const orderId = (order.id || "").toLowerCase()
            const explicitOrderId = (order.orderId || "").toLowerCase()
            const invoiceNo = (order.invoiceNo || "").toLowerCase()
            const q = searchQuery.toLowerCase().trim()
            const matchesSearch = !q ||
                trainerName.includes(q) ||
                packageName.includes(q) ||
                orderId.includes(q) ||
                explicitOrderId.includes(q) ||
                invoiceNo.includes(q)
            return matchesTab && matchesSearch
        })
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            if (isNaN(dateA) && isNaN(dateB)) return 0
            if (isNaN(dateA)) return 1
            if (isNaN(dateB)) return -1
            return dateB - dateA // terbaru di atas tanpa pengecualian
        })

    const favoriteTeachers = allOrders.filter(order => favoritedTeacherIds.includes(order.trainerId))
        .filter((v, i, a) => a.findIndex(t => t.trainerId === v.trainerId) === i)

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    label: "Menunggu Pembayaran",
                    className: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/50",
                    icon: Clock
                }
            case "waiting_approval":
                return {
                    label: "Menunggu Persetujuan Guru",
                    className: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
                    icon: CalendarRange
                }
            case "active":
            case "accepted":
            case "success":
                return {
                    label: "Aktif",
                    className: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
                    icon: CheckCircle2
                }
            case "completed":
                return {
                    label: "Selesai",
                    className: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
                    icon: CheckCircle2
                }
            case "cancelled":
                return {
                    label: "Dibatalkan",
                    className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50",
                    icon: XCircle
                }
            case "rejected":
                return {
                    label: "Ditolak Guru",
                    className: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
                    icon: LucideBan
                }
            default:
                return {
                    label: status,
                    className: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800",
                    icon: Box
                }
        }
    }

    return (
        <div className="min-h-screen bg-transparent font-sans">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                <div className="mb-6 flex items-center gap-2.5">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pesanan Saya</h1>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 space-y-4">
                        {/* Marketplace-style Horizontal Scroll Filter (Desktop & Mobile) */}
                        <div className="-mx-4 px-4 pb-4 sticky top-[72px] z-10 bg-transparent backdrop-blur-md">
                            <div className="flex gap-2 h-auto p-0 bg-transparent justify-start overflow-x-auto no-scrollbar border-none rounded-none w-full">
                                {[
                                    { id: 'all', label: 'Semua' },
                                    { id: 'pending', label: 'Belum Bayar' },
                                    { id: 'waiting_approval', label: 'Menunggu Persetujuan' },
                                    { id: 'success', label: 'Aktif' },
                                    { id: 'completed', label: 'Selesai' },
                                    { id: 'cancelled', label: 'Dibatalkan' },
                                    { id: 'rejected', label: 'Ditolak' },
                                ].map((tab) => {
                                    // Hitung jumlah order untuk setiap tab
                                    const count = tab.id === 'all'
                                        ? allOrders.length
                                        : allOrders.filter(o => o.status === tab.id).length;
                                    const isActive = activeTab === tab.id;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap text-[13px] font-semibold transition-all border shrink-0 cursor-pointer select-none",
                                                isActive
                                                    ? "bg-emerald-700 border-emerald-700 text-white"
                                                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            )}
                                        >
                                            {tab.label}
                                            <span className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none shrink-0 transition-colors",
                                                isActive
                                                    ? "bg-emerald-800 text-white"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                            )}>
                                                {count}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="relative group w-full md:max-w-md">
                                <div className="flex w-full md:w-72 lg:w-96 h-11 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus-within:border-emerald-600 focus-within:ring-[3px] focus-within:ring-emerald-600/20 transition-all overflow-hidden bg-white dark:bg-gray-800/20">
                                    <div className="relative flex-1 h-full">
                                        <Input
                                            placeholder="Cari no. pesanan, no. invoice atau nama produk..."
                                            className="pr-8 h-full text-sm border-0 focus-visible:ring-0 bg-transparent rounded-none"
                                            value={tempSearchQuery}
                                            onChange={(e) => {
                                                setTempSearchQuery(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setSearchQuery(tempSearchQuery);
                                                } else if (e.key === 'Escape') {
                                                    setTempSearchQuery("");
                                                    setSearchQuery("");
                                                }
                                            }}
                                        />
                                        {tempSearchQuery && (
                                            <button
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 z-10"
                                                onClick={() => {
                                                    setTempSearchQuery("");
                                                    setSearchQuery("");
                                                }}
                                                aria-label="Clear filter"
                                            >
                                                <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                            </button>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => setSearchQuery(tempSearchQuery)}
                                        className="h-full px-4 border-0 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-0 flex-shrink-0 cursor-pointer"
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => {
                                    const status = getStatusConfig(order.status)
                                    return (
                                        <Card
                                            key={order.id}
                                            className={cn(
                                                "overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl group transition-all hover:shadow-md relative cursor-pointer p-0 gap-0"
                                            )}
                                            onClick={() => {
                                                router.push(`/${locale}/orders/${order.id}`);
                                            }}
                                        >
                                            <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between space-y-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 min-w-0">
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span
                                                                className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-500 hover:underline cursor-pointer transition-colors uppercase tracking-tight"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push(`/${locale}/orders/${order.id}`);
                                                                }}
                                                            >
                                                                {order.orderId || (order.id.startsWith("ORD") ? order.id : `ORD-${order.id.replace(/^(INV|ORD)-/, '')}`)}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-300 dark:text-slate-600 text-[10px] hidden sm:block">•</span>
                                                        <TooltipProvider delayDuration={0}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="text-[11px] text-slate-500 font-medium whitespace-nowrap cursor-help focus:outline-none hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                                                                    >
                                                                        {formatOrderDate(order.date, order.timezone).timeAgo}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p className="text-xs">{formatOrderDate(order.date, order.timezone).exactDate.replace(/\(.*\)/, '').trim()}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>

                                                <Badge className={cn("text-[10px] px-2.5 py-1 rounded-md shadow-none border font-semibold flex items-center gap-1.5", status.className)}>
                                                    {status.icon && <status.icon className="w-3 h-3" />}
                                                    {status.label}
                                                </Badge>
                                            </CardHeader>

                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex items-center gap-3 lg:gap-5">
                                                    <div className="flex flex-1 gap-3 lg:gap-4 items-center min-w-0">
                                                        <div
                                                            className="shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/${locale}/teachers/${order.trainerId}`);
                                                            }}
                                                        >
                                                            <Avatar className="h-12 w-12 lg:h-14 lg:w-14 rounded-full border border-slate-100 shadow-sm">
                                                                <AvatarImage src={order.trainerAvatar} className="object-cover" />
                                                                <AvatarFallback className="text-emerald-600 font-semibold text-sm">{order.trainerName?.[0]?.toUpperCase() || "G"}</AvatarFallback>
                                                            </Avatar>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3
                                                                className="font-semibold text-sm lg:text-base text-emerald-600 hover:text-emerald-700 hover:underline transition-all truncate leading-snug cursor-pointer inline-block"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.push(`/${locale}/teachers/${order.trainerId}`);
                                                                }}
                                                            >
                                                                {order.trainerName}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{order.packageName}</p>
                                                            <p className="text-xs text-slate-400">{order.sessions} Pertemuan | {order.mode || "Online"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">TOTAL BAYAR</p>
                                                        <p className="text-sm lg:text-base font-bold text-slate-900 dark:text-white leading-none">Rp {order.price.toLocaleString("id-ID")}</p>
                                                    </div>
                                                </div>
                                            </CardContent>

                                            <CardFooter className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-slate-800 flex flex-row items-center justify-end gap-3">
                                                {/* pending: Bayar (green outline) */}
                                                {order.status === 'pending' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            sessionStorage.setItem('checkout_data', JSON.stringify({
                                                                packageId: order.packageId,
                                                                trainerId: order.trainerId,
                                                                mode: order.mode?.toLowerCase() === "online" ? 1 : 2,
                                                                offlineLocationType: order.offlineLocationType,
                                                                orderId: order.originalId || order.id,
                                                                bookings: order.slots?.map((s: any) => {
                                                                    const timeParts = s.t ? s.t.split(":") : ["00", "00"]
                                                                    return {
                                                                        scheduledDate: s.d,
                                                                        startTime: parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]),
                                                                        courseId: order.trainerId,
                                                                        mode: order.mode?.toLowerCase() === "online" ? 1 : 2,
                                                                        address: order.address
                                                                    }
                                                                }) || []
                                                            }))
                                                            router.push(`/${locale}/teachers/${order.trainerId}/checkouts`)
                                                        }}
                                                    >
                                                        Bayar
                                                    </Button>
                                                )}

                                                {/* waiting_approval: Batalkan */}
                                                {order.status === 'waiting_approval' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                        onClick={(e) => handleOpenCancel(order, e)}
                                                    >
                                                        Batalkan
                                                    </Button>
                                                )}

                                                {/* success (aktif): Batalkan + Chat Guru OR Riwayat Pembatalan + Pesan Lagi */}
                                                {order.status === 'success' && (() => {
                                                    const scheduledSessions = (order.sessionDetails || []).filter((s: any) => s.status === 'scheduled')
                                                    const allCancelled = scheduledSessions.length === 0 && (order.sessionDetails || []).some((s: any) => s.status === 'cancelled')

                                                    if (allCancelled) {
                                                        // Semua sesi dibatalkan → Riwayat Pembatalan + Pesan Lagi
                                                        return (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleViewCancellationDetail(order, e)
                                                                    }}
                                                                >
                                                                    Riwayat Pembatalan
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                                    asChild
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Link href={`/${locale}/teachers/${order.trainerId}`}>Pesan Lagi</Link>
                                                                </Button>
                                                            </>
                                                        )
                                                    }

                                                    // Masih ada sesi aktif → Batalkan (buka modal) + Chat Guru
                                                    return (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                                onClick={(e) => handleOpenCancel(order, e)}
                                                            >
                                                                Batalkan
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                                onClick={(e) => handleOpenChat(order, e)}
                                                            >
                                                                Chat Guru
                                                            </Button>
                                                        </>
                                                    )
                                                })()}

                                                {/* completed + not reviewed: Pesan Lagi (left) + Nilai (right, green) */}
                                                {order.status === 'completed' && !getReviewByBookingId(order.id) && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            asChild
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Link href={`/${locale}/teachers/${order.trainerId}`}>Pesan Lagi</Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            onClick={(e) => handleOpenSubmitReview(order, e)}
                                                        >
                                                            Nilai
                                                        </Button>
                                                    </>
                                                )}

                                                {/* completed + already reviewed: Lihat Penilaian (left) + Pesan Lagi (right, green) */}
                                                {order.status === 'completed' && getReviewByBookingId(order.id) && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            onClick={(e) => handleOpenViewReview(order, e)}
                                                        >
                                                            Lihat Penilaian
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            asChild
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Link href={`/${locale}/teachers/${order.trainerId}`}>Pesan Lagi</Link>
                                                        </Button>
                                                    </>
                                                )}

                                                {/* cancelled: Rincian (left) + Pesan Lagi (right, green) */}
                                                {order.status === 'cancelled' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-gray-50 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            onClick={(e) => handleViewCancellationDetail(order, e)}
                                                        >
                                                            Rincian
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-xs px-3.5 h-8 cursor-pointer"
                                                            asChild
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Link href={`/${locale}/teachers/${order.trainerId}`}>Pesan Lagi</Link>
                                                        </Button>
                                                    </>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    )
                                })
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-32 h-32 bg-slate-100/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse" />
                                        <div className="relative text-slate-300 dark:text-slate-600">
                                            <ShoppingBag className="h-14 w-14" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-black mb-2 text-slate-900 dark:text-white">Belum Ada Pesanan</h2>
                                    <p className="text-slate-400 max-w-xs mb-8 font-medium text-xs leading-relaxed">
                                        Jangan biarkan keranjang belajarmu kosong. Cari ustadz favoritmu dan mulailah belajar sekarang juga!
                                    </p>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 px-8 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0" asChild>
                                        <Link href={`/${locale}/teachers`}>Mulai Belajar</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
                    <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                        <DialogHeader className="px-8 pt-8 pb-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                </div>
                                <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">Berikan Ulasan</DialogTitle>
                            </div>
                        </DialogHeader>
                        <div className="px-8 py-6 flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-3 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRatingValue(star)} className="transition-transform hover:scale-110 active:scale-90">
                                            <Star className={cn("w-10 h-10 transition-all", ratingValue >= star ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                placeholder="Apa yang membuat sesi ini berkesan?"
                                className="min-h-[120px] rounded-2xl border-gray-200 bg-gray-50/30 font-medium px-5 py-4 text-sm"
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="px-8 pb-8 flex gap-3">
                            <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)} className="flex-1 h-12 rounded-2xl font-bold">Batal</Button>
                            <Button onClick={handleSubmitRating} disabled={ratingValue === 0} className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-200">Kirim</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                {/* Submit Review Modal (Nilai) */}
                <SubmitReviewModal
                    isOpen={isSubmitReviewOpen}
                    onClose={() => setIsSubmitReviewOpen(false)}
                    onSubmit={handleReviewSubmit}
                    courseName={selectedOrderForReview?.packageName}
                    teacherName={selectedOrderForReview?.trainerName}
                />



                {/* View Review Modal (Lihat Penilaian) */}
                <ViewReviewModal
                    isOpen={isViewReviewOpen}
                    onClose={() => setIsViewReviewOpen(false)}
                    courseName={selectedOrderForViewReview?.packageName}
                    teacherName={selectedOrderForViewReview?.trainerName}
                    review={selectedOrderForViewReview ? getReviewByBookingId(selectedOrderForViewReview.id) || null : null}
                />

                {/* Cancellation Refund Flow (Batalkan pesanan aktif) */}
                {selectedOrderForCancellationFlow && (
                    <CancellationRefundFlow
                        isOpen={isCancellationFlowOpen}
                        onClose={() => setIsCancellationFlowOpen(false)}
                        order={selectedOrderForCancellationFlow}
                        cancelScope="future"
                        targetSessionIds={(
                            selectedOrderForCancellationFlow.sessionDetails || []
                        ).filter((s: any) => s.status === 'scheduled').map((s: any) => s.id)}
                        onCancellationComplete={(result: any, refundResult: any) => {
                            setIsCancellationFlowOpen(false)
                            // Update local state allOrders without refresh
                            try {
                                const savedOrdersDetails = JSON.parse(localStorage.getItem('updated_orders_details') || '{}');
                                setAllOrders(prev => prev.map(o => {
                                    if (o.id === selectedOrderForCancellationFlow?.id) {
                                        return { ...o, ...savedOrdersDetails[o.id] }
                                    }
                                    return o
                                }))
                            } catch (e) { }
                        }}
                    />
                )}

                {/* Cancellation Detail Modal (Rincian pembatalan order dibatalkan) */}
                <CancellationDetailModal
                    isOpen={isCancelDetailOpen}
                    onClose={() => setIsCancelDetailOpen(false)}
                    order={selectedOrderForDetail}
                    cancellation={selectedCancellationForDetail}
                    refund={selectedRefundForDetail}
                />

                {/* Chat Dialog Popup */}
                {selectedTrainerForChat && (
                    <ChatDialog
                        isOpen={isChatDialogOpen}
                        onClose={() => setIsChatDialogOpen(false)}
                        trainer={selectedTrainerForChat}
                        locale={locale}
                    />
                )}
            </div>
        </div>
    )
}
