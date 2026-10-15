"use client"

import { useState, Suspense, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { DUMMY_TRAINERS, getCourses } from "@/data/trainers-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft, ShieldCheck,
    Lock, CheckCircle2,
    Receipt, Wallet, CreditCard,
    Shield, Phone
} from "lucide-react"
import Script from "next/script"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id as idLocale, enUS as enLocale } from "date-fns/locale"
import { useI18n } from "@/components/providers/i18n-provider"
import { useAuth } from "@/components/providers/auth-provider"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { marketplaceApi, type MarketplaceOrder } from "@/lib/marketplace-api"

// Komponen utama untuk halaman Checkout, memproses pembayaran (termasuk dummy Midtrans/Dompet) setelah memilih jadwal.
export function MarketplaceCheckoutPage() {
    const { profile } = useAuth()
    const { locale, t } = useI18n()
    const dateLocale = locale === "en" ? enLocale : idLocale
    const router = useRouter()
    const searchParams = useSearchParams()

    const [selectedMethod, setSelectedMethod] = useState<'midtrans' | 'wallet'>('midtrans')
    const [userBalance, setUserBalance] = useState(0)

    useEffect(() => {
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

                setUserBalance(1500000 + (topup + refunds) - (spent + transfers + withdraws))
            } catch (e) {
                setUserBalance(1500000)
            }
        }
    }, [])

    const [checkoutData, setCheckoutData] = useState<{
        packageId?: string,
        trainerId?: string,
        bookings?: any[],
        _restore?: any,
        offlineLocationType?: string,
        orderId?: string | number
    }>({})

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const data = JSON.parse(sessionStorage.getItem('checkout_data') || '{}')
                setCheckoutData(data)
            } catch (e) {
                console.error("Failed to parse checkout_data", e)
            }
        }
    }, [])

    const params = useParams()
    const trainerIdFromUrl = params?.id as string

    const trainerId = trainerIdFromUrl || checkoutData.trainerId || checkoutData.bookings?.[0]?.courseId || searchParams.get("trainerId") || "1"
    const packageId = checkoutData.packageId || searchParams.get("packageId") || "single"
    const mode = (checkoutData.bookings?.[0]?.mode === 1 ? "online" : checkoutData.bookings?.[0]?.mode === 2 ? "offline" : undefined) || searchParams.get("mode") || "online"
    const offlineLocationType = checkoutData.offlineLocationType || checkoutData._restore?.offlineLocationType || searchParams.get("offlineLocationType") || "student"
    const locationStr = checkoutData.bookings?.[0]?.location || checkoutData._restore?.address || searchParams.get("location")
    const detailAddress = checkoutData.bookings?.[0]?.address || checkoutData._restore?.detailAddress || searchParams.get("address")

    const trainer = DUMMY_TRAINERS.find((t) => String(t.id) === String(trainerId)) || DUMMY_TRAINERS[0]

    useEffect(() => {
        if (trainer) {
            const title = `${t("title_meta.checkout_prefix", "Pembayaran")} - ${trainer.name} | Qurani`;
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

    // Parse slots
    let selectedSlots: { d: string; t: string }[] = []
    if (checkoutData.bookings && checkoutData.bookings.length > 0) {
        selectedSlots = checkoutData.bookings.map((b: any) => {
            const h = Math.floor(b.startTime / 60).toString().padStart(2, '0')
            const m = (b.startTime % 60).toString().padStart(2, '0')
            return {
                d: b.scheduledDate,
                t: `${h}:${m}`
            }
        })
    } else {
        const slotsParam = searchParams.get("slots")
        try {
            selectedSlots = (slotsParam && slotsParam !== "undefined" && slotsParam !== "null") ? JSON.parse(slotsParam) : []
        } catch (e) {
            console.error("Failed to parse slots", e)
        }
    }

    // Find Package
    const allCourses = getCourses(trainer.id)
    const foundPkg = allCourses.find((p: any) => p.id === packageId) as any

    let calculatedPrice = trainer.pricePerSession;
    if (foundPkg) {
        const isTrainer1 = String(trainer.id) === "1";
        if (isTrainer1) {
            const profileStr = typeof window !== 'undefined' ? localStorage.getItem("trainer_profile") : null;
            let profileHourlyRate = null;
            if (profileStr) {
                try {
                    const profile = JSON.parse(profileStr);
                    if (profile && !isNaN(profile.pricePerSession)) {
                        profileHourlyRate = Number(profile.pricePerSession);
                    }
                } catch { }
            }
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

            calculatedPrice = discountPct > 0
                ? Math.floor((runtimeBasePrice * (100 - discountPct)) / 100)
                : foundPkg.discountPrice ?? runtimeBasePrice;
        } else {
            calculatedPrice = foundPkg.discountPrice ?? foundPkg.packagePrice ?? foundPkg.sessionPrice ?? trainer.pricePerSession;
        }
    }

    const selectedPackage = foundPkg ? {
        id: foundPkg.id,
        name: foundPkg.title,
        sessionCount: foundPkg.totalSessions,
        price: calculatedPrice,
        description: foundPkg.shortDescription || foundPkg.description,
        features: foundPkg.learningOutcomes?.map((o: any) => o.value) || [],
    } : {
        id: "single",
        name: t("marketplace_checkout.fallback_package_name", "Sesi Satuan"),
        sessionCount: 1,
        price: trainer.pricePerSession,
        description: t("marketplace_checkout.fallback_package_desc", "1x Pertemuan"),
        features: [t("marketplace_checkout.fallback_package_feature", "Bayar per pertemuan")]
    }

    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [createdOrderId, setCreatedOrderId] = useState<string>("")

    // PIN states
    const [pinDialogOpen, setPinDialogOpen] = useState(false)
    const [pinValue, setPinValue] = useState("")
    const [pinAttempts, setPinAttempts] = useState(0)
    const [pinLockUntil, setPinLockUntil] = useState<number | null>(null)

    // Lupa PIN states
    const [isLupaPinOpen, setIsLupaPinOpen] = useState(false)
    const [lupaPinStep, setLupaPinStep] = useState(1) // 1=modal, 2=OTP, 3=PIN baru, 4=konfirmasi, 5=berhasil
    const [lupaPinPhone, setLupaPinPhone] = useState("")
    const [lupaPinOtp, setLupaPinOtp] = useState("")
    const [lupaPinNewPin, setLupaPinNewPin] = useState("")
    const [lupaPinConfirmPin, setLupaPinConfirmPin] = useState("")
    const [lupaPinOtpCountdown, setLupaPinOtpCountdown] = useState(0)
    const [lupaPinConfirmError, setLupaPinConfirmError] = useState(false)
    const [lupaPinIsLoading, setLupaPinIsLoading] = useState(false)

    const resetLupaPin = () => {
        setLupaPinStep(1)
        setLupaPinPhone("")
        setLupaPinOtp("")
        setLupaPinNewPin("")
        setLupaPinConfirmPin("")
        setLupaPinOtpCountdown(0)
        setLupaPinConfirmError(false)
        setLupaPinIsLoading(false)
    }

    const startOtpCountdown = () => {
        setLupaPinOtpCountdown(60)
        const interval = setInterval(() => {
            setLupaPinOtpCountdown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    const handleSendOtp = () => {
        setLupaPinIsLoading(true)
        setTimeout(() => {
            setLupaPinIsLoading(false)
            setLupaPinStep(2)
            startOtpCountdown()
        }, 1500)
    }

    const handleVerifyOtp = () => {
        setLupaPinIsLoading(true)
        setTimeout(() => {
            setLupaPinIsLoading(false)
            setLupaPinStep(3)
        }, 1200)
    }

    const handleSetNewPin = () => {
        if (lupaPinNewPin.length < 6) return
        setLupaPinStep(4)
    }

    const handleConfirmNewPin = () => {
        if (lupaPinConfirmPin !== lupaPinNewPin) {
            setLupaPinConfirmError(true)
            return
        }
        setLupaPinConfirmError(false)
        setLupaPinIsLoading(true)
        setTimeout(() => {
            if (typeof window !== "undefined") {
                localStorage.setItem("myqurani_wallet_pin", lupaPinNewPin)
            }
            setLupaPinIsLoading(false)
            setLupaPinStep(5)
        }, 1500)
    }

    const pinStrengthChecks = [
        { label: "Minimal 6 digit", ok: lupaPinNewPin.length >= 6 },
        { label: "Hanya angka (0–9)", ok: lupaPinNewPin.length > 0 && /^\d+$/.test(lupaPinNewPin) },
        { label: "Tidak mudah ditebak", ok: lupaPinNewPin.length >= 6 && !/^(\d)\1+$/.test(lupaPinNewPin) && !/^(0123|1234|2345|3456|4567|5678|6789)/.test(lupaPinNewPin) },
    ]

    useEffect(() => {
        if (pinLockUntil) {
            const timer = setTimeout(() => {
                setPinLockUntil(null);
                setPinAttempts(0);
            }, Math.max(0, pinLockUntil - Date.now()));
            return () => clearTimeout(timer);
        }
    }, [pinLockUntil])

    // Voucher Promo Discount
    const [voucherCode, setVoucherCode] = useState("")
    const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; description: string } | null>(null)
    const [voucherError, setVoucherError] = useState("")

    const handleApplyVoucher = () => {
        setVoucherError("")
        const clean = voucherCode.trim().toUpperCase()
        if (!clean) return
        if (clean === "BERKAH10" || clean === "QURANI10") {
            const disc = Math.round(selectedPackage.price * 0.10)
            setAppliedDiscount({ code: clean, amount: disc, description: "Diskon Berkah 10%" })
            toast.success("Voucher berhasil digunakan!", { description: `Hemat Rp ${disc.toLocaleString('id-ID')}` })
        } else if (clean === "QURANIHEMAT" || clean === "HEMAT25") {
            const disc = 25000
            setAppliedDiscount({ code: clean, amount: disc, description: "Potongan Langsung Rp 25.000" })
            toast.success("Voucher berhasil digunakan!", { description: "Potongan Rp 25.000" })
        } else {
            setVoucherError("Kode voucher tidak valid atau sudah kedaluwarsa")
            toast.error("Voucher tidak valid")
        }
    }

    // Pricing
    const PLATFORM_FEE = Math.round(selectedPackage.price * 0.12)
    const discountAmount = appliedDiscount ? appliedDiscount.amount : 0
    const TOTAL_PRICE = Math.max(0, selectedPackage.price + PLATFORM_FEE - discountAmount)

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price)
    }

    const handlePayment = async () => {
        setIsProcessing(true)

        if (selectedMethod === 'wallet') {
            if (userBalance < TOTAL_PRICE) {
                toast.error(t("marketplace_checkout.toast_insufficient_balance", "Saldo tidak cukup!"), {
                    description: t("marketplace_checkout.toast_insufficient_balance_desc", "Silakan isi saldo wallet Anda terlebih dahulu.")
                });
                setIsProcessing(false);
                return;
            }

            // Show PIN Dialog instead of timeout
            setPinDialogOpen(true);
            setIsProcessing(false);
            return;
        }

        try {
            const response = await fetch('/api/payments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: TOTAL_PRICE,
                    teacherName: trainer.name,
                    type: selectedPackage.name,
                    customerName: profile?.name || 'User',
                    customerEmail: profile?.email || 'user@example.com',
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // @ts-expect-error - Midtrans Snap is loaded via script
            window.snap.pay(data.token, {
                onSuccess: function (result: any) {
                    finalizeOrder(result.order_id, "waiting_approval", true, result.payment_type);
                },
                onPending: function (result: any) {
                    toast.info(t("marketplace_checkout.toast_waiting_payment", "Menunggu pembayaran..."));
                    finalizeOrder(result.order_id, "pending", false, result.payment_type);
                },
                onError: function (result: any) {
                    toast.error(t("marketplace_checkout.toast_payment_failed", "Pembayaran Gagal!"));
                    setIsProcessing(false);
                },
                onClose: function () {
                    toast.info(t("marketplace_checkout.toast_payment_closed", "Anda menutup pembayaran."));
                    finalizeOrder(`local-${Date.now()}`, "pending", false);
                }
            });
        } catch (error: any) {
            toast.error(t("marketplace_checkout.toast_processing_failed", "Gagal memproses pembayaran: ") + error.message);
            setIsProcessing(false);
        }
    }

    const finalizeOrder = (transactionId?: string, statusOverride: string = "waiting_approval", showSuccess: boolean = true, paymentMethod?: string) => {
        const finalTransactionId = transactionId || `local-${Date.now()}`;

        const existingRequests = JSON.parse(localStorage.getItem('teacher_requests') || '[]');
        
        // If we are updating an existing order (from query param or checkoutData)
        const updateOrderId = searchParams.get('orderId') || checkoutData?.orderId;
        if (updateOrderId) {
            const orderIndex = existingRequests.findIndex((r: any) => String(r.id) === String(updateOrderId));
            if (orderIndex >= 0) {
                existingRequests[orderIndex] = {
                    ...existingRequests[orderIndex],
                    status: statusOverride,
                    transactionId: finalTransactionId,
                    dateApplied: new Date().toISOString()
                };
                localStorage.setItem('teacher_requests', JSON.stringify(existingRequests));
                
                if (statusOverride === 'waiting_approval') {
                    const savedTx = localStorage.getItem('myqurani_mock_wallet_tx');
                    const txs = savedTx ? JSON.parse(savedTx) : [];
                    const methodMap: Record<string, string> = { bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' };
                    const newTx = {
                        id: `WLT-PAY-${finalTransactionId.replace(/^QRN-/, '')}`,
                        type: "payment",
                        amount: TOTAL_PRICE,
                        date: new Date().toISOString(),
                        status: "success",
                        detail: `Pesanan ke ${trainer.name} - ${selectedPackage.name}`,
                        packageName: selectedPackage.name,
                        teacherName: trainer.name,
                        method: selectedMethod === 'wallet' ? 'Saldo Qurani' : (methodMap[paymentMethod!] || paymentMethod || "Lainnya")
                    };
                    localStorage.setItem('myqurani_mock_wallet_tx', JSON.stringify([newTx, ...txs]));
                    if (selectedMethod === 'wallet') {
                        const newBalance = userBalance - TOTAL_PRICE;
                        localStorage.setItem('myqurani_wallet_balance', String(newBalance));
                    }
                }
                
                if (showSuccess) setIsSuccess(true);
                return;
            }
        }

        if (existingRequests.some((r: any) => r.transactionId === finalTransactionId)) {
            console.warn("Duplicate order detected, skipping save.");
            return;
        }

        const newRequest = {
            id: Date.now(),
            userId: profile?.id || 'unknown',
            transactionId: finalTransactionId,
            student: profile?.name || 'User',
            username: profile?.username || profile?.name?.toLowerCase().replace(/\s+/g, '') || 'user',
            avatar: profile?.avatar || 'https://i.pravatar.cc/150?u=user',
            trainerName: trainer.name,
            trainerAvatar: trainer.avatar,
            trainerId: trainer.id,
            course: trainer.specialization[0] || 'Tahsin',
            duration: selectedPackage.name,
            sessions: selectedPackage.sessionCount || 1,
            price: formatPrice(TOTAL_PRICE),
            subtotal: selectedPackage.price,
            serviceFee: PLATFORM_FEE,
            method: mode === 'offline' ? t("marketplace_checkout.offline", "Offline") : t("marketplace_checkout.online", "Online"),
            address: detailAddress || locationStr || '',
            offlineLocationType: mode === 'offline' ? (offlineLocationType || 'student') : undefined,
            startDate: selectedSlots[0] ? format(new Date(selectedSlots[0].d), "d MMMM yyyy", { locale: dateLocale }) : '',
            preferredTime: selectedSlots[0] ? selectedSlots[0].t : '',
            slots: selectedSlots,
            packageId: selectedPackage.id,
            message: searchParams.get("notes") || checkoutData.bookings?.[0]?.notes || "",
            dateApplied: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            status: statusOverride
        }
        localStorage.setItem('teacher_requests', JSON.stringify([...existingRequests, newRequest]))

        // Save order to marketplaceApi for cross-page & Supabase sync
        const orderInvId = finalTransactionId.startsWith('INV-') ? finalTransactionId : `INV-${Date.now()}`;
        setCreatedOrderId(orderInvId);

        const methodMapOrder: Record<string, string> = { bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' };
        const resolvedMethod = selectedMethod === 'wallet' ? 'Qurani Wallet' : (methodMapOrder[paymentMethod!] || paymentMethod || "Midtrans");

        const newMarketplaceOrder: MarketplaceOrder = {
            id: orderInvId,
            transactionId: finalTransactionId,
            date: new Date().toISOString(),
            userId: profile?.id?.toString() || 'unknown',
            customerName: profile?.name || 'Fulan bin Fulan',
            customerEmail: profile?.email || 'fulan@example.com',
            customerPhone: profile?.phone || '+62 812-3456-7890',
            trainerId: trainer.id,
            trainerName: trainer.name,
            trainerAvatar: trainer.avatar,
            packageId: selectedPackage.id,
            packageName: selectedPackage.name,
            method: trainer.specialization?.[0] || 'Tahsin',
            mode: mode === 'offline' ? 'Offline' : 'Online',
            offlineLocationType: mode === 'offline' ? (offlineLocationType || 'student') : undefined,
            description: `${selectedPackage.sessionCount || 1}x Pertemuan (${mode === 'offline' ? 'Offline' : 'Online'})`,
            features: ["Jadwal fleksibel", "Bimbingan 1-on-1", "Modul Digital"],
            sessions: selectedPackage.sessionCount || 1,
            price: TOTAL_PRICE,
            subtotal: selectedPackage.price,
            serviceFee: PLATFORM_FEE,
            tax: 0,
            discountAmount: discountAmount,
            voucherCode: appliedDiscount?.code,
            status: (statusOverride === 'waiting_approval' || statusOverride === 'success') ? 'waiting_approval' : 'pending',
            paymentMethod: resolvedMethod,
            paymentStatus: statusOverride === 'waiting_approval' ? 'Menunggu Persetujuan' : (statusOverride === 'pending' ? 'Menunggu Pembayaran' : 'Lunas'),
            sessionDetails: (selectedSlots && selectedSlots.length > 0) ? selectedSlots.map((s, idx) => ({
                id: idx + 1,
                title: `Pertemuan ${idx + 1}`,
                status: 'scheduled' as const,
                date: s.d ? format(new Date(s.d), "d MMM yyyy", { locale: dateLocale }) : 'Jadwal Ditentukan',
                time: s.t || '09:00',
                meetingPlatform: 'Google Meet',
                videoConferenceUrl: 'https://meet.google.com/qurani-session'
            })) : [
                { id: 1, title: 'Pertemuan 1', status: 'scheduled' as const, date: 'Jadwal Ditentukan', time: '09:00', meetingPlatform: 'Google Meet', videoConferenceUrl: 'https://meet.google.com/qurani-session' }
            ]
        };
        marketplaceApi.saveOrder(newMarketplaceOrder);

        if (statusOverride === 'waiting_approval') {
            const savedTx = localStorage.getItem('myqurani_mock_wallet_tx');
            const txs = savedTx ? JSON.parse(savedTx) : [];
            const methodMap: Record<string, string> = { bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' };
            const newTx = {
                id: `WLT-PAY-${finalTransactionId.replace(/^QRN-/, '')}`,
                type: "payment",
                amount: TOTAL_PRICE,
                date: new Date().toISOString(),
                status: "success",
                detail: `Pesanan ke ${trainer.name} - ${selectedPackage.name}`,
                packageName: selectedPackage.name,
                teacherName: trainer.name,
                method: selectedMethod === 'wallet' ? 'Saldo Qurani' : (methodMap[paymentMethod!] || paymentMethod || "Lainnya")
            };
            localStorage.setItem('myqurani_mock_wallet_tx', JSON.stringify([newTx, ...txs]));
            if (selectedMethod === 'wallet') {
                setUserBalance(prev => prev - TOTAL_PRICE);
            }
        }

        if (showSuccess) {
            setIsSuccess(true);
            toast.success(t("marketplace_checkout.toast_payment_success", "Pembayaran Berhasil! Menunggu persetujuan guru."));
        } else {
            router.push(`/${locale}/orders`);
        }
        setIsProcessing(false);
    }

    const handlePinSubmit = (currentPin: string) => {
        if (pinLockUntil && Date.now() < pinLockUntil) {
            toast.error("Terlalu banyak percobaan", { description: "Tunggu 3 menit untuk mencoba lagi." });
            return;
        }

        const savedPin = typeof window !== 'undefined' ? localStorage.getItem('myqurani_wallet_pin') || "123456" : "123456";

        if (currentPin === savedPin) {
            setPinDialogOpen(false);
            setPinAttempts(0);
            setPinValue("");
            finalizeOrder(`wallet-${Date.now()}`, "waiting_approval", true);
        } else {
            const newAttempts = pinAttempts + 1;
            setPinAttempts(newAttempts);
            setPinValue("");
            if (newAttempts >= 5) {
                const lockTime = Date.now() + 3 * 60 * 1000;
                setPinLockUntil(lockTime);
                toast.error("Akses PIN Dikunci", { description: "Maksimal percobaan gagal. Silakan coba 3 menit lagi." });
                setPinDialogOpen(false);
            } else {
                toast.error("PIN Salah", { description: `Percobaan sisa: ${5 - newAttempts}` });
            }
        }
    }

    const formatReadableDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr)
            return format(date, "EEEE, d MMMM yyyy", { locale: dateLocale })
        } catch {
            return dateStr
        }
    }

    return (
        <div className="pb-24 bg-slate-50/50 dark:bg-gray-950">
            {/* Midtrans Script */}
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="lazyOnload"
            />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

            {/* Nav Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="font-bold text-lg text-slate-900 dark:text-white">{t("marketplace_checkout.secure_payment_title", "Pembayaran Aman")}</h1>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800">
                        <Lock className="h-3 w-3" />
                        {t("marketplace_checkout.secure_checkout_badge", "Secure Checkout")}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div className="lg:col-span-8">
                        <div className="sticky top-[144px] space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                                <div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-emerald-600" />
                                        {t("marketplace_checkout.payment_method_title", "Metode Pembayaran")}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setSelectedMethod('midtrans')}
                                            className={cn(
                                                "flex flex-col items-start p-5 rounded-3xl border-2 transition-all text-left group",
                                                selectedMethod === 'midtrans'
                                                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg shadow-emerald-500/5"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                                            )}
                                        >
                                            <div className="flex justify-between w-full items-start mb-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                                    selectedMethod === 'midtrans' ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                                                )}>
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                {selectedMethod === 'midtrans' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                            </div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">{t("marketplace_checkout.midtrans_method", "Midtrans (Lainnya)")}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("marketplace_checkout.midtrans_desc", "QRIS, Transfer Bank, E-Wallet, Kartu Kredit.")}</p>
                                        </button>

                                        <button
                                            onClick={() => setSelectedMethod('wallet')}
                                            className={cn(
                                                "flex flex-col items-start p-5 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
                                                selectedMethod === 'wallet'
                                                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg shadow-emerald-500/5"
                                                    : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                                            )}
                                        >
                                            <div className="flex justify-between w-full items-start mb-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                                    selectedMethod === 'wallet' ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                                                )}>
                                                    <Wallet className="h-5 w-5" />
                                                </div>
                                                {selectedMethod === 'wallet' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                                            </div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                {t("marketplace_checkout.qurani_wallet", "Qurani Wallet")}
                                                <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-emerald-500 text-emerald-600">{t("marketplace_checkout.integrated_badge", "Terintegrasi")}</Badge>
                                            </p>
                                            <p className={cn(
                                                "text-xs font-bold mt-1",
                                                userBalance < TOTAL_PRICE ? "text-red-500" : "text-emerald-500"
                                            )}>
                                                {formatPrice(userBalance)}
                                            </p>
                                            {userBalance < TOTAL_PRICE && selectedMethod === 'wallet' && (
                                                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center p-4">
                                                    <div className="bg-red-50 dark:bg-red-950/30 text-red-600 p-2 rounded-xl border border-red-100 dark:border-red-900/50 text-center">
                                                        <p className="text-[10px] font-black leading-tight">{t("marketplace_checkout.insufficient_balance", "SALDO TIDAK CUKUP")}</p>
                                                        <Link href={`/${locale}/wallet`} className="text-[9px] font-bold underline mt-1 block">{t("marketplace_checkout.top_up_now", "Top Up Sekarang")}</Link>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                        {t("marketplace_checkout.order_confirmation", "Konfirmasi Pesanan")}
                                    </h2>

                                    <div className="space-y-6">
                                        <p className="text-sm text-slate-500 leading-relaxed">
                                            {selectedMethod === 'midtrans'
                                                ? t("marketplace_checkout.midtrans_confirmation_desc", "Silakan periksa kembali detail pesanan Anda di samping. Setelah klik tombol bayar, Anda akan diarahkan ke sistem pembayaran aman Midtrans untuk memilih metode pembayaran (QRIS, Transfer Bank, E-Wallet, dll).")
                                                : t("marketplace_checkout.wallet_confirmation_desc", "Anda akan melakukan pembayaran menggunakan saldo Qurani Wallet Anda. Pastikan detail pesanan sudah sesuai sebelum menekan tombol bayar.")}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">{t("marketplace_checkout.instant_confirmation", "Konfirmasi Instan")}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                                                <Lock className="h-5 w-5 text-blue-600" />
                                                <span className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">{t("marketplace_checkout.secure_payment_feature", "Pembayaran Aman")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">

                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-gray-900/50">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-emerald-600" />
                                    {t("marketplace_checkout.order_summary", "Ringkasan Pesanan")}
                                </h3>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-14 w-14 rounded-xl border-2 border-slate-100 dark:border-slate-700">
                                        <AvatarImage src={trainer.avatar} className="object-cover" />
                                        <AvatarFallback>{trainer.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{trainer.name}</h4>
                                        <p className="text-xs text-emerald-600 font-bold">{trainer.specialization.join(" & ")}</p>
                                    </div>
                                </div>

                                <Separator className="opacity-50" />

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">{t("marketplace_checkout.package", "Paket")}</span>
                                        <span className="font-bold text-slate-900 dark:text-white text-right max-w-[150px]">{selectedPackage.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">{t("marketplace_checkout.mode", "Mode")}</span>
                                        <Badge variant="secondary" className="text-[10px] capitalize bg-slate-100 dark:bg-slate-700">{mode}</Badge>
                                    </div>
                                    {mode === "offline" && locationStr && (
                                        <div className="flex flex-col gap-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                                            <span className="text-slate-500 font-medium">
                                                {offlineLocationType === "student" ? "Lokasi Anda (Murid)" : "Lokasi Guru"}
                                            </span>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700 space-y-1.5">
                                                <span className="block text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider">
                                                    {offlineLocationType === "student" ? "Guru akan datang ke lokasi Anda" : "Anda akan datang ke lokasi guru"}
                                                </span>
                                                <p className="font-semibold text-slate-900 dark:text-white leading-snug">
                                                    {locationStr}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1 text-xs">
                                        <span className="text-slate-500 font-medium">{t("marketplace_checkout.notes", "Catatan")}</span>
                                        <p className={cn(
                                            "font-medium text-right leading-snug bg-slate-50 p-2 rounded-lg border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700",
                                            (checkoutData.bookings?.[0]?.notes || searchParams.get("notes"))
                                                ? "text-slate-900 dark:text-white"
                                                : "text-slate-400 italic"
                                        )}>
                                            {checkoutData.bookings?.[0]?.notes || searchParams.get("notes") || "-"}
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <span className="text-xs text-slate-500 font-medium mb-2 block">{t("marketplace_checkout.selected_schedules", `Jadwal Terpilih (${selectedSlots.length}x)`, { count: selectedSlots.length.toString() })}</span>
                                        <div className="max-h-[220px] overflow-y-auto space-y-2 custom-scrollbar pr-1">
                                            {selectedSlots.map((slot, i) => (
                                                <div key={i} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                                    <span className="font-bold text-slate-900 dark:text-white">{formatReadableDate(slot.d)}</span>
                                                    <Badge variant="outline" className="text-[11px] h-6 border-emerald-100 text-emerald-700 bg-emerald-50 font-black">{slot.t}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Voucher Promo Input */}
                                <div className="space-y-2 pt-1">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Kode promo (cth: BERKAH10)"
                                            value={voucherCode}
                                            onChange={(e) => {
                                                setVoucherCode(e.target.value.toUpperCase());
                                                setVoucherError("");
                                            }}
                                            className="h-9 text-xs uppercase font-medium bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleApplyVoucher}
                                            disabled={!voucherCode.trim()}
                                            className="h-9 px-3 text-xs font-bold border-emerald-500 text-emerald-600 hover:bg-emerald-50 shrink-0 cursor-pointer"
                                        >
                                            Pakai
                                        </Button>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 font-medium">
                                            <span>✓ {appliedDiscount.description}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setAppliedDiscount(null);
                                                    setVoucherCode("");
                                                }}
                                                className="text-[10px] text-red-500 hover:underline cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    )}
                                    {voucherError && (
                                        <p className="text-[11px] text-red-500 font-medium">{voucherError}</p>
                                    )}
                                </div>

                                <div className="bg-slate-50 dark:bg-gray-900/50 rounded-2xl p-4 space-y-2">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>{t("marketplace_checkout.package_price", "Harga Paket")}</span>
                                        <span>{formatPrice(selectedPackage.price)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 text-xs">
                                        <div className="flex items-center gap-1">
                                            <span>{t("marketplace_checkout.tax", "Pajak")}</span>
                                            <Badge variant="secondary" className="text-[9px] h-4 px-1.5 bg-slate-100 text-slate-400 border-0">12%</Badge>
                                        </div>
                                        <span>{formatPrice(PLATFORM_FEE)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-500 text-xs">
                                        <span>{t("marketplace_checkout.service_fee", "Layanan")}</span>
                                        <span>{formatPrice(0)}</span>
                                    </div>
                                    {appliedDiscount && (
                                        <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                                            <span>Diskon Promo ({appliedDiscount.code})</span>
                                            <span>-{formatPrice(appliedDiscount.amount)}</span>
                                        </div>
                                    )}
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{t("marketplace_checkout.total_payment", "Total Bayar")}</span>
                                        <span className="text-xl font-black text-emerald-600">{formatPrice(TOTAL_PRICE)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className={cn(
                                        "w-full h-12 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]",
                                        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                    )}
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t("marketplace_checkout.processing", "Memproses...")}
                                        </div>
                                    ) : (
                                        t("marketplace_checkout.pay_now", "Bayar Sekarang")
                                    )}
                                </Button>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        {t("marketplace_checkout.guaranteed_safe_checkout", "Guaranteed Safe Checkout")}
                                    </div>
                                    <div className="flex gap-3 grayscale opacity-50">
                                        <div className="h-5 w-8 bg-slate-200 rounded" />
                                        <div className="h-5 w-8 bg-slate-200 rounded" />
                                        <div className="h-5 w-8 bg-slate-200 rounded" />
                                        <div className="h-5 w-8 bg-slate-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="w-full text-slate-400 hover:text-red-500 transition-colors"
                            onClick={() => router.back()}
                        >
                            {t("marketplace_checkout.cancel_order", "Batalkan Pesanan")}
                        </Button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-8 text-center space-y-6">
                                <div className="relative mx-auto w-24 h-24">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                        className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 bg-emerald-400 rounded-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{t("marketplace_checkout.success_title", "Alhamdulillah!")}</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {t("marketplace_checkout.success_desc", "Pembayaran Success! Sesi belajar telah dijadwalkan.")}
                                    </p>
                                </div>

                                <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl p-4 text-left space-y-3">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400 uppercase tracking-widest">{t("marketplace_checkout.teacher", "Guru")}</span>
                                        <span className="text-slate-900 dark:text-white">{trainer.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400 uppercase tracking-widest">{t("marketplace_checkout.package", "Paket")}</span>
                                        <span className="text-slate-900 dark:text-white">{selectedPackage.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400 uppercase tracking-widest">{t("marketplace_checkout.total", "Total")}</span>
                                        <span className="text-emerald-600">{formatPrice(TOTAL_PRICE)}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/${locale}/dashboard`)}
                                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-600/20"
                                >
                                    {t("marketplace_checkout.go_to_dashboard", "Masuk ke Dashboard")}
                                </Button>

                                <div className="flex flex-col gap-2 pt-1 w-full">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/${locale}/orders/${createdOrderId || "INV-1789973730001"}/invoice`)}
                                        className="w-full h-11 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-bold text-xs"
                                    >
                                        <Receipt className="w-4 h-4 mr-2" />
                                        Lihat Invoice Pembayaran
                                    </Button>

                                    <Button
                                        variant="link"
                                        onClick={() => router.push(`/${locale}/orders`)}
                                        className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                                    >
                                        {t("marketplace_checkout.view_order", "Lihat Semua Pesanan")}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PIN Dialog (Match DOMPET styling) */}
            <Dialog open={pinDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setPinDialogOpen(false);
                    setPinValue("");
                }
            }}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border border-slate-100 dark:border-slate-800 rounded-[24px]">
                    <div className="flex flex-col h-full overflow-y-auto p-6">
                        <div className="flex flex-col items-center justify-center flex-1 space-y-6 pt-4">
                            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                                <Shield className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div className="text-center space-y-2">
                                <DialogTitle className="sr-only">Verifikasi PIN</DialogTitle>
                                <h2 className="text-xl font-semibold text-slate-800">Verifikasi PIN</h2>
                                <p className="text-sm text-slate-500 px-4">Masukkan 6-digit PIN Anda untuk melanjutkan transaksi</p>
                            </div>
                            
                            <div className="py-4">
                                <InputOTP maxLength={6} autoFocus={true} value={pinValue} disabled={!!pinLockUntil} onChange={(val) => {
                                    setPinValue(val)
                                    if (val.length === 6) {
                                        handlePinSubmit(val)
                                    }
                                }}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <InputOTPSlot key={index} index={index} className="w-12 h-14 text-xl border-slate-200 rounded-lg" />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                {pinLockUntil && (
                                    <p className="text-xs text-red-500 font-bold animate-pulse mt-4 text-center">
                                        Terkunci. Coba lagi dalam {Math.ceil((pinLockUntil - Date.now()) / 60000)} menit.
                                    </p>
                                )}
                            </div>
                            
                        </div>
                        <div className="pt-6 pb-2 text-center">
                            <button
                                className="text-sm text-emerald-600 font-semibold hover:underline transition-colors"
                                onClick={() => { setPinDialogOpen(false); setIsLupaPinOpen(true) }}
                            >
                                Lupa PIN?
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* LUPA PIN DIALOG (5-step flow) */}
            <Dialog open={isLupaPinOpen} onOpenChange={(o) => { if (!o) { setIsLupaPinOpen(false); setTimeout(() => resetLupaPin(), 300) } }}>
                <DialogContent className="sm:max-w-sm bg-white p-0 border-0 overflow-hidden rounded-[24px]">

                    {/* ── Step 1: Modal Lupa PIN ── */}
                    {lupaPinStep === 1 && (
                        <div className="flex flex-col p-6 space-y-5 animate-in fade-in duration-200">
                            <div className="flex flex-col items-center text-center space-y-3 pt-2">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <Lock className="h-8 w-8 text-emerald-600" />
                                </div>
                                <DialogTitle className="text-xl font-semibold text-slate-800">Lupa PIN?</DialogTitle>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
                                    Masukkan nomor HP yang terdaftar pada akun Anda untuk mendapatkan kode OTP.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">Nomor HP</Label>
                                <div className="relative flex items-center">
                                    <div className="flex items-center gap-1.5 absolute left-3 text-slate-500 pointer-events-none">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm font-medium">+62</span>
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="812 3456 7890"
                                        className="pl-[68px] h-11 rounded-lg border-slate-200 text-sm"
                                        value={lupaPinPhone}
                                        onChange={e => setLupaPinPhone(e.target.value.replace(/\D/g, ""))}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => { setIsLupaPinOpen(false); resetLupaPin() }}>Kembali</Button>
                                <Button onClick={handleSendOtp} disabled={lupaPinPhone.length < 9 || lupaPinIsLoading} className={cn(lupaPinIsLoading && "opacity-50 pointer-events-none")}>
                                    {lupaPinIsLoading ? "Mengirim..." : "Kirim"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Verifikasi OTP ── */}
                    {lupaPinStep === 2 && (
                        <div className="flex flex-col p-6 space-y-5 animate-in fade-in duration-200">
                            <div className="flex flex-col items-center text-center space-y-3 pt-2">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <Phone className="h-8 w-8 text-emerald-600" />
                                </div>
                                <DialogTitle className="text-xl font-semibold text-slate-800">Masukkan Kode OTP</DialogTitle>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Kode OTP telah dikirim ke nomor<br />
                                    <span className="font-semibold text-slate-700">+62 {lupaPinPhone}</span>
                                </p>
                            </div>

                            <div className="flex justify-center py-2">
                                <InputOTP maxLength={6} autoFocus={true} value={lupaPinOtp} onChange={setLupaPinOtp}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl border-slate-200 rounded-lg" />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="text-center text-sm text-slate-500">
                                {lupaPinOtpCountdown > 0 ? (
                                    <span>Kirim Ulang kode ({String(Math.floor(lupaPinOtpCountdown / 60)).padStart(2, "0")}:{String(lupaPinOtpCountdown % 60).padStart(2, "0")})</span>
                                ) : (
                                    <button className="text-[#059669] font-semibold hover:underline" onClick={() => { startOtpCountdown() }}>
                                        Kirim Ulang Kode OTP
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button onClick={handleVerifyOtp} disabled={lupaPinOtp.length < 6 || lupaPinIsLoading} className={cn(lupaPinIsLoading && "opacity-50 pointer-events-none")}>
                                    {lupaPinIsLoading ? "Memverifikasi..." : "Verifikasi"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Buat PIN Baru ── */}
                    {lupaPinStep === 3 && (
                        <div className="flex flex-col p-6 space-y-5 animate-in fade-in duration-200">
                            <div className="flex flex-col items-center text-center space-y-3 pt-2">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <Shield className="h-8 w-8 text-emerald-600" />
                                </div>
                                <DialogTitle className="text-xl font-semibold text-slate-800">Buat PIN Baru</DialogTitle>
                                <p className="text-sm text-slate-500 max-w-[240px]">
                                    Masukkan 6-digit PIN baru Anda. Pastikan PIN mudah diingat namun tetap aman.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                                <InputOTP maxLength={6} autoFocus={true} value={lupaPinNewPin} onChange={setLupaPinNewPin}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <InputOTPSlot key={i} index={i} className="w-12 h-14 text-xl border-slate-200 rounded-lg" />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                            <div className="space-y-2 bg-slate-50 rounded-lg p-3">
                                {pinStrengthChecks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className={cn("h-4 w-4 flex-shrink-0", check.ok ? "text-emerald-600" : "text-slate-300")} />
                                        <span className={check.ok ? "text-slate-700 font-medium" : "text-slate-400"}>{check.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => { setLupaPinStep(2); setLupaPinNewPin("") }}>Kembali</Button>
                                <Button onClick={handleSetNewPin} disabled={lupaPinNewPin.length < 6 || !pinStrengthChecks.every(c => c.ok)}>Lanjutkan</Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 4: Konfirmasi PIN Baru ── */}
                    {lupaPinStep === 4 && (
                        <div className="flex flex-col p-6 space-y-5 animate-in fade-in duration-200">
                            <div className="flex flex-col items-center text-center space-y-3 pt-2">
                                <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center">
                                    <Shield className="h-8 w-8 text-emerald-600" />
                                </div>
                                <DialogTitle className="text-xl font-semibold text-slate-800">Konfirmasi PIN</DialogTitle>
                                <p className="text-sm text-slate-500 max-w-[240px]">
                                    Masukkan kembali PIN baru Anda untuk memastikan.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <InputOTP maxLength={6} autoFocus={true} value={lupaPinConfirmPin} onChange={(val) => {
                                    setLupaPinConfirmPin(val)
                                    if (lupaPinConfirmError) setLupaPinConfirmError(false)
                                }}>
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <InputOTPSlot key={i} index={i} className={cn("w-12 h-14 text-xl rounded-lg", lupaPinConfirmError ? "border-rose-400" : "border-slate-200")} />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                {lupaPinConfirmError && <p className="text-xs text-rose-500 font-medium">PIN tidak cocok. Coba lagi.</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => { setLupaPinStep(3); setLupaPinConfirmPin("") }}>Kembali</Button>
                                <Button onClick={handleConfirmNewPin} disabled={lupaPinConfirmPin.length < 6 || lupaPinIsLoading} className={cn(lupaPinIsLoading && "opacity-50 pointer-events-none")}>
                                    {lupaPinIsLoading ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 5: Berhasil ── */}
                    {lupaPinStep === 5 && (
                        <div className="flex flex-col p-6 space-y-6 items-center text-center animate-in zoom-in-95 duration-300">
                            <div className="pt-4">
                                <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="text-xl font-semibold text-slate-800">PIN Berhasil Diubah!</DialogTitle>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] mx-auto">
                                    PIN baru Anda sudah aktif dan siap digunakan.
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
