"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronDown,
  Info,
  Banknote,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface TransactionRow {
  id: string;
  studentName: string;
  sessionCount: string;
  date: string;
  grossAmount: number;
  cutAmount: number;
  netAmount: number;
  status: "Selesai" | "Pending";
}

const ALL_TRANSACTIONS: TransactionRow[] = [
  {
    id: "tx-1",
    studentName: "Ahmad Hasan",
    sessionCount: "1x Pertemuan",
    date: "15 Okt 2026",
    grossAmount: 500000,
    cutAmount: 72500,
    netAmount: 427500,
    status: "Selesai",
  },
  {
    id: "tx-2",
    studentName: "Siti Aisyah",
    sessionCount: "5x Pertemuan",
    date: "15 Okt 2026",
    grossAmount: 120000,
    cutAmount: 17400,
    netAmount: 102600,
    status: "Pending",
  },
  {
    id: "tx-3",
    studentName: "Budi Santoso",
    sessionCount: "10x Pertemuan",
    date: "15 Okt 2026",
    grossAmount: 250000,
    cutAmount: 36250,
    netAmount: 213750,
    status: "Selesai",
  },
  {
    id: "tx-4",
    studentName: "Rina Wijaya",
    sessionCount: "1x Pertemuan",
    date: "15 Okt 2026",
    grossAmount: 80000,
    cutAmount: 11600,
    netAmount: 68400,
    status: "Selesai",
  },
  {
    id: "tx-5",
    studentName: "Zaki Anwar",
    sessionCount: "5x Pertemuan",
    date: "15 Okt 2026",
    grossAmount: 150000,
    cutAmount: 21750,
    netAmount: 128250,
    status: "Pending",
  },
  {
    id: "tx-6",
    studentName: "Nurul Hidayah",
    sessionCount: "2x Pertemuan",
    date: "14 Okt 2026",
    grossAmount: 200000,
    cutAmount: 29000,
    netAmount: 171000,
    status: "Selesai",
  },
];

export function TeacherEarningsView({ teacherId = "1" }: { teacherId?: string }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Today");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("BCA");

  const totalPages = Math.ceil(ALL_TRANSACTIONS.length / itemsPerPage);
  const displayedTransactions = ALL_TRANSACTIONS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 50000) {
      toast.error("Minimal penarikan dana adalah Rp 50.000");
      return;
    }
    if (amt > 3850000) {
      toast.error("Saldo tersedia tidak mencukupi");
      return;
    }
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    toast.success(`Permintaan penarikan Rp ${amt.toLocaleString("id-ID")} ke ${withdrawMethod} berhasil diajukan!`);
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* Header: Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Earnings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage and track your teaching earnings
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer shadow-2xs focus:outline-none transition">
              <Calendar className="size-4 text-gray-500" />
              <span>{selectedPeriod}</span>
              <ChevronDown className="size-3 text-gray-400 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 rounded-xl p-1 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800"
            >
              {["Today", "This Week", "This Month", "All Time"].map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => setSelectedPeriod(p)}
                  className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${
                    selectedPeriod === p ? "font-bold text-[#00875a]" : ""
                  }`}
                >
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tarik Dana Button */}
          <Button
            onClick={() => setIsWithdrawOpen(true)}
            className="bg-[#00875a] hover:bg-[#007a51] text-white font-medium rounded-xl px-4 h-10 text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-2 transition-all"
          >
            <Wallet className="size-4" />
            <span>Tarik Dana</span>
          </Button>
        </div>
      </div>

      {/* Top 4 Stats Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Pendapatan
            </span>
            <div className="size-7 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp 4.916.250
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Total pendapatan kotor dari seluruh sesi yang terselesaikan.")}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-0.5 cursor-pointer text-left"
          >
            <span>Klik untuk rincian</span>
            <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Card 2: Saldo Tersedia */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Saldo Tersedia
            </span>
            <div className="size-7 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
              <Wallet className="size-4" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#00875a]">
              Rp 3.850.000
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              Bisa ditarik
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsWithdrawOpen(true)}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-0.5 cursor-pointer text-left"
          >
            <span>Klik untuk rincian</span>
            <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Card 3: Saldo Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>Saldo Pending</span>
              <Info className="size-3.5 text-gray-400" />
            </span>
            <div className="size-7 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp 444.600
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Saldo pending sedang dalam masa hold 24 jam sebelum dapat dicairkan.")}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-0.5 cursor-pointer text-left"
          >
            <span>Klik untuk rincian</span>
            <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Card 4: Total Dicaikan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Dicaikan
            </span>
            <div className="size-7 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp 9.400.000
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Total dana honorarium yang telah berhasil ditransfer ke rekening Anda.")}
            className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-0.5 cursor-pointer text-left"
          >
            <span>Klik untuk rincian</span>
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      {/* Middle Grid: Riwayat Pendapatan (Chart) & Penarikan Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Riwayat Pendapatan Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Riwayat Pendapatan
            </h2>
          </div>

          {/* Area Chart Container */}
          <div className="relative w-full h-56 pt-2">
            {/* SVG Curve Chart */}
            <svg
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00875a" stopOpacity="0.28" />
                  <stop offset="80%" stopColor="#00875a" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#00875a" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="45" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="45" y1="65" x2="600" y2="65" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="45" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="45" y1="155" x2="600" y2="155" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="45" y1="195" x2="600" y2="195" stroke="#e2e8f0" />

              {/* Y Axis Labels */}
              <text x="35" y="24" textAnchor="end" className="text-[10px] fill-gray-400 font-medium">600k</text>
              <text x="35" y="69" textAnchor="end" className="text-[10px] fill-gray-400 font-medium">450k</text>
              <text x="35" y="114" textAnchor="end" className="text-[10px] fill-gray-400 font-medium">300k</text>
              <text x="35" y="159" textAnchor="end" className="text-[10px] fill-gray-400 font-medium">150k</text>
              <text x="35" y="196" textAnchor="end" className="text-[10px] fill-gray-400 font-medium">Rp 0k</text>

              {/* Filled Area */}
              <path
                d="M 45 195 C 130 170, 220 120, 310 135 C 380 148, 470 120, 600 65 L 600 195 L 45 195 Z"
                fill="url(#earningsGradient)"
              />

              {/* Curve Stroke Line */}
              <path
                d="M 45 195 C 130 170, 220 120, 310 135 C 380 148, 470 120, 600 65"
                fill="none"
                stroke="#00875a"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Right Column: Penarikan Terakhir */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Penarikan Terakhir
            </h2>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Rp 450.000
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    15 Okt 2026 • BCA
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60">
                  Pending
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Rp 125.000
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">
                    15 Okt 2026 • GoPay
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60">
                  Pending
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => toast.info("Menampilkan seluruh riwayat penarikan dana.")}
              className="text-xs font-semibold text-[#00875a] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table: Riwayat Transaksi */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-6 pb-2">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">
            Riwayat Transaksi
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  MURID / PERTEMUAN
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  TGL TRANSAKSI
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  NILAI KOTOR
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  POTONGAN (14.5%)
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  DITERIMA BERSIH
                </th>
                <th className="py-3 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/90 dark:divide-slate-800/80">
              {displayedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Murid / Pertemuan */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      {tx.studentName}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {tx.sessionCount}
                    </p>
                  </td>

                  {/* Tgl Transaksi */}
                  <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Nilai Kotor */}
                  <td className="py-4 px-4 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    Rp {tx.grossAmount.toLocaleString("id-ID")}
                  </td>

                  {/* Potongan (14.5%) */}
                  <td className="py-4 px-4 text-xs font-medium text-rose-500 whitespace-nowrap">
                    -Rp {tx.cutAmount.toLocaleString("id-ID")}
                  </td>

                  {/* Diterima Bersih */}
                  <td className="py-4 px-4 text-xs font-bold text-[#00875a] whitespace-nowrap">
                    Rp {tx.netAmount.toLocaleString("id-ID")}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {tx.status === "Selesai" ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Selesai
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500">
          <span>
            Menampilkan 1-{displayedTransactions.length} dari {ALL_TRANSACTIONS.length} transaksi
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="size-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`size-8 rounded-lg border text-xs font-semibold flex items-center justify-center cursor-pointer transition ${
                currentPage === 1
                  ? "border-emerald-300 bg-emerald-50/70 text-[#00875a]"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              1
            </button>
            {totalPages > 1 && (
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`size-8 rounded-lg border text-xs font-semibold flex items-center justify-center cursor-pointer transition ${
                  currentPage === 2
                    ? "border-emerald-300 bg-emerald-50/70 text-[#00875a]"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                2
              </button>
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="size-8 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Banner: Skema Pendapatan Pengajar */}
      <div className="bg-[#f0fdf4] dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 p-6 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3.5 pb-2">
          <div className="size-10 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/60 flex items-center justify-center text-[#00875a] shrink-0 shadow-2xs">
            <Banknote className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Skema Pendapatan Pengajar
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              Setiap sesi yang Anda selesaikan akan melalui perhitungan bagi hasil sebagai berikut:
            </p>
          </div>
        </div>

        {/* 3 Columns Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Card 1: Fee Platform */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-gray-100/90 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              FEE PLATFORM
            </span>
            <p className="text-base font-bold text-red-500 mt-1">
              12% / Sesi
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Biaya operasional & server
            </p>
          </div>

          {/* Card 2: Pajak PPh 21 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-gray-100/90 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              PAJAK PPH 21
            </span>
            <p className="text-base font-bold text-red-500 mt-1">
              2.5% / Sesi
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Disetorkan atas nama Anda
            </p>
          </div>

          {/* Card 3: Bersih Diterima */}
          <div className="bg-[#00875a] rounded-2xl p-4.5 text-white shadow-xs">
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">
              BERSIH DITERIMA
            </span>
            <p className="text-base font-bold text-white mt-1">
              85.5% / Sesi
            </p>
            <p className="text-[11px] text-emerald-100/90 mt-1">
              Siap ditarik setelah hold 24 jam
            </p>
          </div>
        </div>
      </div>

      {/* Modal Dialog: Tarik Dana */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wallet className="size-5 text-[#00875a]" />
              Penarikan Saldo Honorarium
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4 py-3 text-xs">
            {/* Saldo info */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-xs text-gray-500">Saldo Tersedia untuk Ditarik:</span>
              <p className="text-xl font-bold text-[#00875a] mt-0.5">
                Rp 3.850.000
              </p>
            </div>

            {/* Rekening Tujuan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pilih Rekening Tujuan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "BCA", sub: "8821xxxx" },
                  { name: "BSI", sub: "7128xxxx" },
                  { name: "GoPay", sub: "0812xxxx" },
                ].map((m) => (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setWithdrawMethod(m.name)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      withdrawMethod === m.name
                        ? "border-[#00875a] bg-emerald-50/50 text-[#00875a] font-bold"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-xs">{m.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{m.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Nominal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Nominal Penarikan (Rp)
              </label>
              <Input
                type="number"
                placeholder="Contoh: 500000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="rounded-xl border-gray-200 text-xs h-10"
              />
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                <span>Minimal Rp 50.000</span>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount("3850000")}
                  className="text-[#00875a] font-semibold hover:underline"
                >
                  Tarik Semua
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-gray-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-xl text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Ajukan Penarikan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
