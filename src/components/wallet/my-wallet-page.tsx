"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
    Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
    Wallet, Clock, ArrowLeft, ChevronRight, Plus, Search,
    History as HistoryIcon, Info, Banknote,
    Download, Lock, CheckCircle, ArrowDownLeft, CornerUpLeft,
    Building2, CreditCard, Shield, Send, Calendar, X, Filter, ShoppingCart, ShoppingBag, Loader2, Keyboard, Phone, Eye, EyeOff, AlertTriangle, ChevronLeft, Trash2
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useAuth } from "@/components/providers/auth-provider"
import { useI18n } from "@/components/providers/i18n-provider"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import Script from "next/script"
import { WalletDetailPage } from "./detail-my-wallet"
import { TransactionDetailModal } from "./transaction-detail-modal"
import { useSearchUsers } from "@/hooks/use-friends-data"
import { useDebounce } from "@/hooks/use-debounce"
import { getInitials } from "@/utils/helpers/get-initials"
import { AvatarImage } from "@/components/ui/avatar"

// ─── Types ───────────────────────────────────────────────
type WalletTransaction = {
    id: string;
    type: string;
    amount: number;
    date: string; // ISO string
    status: string;
    method?: string;
    detail?: string;
    subtitle?: string; // guru, penerima, tujuan
    packageName?: string; // nama paket/kursus untuk pesanan
    teacherName?: string; // nama guru untuk pesanan/refund
    receiverName?: string; // nama penerima (transfer)
    senderName?: string;   // nama pengirim (topup sumber)
    accountInfo?: string;  // rekening tujuan withdraw (raw)
}

// ─── Time Ago Helper ─────────────────────────────────────
const formatDateIndo = (dateStr: string): string => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const mins = date.getMinutes().toString().padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}.${mins}`
}

const formatExactDateIndo = (dateStr: string): string => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const mins = date.getMinutes().toString().padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}.${mins}`
}

// ─── Relative Time Helper ────────────────────────────────
const getRelativeTime = (dateStr: string): string => {
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const diffSec = Math.floor(diffMs / 1000)
    if (diffSec < 10) return "Baru saja"
    if (diffSec < 60) return `${diffSec} detik yang lalu`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin} menit yang lalu`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour} jam yang lalu`
    const diffDay = Math.floor(diffHour / 24)
    if (diffDay < 30) return `${diffDay} hari yang lalu`
    const diffMon = Math.floor(diffDay / 30)
    if (diffMon < 12) return `${diffMon} bulan yang lalu`
    return formatExactDateIndo(dateStr)
}

// ─── Mask Account Number ─────────────────────────────────
const maskAccountNo = (raw: string): string => {
    // If already contains **** keep as-is
    if (raw.includes("****")) return raw
    // Strip non-digit chars then mask
    const digits = raw.replace(/\D/g, "")
    if (digits.length < 4) return raw
    return `****${digits.slice(-4)}`
}

// ─── Relative Time Component (hover/click tooltip) ───────
function RelativeTime({ dateStr }: { dateStr: string }) {
    const [mounted, setMounted] = React.useState(false)
    const [showFull, setShowFull] = React.useState(false)
    const exact = formatExactDateIndo(dateStr)
    const relative = getRelativeTime(dateStr)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <TooltipProvider delay={100}>
            <Tooltip open={showFull || undefined}>
                <TooltipTrigger
                    className="text-[11px] text-gray-500 font-medium whitespace-nowrap cursor-help hover:text-gray-700 transition-colors text-left bg-transparent border-0 p-0 shadow-none hover:bg-transparent"
                    onClick={(e) => { e.stopPropagation(); setShowFull(v => !v) }}
                    onMouseLeave={() => setShowFull(false)}
                >
                    <span suppressHydrationWarning>
                        {mounted ? relative : exact}
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs font-medium">
                    {exact}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export const getTransactionDetail = (type: string, target: string, isPayment: boolean = false, packageName?: string) => {
    switch (type) {
        case "topup": return `Isi saldo melalui metode ${target}`
        case "withdraw": 
            const parts = target.split(" - ");
            if (parts.length === 2) {
                return `Tarik saldo ke ${parts[0]} ${maskAccountNo(parts[1])}`
            }
            return `Tarik saldo ke ${maskAccountNo(target)}`
        case "transfer": return isPayment ? `Pembayaran - ${target}` : `Kirim dana ke ${target}`
        case "payment": return `Pesanan ke ${target}${packageName ? ` - ${packageName}` : ''}`
        case "refund": return `Pengembalian saldo dari ${target}${packageName ? ` - ${packageName}` : ''}`
        default: return target
    }
}

// ─── Activity Config ─────────────────────────────────────
const activityConfig: Record<string, { label: string; icon: React.ElementType; bg: string; color: string }> = {
    topup: { label: "Isi Saldo", icon: Plus, bg: "bg-emerald-50", color: "text-emerald-600" },
    transfer: { label: "Kirim Saldo", icon: Send, bg: "bg-blue-50", color: "text-blue-500" },
    payment: { label: "Pesanan", icon: ShoppingBag, bg: "bg-amber-50", color: "text-amber-500" },
    withdraw: { label: "Tarik Saldo", icon: Download, bg: "bg-rose-50", color: "text-rose-500" },
    refund: { label: "Pengembalian Dana", icon: ArrowDownLeft, bg: "bg-emerald-50", color: "text-emerald-600" },
}

// ─── Helper for Consistent IDs ──────────────────────────────
export const generateTxId = (type: string) => {
    const prefix = type === "topup" ? "TU" : type === "withdraw" ? "WD" : type === "transfer" ? "TRF" : type === "payment" ? "PAY" : "REF";
    const part1 = Math.floor(Math.random() * 900000) + 100000;
    const part2 = Math.floor(Math.random() * 9000) + 1000;
    return `WLT-${prefix}-${part1}-${part2}`;
}

// ─── Mock Data (ISO dates) ───────────────────────────────
export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
    { id: "WLT-WD-914569-3817", type: "withdraw", amount: 50000,  date: new Date(Date.now() - 1000*5).toISOString(), status: "pending", detail: "Tarik saldo ke BSI ****9999", accountInfo: "0099999999", method: "BSI" },
    { id: "WLT-TRF-882281-8793", type: "transfer", amount: 10000, date: new Date(Date.now() - 1000*54).toISOString(), status: "success", detail: "Kirim dana ke Veni", receiverName: "Veni", subtitle: "Kirim saldo ke Veni" },
    { id: "WLT-TU-201274-1041", type: "topup", amount: 1000000, date: new Date(Date.now() - 1000*60*2).toISOString(), status: "success", detail: "Isi saldo via Transfer Bank", senderName: "Transfer Bank" },
    { id: "WLT-TU-141235-1041", type: "topup", amount: 1000000, date: new Date(Date.now() - 1000*60*4).toISOString(), status: "success", detail: "Isi saldo via Transfer Bank", senderName: "Transfer Bank" },
    { id: "WLT-PAY-1780168979355", type: "payment", amount: 645120, date: new Date(Date.now() - 1000*60*8).toISOString(), status: "success", detail: "Pesanan ke Shafa Marwa - Tahfidz Mahir", teacherName: "Shafa Marwa", packageName: "Tahfidz Mahir", method: "Saldo Qurani" },
    { id: "WLT-PAY-8C82B7D3", type: "payment", amount: 224000, date: new Date(Date.now() - 1000*60*9).toISOString(), status: "success", detail: "Pesanan ke Rafi Andika - Tahfidz Pemula", teacherName: "Rafi Andika", packageName: "Tahfidz Pemula", method: "Saldo Qurani" },
    { id: "WLT-REF-109283-4412", type: "refund",   amount: 75000,   date: new Date(Date.now() - 1000*60*60*24*5).toISOString(),   status: "success", detail: "Pengembalian saldo dari Ustadz Ali - Tahsin Dasar",  teacherName: "Ustadz Ali",            packageName: "Tahsin Dasar" },
    { id: "WLT-PAY-119283-5512", type: "payment",  amount: 350000,  date: new Date(Date.now() - 1000*60*60*24*9).toISOString(),   status: "failed",  detail: "Pesanan ke Ustadz Ihsan - Tahsin Intensif",       teacherName: "Ustadz Ihsan",          packageName: "Tahsin Intensif",       method: "Transfer Bank" },
    { id: "WLT-TU-482910-3301",  type: "topup",    amount: 500000,  date: new Date(Date.now() - 1000*60*60*24*17).toISOString(),  status: "success", detail: "Isi saldo via GoPay",                                  senderName: "GoPay" },
    { id: "WLT-WD-992813-1109",  type: "withdraw", amount: 200000,  date: new Date(Date.now() - 1000*60*60*24*25).toISOString(),  status: "failed",  detail: "Tarik saldo ke BNI ****7741",                        accountInfo: "0071997741",            method: "BNI" },
    { id: "WLT-TRF-481923-2210", type: "transfer", amount: 50000,   date: new Date(Date.now() - 1000*60*60*24*3).toISOString(),   status: "success", detail: "Kirim saldo ke Ustadzah Fatimah",                      receiverName: "Ustadzah Fatimah",     subtitle: "Barakallah fii umrik" },
    { id: "WLT-PAY-612349-1102", type: "payment",  amount: 100000,  date: new Date(Date.now() - 1000*60*60*24*7).toISOString(),   status: "pending", detail: "Pesanan ke Budi Santoso - Tajwid Praktis",   teacherName: "Budi Santoso",          packageName: "Tajwid Praktis", method: "GoPay" },
    { id: "WLT-TU-291834-5512",  type: "topup",    amount: 150000,  date: new Date(Date.now() - 1000*60*60*24*10).toISOString(),  status: "success", detail: "Isi saldo via Transfer Bank",                          senderName: "Transfer Bank" },
    { id: "WLT-PAY-554312-7783", type: "payment",  amount: 90000,   date: new Date(Date.now() - 1000*60*60*24*15).toISOString(),  status: "success", detail: "Pesanan ke Ahmad Zain - Hafalan Juz 30 Penuh",          teacherName: "Ahmad Zain",            packageName: "Hafalan Juz 30 Penuh",     method: "QRIS" },
    { id: "WLT-REF-772319-3301", type: "refund",   amount: 120000,  date: new Date(Date.now() - 1000*60*60*24*16).toISOString(),  status: "success", detail: "Pengembalian saldo dari Ustadzah Aminah - Tartil Pemula", teacherName: "Ustadzah Aminah",    packageName: "Tartil Pemula" },
    { id: "WLT-WD-384719-5523",  type: "withdraw", amount: 300000,  date: new Date(Date.now() - 1000*60*60*24*12).toISOString(),  status: "success", detail: "Tarik saldo ke Mandiri ****3312",                      accountInfo: "1230033312",            method: "Mandiri" },
    { id: "WLT-TRF-889123-4412", type: "transfer", amount: 150000,  date: new Date(Date.now() - 1000*60*60*24*30).toISOString(),  status: "failed",  detail: "Kirim saldo ke Hamid Arifin",                          receiverName: "Hamid Arifin" },
    { id: "WLT-PAY-812371-8812", type: "payment",  amount: 80000,   date: new Date(Date.now() - 1000*60*60*24*6).toISOString(),   status: "success", detail: "Pesanan ke Ustadzah Aisyah - Tafsir Pemula",        teacherName: "Ustadzah Aisyah",      packageName: "Tafsir Pemula" },
    { id: "WLT-TU-193847-7712",  type: "topup",    amount: 250000,  date: new Date(Date.now() - 1000*60*60*24*22).toISOString(),  status: "pending", detail: "Isi saldo via Transfer Bank",                          senderName: "Transfer Bank" },
    { id: "WLT-PAY-991823-4410", type: "payment",  amount: 130000,  date: new Date(Date.now() - 1000*60*60*24*18).toISOString(),  status: "failed",  detail: "Pesanan ke Ustadzah Maryam - Tafsir Juz Amma",    teacherName: "Ustadzah Maryam",      packageName: "Tafsir Juz Amma",      method: "GoPay" },
    { id: "WLT-WD-774512-8891",  type: "withdraw", amount: 1000000, date: new Date(Date.now() - 1000*60*60*24*35).toISOString(),  status: "success", detail: "Tarik saldo ke BRI ****9923",                         accountInfo: "0091009923",            method: "BRI" },
    { id: "WLT-TRF-512938-1192", type: "transfer", amount: 25000,   date: new Date(Date.now() - 1000*60*60*24*14).toISOString(),  status: "success", detail: "Kirim saldo ke Ahmad Fauzi",                            receiverName: "Ahmad Fauzi" },
    { id: "WLT-PAY-223847-3301", type: "payment",  amount: 200000,  date: new Date(Date.now() - 1000*60*60*24*8).toISOString(),   status: "success", detail: "Pesanan ke Ustadz Yusuf - Tahfidz Lanjutan",   teacherName: "Ustadz Yusuf",         packageName: "Tahfidz Lanjutan", method: "QRIS" },
    { id: "WLT-TU-557823-1102",  type: "topup",    amount: 750000,  date: new Date(Date.now() - 1000*60*60*24*28).toISOString(),  status: "success", detail: "Isi saldo via QRIS",                                  senderName: "QRIS" },
    { id: "WLT-PAY-334812-6612", type: "payment",  amount: 165000,  date: new Date(Date.now() - 1000*60*60*24*20).toISOString(),  status: "success", detail: "Pesanan ke Ustadz Salim - Sanad Mahir",  teacherName: "Ustadz Salim",         packageName: "Sanad Mahir", method: "Transfer Bank" },
    { id: "WLT-REF-331892-6612", type: "refund",   amount: 50000,   date: new Date(Date.now() - 1000*60*60*24*27).toISOString(),  status: "pending", detail: "Pengembalian saldo dari Ustadz Sulaiman - Tartil Fasih", teacherName: "Ustadz Sulaiman",   packageName: "Tartil Fasih" },
    { id: "WLT-PAY-773621-9902", type: "payment",  amount: 175000,  date: new Date(Date.now() - 1000*60*60*24*11).toISOString(),  status: "success", detail: "Pesanan ke Ustadzah Khadijah - Tajwid Lanjutan",  teacherName: "Ustadzah Khadijah",    packageName: "Tajwid Lanjutan",    method: "ShopeePay" },
    { id: "WLT-TU-884910-6633",  type: "topup",    amount: 100000,  date: new Date(Date.now() - 1000*60*60*24*32).toISOString(),  status: "failed",  detail: "Isi saldo via ShopeePay",                              senderName: "ShopeePay" },
    { id: "WLT-PAY-882910-1102", type: "payment",  amount: 250000,  date: new Date(Date.now() - 1000*60*60*24*13).toISOString(),  status: "pending", detail: "Pesanan ke Ustadz Rahman - Kelas Siroh Nabawiyah",       teacherName: "Ustadz Rahman",        packageName: "Kelas Siroh Nabawiyah",      method: "Transfer Bank" },
    { id: "WLT-TRF-663219-8801", type: "transfer", amount: 100000,  date: new Date(Date.now() - 1000*60*60*24*26).toISOString(),  status: "success", detail: "Kirim saldo ke Muhammad Rizki",                          receiverName: "Muhammad Rizki" },
    { id: "WLT-PAY-667234-2290", type: "payment",  amount: 95000,   date: new Date(Date.now() - 1000*60*60*24*23).toISOString(),  status: "success", detail: "Pesanan ke Ustadzah Zainab - Kursus Fiqih Wanita",       teacherName: "Ustadzah Zainab",      packageName: "Kursus Fiqih Wanita",        method: "QRIS" },
]

// ─── Reusable: Step Dots ─────────────────────────────────
function StepDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex justify-center gap-1.5 pt-1">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i + 1 === current ? "w-6 bg-emerald-500" :
                        i + 1 < current ? "w-1.5 bg-emerald-300" : "w-1.5 bg-gray-200"
                )} />
            ))}
        </div>
    )
}

// ─── Reusable: PIN Input ─────────────────────────────────
function PINInput({ value, onChange, onSubmit, disabled, accent = "emerald" }: {
    value: string; onChange: (v: string) => void; onSubmit: () => void; disabled?: boolean; accent?: "emerald" | "blue"
}) {
    const accentColors = accent === "blue"
        ? { dot: "bg-blue-600", ring: "focus-visible:ring-blue-500", btn: "bg-primary", btnText: "hover:text-primary" }
        : { dot: "bg-emerald-600", ring: "focus-visible:ring-emerald-500", btn: "bg-primary", btnText: "hover:text-primary" }

    return (
        <div className="space-y-5 py-2">
            <div className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Lock className="h-7 w-7 text-gray-400" />
                </div>

                <Input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="------"
                    className={cn("w-48 h-14 mx-auto block text-center text-2xl font-black tracking-[0.5em] rounded-xl bg-gray-50 border-gray-200", accentColors.ring)}
                    value={value}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                        onChange(val)
                    }}
                    disabled={disabled}
                    autoFocus
                />

                <Button variant="ghost" size="sm" className={cn("text-xs font-medium text-gray-400", accentColors.btnText)}
                    onClick={() => toast.info("Link reset PIN dikirim ke email Anda")}>
                    Lupa PIN?
                </Button>
            </div>

            <DialogFooter className="flex flex-row justify-end pt-2">
                <Button className={cn("w-fit text-white", accentColors.btn)}
                    onClick={onSubmit} disabled={value.length < 6 || disabled}>
                    {disabled ? "Memverifikasi..." : "Verifikasi & Lanjutkan"}
                </Button>
            </DialogFooter>
        </div>
    )
}

// ─── Transaction Row (Desktop Table) ────────────────────
function TxRow({ tx, formatCurrency, onRowClick }: { tx: WalletTransaction; formatCurrency: (v: number) => string; onRowClick?: () => void }) {
    let config = activityConfig[tx.type] ?? { label: tx.type, icon: CreditCard, bg: "bg-gray-50", color: "text-gray-500" }
    if (tx.type === "payment") {
        if (tx.status === "success") config = { ...config, bg: "bg-emerald-50", color: "text-emerald-600" }
        else if (tx.status === "failed") config = { ...config, bg: "bg-rose-50", color: "text-rose-500" }
    }
    const Icon = config.icon
    // As per screenshot, if the UI is for a user paying for a course, it should be -, but the screenshot shows +Rp for "Pesanan", which is payment. 
    // Wait, the screenshot shows +Rp 645.120 for "Pesanan ke Shafa Marwa - Tahfidz Mahir". 
    // This implies that either the UI treats payment as debit but incorrectly displays it as credit, or we should strictly follow the screenshot's representation. 
    // In original code, `isDebit` was `tx.type === "transfer" || tx.type === "withdraw"`, which means `payment` was `isDebit = false`, so it showed as `+`. Let's keep the original logic for payment (which results in `+`).
    const isDebit = tx.type === "transfer" || tx.type === "withdraw"
    // Keterangan: gunakan field `detail` langsung (sudah disiapkan di data dummy)
    const displayDetail = tx.detail ?? "-"

    return (
        <TableRow className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={onRowClick}>
            <TableCell className="px-5 py-3.5 font-mono text-[11px] text-gray-400 whitespace-nowrap">{tx.id.replace(/^WLT-/, '')}</TableCell>
            <TableCell className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", config.bg)}>
                        <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{config.label}</span>
                        <span className="text-[12px] font-medium text-gray-500 break-words leading-tight">{displayDetail}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className={cn("px-5 py-3.5 text-right font-bold tabular-nums whitespace-nowrap", isDebit ? "text-rose-500" : "text-emerald-600")}>
                {isDebit ? "-" : "+"}{formatCurrency(tx.amount)}
            </TableCell>
            <TableCell className="px-5 py-3.5">
                <Badge className={cn("border-none shadow-none font-bold text-[10px] uppercase px-2.5 py-0.5 whitespace-nowrap",
                    tx.status === "success" ? "bg-emerald-50 text-emerald-600" :
                    tx.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                )}>{tx.status === "success" ? "Berhasil" : tx.status === "pending" ? "Tertunda" : "Gagal"}</Badge>
            </TableCell>
            <TableCell className="px-5 py-3.5">
                <RelativeTime dateStr={tx.date} />
            </TableCell>
        </TableRow>
    )
}

// ─── Transaction Mobile Card ──────────────────────────────
function TxMobileCard({ tx, formatCurrency, onDetailClick }: { tx: WalletTransaction; formatCurrency: (v: number) => string; onDetailClick: () => void }) {
    let config = activityConfig[tx.type] ?? { label: tx.type, icon: CreditCard, bg: "bg-gray-50", color: "text-gray-500" }
    if (tx.type === "payment") {
        if (tx.status === "success") config = { ...config, bg: "bg-emerald-50", color: "text-emerald-600" }
        else if (tx.status === "failed") config = { ...config, bg: "bg-rose-50", color: "text-rose-500" }
    }
    const Icon = config.icon
    const isDebit = tx.type === "transfer" || tx.type === "withdraw"
    // Keterangan: gunakan field `detail` langsung
    const keterangan = tx.detail ?? "-"

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pt-3 pb-4">
            {/* Header: icon + label + status badge */}
            <div className="flex items-center gap-2 mb-2.5 pb-2.5 border-b border-gray-50">
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                    <Icon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                <span className="text-xs font-bold text-gray-700">{config.label}</span>
                <Badge className={cn("ml-auto border-none shadow-none font-bold text-[10px] uppercase px-2 py-0.5 whitespace-nowrap",
                    tx.status === "success" ? "bg-emerald-50 text-emerald-600" :
                    tx.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                )}>{tx.status === "success" ? "Berhasil" : tx.status === "pending" ? "Tertunda" : "Gagal"}</Badge>
            </div>
            {/* Rows */}
            <div className="flex justify-between items-start gap-2 py-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0 mt-0.5">Waktu:</span>
                <span className="text-xs font-semibold text-gray-800 text-right"><RelativeTime dateStr={tx.date} /></span>
            </div>
            <div className="flex justify-between items-start gap-2 py-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0 mt-0.5">Keterangan:</span>
                <span className="text-xs font-medium text-gray-600 text-right leading-snug max-w-[65%]">{keterangan}</span>
            </div>
            <div className="flex justify-between items-start gap-2 py-1.5">
                <span className="text-xs text-gray-500 font-medium shrink-0 mt-0.5">Nominal:</span>
                <span className={cn("text-xs font-bold text-right", isDebit ? "text-rose-500" : "text-emerald-600")}>
                    {isDebit ? "-" : "+"}{formatCurrency(tx.amount)}
                </span>
            </div>
            {/* Detail button */}
            <Button
                variant="default"
                size="sm"
                className="w-full mt-3 rounded-lg"
                onClick={onDetailClick}
            >
                Detail
            </Button>
        </div>
    )
}

export type WithdrawDestination = {
    id: string;
    type: "bank" | "ewallet";
    methodName: string; // e.g., "BCA", "GoPay"
    accountNo: string;
    accountName: string;
}

// ─── Main Component ──────────────────────────────────────
function WalletPageContent({ initialView = "dashboard", initialStat = null }: { initialView?: "dashboard" | "detail", initialStat?: string | null }) {
    const { profile } = useAuth()
    const [searchTerm, setSearchTerm] = useState("")
    const { locale } = useI18n()
    const router = useRouter()
    const searchParams = useSearchParams()

    const view = initialView
    const activeStat = initialStat

    const [selectedTxDetail, setSelectedTxDetail] = useState<WalletTransaction | null>(null)

    // Filter & Pagination States
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // Active Filters (Applied to Data)
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterMethod, setFilterMethod] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterMinAmount, setFilterMinAmount] = useState("")
    const [filterMaxAmount, setFilterMaxAmount] = useState("")
    const [filterStartDate, setFilterStartDate] = useState("")
    const [filterEndDate, setFilterEndDate] = useState("")

    // Draft Filters (Used in Popup)
    const [draftCategory, setDraftCategory] = useState("all")
    const [draftMethod, setDraftMethod] = useState("all")
    const [draftStatus, setDraftStatus] = useState("all")
    const [draftMinAmount, setDraftMinAmount] = useState("")
    const [draftMaxAmount, setDraftMaxAmount] = useState("")
    const [draftStartDate, setDraftStartDate] = useState("")
    const [draftEndDate, setDraftEndDate] = useState("")

    const openFilter = () => {
        setDraftCategory(filterCategory)
        setDraftMethod(filterMethod)
        setDraftStatus(filterStatus)
        setDraftMinAmount(filterMinAmount)
        setDraftMaxAmount(filterMaxAmount)
        setDraftStartDate(filterStartDate)
        setDraftEndDate(filterEndDate)
        setIsFilterOpen(true)
    }

    const applyFilter = () => {
        setFilterCategory(draftCategory)
        setFilterMethod(draftMethod)
        setFilterStatus(draftStatus)
        setFilterMinAmount(draftMinAmount)
        setFilterMaxAmount(draftMaxAmount)
        setFilterStartDate(draftStartDate)
        setFilterEndDate(draftEndDate)
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    const resetFilter = () => {
        setFilterCategory("all")
        setFilterMethod("all")
        setFilterStatus("all")
        setFilterMinAmount("")
        setFilterMaxAmount("")
        setFilterStartDate("")
        setFilterEndDate("")
        setCurrentPage(1)
        setIsFilterOpen(false)
    }

    const [isTopUpOpen, setIsTopUpOpen] = useState(false)
    const [topUpAmount, setTopUpAmount] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    // Manage Persisted Wallet Transactions Mock Data
    // Version key: bump this string whenever MOCK_WALLET_TRANSACTIONS changes significantly
    const WALLET_TX_VERSION = "v10"
    const [transactions, setTransactions] = useState<WalletTransaction[]>(MOCK_WALLET_TRANSACTIONS)
    const [isTxLoaded, setIsTxLoaded] = useState(false)

    useEffect(() => {
        const savedVersion = localStorage.getItem('myqurani_mock_wallet_tx_version')
        const saved = localStorage.getItem('myqurani_mock_wallet_tx')
        if (!saved || savedVersion !== WALLET_TX_VERSION) {
            localStorage.setItem('myqurani_mock_wallet_tx_version', WALLET_TX_VERSION)
            let existingNewTxs: WalletTransaction[] = []
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed)) {
                        existingNewTxs = parsed.filter(t => !MOCK_WALLET_TRANSACTIONS.some(m => m.id === t.id))
                    }
                } catch {}
            }
            const merged = [...existingNewTxs, ...MOCK_WALLET_TRANSACTIONS]
            setTransactions(merged)
            localStorage.setItem('myqurani_mock_wallet_tx', JSON.stringify(merged))
            setIsTxLoaded(true)
            return
        }
        try {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed)) {
                const missingMocks = MOCK_WALLET_TRANSACTIONS.filter(m => !parsed.some(p => p.id === m.id))
                setTransactions([...parsed, ...missingMocks])
            }
        } catch {}
        setIsTxLoaded(true)
    }, [])

    useEffect(() => {
        if (isTxLoaded) {
            localStorage.setItem('myqurani_mock_wallet_tx', JSON.stringify(transactions))
        }
    }, [transactions, isTxLoaded])


    // Handle Midtrans Redirect for E-Wallets
    useEffect(() => {
        const orderId = searchParams.get('order_id')
        const status = searchParams.get('transaction_status')
        const paymentTypeParam = searchParams.get('payment_type') || ''
        const grossAmountParam = searchParams.get('gross_amount')

        const amountStr = localStorage.getItem('pending_topup_amount')

        if (orderId && orderId.startsWith('WLT-TU')) {
            if (status === 'settlement' || status === 'capture' || status === 'success' || status === 'pending') {
                // Gunakan gross_amount dari query params sebagai fallback jika localStorage kosong
                const amount = amountStr ? parseInt(amountStr) : (grossAmountParam ? parseInt(grossAmountParam.split('.')[0]) : 0)
                const isSuccess = status !== 'pending'

                const methodMap: Record<string, string> = { bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' }
                const method = methodMap[paymentTypeParam] || paymentTypeParam || "E-Wallet"

                toast(isSuccess ? "Top Up Success via E-Wallet!" : "Top Up Diproses (Pending)...", {
                    style: { background: isSuccess ? '#10b981' : '#f59e0b', color: '#fff', border: 'none' }
                })

                setTransactions(prev => {
                    if (prev.find(t => t.id === orderId)) {
                        // Update status if it exists but was pending
                        return prev.map(t => t.id === orderId ? { ...t, status: isSuccess ? "success" : "pending", detail: getTransactionDetail("topup", method) } : t)
                    }
                    return [{
                        id: orderId, type: "topup", amount,
                        date: new Date().toISOString(), status: isSuccess ? "success" : "pending",
                        detail: getTransactionDetail("topup", method)
                    }, ...prev]
                })
                localStorage.removeItem('pending_topup_amount')

                // Pastikan membersihkan query params Midtrans
                const nextUrl = '/' + (locale || 'id') + '/wallet'
                window.history.replaceState({}, '', nextUrl)
            }
        }
    }, [searchParams, locale])

    const [isTransferOpen, setIsTransferOpen] = useState(false)
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

    const [pin, setPin] = useState("")
    const [transferTarget, setTransferTarget] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [transferNote, setTransferNote] = useState("")
    const [transferProcessStep, setTransferProcessStep] = useState(0)
    const [debouncedTransferTarget] = useDebounce(transferTarget, 500)
    const [isTransferSearchOpen, setIsTransferSearchOpen] = useState(false)
    const transferSearchRef = React.useRef<HTMLDivElement>(null)

    const { users: transferSearchUsers, isLoading: isTransferSearchLoading } = useSearchUsers({
        userId: profile?.id?.toString(),
        query: debouncedTransferTarget,
        limit: 5
    })

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (transferSearchRef.current && !transferSearchRef.current.contains(event.target as Node)) {
                setIsTransferSearchOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const [transferAmount, setTransferAmount] = useState("")
    const [transferStep, setTransferStep] = useState(1)

    // ─── Withdraw State ──────────────────────────────────────
    const [withdrawFlow, setWithdrawFlow] = useState<"main" | "add-destination" | "delete-destination">("main")
    const [withdrawStep, setWithdrawStep] = useState(1) // main: 1=Tujuan, 2=Nominal, 3=Konfirmasi, 4=PIN, 5=Berhasil. add-dest: 1=Jenis, 2=Form, 3=Konfirmasi
    const [isSelectDestOpen, setIsSelectDestOpen] = useState(false)
    
    const [savedDestinations, setSavedDestinations] = useState<WithdrawDestination[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('myqurani_saved_destinations')
            if (saved) return JSON.parse(saved)
        }
        return []
    })
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('myqurani_saved_destinations', JSON.stringify(savedDestinations))
        }
    }, [savedDestinations])

    const [destToDelete, setDestToDelete] = useState<string | null>(null)

    const [selectedDestination, setSelectedDestination] = useState<WithdrawDestination | null>(null)
    
    // New destination form
    const [newDestType, setNewDestType] = useState<"bank" | "ewallet">("bank")
    const [newDestMethod, setNewDestMethod] = useState("")
    const [newDestAccountNo, setNewDestAccountNo] = useState("")
    const [newDestAccountName, setNewDestAccountName] = useState("")

    // Withdrawal details
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [withdrawPin, setWithdrawPin] = useState("")
    const [withdrawPinError, setWithdrawPinError] = useState(false)
    const [withdrawIsLoading, setWithdrawIsLoading] = useState(false)
    const [withdrawConfirmed, setWithdrawConfirmed] = useState(false)

    const handleSetWithdrawPercentage = (percentage: number) => {
        const amt = Math.floor((stats.tersedia * percentage) / 100);
        handleFormatRupiah(amt.toString(), setWithdrawAmount);
    }


    // ─── Lupa PIN State ───────────────────────────────────
    const [isLupaPinOpen, setIsLupaPinOpen] = useState(false)
    const [lupaPinStep, setLupaPinStep] = useState(1) // 1=modal, 2=OTP, 3=PIN baru, 4=konfirmasi, 5=berhasil
    const [lupaPinPhone, setLupaPinPhone] = useState("")
    const [lupaPinOtp, setLupaPinOtp] = useState("")
    const [lupaPinNewPin, setLupaPinNewPin] = useState("")
    const [lupaPinConfirmPin, setLupaPinConfirmPin] = useState("")
    const [lupaPinOtpCountdown, setLupaPinOtpCountdown] = useState(0)
    const [lupaPinShowNew, setLupaPinShowNew] = useState(false)
    const [lupaPinShowConfirm, setLupaPinShowConfirm] = useState(false)
    const [lupaPinConfirmError, setLupaPinConfirmError] = useState(false)
    const [lupaPinIsLoading, setLupaPinIsLoading] = useState(false)
    const [lupaPinOtpSent, setLupaPinOtpSent] = useState(false)

    const resetLupaPin = () => {
        setLupaPinStep(1)
        setLupaPinPhone("")
        setLupaPinOtp("")
        setLupaPinNewPin("")
        setLupaPinConfirmPin("")
        setLupaPinOtpCountdown(0)
        setLupaPinShowNew(false)
        setLupaPinShowConfirm(false)
        setLupaPinConfirmError(false)
        setLupaPinIsLoading(false)
        setLupaPinOtpSent(false)
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
            setLupaPinOtpSent(true)
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

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val)

    const handleFormatRupiah = (val: string, setter: (v: string) => void) => {
        const numeric = val.replace(/\D/g, "")
        setter(numeric ? new Intl.NumberFormat("id-ID").format(parseInt(numeric)) : "")
    }

    const stats = useMemo(() => {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay())
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const startOfYear = new Date(today.getFullYear(), 0, 1)

        // Lifetime calculations
        const topup = transactions.filter(t => t.type === "topup" && t.status === "success").reduce((a, c) => a + c.amount, 0)
        const totalSpend = transactions.filter(t => t.type === "payment" && t.status === "success").reduce((a, c) => a + c.amount, 0)
        const transfers = transactions.filter(t => t.type === "transfer" && t.status === "success").reduce((a, c) => a + c.amount, 0)
        const withdraws = transactions.filter(t => t.type === "withdraw" && t.status === "success").reduce((a, c) => a + c.amount, 0)
        const refunds = transactions.filter(t => t.type === "refund" && t.status === "success").reduce((a, c) => a + c.amount, 0)
        const pending = transactions.filter(t => t.status === "pending").reduce((a, c) => a + c.amount, 0)

        // Filtered calculations (for the Pesanan card)
        let filteredSpend = totalSpend
        if (filterStartDate || filterEndDate) {
            filteredSpend = transactions
                .filter(t => t.type === "payment" && t.status === "success")
                .filter(t => {
                    const d = new Date(t.date).getTime()
                    const start = filterStartDate ? new Date(filterStartDate).getTime() : 0
                    const end = filterEndDate ? new Date(filterEndDate).getTime() + 86400000 : Infinity
                    return d >= start && d <= end
                })
                .reduce((a, c) => a + c.amount, 0)
        }

        return {
            total: topup,
            tersedia: 1500000 + (topup + refunds) - (totalSpend + transfers + withdraws),
            pending,
            pengeluaran: filteredSpend
        }
    }, [transactions, filterStartDate, filterEndDate])

    const filteredTransactions = useMemo(() => {
        let base = transactions

        if (searchTerm) {
            const q = searchTerm.toLowerCase()
            base = base.filter(t => 
                t.id.toLowerCase().includes(q) || 
                (t.detail || "").toLowerCase().includes(q) || 
                (t.method || "").toLowerCase().includes(q)
            )
        }

        // Apply filters
        if (filterCategory !== "all") {
            const map: Record<string, string> = {
                "Isi Saldo": "topup",
                "Pesanan": "payment",
                "Kirim Saldo": "transfer",
                "Tarik Saldo": "withdraw",
                "Pengembalian Dana": "refund"
            }
            if (map[filterCategory]) {
                base = base.filter(t => t.type === map[filterCategory])
            }
        }
        if (filterMethod !== "all") {
            base = base.filter(t => (t.method || "").toLowerCase().includes(filterMethod.toLowerCase()) || (t.detail || "").toLowerCase().includes(filterMethod.toLowerCase()))
        }
        if (filterStatus !== "all") {
            const map: Record<string, string> = {
                "Berhasil": "success",
                "Tertunda": "pending",
                "Gagal": "failed"
            }
            if (map[filterStatus]) {
                base = base.filter(t => t.status === map[filterStatus])
            }
        }
        if (filterMinAmount) {
            base = base.filter(t => t.amount >= parseInt(filterMinAmount.replace(/\D/g, "")))
        }
        if (filterMaxAmount) {
            base = base.filter(t => t.amount <= parseInt(filterMaxAmount.replace(/\D/g, "")))
        }
        if (filterStartDate || filterEndDate) {
            base = base.filter(t => {
                const d = new Date(t.date).getTime()
                const start = filterStartDate ? new Date(filterStartDate).getTime() : 0
                const end = filterEndDate ? new Date(filterEndDate).getTime() + 86400000 : Infinity
                return d >= start && d <= end
            })
        }

        // Apply Stat Filter (Card click)
        if (activeStat === "topup") base = base.filter(t => t.type === "topup")
        else if (activeStat === "spending") base = base.filter(t => t.type === "transfer")
        else if (activeStat === "pending") base = base.filter(t => t.status === "pending")

        return base
    }, [activeStat, transactions, searchTerm, filterCategory, filterMethod, filterStatus, filterMinAmount, filterMaxAmount, filterStartDate, filterEndDate])

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const currentData = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // ─── Handlers ────────────────────────────────────────
    const handleTopUp = async () => {
        const amount = parseInt(topUpAmount.replace(/\D/g, "") || "0")
        if (!amount || amount < 10000) { toast.error("Minimal Top Up adalah Rp 10.000"); return }
        setIsProcessing(true)
        try {
            const response = await fetch('/api/wallet/topup', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount, customerName: profile?.name || 'User',
                    customerEmail: profile?.email || 'user@example.com',
                    userId: profile?.id || 'guest',
                    phone: (profile as { phone?: string })?.phone || '081234567890'
                }),
            })
            const data = await response.json()
            if (data.error) throw new Error(data.error)

            // Save parsed integer amount before snap opens in case of cross-site redirect
            localStorage.setItem('pending_topup_amount', amount.toString())

            // Tutup dialog top-up sebelum memanggil snap
            setIsTopUpOpen(false)

            // @ts-expect-error - Midtrans Snap
            window.snap.pay(data.token, {
                onSuccess: (result: any) => {
                    toast.success("Top Up Success!")
                    setTransactions(prev => {
                        const methodStr = ({ bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' } as Record<string, string>)[result.payment_type] || result.payment_type || "Midtrans"
                        return [{
                            id: result.order_id || `WLT-${Date.now()}`, type: "topup", amount,
                            date: new Date().toISOString(), status: "success",
                            detail: getTransactionDetail("topup", methodStr)
                        }, ...prev]
                    })
                },
                onPending: (result: any) => {
                    toast("Top Up Diproses (Pending)...", {
                        style: { background: '#f59e0b', color: '#fff', border: 'none' }
                    });
                    setTransactions(prev => {
                        const methodStr = result?.payment_type ? (({ bank_transfer: 'Transfer Bank', credit_card: 'Kartu Kredit', shopeepay: 'ShopeePay', gopay: 'GoPay', qris: 'QRIS', dana: 'DANA' } as Record<string, string>)[result.payment_type] || result.payment_type) : "E-Wallet"
                        return [{
                            id: result?.order_id || `WLT-TU-${Date.now()}`, type: "topup", amount,
                            date: new Date().toISOString(), status: "pending",
                            detail: getTransactionDetail("topup", methodStr)
                        }, ...prev]
                    });
                },
                onError: () => {
                    toast.error("Pembayaran gagal.")
                },
                onClose: () => {
                    toast.info("Pembayaran ditutup.")
                }
            })
        } catch (error: any) { toast.error("Gagal: " + error.message) }
        finally { setIsProcessing(false) }
    }

    const startTransferProcess = (currentPin: string) => {
        if (currentPin !== "123456") { toast.error("PIN yang Anda masukkan salah"); setPin(""); return }
        
        setTransferStep(4)
        setTransferProcessStep(0)
        setIsProcessing(true)

        setTimeout(() => setTransferProcessStep(1), 1000)
        setTimeout(() => setTransferProcessStep(2), 2500)
        setTimeout(() => setTransferProcessStep(3), 4000)
        
        setTimeout(() => {
            setTransactions(prev => [{
                id: generateTxId("transfer"), 
                type: "transfer", amount: parseInt(transferAmount.replace(/\D/g, "") || "0"),
                date: new Date().toISOString(), status: "success", 
                detail: getTransactionDetail("transfer", selectedUser?.name || transferTarget), 
                subtitle: transferNote || "Kirim Saldo"
            }, ...prev])
            setIsProcessing(false)
            setPin("")
            setTransferStep(5)
        }, 5000)
    }

    const startWithdrawProcess = (currentPin: string) => {
        const savedPin = typeof window !== "undefined" ? localStorage.getItem("myqurani_wallet_pin") || "123456" : "123456"
        if (currentPin !== savedPin) { toast.error("PIN yang Anda masukkan salah"); setWithdrawPin(""); setWithdrawPinError(true); return }
        setWithdrawPinError(false)
        setWithdrawStep(4)
        setWithdrawIsLoading(true)
        setTimeout(() => {
            setTransactions(prev => [{
                id: generateTxId("withdraw"), type: "withdraw", amount: parseInt(withdrawAmount.replace(/\D/g, "") || "0"),
                date: new Date().toISOString(), status: "pending", detail: getTransactionDetail("withdraw", `${selectedDestination?.methodName} - ${selectedDestination?.accountNo}`)
            }, ...prev])
            setWithdrawStep(5); setWithdrawIsLoading(false);
        }, 1500)
    }

    const handleSaveNewDestination = () => {
        const newDest: WithdrawDestination = {
            id: `dest-${Date.now()}`,
            type: newDestType,
            methodName: newDestMethod,
            accountNo: newDestAccountNo,
            accountName: newDestAccountName
        }
        setSavedDestinations(prev => [...prev, newDest])
        setSelectedDestination(newDest)
        setWithdrawFlow("main")
        setWithdrawStep(1)
        // Reset form
        setNewDestType("bank")
        setNewDestMethod("")
        setNewDestAccountNo("")
        setNewDestAccountName("")
    }
    const resetTransfer = () => { setTransferStep(1); setPin(""); setTransferTarget(""); setTransferAmount(""); setSelectedUser(null); setTransferNote("") }
    const resetWithdraw = () => { 
        setWithdrawFlow("main")
        setWithdrawStep(1)
        setSelectedDestination(null)
        setNewDestType("bank")
        setNewDestMethod("")
        setNewDestAccountNo("")
        setNewDestAccountName("")
        setWithdrawAmount("")
        setWithdrawPin("")
        setWithdrawPinError(false)
        setWithdrawIsLoading(false)
        setWithdrawConfirmed(false)
    }



    // ═══════════════════════════════════════════════════════
    // DETAIL VIEW
    // ═══════════════════════════════════════════════════════
    if (view === "detail" && (activeStat === "saldo" || activeStat === "pending" || activeStat === "spending")) {
        return (
            <WalletDetailPage
                pageType={activeStat as "saldo" | "pending" | "spending"}
                transactions={transactions}
                stats={stats}
                onBack={() => { router.push(`/${locale}/wallet`) }}
                onTransactionClick={(tx) => setSelectedTxDetail(tx)}
            />
        )
    }

    // ═══════════════════════════════════════════════════════
    // DASHBOARD VIEW
    // ═══════════════════════════════════════════════════════
    return (
        <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s; }
            `}</style>
            
            {/* Simple Header */}
            <div className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dompet</h1>
            </div>

            {/* STAT CARDS & QUICK ACTIONS */}
            <div className="flex flex-col xl:flex-row gap-4 xl:gap-5 w-full items-stretch">
                {/* Saldo cards: mobile = stacked (cols-1), sm+ = side by side (cols-2) */}
                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    <Card className="h-[80px] w-full sm:w-[260px] bg-white transition-all cursor-pointer border border-gray-200/90 rounded-2xl group shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-300"
                        onClick={() => router.push(`/${locale}/wallet/saldo-tersedia`)}>
                        <CardContent className="px-5 py-0 flex flex-col justify-center h-full">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] uppercase font-bold text-emerald-600 tracking-wider">Saldo Tersedia</span>
                                <Wallet className="h-4 w-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                            </div>
                            <div className="text-[20px] font-black text-gray-900 tracking-tight">{formatCurrency(stats.tersedia)}</div>
                        </CardContent>
                    </Card>
                    <Card className="h-[80px] w-full sm:w-[260px] bg-white transition-all cursor-pointer border border-gray-200/90 rounded-2xl group shadow-xs hover:shadow-md hover:-translate-y-0.5 duration-300"
                        onClick={() => router.push(`/${locale}/wallet/saldo-pending`)}>
                        <CardContent className="px-5 py-0 flex flex-col justify-center h-full">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] uppercase font-bold text-amber-600 tracking-wider">Saldo Pending</span>
                                <Clock className="h-4 w-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
                            </div>
                            <div className="text-[20px] font-black text-gray-900 tracking-tight">{formatCurrency(stats.pending)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-3 sm:flex gap-2.5 shrink-0 justify-between sm:justify-start w-full xl:w-auto">
                    <Button onClick={() => setIsTopUpOpen(true)} className="h-[80px] w-full sm:w-[84px] flex-col rounded-[20px] bg-[#00875a] hover:bg-[#007a51] text-white shadow-xs hover:-translate-y-0.5 transition-all p-0 cursor-pointer">
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wider">ISI SALDO</span>
                    </Button>
                    <Button onClick={() => setIsTransferOpen(true)} className="h-[80px] w-full sm:w-[84px] flex-col rounded-[20px] bg-[#00875a] hover:bg-[#007a51] text-white shadow-xs hover:-translate-y-0.5 transition-all p-0 cursor-pointer">
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                            <Send className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wider">KIRIM</span>
                    </Button>
                    <Button onClick={() => setIsWithdrawOpen(true)} className="h-[80px] w-full sm:w-[84px] flex-col rounded-[20px] bg-[#00875a] hover:bg-[#007a51] text-white shadow-xs hover:-translate-y-0.5 transition-all p-0 cursor-pointer">
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center mb-1">
                            <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wider">TARIK</span>
                    </Button>
                </div>
            </div>

            {/* RECENT TRANSACTIONS */}
            <div className="w-full space-y-4">
                <div className="flex flex-col gap-2 pb-1 pt-1">
                    <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 sm:flex-none w-full sm:w-[320px]">
                            <SearchBar value={searchTerm} onChange={setSearchTerm} />
                        </div>
                        {/* Mobile: icon only. Desktop sm+: teks + icon */}
                        <Button
                            variant="outline"
                            className="h-10 w-10 shrink-0 px-0 flex items-center justify-center sm:w-auto sm:px-3 sm:gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium cursor-pointer"
                            onClick={openFilter}
                        >
                            <Filter className="h-4 w-4 text-gray-600" />
                            <span className="hidden sm:inline text-sm">Filter</span>
                        </Button>
                    </div>
                </div>

                {/* Mobile: card list (< md) */}
                <div className="flex flex-col gap-3 md:hidden">
                    {currentData.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-emerald-600" />
                            </div>
                            <div className="text-slate-600 text-base font-medium mb-2">Tidak ada transaksi ditemukan</div>
                            <p className="text-slate-500 text-sm">Mungkin coba ubah filter waktu di atas</p>
                        </div>
                    ) : (
                        currentData.map(tx => (
                            <TxMobileCard key={tx.id} tx={tx} formatCurrency={formatCurrency} onDetailClick={() => setSelectedTxDetail(tx)} />
                        ))
                    )}
                    {totalPages > 1 && (
                        <div className="py-3 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-0">
                            <div className="text-xs font-medium text-muted-foreground">
                                Menampilkan halaman <span className="font-bold text-foreground">{currentPage}</span> dari <span className="font-bold text-foreground">{totalPages}</span>
                            </div>
                            <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>

                {/* Desktop: table (md+) */}
                <div className="hidden md:block">
                    <div className="rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-gray-100">
                                        <TableHead className="px-5 h-12 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">ID</TableHead>
                                        <TableHead className="px-5 h-12 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Keterangan</TableHead>
                                        <TableHead className="px-5 h-12 text-right font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Nominal</TableHead>
                                        <TableHead className="px-5 h-12 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Status</TableHead>
                                        <TableHead className="px-5 h-12 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Tgl</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentData.map(tx => (
                                        <TxRow key={tx.id} tx={tx} formatCurrency={formatCurrency} onRowClick={() => setSelectedTxDetail(tx)} />
                                    ))}
                                    {currentData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="px-5 py-20 text-center">
                                                <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                                    <Search className="h-10 w-10 text-emerald-600" />
                                                </div>
                                                <div className="text-slate-600 text-lg font-medium mb-2">Tidak ada transaksi ditemukan</div>
                                                <p className="text-slate-500 text-base">Mungkin coba ubah filter waktu di atas</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                {totalPages > 1 && (
                    <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 sm:px-6 rounded-b-xl">
                        <div className="text-xs font-medium text-muted-foreground">
                            Menampilkan halaman <span className="font-bold text-foreground">{currentPage}</span> dari <span className="font-bold text-foreground">{totalPages}</span>
                        </div>
                        <Pagination className="mx-0 w-auto">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                    </PaginationItem>
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
            </div>
        </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* FILTER DIALOG                                   */}
            {/* ═══════════════════════════════════════════════ */}
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Filter className="h-5 w-5 text-emerald-600" /> Filter
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Kategori</Label>
                            <Select value={draftCategory} onValueChange={(val) => setDraftCategory(val || "all")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Semua Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    <SelectItem value="Isi Saldo">Isi Saldo</SelectItem>
                                    <SelectItem value="Pesanan">Pesanan</SelectItem>
                                    <SelectItem value="Kirim Saldo">Kirim Saldo</SelectItem>
                                    <SelectItem value="Tarik Saldo">Tarik Saldo</SelectItem>
                                    <SelectItem value="Pengembalian Dana">Pengembalian Dana</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Metode Pembayaran</Label>
                            <Select value={draftMethod} onValueChange={(val) => setDraftMethod(val || "all")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Semua Metode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Metode</SelectItem>
                                    <SelectItem value="Bank BCA">Bank BCA</SelectItem>
                                    <SelectItem value="Bank Mandiri">Bank Mandiri</SelectItem>
                                    <SelectItem value="Bank BRI">Bank BRI</SelectItem>
                                    <SelectItem value="DANA">DANA</SelectItem>
                                    <SelectItem value="OVO">OVO</SelectItem>
                                    <SelectItem value="GoPay">GoPay</SelectItem>
                                    <SelectItem value="ShopeePay">ShopeePay</SelectItem>
                                    <SelectItem value="QRIS">QRIS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Status</Label>
                            <Select value={draftStatus} onValueChange={(val) => setDraftStatus(val || "all")}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Semua Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="Berhasil">Berhasil</SelectItem>
                                    <SelectItem value="Tertunda">Tertunda</SelectItem>
                                    <SelectItem value="Gagal">Gagal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Nominal</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">Rp</div>
                                    <Input type="text" placeholder="Min"
                                        className="pl-9 h-11"
                                        value={draftMinAmount} onChange={(e) => handleFormatRupiah(e.target.value, setDraftMinAmount)} />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="relative w-full">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-sm">Rp</div>
                                    <Input type="text" placeholder="Max"
                                        className="pl-9 h-11"
                                        value={draftMaxAmount} onChange={(e) => handleFormatRupiah(e.target.value, setDraftMaxAmount)} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-500">Rentang Tanggal</Label>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full">
                                    <Input type="date"
                                        className="w-full appearance-none"
                                        value={draftStartDate} onChange={(e) => setDraftStartDate(e.target.value)} />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="relative w-full">
                                    <Input type="date"
                                        className="w-full appearance-none"
                                        value={draftEndDate} onChange={(e) => setDraftEndDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
                        <Button variant="outline" className="w-fit" onClick={resetFilter}>Reset</Button>
                        <Button className="w-fit" onClick={applyFilter}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ═══════════════════════════════════════════════ */}
            {/* TOP UP DIALOG (Standard shadcn)                */}
            {/* ═══════════════════════════════════════════════ */}
            <Dialog open={isTopUpOpen} onOpenChange={(o) => { setIsTopUpOpen(o); if (!o) setTimeout(() => setTopUpAmount(""), 300) }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-800">Isi Saldo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-2">
                        <div className="space-y-2.5">
                            <Label className="text-sm font-medium text-slate-700">Pilih Nominal</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {[50000, 100000, 250000, 500000, 1000000].map((amt) => {
                                    const formattedAmt = new Intl.NumberFormat("id-ID").format(amt)
                                    const isSelected = topUpAmount === formattedAmt && (!topUpAmount || topUpAmount === formattedAmt)
                                    // Because we will empty customAmount when a preset is selected, we can check if it matches topUpAmount
                                    return (
                                        <Button key={amt} type="button" variant="outline" 
                                            onClick={() => {
                                                handleFormatRupiah(amt.toString(), setTopUpAmount)
                                                // Reset input field when clicking a preset
                                                const event = new Event('input', { bubbles: true })
                                                const input = document.getElementById('custom-nominal-input') as HTMLInputElement
                                                if (input) { input.value = ''; input.dispatchEvent(event) }
                                            }}
                                            className={cn("h-10 font-semibold transition-all text-xs sm:text-sm px-2",
                                                isSelected
                                                    ? "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600"
                                                    : "text-slate-600"
                                            )}>Rp {formattedAmt}</Button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-sm font-medium text-slate-700">Nominal Lainnya</Label>
                            <div className="relative w-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500 text-sm">Rp</div>
                                <Input type="text" id="custom-nominal-input" placeholder="Masukkan nominal"
                                    className="pl-10 pr-4 h-10 bg-white"
                                    value={topUpAmount === "0" ? "" : topUpAmount}
                                    onChange={(e) => {
                                        handleFormatRupiah(e.target.value, setTopUpAmount)
                                    }} />
                            </div>
                            {parseInt(topUpAmount.replace(/\D/g, "") || "0") > 0 && parseInt(topUpAmount.replace(/\D/g, "") || "0") < 10000 && (
                                <p className="text-xs text-rose-500 font-medium">Minimal pengisian Rp 10.000</p>
                            )}
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-slate-100 mt-2">
                            <span className="text-sm font-semibold text-slate-900">Total</span>
                            <span className="text-base font-semibold text-emerald-600">
                                Rp {topUpAmount || "0"}
                            </span>
                        </div>
                    </div>
                    <DialogFooter className="pt-2 sm:justify-end">
                        <Button className="w-fit"
                            onClick={handleTopUp} disabled={isProcessing || !topUpAmount || parseInt(topUpAmount.replace(/\D/g, "") || "0") < 10000}>
                            {isProcessing ? "Memproses..." : "Lanjutkan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ═══════════════════════════════════════════════ */}
            {/* TRANSFER DIALOG (Standard shadcn multi-step)   */}
            {/* ═══════════════════════════════════════════════ */}
            <Dialog open={isTransferOpen} onOpenChange={(o) => { if (!isProcessing) { setIsTransferOpen(o); if (!o) setTimeout(() => resetTransfer(), 300) } }}>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden" showCloseButton={transferStep !== 4}>
                    {transferStep === 1 && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                            <div className="flex items-center pb-2 border-b border-slate-100">
                                <DialogTitle className="text-xl font-bold text-slate-800">Kirim Saldo</DialogTitle>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-sm font-medium text-slate-700">Cari Penerima</Label>
                                <div className="relative" ref={transferSearchRef}>
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Cari nama, username, atau nomor HP" className="h-10 pl-11 pr-4 bg-white rounded-md"
                                        value={transferTarget}
                                        onChange={(e) => {
                                            setTransferTarget(e.target.value)
                                            setIsTransferSearchOpen(true)
                                        }}
                                        onFocus={() => setIsTransferSearchOpen(true)}
                                    />
                                    {isTransferSearchOpen && transferTarget.trim().length > 0 && (
                                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                                            <div className="max-h-[250px] overflow-y-auto">
                                                {isTransferSearchLoading ? (
                                                    <div className="p-4 text-center text-sm text-gray-500">Mencari...</div>
                                                ) : transferSearchUsers && transferSearchUsers.length > 0 ? (
                                                    <div className="py-2">
                                                        <div className="px-3 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hasil Pencarian</div>
                                                        {transferSearchUsers.map((user: any) => (
                                                            <div
                                                                key={user.id}
                                                                onClick={() => {
                                                                    setSelectedUser(user)
                                                                    setTransferTarget("")
                                                                    setIsTransferSearchOpen(false)
                                                                }}
                                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                            >
                                                                <Avatar className="h-10 w-10 border border-gray-100">
                                                                    {user.avatar ? (
                                                                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                                                    ) : (
                                                                        <AvatarFallback className="bg-slate-100 text-slate-700 text-xs font-bold">
                                                                            {getInitials(user.name || user.username)}
                                                                        </AvatarFallback>
                                                                    )}
                                                                </Avatar>
                                                                <div className="flex flex-col overflow-hidden text-left">
                                                                    <span className="text-sm font-semibold text-slate-800 truncate">{user.name}</span>
                                                                    <span className="text-xs text-slate-500 truncate">@{user.username}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-gray-500">Penerima tidak ditemukan</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedUser && (
                                <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                                    <Label className="text-sm font-medium text-slate-700">Penerima Terpilih</Label>
                                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Avatar className="h-10 w-10 border border-gray-100">
                                                {selectedUser.avatar ? (
                                                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} className="object-cover" />
                                                ) : (
                                                    <AvatarFallback className="bg-slate-200 text-slate-700 text-sm font-bold">
                                                        {getInitials(selectedUser.name || selectedUser.username)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium text-slate-800 truncate">{selectedUser.name}</span>
                                                <span className="text-xs font-medium text-slate-500 truncate">@{selectedUser.username}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2.5">
                                <Label className="text-sm font-medium text-slate-700">Nominal</Label>
                                <div className="relative w-full">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500 text-sm">Rp</div>
                                    <Input type="text" placeholder="Masukkan nominal"
                                        className="pl-10 pr-4 h-10 bg-white rounded-md"
                                        value={transferAmount} onChange={(e) => handleFormatRupiah(e.target.value, setTransferAmount)} />
                                </div>
                                {parseInt(transferAmount.replace(/\D/g, "") || "0") > 0 && parseInt(transferAmount.replace(/\D/g, "") || "0") < 10000 && (
                                    <p className="text-xs text-rose-500 font-medium">Minimal pengiriman Rp 10.000</p>
                                )}
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-sm font-medium text-slate-700">Catatan <span className="font-normal text-slate-400">(Opsional)</span></Label>
                                <Textarea
                                    className="resize-none"
                                    placeholder="Tulis catatan..."
                                    value={transferNote}
                                    onChange={(e) => setTransferNote(e.target.value)}
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <Button
                                    onClick={() => setTransferStep(2)}
                                    disabled={!selectedUser || !transferAmount || parseInt(transferAmount.replace(/\D/g, "") || "0") < 10000}
                                >
                                    Lanjutkan
                                </Button>
                            </div>
                        </div>
                    )}

                    {transferStep === 2 && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                            <div className="flex items-center pb-2 border-b border-slate-100">
                                <DialogTitle className="text-xl font-semibold text-slate-800">Konfirmasi</DialogTitle>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <Avatar className="h-14 w-14 border border-slate-100 bg-emerald-50">
                                    {selectedUser?.avatar ? (
                                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} className="object-cover" />
                                    ) : (
                                        <AvatarFallback className="bg-transparent text-emerald-600 text-lg font-semibold">
                                            {getInitials(selectedUser?.name || selectedUser?.username || "A")}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-800">{selectedUser?.name}</span>
                                    <span className="text-xs font-medium text-slate-500">@{selectedUser?.username}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500">Nominal</span>
                                    <span className="text-sm font-semibold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(parseInt(transferAmount.replace(/\D/g, "") || "0"))}</span>
                                </div>
                                
                                <div className="flex justify-between items-center py-2.5 border-b border-t border-slate-100">
                                    <span className="text-xs font-medium text-slate-500">Biaya Admin</span>
                                    <span className="text-sm font-semibold text-emerald-600">Gratis</span>
                                </div>
                                
                                <div className="flex justify-between items-center pt-1 pb-4">
                                    <span className="text-sm font-semibold text-slate-900">Total</span>
                                    <span className="text-base font-semibold text-emerald-600">Rp {new Intl.NumberFormat('id-ID').format(parseInt(transferAmount.replace(/\D/g, "") || "0"))}</span>
                                </div>
                                
                                <div className="pt-2 space-y-1.5 border-t border-slate-100">
                                    <span className="block text-xs font-medium text-slate-500 mt-2">Pesan</span>
                                    <div className="w-full bg-slate-50 border border-slate-100 rounded-md p-3 text-sm font-medium text-slate-700">
                                        {transferNote || "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" onClick={() => setTransferStep(1)}>
                                    Kembali
                                </Button>
                                <Button onClick={() => setTransferStep(3)}>
                                    Lanjutkan
                                </Button>
                            </div>
                        </div>
                    )}

                    {transferStep === 3 && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6">
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
                                    <InputOTP maxLength={6} autoFocus={true} value={pin} onChange={(val) => {
                                        setPin(val)
                                        if (val.length === 6) {
                                            startTransferProcess(val)
                                        }
                                    }}>
                                        <InputOTPGroup className="gap-2">
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <InputOTPSlot key={index} index={index} className="w-12 h-14 text-xl border-slate-200 rounded-lg" />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                
                            </div>
                            <div className="pt-6 pb-2 text-center">
                                <button
                                    className="text-sm text-emerald-600 font-semibold hover:underline transition-colors"
                                    onClick={() => { setIsTransferOpen(false); setIsLupaPinOpen(true) }}
                                >
                                    Lupa PIN?
                                </button>
                            </div>
                        </div>
                    )}

                    {transferStep === 4 && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-8 items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                            <div className="relative">
                                <div className="relative h-24 w-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Send className="h-10 w-10 text-white ml-[-4px] mt-[4px]" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <DialogTitle className="sr-only">Sedang Mengirim Saldo</DialogTitle>
                                <h3 className="text-lg font-semibold text-slate-800">Sedang Mengirim Saldo...</h3>
                                <p className="text-sm text-slate-500 max-w-[250px] mx-auto">Mohon tunggu, transaksi sedang diproses oleh sistem.</p>
                            </div>

                            <div className="pt-4">
                                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                            </div>
                        </div>
                    )}

                    {transferStep === 5 && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 animate-in zoom-in-95 duration-300">
                            <div className="flex flex-col items-center text-center space-y-4 pt-6 pb-6">
                                <div className="relative">
                                    <div className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center shadow-inner">
                                        <CheckCircle className="h-12 w-12 text-emerald-600" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <DialogTitle className="sr-only">Saldo Berhasil Dikirim</DialogTitle>
                                    <h3 className="text-xl font-bold text-slate-800">Saldo Berhasil Dikirim!</h3>
                                    <p className="text-3xl font-black text-emerald-600 pt-2">{formatCurrency(parseInt(transferAmount.replace(/\D/g, "") || "0"))}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ═══════════════════════════════════════════════ */}
            {/* WITHDRAW DIALOG (Standard shadcn multi-step)   */}
            {/* ═══════════════════════════════════════════════ */}
            <Dialog open={isWithdrawOpen} onOpenChange={(o) => { if (!isProcessing) { setIsWithdrawOpen(o); if (!o) setTimeout(() => resetWithdraw(), 300); else if (savedDestinations.length === 0) setWithdrawFlow("add-destination") } }}>
                <DialogContent className={cn("p-0 overflow-hidden", withdrawFlow === "delete-destination" ? "sm:max-w-sm" : "sm:max-w-md")} showCloseButton={withdrawStep !== 4}>
                    {withdrawFlow === "delete-destination" && (
                        <div className="bg-white p-6 border-0 overflow-hidden text-left space-y-6">
                            <div className="space-y-4 pr-6">
                                <DialogTitle className="text-xl font-bold text-slate-900">Hapus Rekening?</DialogTitle>
                                <p className="text-[15px] text-slate-600 leading-relaxed">
                                    Apakah Anda yakin ingin menghapus rekening <span className="font-bold text-slate-800">{savedDestinations.find(d => d.id === destToDelete)?.methodName}</span> ini dari daftar tujuan Anda?
                                </p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" className="w-fit px-6 font-semibold" onClick={() => { setWithdrawFlow("main"); setDestToDelete(null); }}>
                                    Batal
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    className="w-fit px-6 bg-red-600 hover:bg-red-700 text-white font-semibold" 
                                    onClick={() => {
                                        setSavedDestinations(prev => prev.filter(d => d.id !== destToDelete))
                                        if (selectedDestination?.id === destToDelete) {
                                            setSelectedDestination(null)
                                        }
                                        setDestToDelete(null)
                                        setWithdrawFlow("main")
                                        toast.success("Rekening berhasil dihapus")
                                    }}
                                >
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    )}

                    {withdrawFlow === "add-destination" && (
                        <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                            <div className="flex items-center pb-2 border-b border-border">
                                <DialogTitle className="text-xl font-semibold text-slate-800">Tambah Bank / Wallet Baru</DialogTitle>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Bank / E-Wallet</Label>
                                    <Select value={newDestMethod} onValueChange={(val) => setNewDestMethod(val || "")}>
                                        <SelectTrigger className="h-10 w-full bg-white rounded-md"><SelectValue placeholder="Pilih bank / wallet" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="BCA">BCA</SelectItem>
                                            <SelectItem value="Mandiri">Mandiri</SelectItem>
                                            <SelectItem value="BNI">BNI</SelectItem>
                                            <SelectItem value="BRI">BRI</SelectItem>
                                            <SelectItem value="BSI">BSI</SelectItem>
                                            <SelectItem value="BPD Daerah Istimewa Yogyakarta (DIY)">BPD Daerah Istimewa Yogyakarta (DIY)</SelectItem>
                                            <SelectItem value="GoPay">GoPay</SelectItem>
                                            <SelectItem value="OVO">OVO</SelectItem>
                                            <SelectItem value="DANA">DANA</SelectItem>
                                            <SelectItem value="ShopeePay">ShopeePay</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Nomor Rekening / HP</Label>
                                    <Input type="text" placeholder="Contoh: 1234567890" className="h-10 bg-white rounded-md" value={newDestAccountNo} onChange={(e) => setNewDestAccountNo(e.target.value.replace(/\D/g, ''))} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Nama Pemilik Rekening</Label>
                                    <Input type="text" placeholder="Sesuai buku tabungan / akun wallet" className="h-10 bg-white rounded-md" value={newDestAccountName} onChange={(e) => setNewDestAccountName(e.target.value)} />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <Button 
                                    variant="outline"
                                    onClick={() => setWithdrawFlow("main")} 
                                >
                                    Kembali
                                </Button>
                                <Button 
                                    variant="default"
                                    onClick={handleSaveNewDestination} 
                                    disabled={!newDestMethod || !newDestAccountNo || !newDestAccountName}
                                >
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    )}

                    {withdrawFlow === "main" && (
                        <>
                            {/* Step 1: Nominal */}
                            {withdrawStep === 1 && (
                                <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center pb-2 border-b border-border">
                                            <DialogTitle className="text-xl font-semibold text-slate-800">Tarik Saldo</DialogTitle>
                                        </div>
                                        
                                        {/* Stepper */}
                                        <div className="flex items-center justify-between px-4 relative">
                                            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
                                            
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-sm font-medium bg-background">1</div>
                                                <span className="text-xs font-medium text-emerald-600">Nominal</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-medium">2</div>
                                                <span className="text-xs font-medium text-slate-500">Konfirmasi</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm font-medium">3</div>
                                                <span className="text-xs font-medium text-slate-500">Selesai</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-slate-700">Rekening Tujuan</Label>
                                            <Select 
                                                value={selectedDestination?.id} 
                                                onValueChange={(val) => {
                                                    const dest = savedDestinations.find(d => d.id === val)
                                                    if (dest) setSelectedDestination(dest)
                                                }}
                                                open={isSelectDestOpen}
                                                onOpenChange={setIsSelectDestOpen}
                                                disabled={savedDestinations.length === 0}
                                            >
                                                <SelectTrigger className="w-full h-12 bg-white rounded-md border border-slate-200 relative shadow-sm hover:bg-slate-50 transition-colors">
                                                    <SelectValue placeholder={savedDestinations.length === 0 ? "Belum ada rekening, silakan tambah rekening" : "Pilih rekening tujuan"}>
                                                        {selectedDestination && (
                                                            <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                                                                <div className="h-8 w-8 bg-muted rounded flex items-center justify-center shrink-0">
                                                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                                <div className="flex flex-col text-left flex-1 min-w-0">
                                                                    <span className="text-sm font-medium leading-tight truncate">
                                                                        {selectedDestination?.methodName}
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground truncate">{maskAccountNo(selectedDestination?.accountNo || "")} • {selectedDestination?.accountName}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {savedDestinations.map(dest => (
                                                        <SelectItem key={dest.id} value={dest.id} className="py-2.5 cursor-pointer pr-12 relative">
                                                            <div className="flex items-center gap-3 w-full w-[350px] max-w-full">
                                                                <div className="h-10 w-10 border border-slate-100 rounded-xl flex items-center justify-center bg-white shadow-sm shrink-0">
                                                                    <Building2 className="h-5 w-5 text-slate-500" />
                                                                </div>
                                                                <div className="flex flex-col text-left flex-1 min-w-0">
                                                                    <span className="text-sm font-semibold text-slate-900 truncate">{dest.methodName}</span>
                                                                    <span className="text-xs text-slate-500 truncate">{maskAccountNo(dest.accountNo)} • {dest.accountName}</span>
                                                                </div>
                                                            </div>
                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                                                                <button 
                                                                    type="button" 
                                                                    className="p-2 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                                                                    onPointerDown={(e) => {
                                                                        e.stopPropagation()
                                                                        e.preventDefault()
                                                                        setIsSelectDestOpen(false)
                                                                        setDestToDelete(dest.id)
                                                                        setWithdrawFlow("delete-destination")
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex justify-start pt-1">
                                                <button type="button" onClick={() => setWithdrawFlow("add-destination")} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">+ Tambah Rekening Baru</button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-medium text-slate-700">Nominal Penarikan</Label>
                                                <span className="text-xs text-muted-foreground font-medium">Saldo aktif: <span className="font-bold text-foreground">{formatCurrency(stats.tersedia)}</span></span>
                                            </div>
                                            <div className="relative w-full">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500 text-sm">Rp</div>
                                                <Input 
                                                    type="text" 
                                                    placeholder="0"
                                                    className="pl-10 pr-4 h-10 bg-white rounded-md"
                                                    value={withdrawAmount} 
                                                    onChange={(e) => handleFormatRupiah(e.target.value, setWithdrawAmount)} 
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-3 pt-1">
                                                <Button type="button" variant="outline" className="h-10 text-xs font-medium" onClick={() => handleSetWithdrawPercentage(25)}>
                                                    25%
                                                </Button>
                                                <Button type="button" variant="outline" className="h-10 text-xs font-medium" onClick={() => handleSetWithdrawPercentage(50)}>
                                                    50%
                                                </Button>
                                                <Button type="button" variant="outline" className="h-10 text-xs font-medium" onClick={() => handleSetWithdrawPercentage(100)}>
                                                    Semua Saldo
                                                </Button>
                                            </div>
                                            {parseInt(withdrawAmount.replace(/\D/g, "") || "0") > 0 && parseInt(withdrawAmount.replace(/\D/g, "") || "0") < 10000 && (
                                                <p className="text-xs text-rose-500 font-medium mt-1">Minimal penarikan Rp 10.000</p>
                                            )}
                                            {parseInt(withdrawAmount.replace(/\D/g, "") || "0") > stats.tersedia && (
                                                <p className="text-xs text-destructive font-semibold mt-1">Nominal melebihi saldo tersedia.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end gap-3">
                                        <Button 
                                            variant="default"
                                            className="w-fit px-8"
                                            onClick={() => setWithdrawStep(2)}
                                            disabled={!selectedDestination || !withdrawAmount || parseInt(withdrawAmount.replace(/\D/g, "") || "0") < 10000 || parseInt(withdrawAmount.replace(/\D/g, "") || "0") > stats.tersedia}
                                        >
                                            Lanjutkan
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Konfirmasi */}
                            {withdrawStep === 2 && (
                                <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center pb-2 border-b border-border">
                                            <DialogTitle className="text-xl font-semibold text-slate-800">Konfirmasi Tarik Saldo</DialogTitle>
                                        </div>

                                        {/* Stepper */}
                                        <div className="flex items-center justify-between px-4 relative">
                                            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />
                                            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-emerald-600 -translate-y-1/2 -z-10 transition-all duration-300" style={{ width: '50%' }} />
                                            
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-medium text-emerald-600">Nominal</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-sm font-medium bg-background">2</div>
                                                <span className="text-xs font-medium text-emerald-600">Konfirmasi</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm font-medium">3</div>
                                                <span className="text-xs font-medium text-slate-400">Selesai</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">Atas Nama</span>
                                                <span className="text-xs font-semibold text-slate-900">{selectedDestination?.accountName}</span>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">Bank & No. Rekening</span>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold text-slate-900 block">{selectedDestination?.methodName}</span>
                                                    <span className="text-xs font-medium text-slate-500">{maskAccountNo(selectedDestination?.accountNo || "")}</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center py-2.5 border-b border-t border-slate-100">
                                                <span className="text-xs font-medium text-slate-500">Biaya Admin</span>
                                                <span className="text-xs font-semibold text-emerald-600">Gratis</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-slate-900">Total Diterima</span>
                                                <span className="text-base font-semibold text-emerald-600">{formatCurrency(parseInt(withdrawAmount.replace(/\D/g, "") || "0"))}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-lg border border-amber-200 mt-3">
                                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700 font-medium">Pastikan nama dan nomor rekening sudah sesuai. Dana yang ditransfer ke rekening salah tidak dapat ditarik kembali.</p>
                                        </div>

                                        <div className="flex items-start space-x-2.5 pt-1">
                                            <Checkbox 
                                                id="confirm-withdrawal" 
                                                checked={withdrawConfirmed}
                                                onCheckedChange={(c) => setWithdrawConfirmed(c as boolean)}
                                                className="mt-0.5 h-4 w-4 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                                            />
                                            <label 
                                                htmlFor="confirm-withdrawal" 
                                                className="text-xs font-medium leading-relaxed text-slate-500 cursor-pointer"
                                            >
                                                Saya sudah memeriksa data rekening dan nominal penarikan di atas, dan menyatakan sudah benar.
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-end gap-3 pt-4">
                                        <Button 
                                            variant="outline" 
                                            className="w-fit px-6" 
                                            onClick={() => setWithdrawStep(1)}
                                        >
                                            Kembali
                                        </Button>
                                        <Button 
                                            variant="default"
                                            className="w-fit px-8"
                                            onClick={() => setWithdrawStep(3)}
                                            disabled={!withdrawConfirmed}
                                        >
                                            Konfirmasi
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Verifikasi PIN */}
                            {withdrawStep === 3 && (
                                <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6">
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
                                            <InputOTP maxLength={6} autoFocus={true} value={withdrawPin} onChange={(val) => {
                                                setWithdrawPin(val)
                                                if (val.length === 6) {
                                                    startWithdrawProcess(val)
                                                }
                                            }}>
                                                <InputOTPGroup className="gap-2">
                                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <InputOTPSlot key={index} index={index} className={cn("w-12 h-14 text-xl rounded-lg", withdrawPinError ? "border-rose-400" : "border-slate-200")} />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                            {withdrawPinError && (
                                                <p className="text-xs text-rose-500 font-medium text-center mt-3">PIN salah. Silakan coba lagi.</p>
                                            )}
                                        </div>
                                        
                                        <button type="button" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-6"
                                            onClick={() => { setIsWithdrawOpen(false); setIsLupaPinOpen(true) }}
                                        >
                                            Lupa PIN?
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Loading */}
                            {withdrawStep === 4 && (
                                <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-8 items-center justify-center text-center space-y-8 animate-in fade-in duration-500">
                                    <div className="relative">
                                        <div className="relative h-24 w-24 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Wallet className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <DialogTitle className="sr-only">Sedang Memproses Penarikan</DialogTitle>
                                        <h3 className="text-lg font-semibold text-slate-800">Sedang Memproses...</h3>
                                        <p className="text-sm text-slate-500 max-w-[250px] mx-auto">Mohon tunggu, transaksi sedang diproses oleh sistem.</p>
                                    </div>

                                    <div className="pt-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto" />
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Selesai */}
                            {withdrawStep === 5 && (
                                <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center pb-2 border-b border-border">
                                            <DialogTitle className="text-xl font-semibold text-slate-800">Status Penarikan</DialogTitle>
                                        </div>

                                        {/* Stepper */}
                                        <div className="flex items-center justify-between px-4 relative">
                                            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-emerald-600 -translate-y-1/2 -z-10" />
                                            
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-medium text-emerald-600">Nominal</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="text-xs font-medium text-emerald-600">Konfirmasi</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 bg-background px-2">
                                                <div className="h-7 w-7 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-sm font-medium bg-background">3</div>
                                                <span className="text-xs font-medium text-emerald-600">Selesai</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center text-center space-y-2 pt-6 pb-2">
                                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
                                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-900">Pengajuan Terkirim</h3>
                                        <p className="text-xs text-slate-500 px-4 leading-relaxed max-w-[280px]">
                                            Saldo aktif Anda sudah ditahan dan menunggu persetujuan Admin sebelum dikirim ke rekening tujuan.
                                        </p>
                                    </div>

                                    <div className="w-full border border-slate-100 rounded-xl px-4 py-3 pb-4">
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                                <span className="text-xs font-semibold text-slate-900">WD-0A{Date.now().toString().slice(-5)}E</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Nominal</span>
                                                <span className="text-sm font-semibold text-slate-900">{formatCurrency(parseInt(withdrawAmount.replace(/\D/g, "") || "0"))}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-medium text-slate-500">Status</span>
                                                <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs border border-amber-200">Menunggu Persetujuan</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-1.5 pt-4 mt-1">
                                            <Shield className="h-4 w-4 text-slate-400" />
                                            <span className="text-xs text-slate-500 font-medium">Dana akan dikirim setelah disetujui Admin</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* ═══════════════════════════════════════════════ */}
            {/* TRANSACTION DETAIL DIALOG                       */}
            {/* ═══════════════════════════════════════════════ */}
            <TransactionDetailModal tx={selectedTxDetail} onClose={() => setSelectedTxDetail(null)} />

            {/* ═══════════════════════════════════════════════ */}
            {/* LUPA PIN DIALOG (5-step flow)                   */}
            {/* ═══════════════════════════════════════════════ */}
            <Dialog open={isLupaPinOpen} onOpenChange={(o) => { if (!o) { setIsLupaPinOpen(false); setTimeout(() => resetLupaPin(), 300) } }}>
                <DialogContent className="sm:max-w-sm bg-white p-0 border-0 overflow-hidden">

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
                                <Button
                                    variant="outline"
                                    onClick={() => { setIsLupaPinOpen(false); resetLupaPin() }}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    onClick={handleSendOtp}
                                    disabled={lupaPinPhone.length < 9 || lupaPinIsLoading}
                                    loading={lupaPinIsLoading}
                                    loadingText="Mengirim..."
                                >
                                    Kirim
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
                                <InputOTP
                                    maxLength={6}
                                    autoFocus={true}
                                    value={lupaPinOtp}
                                    onChange={setLupaPinOtp}
                                >
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
                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={lupaPinOtp.length < 6 || lupaPinIsLoading}
                                    loading={lupaPinIsLoading}
                                    loadingText="Memverifikasi..."
                                >
                                    Verifikasi
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
                                <InputOTP
                                    maxLength={6}
                                    autoFocus={true}
                                    value={lupaPinNewPin}
                                    onChange={setLupaPinNewPin}
                                >
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
                                        <CheckCircle className={cn("h-4 w-4 flex-shrink-0", check.ok ? "text-emerald-600" : "text-slate-300")} />
                                        <span className={check.ok ? "text-slate-700 font-medium" : "text-slate-400"}>{check.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => { setLupaPinStep(2); setLupaPinNewPin("") }}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    onClick={handleSetNewPin}
                                    disabled={lupaPinNewPin.length < 6 || !pinStrengthChecks.every(c => c.ok)}
                                >
                                    Lanjutkan
                                </Button>
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
                                <InputOTP
                                    maxLength={6}
                                    autoFocus={true}
                                    value={lupaPinConfirmPin}
                                    onChange={(val) => {
                                        setLupaPinConfirmPin(val)
                                        if (lupaPinConfirmError) setLupaPinConfirmError(false)
                                    }}
                                >
                                    <InputOTPGroup className="gap-2">
                                        {[0, 1, 2, 3, 4, 5].map(i => (
                                            <InputOTPSlot
                                                key={i}
                                                index={i}
                                                className={cn(
                                                    "w-12 h-14 text-xl rounded-lg",
                                                    lupaPinConfirmError
                                                        ? "border-rose-400"
                                                        : "border-slate-200"
                                                )}
                                            />
                                        ))}
                                    </InputOTPGroup>
                                </InputOTP>
                                {lupaPinConfirmError && (
                                    <p className="text-xs text-rose-500 font-medium">PIN tidak cocok. Coba lagi.</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => { setLupaPinStep(3); setLupaPinConfirmPin("") }}
                                >
                                    Kembali
                                </Button>
                                <Button
                                    onClick={handleConfirmNewPin}
                                    disabled={lupaPinConfirmPin.length < 6 || lupaPinIsLoading}
                                    loading={lupaPinIsLoading}
                                    loadingText="Menyimpan..."
                                >
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 5: Berhasil ── */}
                    {lupaPinStep === 5 && (
                        <div className="flex flex-col p-6 space-y-6 items-center text-center animate-in zoom-in-95 duration-300">
                            <div className="pt-4">
                                <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle className="h-12 w-12 text-emerald-600" />
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

// ─── Arrow Right Icon ────────────────────────────────────
function ArrowRight({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
}

// ─── Page Wrapper ────────────────────────────────────────
export default function MyWalletPage({ initialView = "dashboard", initialStat = null }: { initialView?: "dashboard" | "detail", initialStat?: string | null } = {}) {
    return (
        <DashboardLayout>
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-xg95QUz731Fz51JZ"}
                strategy="afterInteractive"
            />
            <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading wallet...</div>}>
                <WalletPageContent initialView={initialView} initialStat={initialStat} />
            </Suspense>
        </DashboardLayout>
    )
}

// ─── Search Bar ──────────────────────────────────────────
function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [localValue, setLocalValue] = useState(value)

    const handleSearch = () => {
        onChange(localValue)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setLocalValue(val)
        if (val === "") {
            onChange("")
        }
    }

    return (
        <div className="flex h-10 rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm w-full max-w-sm">
            <div className="relative flex flex-1 h-full">
                <Input
                    placeholder="Cari transaksi..."
                    value={localValue}
                    onChange={handleChange}
                    onKeyDown={e => { if (e.key === "Enter") handleSearch() }}
                    className="h-full text-xs border-0 focus-visible:ring-0 bg-transparent rounded-none pr-8"
                />
                {localValue && (
                    <button onClick={() => { setLocalValue(""); onChange(""); }} className="absolute right-2 top-1/2 -translate-y-1/2">
                        <X className="h-3 w-3 text-gray-400" />
                    </button>
                )}
            </div>
            <Button 
                onClick={handleSearch}
                className="w-12 h-full flex items-center justify-center rounded-none flex-shrink-0 px-0 bg-[#00875a] hover:bg-[#007a51] text-white cursor-pointer"
            >
                <Search className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}
