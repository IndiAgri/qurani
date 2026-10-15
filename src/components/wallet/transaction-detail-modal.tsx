"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Type (mirrored from main wallet) ────────────────────
export type WalletTransaction = {
    id: string
    type: string
    amount: number
    date: string
    status: string
    method?: string
    detail?: string
    subtitle?: string
    packageName?: string
    teacherName?: string
    receiverName?: string
    senderName?: string
    accountInfo?: string
}

// ─── Helpers ─────────────────────────────────────────────
const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

const formatDateTime = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr))

const maskAccountNo = (raw: string): string => {
    if (raw.includes("****")) return raw
    const digits = raw.replace(/\D/g, "")
    if (digits.length < 4) return raw
    return `****${digits.slice(-4)}`
}

const typeLabel = (type: string) => {
    switch (type) {
        case "transfer": return "Kirim Saldo"
        case "topup":    return "Isi Saldo"
        case "withdraw": return "Tarik Saldo"
        case "payment":  return "Pembayaran"
        case "refund":   return "Pengembalian Dana"
        default:         return type
    }
}

// ─── Props ────────────────────────────────────────────────
type Props = {
    tx: WalletTransaction | null
    onClose: () => void
}

// ─── Component ───────────────────────────────────────────
export function TransactionDetailModal({ tx, onClose }: Props) {
    const keterangan = !tx ? "-" : (tx.detail ?? "-")

    return (
        <Dialog open={!!tx} onOpenChange={(o) => !o && onClose()}>
            <DialogContent
                className="sm:max-w-md bg-white p-0 border-0 overflow-hidden"
                showCloseButton={false}
            >
                {tx && (
                    <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center gap-3 p-6 pb-4 border-b border-slate-100">
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Detail Transaksi
                            </DialogTitle>
                        </div>

                        <div className="flex flex-col p-6 space-y-6">
                            {/* Status Hero */}
                            <div className="flex flex-col items-center justify-center space-y-4 pt-4 pb-6 border-b border-dashed border-slate-200">
                                <div className={cn(
                                    "h-16 w-16 rounded-full flex items-center justify-center",
                                    tx.status === "success" ? "bg-emerald-500" :
                                    tx.status === "pending" ? "bg-yellow-500" : "bg-rose-500"
                                )}>
                                    {tx.status === "success" ? (
                                        <CheckCircle className="h-8 w-8 text-white" />
                                    ) : tx.status === "pending" ? (
                                        <Clock className="h-8 w-8 text-white" />
                                    ) : (
                                        <AlertTriangle className="h-8 w-8 text-white" />
                                    )}
                                </div>
                                <div className="text-center space-y-1">
                                    <p className={cn(
                                        "text-xs font-bold uppercase tracking-widest",
                                        tx.status === "success" ? "text-emerald-600" :
                                        tx.status === "pending" ? "text-yellow-600" : "text-rose-600"
                                    )}>
                                        {tx.status === "success" ? "Transaksi Berhasil" :
                                         tx.status === "pending" ? "Menunggu Diproses" : "Transaksi Gagal"}
                                    </p>
                                    <h3 className="text-3xl font-extrabold tracking-tight text-emerald-600">
                                        {formatCurrency(tx.amount)}
                                    </h3>
                                </div>
                            </div>

                            {/* Detail Info */}
                            <div className="space-y-4">
                                {/* Section: Informasi Transaksi */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-800 px-1">Informasi Transaksi</h4>
                                    <div className="w-full p-4 bg-slate-50/80 rounded-xl space-y-3.5 border border-slate-100/80">
                                        {/* Jenis */}
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">Jenis Transaksi</span>
                                            <span className="text-xs font-semibold text-slate-900 text-right">{typeLabel(tx.type)}</span>
                                        </div>
                                        {/* Status */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium text-slate-500">Status</span>
                                            <Badge className={cn(
                                                "border-0 font-bold px-2 py-0.5 text-[10px] uppercase",
                                                tx.status === "success" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                                                tx.status === "pending" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                                "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                            )}>
                                                {tx.status === "success" ? "BERHASIL" : tx.status === "pending" ? "TERTUNDA" : "GAGAL"}
                                            </Badge>
                                        </div>
                                        {/* Tanggal */}
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">Tanggal &amp; Waktu</span>
                                            <span className="text-xs font-semibold text-slate-900 text-right">{formatDateTime(tx.date)}</span>
                                        </div>
                                        {/* ID */}
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">ID Transaksi</span>
                                            <span className="text-xs font-semibold text-slate-900 text-right font-mono">{tx.id.replace(/^WLT-/, '')}</span>
                                        </div>

                                        {/* Keterangan — nama paket + guru, atau detail */}
                                        <div className="flex justify-between items-start border-t border-slate-200/70 pt-3.5">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">Keterangan</span>
                                            <span className="text-xs font-semibold text-slate-900 text-right max-w-[60%] leading-snug">{keterangan}</span>
                                        </div>

                                        {/* Metode */}
                                        {tx.method && (
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-medium text-slate-500 mt-0.5">Metode</span>
                                                <span className="text-xs font-semibold text-slate-900 text-right">{tx.method}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section: Rincian Nominal */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-slate-800 px-1">Rincian Nominal</h4>
                                    <div className="w-full p-4 bg-slate-50/80 rounded-xl space-y-3.5 border border-slate-100/80">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">Nominal</span>
                                            <span className="text-sm font-bold text-slate-900 text-right">{formatCurrency(tx.amount)}</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-medium text-slate-500 mt-0.5">Biaya Admin</span>
                                            <span className="text-xs font-semibold text-emerald-600 text-right">Gratis</span>
                                        </div>
                                        {/* Total */}
                                        <div className="flex justify-between items-center border-t border-slate-200/70 pt-3.5 mt-1">
                                            <span className="text-sm font-bold text-slate-900">Total Transaksi</span>
                                            <span className="text-base font-bold text-emerald-600 text-right">{formatCurrency(tx.amount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Pesan (for transfer) */}
                                {tx.type === "transfer" && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-slate-800 px-1">Pesan</h4>
                                        <div className="bg-slate-50/80 rounded-xl p-4 text-xs font-medium text-slate-700 min-h-[50px] flex items-center border border-slate-100/80">
                                            {tx.subtitle || "-"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
                                <Button onClick={onClose}>Tutup</Button>
                            </DialogFooter>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
