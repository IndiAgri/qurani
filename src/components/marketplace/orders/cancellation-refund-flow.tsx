"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
    X, AlertCircle, CheckCircle2, Wallet, Loader2,
    Calendar, Clock, ChevronRight, ArrowLeft, Package,
    ReceiptText, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Session {
    id: number
    title: string
    status: "scheduled" | "completed" | "cancelled"
    date: string
    time: string
}

export interface Order {
    id: string
    trainerName: string
    trainerAvatar?: string
    packageName: string
    sessions: number
    price: number
    sessionDetails?: Session[]
    [key: string]: any
}

export interface CancellationRefundFlowProps {
    isOpen: boolean
    onClose: () => void
    order: Order
    cancelScope: "single" | "future"
    targetSessionIds: number[]
    onCancellationComplete?: (result: CancellationResult, refund: RefundResult) => void
}

export interface CancellationResult {
    id: string
    orderId: string
    sessionIds: number[]
    type: "single" | "future"
    reason: string
    note: string
    cancelledAt: string
    status: "success"
}

export interface RefundResult {
    id: string
    orderId: string
    cancellationId: string
    amount: number
    method: "qurani_wallet"
    status: "pending" | "success" | "failed"
    createdAt: string
}

// ─── Steps ────────────────────────────────────────────────────────────────────
type FlowStep = "cancel_form" | "confirm_cancel" | "processing_cancel" | "cancel_success" | "refund_detail" | "processing_refund" | "refund_success"

const CANCEL_REASONS = [
    "Kendala biaya",
    "Sudah tidak membutuhkan layanan",
    "Pindah ke platform/lembaga lain",
    "Kualitas pengajaran tidak sesuai ekspektasi",
    "Lainnya",
]

const CANCELLATION_KEY = "qurani_cancellations"
const REFUND_KEY = "qurani_refunds"
const WALLET_TX_KEY = "myqurani_mock_wallet_tx"

function saveCancellation(result: CancellationResult) {
    try {
        const existing = JSON.parse(localStorage.getItem(CANCELLATION_KEY) || "[]")
        localStorage.setItem(CANCELLATION_KEY, JSON.stringify([...existing, result]))
    } catch (_) { }
}

function getCancellations(orderId: string): CancellationResult[] {
    try {
        const existing = JSON.parse(localStorage.getItem(CANCELLATION_KEY) || "[]")
        return existing.filter((c: CancellationResult) => c.orderId === orderId)
    } catch (_) { return [] }
}

function saveRefund(result: RefundResult) {
    try {
        const existing = JSON.parse(localStorage.getItem(REFUND_KEY) || "[]")
        localStorage.setItem(REFUND_KEY, JSON.stringify([...existing, result]))
    } catch (_) { }
}

function getRefunds(orderId: string): RefundResult[] {
    try {
        const existing = JSON.parse(localStorage.getItem(REFUND_KEY) || "[]")
        return existing.filter((r: RefundResult) => r.orderId === orderId)
    } catch (_) { return [] }
}

function addWalletRefundTransaction(orderId: string, packageName: string, trainerName: string, amount: number) {
    try {
        const txs = JSON.parse(localStorage.getItem(WALLET_TX_KEY) || "[]")
        const newTx = {
            id: `WLT-REF-${Date.now()}`,
            type: "refund",
            amount,
            date: new Date().toISOString(),
            status: "pending",
            detail: `Pengembalian saldo dari ${trainerName} - ${packageName}`,
            packageName: packageName,
            teacherName: trainerName,
            orderId,
        }
        localStorage.setItem(WALLET_TX_KEY, JSON.stringify([newTx, ...txs]))
    } catch (_) { }
}

function saveOrderCancellation(orderId: string, updatedOrder: any, updatedSessions: Session[], newStatus: string) {
    try {
        const saved = JSON.parse(localStorage.getItem("updated_orders_details") || "{}")
        saved[orderId] = { ...updatedOrder, sessionDetails: updatedSessions, status: newStatus }
        localStorage.setItem("updated_orders_details", JSON.stringify(saved))
    } catch (_) { }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatCurrency(val: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val)
}

function formatDate(iso: string) {
    try {
        const date = new Date(iso)
        const d = date.getDate()
        const m = date.toLocaleString("id-ID", { month: "short" })
        const y = date.getFullYear()
        const time = date.toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(':', '.')
        return `${d} ${m} ${y}, ${time}`
    } catch (_) { return iso }
}

// ─── Step 1: Form Modal ────────────────────────────────────────────────────────
function StepCancelForm({ order, cancelScope, targetSessionIds, onNext, onClose }: {
    order: Order
    cancelScope: "single" | "future"
    targetSessionIds: number[]
    onNext: (reason: string, note: string) => void
    onClose: () => void
}) {
    const [reason, setReason] = useState("")
    const [note, setNote] = useState("")

    const scheduled = (order.sessionDetails || []).filter(s => s.status === "scheduled")
    const sessionsToCancel = targetSessionIds.length > 0 
        ? scheduled.filter(s => targetSessionIds.includes(s.id))
        : scheduled

    const sessionPrice = Math.floor((order.price || 0) / (order.sessions || 1))
    const estimatedRefund = sessionPrice * sessionsToCancel.length

    const isValid = reason && (reason !== "Lainnya" || note.trim())

    return (
        <>
            <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                            <X className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-gray-900">Batalkan Pesanan</DialogTitle>
                            <DialogDescription className="text-xs text-gray-500 mt-0.5 font-medium">
                                {cancelScope === "single" && sessionsToCancel.length === 1 
                                    ? `Membatalkan ${sessionsToCancel[0].title}`
                                    : `Batalkan ${sessionsToCancel.length} sesi tersisa`
                                }
                            </DialogDescription>
                        </div>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Guru & Paket */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <Avatar className="w-10 h-10 border border-gray-200 shrink-0">
                        <AvatarImage src={order.trainerAvatar} className="object-cover" />
                        <AvatarFallback className="text-sm font-bold bg-emerald-100 text-emerald-700">{order.trainerName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{order.trainerName}</p>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
                            <Package className="w-3 h-3" />
                            {order.packageName}
                        </p>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sesi tersisa</p>
                        <p className="text-lg font-black text-gray-900">{scheduled.length}</p>
                    </div>
                </div>


                {/* Reason */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-bold text-gray-900">Alasan Pembatalan</Label>
                        <Badge className="bg-red-50 text-red-500 border-none text-[10px] font-bold px-1.5 py-0">Wajib</Badge>
                    </div>
                    <div className="space-y-2">
                        {CANCEL_REASONS.map((r) => (
                            <div
                                key={r}
                                className={cn("flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all", reason === r ? "border-emerald-500 bg-emerald-50/50" : "border-gray-100 bg-white hover:bg-gray-50")}
                                onClick={() => setReason(r)}
                            >
                                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", reason === r ? "border-emerald-500" : "border-gray-300")}>
                                    {reason === r && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{r}</span>
                            </div>
                        ))}
                    </div>
                    {reason === "Lainnya" && (
                        <Textarea
                            placeholder="Tuliskan alasan Anda..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-2 rounded-2xl min-h-[80px] resize-none text-sm"
                            autoFocus
                        />
                    )}
                </div>

            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <Button variant="outline" onClick={onClose} className="flex-1 font-semibold">Batal</Button>
                <Button
                    variant="default"
                    disabled={!isValid}
                    onClick={() => onNext(reason, note)}
                    className="flex-1 font-bold"
                >
                    Lanjutkan
                </Button>
            </div>
        </>
    )
}

// ─── Step 2: Konfirmasi Pembatalan ─────────────────────────────────────────────
function StepConfirmCancel({ order, cancelScope, targetSessionIds, reason, note, onConfirm, onBack }: {
    order: Order
    cancelScope: "single" | "future"
    targetSessionIds: number[]
    reason: string
    note: string
    onConfirm: () => void
    onBack: () => void
}) {
    const scheduled = (order.sessionDetails || []).filter(s => s.status === "scheduled")
    const sessionsToCancel = targetSessionIds.length > 0 
        ? scheduled.filter(s => targetSessionIds.includes(s.id))
        : scheduled
    const sessionPrice = Math.floor((order.price || 0) / (order.sessions || 1))
    const estimatedRefund = sessionPrice * sessionsToCancel.length
    const finalReason = reason === "Lainnya" && note.trim() ? note.trim() : reason

    return (
        <>
            <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <DialogTitle className="text-base font-bold text-gray-900">Konfirmasi Pembatalan</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500 mt-0.5 font-medium">Tinjau sesi yang akan dibatalkan</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Info Banner */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                        Anda akan membatalkan <strong>{sessionsToCancel.length} sesi mendatang</strong> dengan alasan <strong>{finalReason}</strong>
                    </p>
                </div>

                {/* Sessions to Cancel */}
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">Detail Pertemuan</p>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {sessionsToCancel.map((s, i) => (
                            <div key={s.id} className={cn("flex items-center justify-between px-4 py-3", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                                        <Calendar className="w-3 h-3 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">{s.date} · {s.time.split(" - ")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <Button variant="outline" onClick={onBack} className="flex-1 font-semibold">Batal</Button>
                <Button variant="default" onClick={onConfirm} className="flex-1 font-bold">
                    Konfirmasi
                </Button>
            </div>
        </>
    )
}

// ─── Step 3: Processing Cancel ─────────────────────────────────────────────────
function StepProcessingCancel() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <div>
                <h3 className="text-lg font-black text-gray-900">Memproses Pembatalan</h3>
                <p className="text-sm text-gray-500 font-medium mt-2 max-w-xs leading-relaxed">
                    Mohon tunggu, pesanan Anda sedang dibatalkan. Proses ini hanya membutuhkan beberapa saat.
                </p>
            </div>
        </div>
    )
}

// ─── Step 4: Cancel Success ────────────────────────────────────────────────────
function StepCancelSuccess({ order, cancelScope, reason, note, sessionsToCancel, onContinueToRefund, onClose }: {
    order: Order
    cancelScope: "single" | "future"
    reason: string
    note: string
    sessionsToCancel: Session[]
    onContinueToRefund: () => void
    onClose: () => void
}) {
    const completed = (order.sessionDetails || []).filter(s => s.status === "completed").length
    const finalReason = reason === "Lainnya" && note.trim() ? note.trim() : reason

    return (
        <>
            <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between">
                    <DialogTitle className="text-base font-bold text-gray-900">Pembatalan Berhasil</DialogTitle>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Success Icon */}
                <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900">Pembatalan Berhasil</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">{sessionsToCancel.length} sesi telah berhasil dibatalkan.</p>
                    </div>
                </div>

                {/* Rincian */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Pembatalan</p>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {[
                            { label: "Guru", value: order.trainerName },
                            { label: "Paket", value: order.packageName },
                            { label: "Jenis pembatalan", value: cancelScope === "future" ? "Semua sesi mendatang" : "Sesi ini saja" },
                            { label: "Sesi yang telah selesai", value: `${completed} sesi` },
                            { label: "Alasan", value: finalReason },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between px-4 py-3 bg-white">
                                <span className="text-xs text-gray-500 font-medium">{label}</span>
                                <span className="text-xs font-bold text-gray-900 text-right max-w-[200px]">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rincian Sesi */}
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Pertemuan</p>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {sessionsToCancel.map((s, i) => (
                            <div key={s.id} className={cn("flex items-center justify-between px-4 py-3", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                                        <Calendar className="w-3 h-3 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">{s.date} · {s.time.split(" - ")[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                <Button variant="default" onClick={onContinueToRefund} className="w-full font-bold gap-2">
                    Pengembalian Dana
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </>
    )
}

// ─── Step 5: Rincian Pengembalian Dana ─────────────────────────────────────────
function StepRefundDetail({ order, cancelScope, sessionsToCancel, refundAmount, onConfirm, onBack }: {
    order: Order
    cancelScope: "single" | "future"
    sessionsToCancel: Session[]
    refundAmount: number
    onConfirm: () => void
    onBack: () => void
}) {
    const completed = (order.sessionDetails || []).filter(s => s.status === "completed").length
    const sessionPrice = Math.floor((order.price || 0) / (order.sessions || 1))
    const completedCost = sessionPrice * completed

    return (
        <>
            <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <DialogTitle className="text-base font-bold text-gray-900">Pengembalian Dana</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500 mt-0.5 font-medium">Tinjau detail sebelum konfirmasi</DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Guru & Paket */}
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-gray-200 shrink-0">
                        <AvatarImage src={order.trainerAvatar} className="object-cover" />
                        <AvatarFallback className="text-sm font-bold bg-emerald-100 text-emerald-700">{order.trainerName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{order.trainerName}</p>
                        <p className="text-xs text-gray-500">@{order.trainerName?.toLowerCase().replace(/\s+/g, "_")}</p>
                    </div>
                    <div className="ml-auto">
                        <p className="text-xs text-gray-400 text-right font-medium">Paket</p>
                        <p className="text-sm font-bold text-gray-900">{order.packageName}</p>
                    </div>
                </div>

                <Separator />

                {/* Metode */}
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">Metode</p>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Wallet className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Saldo Wallet Qurani</p>
                            <p className="text-[11px] text-gray-500 font-medium">Dana akan masuk ke saldo Wallet Qurani Anda.</p>
                        </div>
                    </div>
                </div>

                {/* Rincian Perhitungan */}
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-900">Detail </p>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {sessionsToCancel.map((s, i) => (
                            <div key={s.id} className={cn("flex items-center justify-between px-4 py-3", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                                        <Calendar className="w-3 h-3 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">{s.date} · {s.time.split(" - ")[0]}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-700">{formatCurrency(sessionPrice)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">Total</p>
                    <span className="text-base font-bold text-emerald-600">{formatCurrency(refundAmount)}</span>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <Button variant="outline" onClick={onBack} className="flex-1 font-semibold">Kembali</Button>
                <Button variant="default" onClick={onConfirm} className="flex-1 font-bold">
                    Konfirmasi
                </Button>
            </div>
        </>
    )
}

// ─── Step 6: Processing Refund ─────────────────────────────────────────────────
function StepProcessingRefund() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-5">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
            <div>
                <h3 className="text-lg font-black text-gray-900">Pengembalian Dana Diproses</h3>
                <p className="text-sm text-gray-500 font-medium mt-2 max-w-xs leading-relaxed">
                    Saldo Wallet Qurani sedang diperbarui.
                </p>
            </div>
        </div>
    )
}

// ─── Step 7: Refund Success ────────────────────────────────────────────────────
function StepRefundSuccess({ order, refundResult, onViewWallet, onClose, onBack }: {
    order: Order
    refundResult: RefundResult
    onViewWallet: () => void
    onClose: () => void
    onBack?: () => void
}) {
    return (
        <>
            <DialogHeader className="px-6 py-5 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 transition-colors shrink-0">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <DialogTitle className="text-base font-bold text-gray-900">Pengembalian Dana</DialogTitle>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Success */}
                <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Pengembalian Dana Diproses</p>
                        <p className="text-3xl font-black text-amber-600 mt-1">{formatCurrency(refundResult.amount)}</p>
                    </div>
                </div>

                {/* Detail Transaksi */}
                <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Transaksi</p>
                    <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                        {[
                            { label: "Nomor Pesanan", value: order.id },
                            { label: "Metode", value: "Saldo Wallet Qurani" },
                            { label: "Tanggal", value: formatDate(refundResult.createdAt) },
                            { label: "Status", value: "Tertunda", isPending: true },
                        ].map(({ label, value, isPending }) => (
                            <div key={label} className="flex items-center justify-between px-4 py-3">
                                <span className="text-xs text-gray-500 font-medium">{label}</span>
                                {isPending
                                    ? <Badge className="bg-amber-50 text-amber-600 border-none text-[10px] font-bold px-2">{value}</Badge>
                                    : <span className="text-xs font-bold text-gray-900">{value}</span>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
                <Button variant="outline" onClick={onClose} className="flex-1 font-semibold">
                    Kembali
                </Button>
                <Button variant="default" onClick={onViewWallet} className="flex-1 font-bold gap-2">
                    <Wallet className="w-4 h-4" />
                    Lihat Saldo
                </Button>
            </div>
        </>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function CancellationRefundFlow({ isOpen, onClose, order, cancelScope, targetSessionIds, onCancellationComplete }: CancellationRefundFlowProps) {
    const [step, setStep] = useState<FlowStep>("cancel_form")
    const [cancelReason, setCancelReason] = useState("")
    const [cancelNote, setCancelNote] = useState("")
    const [cancellationResult, setCancellationResult] = useState<CancellationResult | null>(null)
    const [refundResult, setRefundResult] = useState<RefundResult | null>(null)

    useEffect(() => {
        if (isOpen) {
            setStep("cancel_form")
            setCancelReason("")
            setCancelNote("")
            setCancellationResult(null)
            setRefundResult(null)
        }
    }, [isOpen, order.id])

    const scheduled = (order.sessionDetails || []).filter(s => s.status === "scheduled")
    const sessionsToCancel = targetSessionIds.length > 0 
        ? scheduled.filter(s => targetSessionIds.includes(s.id))
        : scheduled
    const sessionPrice = Math.floor((order.price || 0) / (order.sessions || 1))
    const refundAmount = sessionPrice * sessionsToCancel.length

    const handleStepOneToCancellation = (reason: string, note: string) => {
        setCancelReason(reason)
        setCancelNote(note)
        setStep("confirm_cancel")
    }

    const handleConfirmCancel = () => {
        setStep("processing_cancel")
        // Simulate processing delay
        setTimeout(() => {
            const finalReason = cancelReason === "Lainnya" && cancelNote.trim() ? cancelNote.trim() : cancelReason
            const cancelledIds = sessionsToCancel.map(s => s.id)

            const newCancellationResult: CancellationResult = {
                id: `CXL-${Date.now()}`,
                orderId: order.id,
                sessionIds: cancelledIds,
                type: cancelScope,
                reason: finalReason,
                note: cancelNote,
                cancelledAt: new Date().toISOString(),
                status: "success",
            }

            // Do not save to localStorage yet to allow user to close dialog without changing order state
            setCancellationResult(newCancellationResult)
            setStep("cancel_success")
        }, 2000)
    }

    const handleContinueToRefund = () => {
        setStep("refund_detail")
    }

    const handleConfirmRefund = () => {
        setStep("processing_refund")
        setTimeout(() => {
            if (!cancellationResult) return

            // 1. Save Cancellation State
            saveCancellation(cancellationResult)

            // 2. Save Order State
            const cancelledIds = sessionsToCancel.map(s => s.id)
            const scheduledIds = scheduled.map(s => s.id)
            const remainingScheduled = scheduledIds.filter(id => !cancelledIds.includes(id))
            const newOrderStatus = remainingScheduled.length === 0 ? "cancelled" : "active"
            
            const finalReason = cancelReason === "Lainnya" && cancelNote.trim() ? cancelNote.trim() : cancelReason
            const updatedSessions: Session[] = (order.sessionDetails || []).map(s =>
                cancelledIds.includes(s.id) ? { ...s, status: "cancelled" as const, cancelReason: finalReason } : s
            )
            saveOrderCancellation(order.id, { ...order, cancelReason: finalReason, status: newOrderStatus }, updatedSessions, newOrderStatus)

            // 3. Create Refund State
            const newRefundResult: RefundResult = {
                id: `RFD-${Date.now()}`,
                orderId: order.id,
                cancellationId: cancellationResult.id,
                amount: refundAmount,
                method: "qurani_wallet",
                status: "pending",
                createdAt: new Date().toISOString(),
            }

            saveRefund(newRefundResult)
            addWalletRefundTransaction(order.id, order.packageName, order.trainerName, refundAmount)

            setRefundResult(newRefundResult)
            setStep("refund_success")

            if (onCancellationComplete) onCancellationComplete(cancellationResult, newRefundResult)
        }, 2200)
    }

    const handleViewWallet = () => {
        onClose()
        // Navigate to wallet page (implemented by parent if needed)
        if (typeof window !== "undefined") {
            const locale = window.location.pathname.split("/")[1] || "id"
            window.location.href = `/${locale}/wallet`
        }
    }

    const isProcessing = step === "processing_cancel" || step === "processing_refund"

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isProcessing) onClose() }}>
            <DialogContent className="sm:max-w-md rounded-[24px] border-none shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh] gap-0">
                {step === "cancel_form" && (
                    <StepCancelForm 
                        order={order} 
                        cancelScope={cancelScope}
                        targetSessionIds={targetSessionIds}
                        onNext={handleStepOneToCancellation} 
                        onClose={onClose} 
                    />
                )}
                {step === "confirm_cancel" && (
                    <StepConfirmCancel
                        order={order}
                        cancelScope={cancelScope}
                        targetSessionIds={targetSessionIds}
                        reason={cancelReason}
                        note={cancelNote}
                        onConfirm={handleConfirmCancel}
                        onBack={() => setStep("cancel_form")}
                    />
                )}
                {step === "processing_cancel" && <StepProcessingCancel />}
                {step === "cancel_success" && (
                    <StepCancelSuccess
                        order={order}
                        cancelScope={cancelScope}
                        reason={cancelReason}
                        note={cancelNote}
                        sessionsToCancel={sessionsToCancel}
                        onContinueToRefund={handleContinueToRefund}
                        onClose={onClose}
                    />
                )}
                {step === "refund_detail" && (
                    <StepRefundDetail
                        order={order}
                        cancelScope={cancelScope}
                        sessionsToCancel={sessionsToCancel}
                        refundAmount={refundAmount}
                        onConfirm={handleConfirmRefund}
                        onBack={() => setStep("cancel_success")}
                    />
                )}
                {step === "processing_refund" && <StepProcessingRefund />}
                {step === "refund_success" && refundResult && (
                    <StepRefundSuccess
                        order={order}
                        refundResult={refundResult}
                        onViewWallet={handleViewWallet}
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

// ─── Hook: Read Cancellation State ────────────────────────────────────────────
export function useCancellationState(orderId: string) {
    const [cancellations, setCancellations] = useState<CancellationResult[]>([])
    const [refunds, setRefunds] = useState<RefundResult[]>([])

    const refresh = () => {
        if (typeof window !== "undefined") {
            setCancellations(getCancellations(orderId))
            setRefunds(getRefunds(orderId))
        }
    }

    useEffect(() => {
        refresh()
    }, [orderId])

    return { cancellations, refunds, refresh }
}

// ─── Cancellation Detail Modal (View Mode) ────────────────────────────────────
export function CancellationDetailModal({ isOpen, onClose, order, cancellation, refund }: {
    isOpen: boolean
    onClose: () => void
    order: Order
    cancellation: CancellationResult | null
    refund: RefundResult | null
}) {
    const [viewingRefund, setViewingRefund] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setViewingRefund(false)
        }
    }, [isOpen])

    if (!order || !cancellation) return null

    const handleViewWallet = () => {
        onClose()
        if (typeof window !== "undefined") {
            const locale = window.location.pathname.split("/")[1] || "id"
            window.location.href = `/${locale}/wallet`
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="sm:max-w-md rounded-[24px] border-none shadow-2xl p-0 overflow-hidden flex flex-col max-h-[90vh] gap-0">
                {!viewingRefund ? (
                    <StepCancelSuccess
                        order={order}
                        cancelScope={cancellation.type}
                        reason={cancellation.reason}
                        note={cancellation.note}
                        sessionsToCancel={(order.sessionDetails || []).filter(s => cancellation.sessionIds.includes(s.id))}
                        onContinueToRefund={() => {
                            if (refund) setViewingRefund(true)
                        }}
                        onClose={onClose}
                    />
                ) : (
                    refund && (
                        <StepRefundSuccess
                            order={order}
                            refundResult={refund}
                            onViewWallet={handleViewWallet}
                            onClose={onClose}
                            onBack={() => setViewingRefund(false)}
                        />
                    )
                )}
            </DialogContent>
        </Dialog>
    )
}
