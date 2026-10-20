"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useI18n } from "@/components/providers/i18n-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle2, Download, Receipt, BookOpen, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function OrganizationPayoutsPage() {
    const params = useParams()
    const { locale } = useI18n()
    const orgId = params.orgId as string
    const [timeFilter, setTimeFilter] = useState("this_month")

    const transactions = [
        { id: "TRX-091", teacher: "Ustadz Hanif", type: "Penyelesaian Sesi", prog: "Tahsin Reguler", amount: 150000, splitOrg: 30000, splitTeacher: 120000, status: "Berhasil", date: "Hari ini, 09:00" },
        { id: "TRX-092", teacher: "Ustadzah Sarah", type: "Penyelesaian Sesi", prog: "Tahfidz Anak", amount: 200000, splitOrg: 40000, splitTeacher: 160000, status: "Berhasil", date: "Kemarin, 16:30" },
        { id: "TRX-093", teacher: "Sistem", type: "Pendaftaran Paket", prog: "Iqra Dasar (15 Sesi)", amount: 1500000, splitOrg: 300000, splitTeacher: 1200000, status: "Dana Ditahan", date: "12 Mar 2026, 10:15" },
        { id: "TRX-094", teacher: "Ustadz Ziyad", type: "Penyelesaian Sesi", prog: "Kajian Kitab", amount: 350000, splitOrg: 70000, splitTeacher: 280000, status: "Berhasil", date: "10 Mar 2026, 20:00" },
        { id: "TRX-095", teacher: "Pencairan Saldo", type: "Penarikan Dana Organisasi", prog: "Transfer Bank BCA", amount: -5000000, splitOrg: 0, splitTeacher: 0, status: "Berhasil", date: "01 Mar 2026, 08:00" },
    ]

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Laporan Keuangan</h1>
                    <p className="text-slate-500 font-medium">Distribusi pendapatan otomatis antara organisasi (20%) dan guru (80%).</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={timeFilter} onValueChange={(val) => setTimeFilter(val || "this_month")}>
                        <SelectTrigger className="w-36 rounded-xl border-slate-200 bg-white">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="this_month">Bulan Ini</SelectItem>
                            <SelectItem value="last_month">Bulan Lalu</SelectItem>
                            <SelectItem value="this_year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="hidden md:flex bg-white hover:bg-slate-50 border-slate-200 shadow-sm rounded-xl font-semibold">
                        <Download className="h-4 w-4 mr-2" />
                        Unduh Laporan Format Excel
                    </Button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 text-white relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="h-20 w-20 -mr-4 -mt-4 shadow-2xl" />
                    </div>
                    <CardContent className="p-6 relative z-10">
                        <p className="text-emerald-100 text-sm font-semibold mb-1">Saldo Organisasi Tersedia</p>
                        <h2 className="text-3xl font-bold mb-4">Rp 4.250.000</h2>
                        <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold shadow-sm">
                            Tarik Saldo Ke Rekening
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500">Pendapatan Kotor (Gross)</p>
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                <Receipt className="h-4 w-4" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rp 24.500.000</h2>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Berdasarkan filter: Bulan Ini</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500">Bagi Hasil Organisasi (20%)</p>
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <ArrowDownRight className="h-4 w-4" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-blue-600">Rp 4.900.000</h2>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Masuk otomatis ke kas organisasi</p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500">Total Bagi Hasil Guru (80%)</p>
                            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-purple-600">Rp 19.600.000</h2>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Diteruskan ke masing-masing guru</p>
                    </CardContent>
                </Card>
            </div>

            {/* Transactions History */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                <CardHeader className="border-b border-slate-50 dark:border-slate-800 pb-4">
                    <CardTitle className="text-lg">Riwayat Arus Kas & Bagi Hasil</CardTitle>
                    <CardDescription>Rincian potongan komisi untuk setiap sesi atau paket yang dipesan.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Id & Waktu</th>
                                    <th className="px-6 py-4 font-semibold">Tipe & Keterangan</th>
                                    <th className="px-6 py-4 font-semibold">Nominal Dasar</th>
                                    <th className="px-6 py-4 font-semibold">Porsi Organisasi</th>
                                    <th className="px-6 py-4 font-semibold">Porsi Guru</th>
                                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-bold text-slate-900 dark:text-white">{trx.id}</p>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                                <Clock className="h-3 w-3" />
                                                {trx.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{trx.type}</p>
                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 line-clamp-1">
                                                <Badge variant="outline" className="font-medium bg-white dark:bg-slate-800 px-1.5">{trx.teacher}</Badge>
                                                <span>•</span>
                                                {trx.prog}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                                            {trx.amount < 0 ? `- Rp ${Math.abs(trx.amount).toLocaleString('id-ID')}` : `Rp ${trx.amount.toLocaleString('id-ID')}`}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-blue-600">
                                            {trx.splitOrg > 0 ? `+ Rp ${trx.splitOrg.toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-purple-600">
                                            {trx.splitTeacher > 0 ? `+ Rp ${trx.splitTeacher.toLocaleString('id-ID')}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Badge className={`font-semibold border-none ${
                                                trx.status === 'Berhasil' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}>
                                                {trx.status === 'Berhasil' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                                                {trx.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
