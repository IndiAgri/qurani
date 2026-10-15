"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { marketplaceApi, MarketplaceOrder, INITIAL_DUMMY_ORDERS } from "@/lib/marketplace-api"
import { useI18n } from "@/components/providers/i18n-provider"

interface MarketplaceInvoicePageProps {
    id: string
}

// Komponen utama untuk halaman Invoice, menampilkan rincian pembayaran setelah berhasil memesan paket belajar.
export function MarketplaceInvoicePage({ id }: MarketplaceInvoicePageProps) {
    const { locale } = useI18n()
    const [order, setOrder] = useState<MarketplaceOrder | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchOrder() {
            setIsLoading(true)
            const found = await marketplaceApi.getOrderById(id)
            if (found) {
                setOrder(found)
            } else {
                // Fallback dummy order
                setOrder(INITIAL_DUMMY_ORDERS[0])
            }
            setIsLoading(false)
        }
        fetchOrder()
    }, [id])

    if (isLoading || !order) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-500">Memuat invoice...</p>
                </div>
            </div>
        )
    }

    const formattedDate = order.date
        ? new Date(order.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "27 Februari 2026"

    return (
        <div className="min-h-screen bg-slate-100 py-8 font-sans print:bg-white print:py-0">
            {/* Non-printable action bar */}
            <div className="max-w-[800px] mx-auto mb-4 flex items-center justify-between print:hidden px-4 md:px-0">
                <Link
                    href={`/${locale || "id"}/orders`}
                    className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Kembali ke Pesanan
                </Link>
                <div className="flex gap-2.5">
                    <Button
                        variant="outline"
                        onClick={() => window.print()}
                        className="bg-white hover:bg-slate-50 border-slate-200 text-xs font-semibold h-9"
                    >
                        <Printer className="w-3.5 h-3.5 mr-1.5" />
                        Cetak
                    </Button>
                    <Button
                        onClick={() => window.print()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 shadow-sm"
                    >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Unduh PDF
                    </Button>
                </div>
            </div>

            {/* Printable Invoice Container */}
            <div className="max-w-[800px] mx-auto bg-white p-8 md:p-12 shadow-sm rounded-xl print:shadow-none print:rounded-none">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-emerald-600 tracking-tight">my-qurani</h1>
                        <p className="text-[11px] font-semibold text-slate-400 mt-1">Platform Belajar Al-Qur&apos;an Terpercaya</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-slate-900 tracking-tight">INVOICE</p>
                        <p className="text-sm font-bold text-emerald-600 font-mono">{order.id}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {order.paymentStatus || "Lunas"}
                        </span>
                    </div>
                </div>

                {/* Parties Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b-2 border-slate-900">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Diterbitkan atas nama</p>
                        <div className="flex text-sm">
                            <span className="w-20 text-slate-500 font-medium">Pengajar</span>
                            <span className="font-bold text-slate-900">: {order.trainerName}</span>
                        </div>
                        <div className="flex text-sm mt-1">
                            <span className="w-20 text-slate-500 font-medium">Metode</span>
                            <span className="font-medium text-slate-700">: {order.method} ({order.mode || "Online"})</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Untuk</p>
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex">
                                <span className="w-32 text-slate-500 font-medium shrink-0">Pembeli</span>
                                <span className="font-bold text-slate-900">: {order.customerName}</span>
                            </div>
                            <div className="flex">
                                <span className="w-32 text-slate-500 font-medium shrink-0">Tanggal Pembelian</span>
                                <span className="font-bold text-slate-900">: {formattedDate}</span>
                            </div>
                            <div className="flex">
                                <span className="w-32 text-slate-500 font-medium shrink-0">Kontak Pembeli</span>
                                <span className="font-bold text-slate-900">: {order.customerPhone || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-2 border-b-2 border-slate-900 mb-4">
                    <div className="col-span-6">
                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Info Produk</p>
                    </div>
                    <div className="col-span-2 text-center">
                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Jumlah</p>
                    </div>
                    <div className="col-span-2 text-right">
                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Harga Satuan</p>
                    </div>
                    <div className="col-span-2 text-right">
                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider">Total Harga</p>
                    </div>
                </div>

                {/* Table Items */}
                <div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-200 mb-6 items-center">
                    <div className="col-span-6">
                        <p className="text-sm font-bold text-emerald-700 mb-0.5 leading-tight">{order.packageName} - {order.sessions} Pertemuan</p>
                        <p className="text-[11px] font-medium text-slate-500">Mode Belajar: <span className="text-slate-800 font-semibold">{order.mode || "Online"}</span></p>
                    </div>
                    <div className="col-span-2 text-center text-sm font-semibold text-slate-900">
                        1
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-slate-900">
                        Rp{(order.subtotal || order.price).toLocaleString("id-ID")}
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-slate-900">
                        Rp{(order.subtotal || order.price).toLocaleString("id-ID")}
                    </div>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-12">
                    <div className="w-full md:w-1/2 space-y-2.5">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-slate-600">Subtotal Biaya Sesi</span>
                            <span className="font-bold text-slate-900">Rp{(order.subtotal || order.price).toLocaleString("id-ID")}</span>
                        </div>
                        {Boolean(order.discountAmount && order.discountAmount > 0) && (
                            <div className="flex justify-between text-sm text-emerald-600 font-medium">
                                <span>Diskon Kupon Promo</span>
                                <span>-Rp{order.discountAmount?.toLocaleString("id-ID")}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Pajak (PPN 12%)</span>
                            <span className="text-slate-700 font-medium">Rp{(order.tax || 0).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-sm pb-3 border-b border-slate-200">
                            <span className="text-slate-500">Biaya Layanan Platform</span>
                            <span className="text-slate-700 font-medium">Rp{(order.serviceFee || 0).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between text-base pt-1">
                            <span className="font-black text-slate-900 uppercase tracking-wide">Total Tagihan</span>
                            <span className="font-black text-emerald-700 text-lg">Rp{order.price.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="border-t-2 border-slate-900 pt-6 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Pembayaran</p>
                        <p className="text-xs font-black text-emerald-600 mt-0.5">{order.paymentStatus || "Lunas"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5 tracking-wider">Metode Pembayaran:</p>
                        <p className="text-sm font-bold text-slate-900">{order.paymentMethod}</p>
                    </div>
                </div>

                <div className="mt-16 text-[10px] text-slate-400 space-y-1">
                    <p>Invoice ini sah dan diterbitkan secara digital oleh sistem Qurani.</p>
                    <p>Silakan hubungi <span className="font-bold text-emerald-600">Bantuan My-Qurani</span> apabila membutuhkan konfirmasi jadwal atau faktur resmi.</p>
                </div>
            </div>
        </div>
    )
}
