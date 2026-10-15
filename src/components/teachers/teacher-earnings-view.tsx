"use client";

import React, { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Transaction {
  id: string;
  type: "income" | "withdraw";
  title: string;
  description: string;
  amount: number;
  date: string;
  status: "success" | "pending";
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-9901",
    type: "income",
    title: "Sesi Selesai - Siti Rahmawati",
    description: "Paket 10x Pertemuan (Sesi 3)",
    amount: 45000,
    date: "Hari Ini, 09:15 WIB",
    status: "success",
  },
  {
    id: "TX-9900",
    type: "income",
    title: "Sesi Selesai - Ahmad Fauzi",
    description: "Paket 10x Pertemuan (Sesi 7)",
    amount: 45000,
    date: "Kemarin, 11:40 WIB",
    status: "success",
  },
  {
    id: "TX-9844",
    type: "withdraw",
    title: "Penarikan Dana ke Rekening BSI",
    description: "Rek. 7128938192 (a.n Rafi Andika)",
    amount: 2500000,
    date: "01 Feb 2026",
    status: "success",
  },
  {
    id: "TX-9810",
    type: "income",
    title: "Pembayaran Paket Baru - Faisal Rahman",
    description: "Tartil Dasar (8 Sesi)",
    amount: 360000,
    date: "28 Jan 2026",
    status: "success",
  },
  {
    id: "TX-9755",
    type: "income",
    title: "Sesi Selesai - Lailatul Munawaroh",
    description: "Tajwid Mahir (Sesi 5)",
    amount: 50000,
    date: "25 Jan 2026",
    status: "success",
  },
];

export function TeacherEarningsView({ teacherId = "1" }: { teacherId?: string }) {
  const [balance, setBalance] = useState(4200000);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!amt || amt < 50000) {
      toast.error("Minimal penarikan adalah Rp 50.000");
      return;
    }
    if (amt > balance) {
      toast.error("Saldo tidak mencukupi untuk penarikan ini");
      return;
    }

    setBalance((prev) => prev - amt);
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: "withdraw",
      title: "Penarikan Dana ke Rekening BSI",
      description: "Rek. 7128938192 (Sedang diproses)",
      amount: amt,
      date: "Baru saja",
      status: "success",
    };
    setTransactions([newTx, ...transactions]);
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    toast.success(`Permintaan penarikan Rp ${amt.toLocaleString("id-ID")} berhasil diajukan!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Pendapatan & Saldo
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Rekap honor sesi bimbingan dan pencairan saldo mengajar ke rekening bank.
          </p>
        </div>

        <Button
          onClick={() => setIsWithdrawOpen(true)}
          className="bg-[#00875a] hover:bg-[#007a51] text-white font-semibold rounded-xl px-5 h-10 text-sm shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
        >
          <ArrowUpRight className="size-4" />
          <span>Tarik Saldo</span>
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Saldo Tersedia</span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Rp {balance.toLocaleString("id-ID")}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Siap ditarik kapan saja
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Bulan Ini</span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Rp 4.2M
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            ↗ +12% dibanding bulan lalu
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Total Ditarik</span>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Rp 13.4M
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            Ditransfer ke BSI
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-gray-400 font-medium">Rekening Tujuan</span>
          <div className="my-2 flex items-center gap-2">
            <Building className="size-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Bank Syariah Indonesia</p>
              <p className="text-[11px] text-gray-400">7128-9381-92</p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Terverifikasi
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Riwayat Mutasi Saldo
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Semua transaksi pendapatan sesi dan penarikan honorarium.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    tx.type === "income"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {tx.type === "income" ? (
                    <ArrowDownLeft className="size-5" />
                  ) : (
                    <ArrowUpRight className="size-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {tx.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {tx.description} • {tx.date}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold block ${
                    tx.type === "income" ? "text-emerald-600" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"} Rp {tx.amount.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">Berhasil</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tarik Saldo */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Tarik Saldo ke Rekening Bank
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleWithdraw} className="space-y-4 py-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800 space-y-1">
              <span className="text-gray-400 text-[11px]">Rekening Pencairan:</span>
              <p className="font-bold text-gray-900 dark:text-white">
                Bank Syariah Indonesia (BSI)
              </p>
              <p className="text-gray-500 font-mono">No. Rek: 7128-9381-92 (a.n Rafi Andika)</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Nominal Penarikan (Rp)
              </label>
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Contoh: 500000"
                className="h-10 rounded-xl"
                required
              />
              <span className="text-[10px] text-gray-400">
                Saldo tersedia: Rp {balance.toLocaleString("id-ID")}
              </span>
            </div>

            <DialogFooter className="pt-2 flex sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWithdrawOpen(false)}
                className="rounded-xl text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs"
              >
                Konfirmasi Tarik Dana
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
