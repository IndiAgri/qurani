"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft, Wallet, Clock, ShoppingBag, Search, X,
    Send, Plus, Download, ArrowDownLeft, CreditCard,
} from "lucide-react"
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { TransactionDetailModal } from "./transaction-detail-modal"
import type { WalletTransaction } from "./transaction-detail-modal"

export type { WalletTransaction }

type DetailPageType = "saldo" | "pending" | "spending"

type Props = {
    pageType: DetailPageType
    transactions: WalletTransaction[]
    stats: { tersedia: number; pending: number; pengeluaran: number; total: number }
    onBack: () => void
    onTransactionClick?: (tx: WalletTransaction) => void
}

const formatCurrency = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

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

function RelativeTime({ dateStr }: { dateStr: string }) {
    const [showFull, setShowFull] = React.useState(false)
    const exact = formatExactDateIndo(dateStr)
    const relative = getRelativeTime(dateStr)
    return (
        <TooltipProvider delay={100}>
            <Tooltip open={showFull || undefined}>
                <TooltipTrigger
                    className="text-[11px] text-gray-500 font-medium whitespace-nowrap cursor-help hover:text-gray-700 transition-colors text-left bg-transparent border-0 p-0 shadow-none hover:bg-transparent"
                    onClick={(e) => { e.stopPropagation(); setShowFull(v => !v) }}
                    onMouseLeave={() => setShowFull(false)}
                >
                    {relative}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs font-medium">
                    {exact}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const activityConfig: Record<string, { label: string; icon: React.ElementType; bg: string; color: string }> = {
    topup: { label: "Isi Saldo", icon: Plus, bg: "bg-emerald-50", color: "text-emerald-600" },
    transfer: { label: "Kirim Saldo", icon: Send, bg: "bg-blue-50", color: "text-blue-500" },
    payment: { label: "Pesanan", icon: ShoppingBag, bg: "bg-emerald-50", color: "text-emerald-600" },
    withdraw: { label: "Tarik Saldo", icon: Download, bg: "bg-rose-50", color: "text-rose-500" },
    refund: { label: "Pengembalian Dana", icon: ArrowDownLeft, bg: "bg-emerald-50", color: "text-emerald-600" },
}

const ITEMS_PER_PAGE = 10

function TxRow({ tx, onRowClick }: { tx: WalletTransaction; onRowClick?: () => void }) {
    let config = activityConfig[tx.type] ?? { label: tx.type, icon: CreditCard, bg: "bg-gray-50", color: "text-gray-500" }
    if (tx.type === "payment") {
        if (tx.status === "success") config = { ...config, bg: "bg-emerald-50", color: "text-emerald-600" }
        else if (tx.status === "failed") config = { ...config, bg: "bg-rose-50", color: "text-rose-500" }
    }
    const Icon = config.icon
    const isDebit = tx.type === "transfer" || tx.type === "withdraw"
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

function TxMobileCard({ tx, onDetailClick }: { tx: WalletTransaction; onDetailClick: () => void }) {
    let config = activityConfig[tx.type] ?? { label: tx.type, icon: CreditCard, bg: "bg-gray-50", color: "text-gray-500" }
    if (tx.type === "payment") {
        if (tx.status === "success") config = { ...config, bg: "bg-emerald-50", color: "text-emerald-600" }
        else if (tx.status === "failed") config = { ...config, bg: "bg-rose-50", color: "text-rose-500" }
    }
    const Icon = config.icon
    const isDebit = tx.type === "transfer" || tx.type === "withdraw"
    const keterangan = tx.detail ?? "-"

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 pt-3 pb-4">
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

function TxTable({ data, onRowClick, emptyIcon, emptyText }: {
    data: WalletTransaction[]
    onRowClick: (tx: WalletTransaction) => void
    emptyIcon: React.ReactNode
    emptyText: string
}) {
    return (
        <>
            <div className="flex flex-col gap-3 md:hidden">
                {data.map(tx => (
                    <TxMobileCard key={tx.id} tx={tx} onDetailClick={() => onRowClick(tx)} />
                ))}
                {data.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                            {emptyIcon}
                        </div>
                        <div className="text-slate-600 text-base font-medium mb-2">{emptyText}</div>
                        <p className="text-slate-500 text-sm">Mungkin coba ubah pencarian</p>
                    </div>
                )}
            </div>
            <div className="hidden md:block">
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
                                    <TableHead className="px-5 h-14 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">ID</TableHead>
                                    <TableHead className="px-5 h-14 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Keterangan</TableHead>
                                    <TableHead className="px-5 h-14 text-right font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Nominal</TableHead>
                                    <TableHead className="px-5 h-14 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Status</TableHead>
                                    <TableHead className="px-5 h-14 text-left font-bold text-[11px] text-slate-500 uppercase tracking-wider align-middle">Tgl</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map(tx => <TxRow key={tx.id} tx={tx} onRowClick={() => onRowClick(tx)} />)}
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="px-5 py-20 text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                                {emptyIcon}
                                            </div>
                                            <div className="text-slate-600 text-lg font-medium mb-2">{emptyText}</div>
                                            <p className="text-slate-500 text-base">Mungkin coba ubah pencarian</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    )
}

function StatCard({ label, value, sub, valueColor = "text-gray-900" }: { label: string; value: string; sub?: string; valueColor?: string }) {
    let labelColor = "text-gray-500"
    if (valueColor.includes("emerald")) labelColor = "text-emerald-600"
    else if (valueColor.includes("amber")) labelColor = "text-amber-600"
    else if (valueColor.includes("rose")) labelColor = "text-rose-600"
    else if (valueColor.includes("blue")) labelColor = "text-blue-600"

    return (
        <Card className="h-[80px] w-full sm:w-[280px] bg-white transition-all border-gray-100 shadow-sm duration-300">
            <CardContent className="px-4 py-0 flex flex-col justify-center h-full">
                <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-[10px] uppercase font-black tracking-wider", labelColor)}>{label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                    <div className="text-[20px] font-black tracking-tight text-gray-900 truncate">{value}</div>
                    {sub && <div className="text-[11px] font-semibold text-gray-400 shrink-0">/ {sub.replace(/^[+-]/, '')}</div>}
                </div>
            </CardContent>
        </Card>
    )
}

export function TxPagination({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) {
    if (totalPages <= 1) return null
    return (
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 sm:px-6 rounded-b-xl">
            <div className="text-xs font-medium text-muted-foreground">
                Menampilkan halaman <span className="font-bold text-foreground">{page}</span> dari <span className="font-bold text-foreground">{totalPages}</span>
            </div>
            <Pagination className="w-auto mx-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink onClick={() => setPage(i + 1)} isActive={page === i + 1} className="cursor-pointer">{i + 1}</PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext onClick={() => setPage(Math.min(totalPages, page + 1))} className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

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
                    placeholder="Cari ID atau keterangan transaksi..."
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

function SaldoTersediaDetail({ transactions, stats, onBack }: Omit<Props, "pageType" | "onTransactionClick">) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null)

    const successTx = transactions.filter(t => t.status === "success")
    const filtered = useMemo(() => {
        if (!search) return successTx
        const q = search.toLowerCase()
        return successTx.filter(t => t.id.toLowerCase().includes(q) || (t.detail ?? "").toLowerCase().includes(q))
    }, [transactions, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const currentData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const totalMasuk = successTx.filter(t => ["topup", "refund"].includes(t.type)).reduce((a, c) => a + c.amount, 0)
    const totalKeluar = successTx.filter(t => ["payment", "withdraw", "transfer"].includes(t.type)).reduce((a, c) => a + c.amount, 0)
    const countMasuk = successTx.filter(t => ["topup", "refund"].includes(t.type)).length
    const countKeluar = successTx.filter(t => ["payment", "withdraw", "transfer"].includes(t.type)).length

    return (
        <>
            <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
                <div className="flex justify-between w-full mb-5 mt-2">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 transition-colors -ml-2 cursor-pointer">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Detail Saldo Tersedia</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full mb-6">
                    <StatCard label="Saldo Tersedia" value={formatCurrency(stats.tersedia)} sub={`${successTx.length} transaksi`} valueColor="text-emerald-600" />
                    <StatCard label="Total Masuk" value={formatCurrency(totalMasuk)} sub={`+${countMasuk} transaksi`} valueColor="text-emerald-600" />
                    <StatCard label="Total Keluar" value={formatCurrency(totalKeluar)} sub={`-${countKeluar} transaksi`} valueColor="text-rose-500" />
                </div>
                <div className="w-full mb-6 space-y-4">
                    <div className="flex flex-col gap-2 pb-2 pt-2">
                        <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 sm:flex-none w-full sm:w-[320px]">
                                <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} />
                            </div>
                        </div>
                    </div>
                    <TxTable data={currentData} onRowClick={setSelectedTx} emptyIcon={<Search className="h-8 w-8 text-emerald-600" />} emptyText="Tidak ada transaksi ditemukan" />
                    <TxPagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            </div>
            <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </>
    )
}

function SaldoPendingDetail({ transactions, stats, onBack }: Omit<Props, "pageType" | "onTransactionClick">) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null)

    const pendingTx = transactions.filter(t => t.status === "pending")
    const filtered = useMemo(() => {
        if (!search) return pendingTx
        const q = search.toLowerCase()
        return pendingTx.filter(t => t.id.toLowerCase().includes(q) || (t.detail ?? "").toLowerCase().includes(q))
    }, [transactions, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const currentData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const saldoMasuk = pendingTx.filter(t => ["topup", "refund"].includes(t.type)).reduce((a, c) => a + c.amount, 0)
    const saldoKeluar = pendingTx.filter(t => ["payment", "withdraw", "transfer"].includes(t.type)).reduce((a, c) => a + c.amount, 0)
    const countMasuk = pendingTx.filter(t => ["topup", "refund"].includes(t.type)).length
    const countKeluar = pendingTx.filter(t => ["payment", "withdraw", "transfer"].includes(t.type)).length

    return (
        <>
            <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
                <div className="flex justify-between w-full mb-5 mt-2">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 transition-colors -ml-2 cursor-pointer">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Detail Saldo Pending</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full mb-6">
                    <StatCard label="Saldo Pending" value={formatCurrency(stats.pending)} sub={`${pendingTx.length} transaksi`} valueColor="text-amber-600" />
                    <StatCard label="Total Masuk" value={formatCurrency(saldoMasuk)} sub={`+${countMasuk} transaksi`} valueColor="text-emerald-600" />
                    <StatCard label="Total Keluar" value={formatCurrency(saldoKeluar)} sub={`-${countKeluar} transaksi`} valueColor="text-rose-500" />
                </div>
                <div className="w-full mb-6 space-y-4">
                    <div className="flex flex-col gap-2 pb-2 pt-2">
                        <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi</h2>
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 sm:flex-none w-full sm:w-[320px]">
                                <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} />
                            </div>
                        </div>
                    </div>
                    <TxTable data={currentData} onRowClick={setSelectedTx} emptyIcon={<Clock className="h-8 w-8 text-amber-500" />} emptyText="Tidak ada transaksi tertunda" />
                    <TxPagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            </div>
            <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </>
    )
}

function PesananDetail({ transactions, stats, onBack }: Omit<Props, "pageType" | "onTransactionClick">) {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null)

    const allPayments = transactions.filter(t => t.type === "payment")
    const filtered = useMemo(() => {
        if (!search) return allPayments
        const q = search.toLowerCase()
        return allPayments.filter(t => t.id.toLowerCase().includes(q) || (t.detail ?? "").toLowerCase().includes(q))
    }, [transactions, search])

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
    const currentData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    const successPay = allPayments.filter(t => t.status === "success")
    const failedPay = allPayments.filter(t => t.status === "failed")
    const totalPesanan = allPayments.reduce((a, c) => a + c.amount, 0)

    return (
        <>
            <div className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
                <div className="flex justify-between w-full mb-5 mt-2">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 rounded-lg hover:bg-slate-100 transition-colors -ml-2 cursor-pointer">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Detail Pesanan</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full mb-6">
                    <StatCard label="Total Pesanan" value={formatCurrency(totalPesanan)} valueColor="text-blue-600" />
                    <StatCard label="Pesanan Aktif" value={formatCurrency(successPay.reduce((a, c) => a + c.amount, 0))} sub={`${successPay.length} pesanan`} valueColor="text-emerald-600" />
                    <StatCard label="Selesai" value={formatCurrency(successPay.reduce((a, c) => a + c.amount, 0))} sub={`${successPay.length} pesanan`} valueColor="text-emerald-600" />
                    <StatCard label="Dibatalkan" value={formatCurrency(failedPay.reduce((a, c) => a + c.amount, 0))} sub={`${failedPay.length} pesanan`} valueColor="text-rose-500" />
                </div>
                <div className="w-full mb-6 space-y-4">
                    <div className="flex flex-col gap-2 pb-2 pt-2">
                        <h2 className="text-lg font-bold text-slate-900">Daftar Pesanan</h2>
                        <div className="flex items-center gap-3 w-full">
                            <div className="flex-1 sm:flex-none w-full sm:w-[320px]">
                                <SearchBar value={search} onChange={v => { setSearch(v); setPage(1) }} />
                            </div>
                        </div>
                    </div>
                    <TxTable data={currentData} onRowClick={setSelectedTx} emptyIcon={<ShoppingBag className="h-8 w-8 text-blue-500" />} emptyText="Tidak ada pesanan ditemukan" />
                    <TxPagination page={page} totalPages={totalPages} setPage={setPage} />
                </div>
            </div>
            <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </>
    )
}

export function WalletDetailPage({ pageType, transactions, stats, onBack }: Props) {
    if (pageType === "saldo") return <SaldoTersediaDetail transactions={transactions} stats={stats} onBack={onBack} />
    if (pageType === "pending") return <SaldoPendingDetail transactions={transactions} stats={stats} onBack={onBack} />
    return <PesananDetail transactions={transactions} stats={stats} onBack={onBack} />
}