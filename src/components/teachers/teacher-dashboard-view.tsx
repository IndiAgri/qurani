"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Users,
  Wallet,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface ScheduleItem {
  id: string;
  name: string;
  avatar: string;
  package: string;
  time: string;
  tag: string;
  completed: boolean;
}

interface RequestItem {
  id: string;
  name: string;
  package: string;
  timeAgo: string;
  status: "pending" | "accepted" | "rejected";
}

export function TeacherDashboardView({ teacherId = "1" }: { teacherId?: string }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";

  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "sch-1",
      name: "Siti Rahmawati",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      package: "Paket 10x Pertemuan (Sesi 3)",
      time: "08:00 - 09:00 WIB",
      tag: "Today",
      completed: false,
    },
    {
      id: "sch-2",
      name: "Ahmad Fauzi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      package: "Paket 10x Pertemuan (Sesi 8)",
      time: "10:30 - 11:30 WIB",
      tag: "Today",
      completed: false,
    },
    {
      id: "sch-3",
      name: "Lailatul Munawaroh",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      package: "Paket 5x Pertemuan (Sesi 1)",
      time: "13:30 - 14:30 WIB",
      tag: "Today",
      completed: false,
    },
  ]);

  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: "req-1",
      name: "Rizky Pratama",
      package: "Paket 10x Pertemuan",
      timeAgo: "2 hours ago",
      status: "pending",
    },
    {
      id: "req-2",
      name: "Laila Sari",
      package: "Paket 5x Pertemuan",
      timeAgo: "5 hours ago",
      status: "pending",
    },
  ]);

  const handleConfirmSchedule = (id: string, name: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s))
    );
    toast.success(`Sesi dengan ${name} berhasil dikonfirmasi selesai!`);
  };

  const handleAcceptRequest = (id: string, name: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.success(`Permintaan bimbingan dari ${name} diterima!`);
  };

  const handleRejectRequest = (id: string, name: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    toast.info(`Permintaan dari ${name} ditolak.`);
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans space-y-6 sm:space-y-8">
      {/* Top Row: Greeting & Lihat Jadwal Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Assalamu&apos;alaikum, {user?.name?.toLowerCase() || "fatkul"}! 👋
        </h1>
        <Link href={`/${currentLocale}/teachers/${teacherId}/schedules`}>
          <Button className="bg-[#00875a] hover:bg-[#007a51] text-white font-medium rounded-xl px-4 py-2.5 h-10 text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-2 transition-all">
            <Calendar className="size-4 shrink-0" />
            <span>Lihat Jadwal</span>
          </Button>
        </Link>
      </div>

      {/* 4 Stats Cards Grid matching Screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Murid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Murid</span>
            <Users className="size-4.5 text-emerald-500 shrink-0" />
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">24</span>
            <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
              +2 minggu ini
            </span>
          </div>
        </div>

        {/* Card 2: Sesi Bulan Ini */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sesi Bulan Ini</span>
            <Calendar className="size-4.5 text-blue-500 shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">56</span>
            <span className="text-xs text-gray-400 font-medium">sesi selesai</span>
          </div>
        </div>

        {/* Card 3: Pendapatan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Pendapatan</span>
            <Wallet className="size-4.5 text-orange-500 shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Rp 4.2M</span>
            <span className="text-xs font-semibold text-emerald-600">↗ 12%</span>
          </div>
        </div>

        {/* Card 4: Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Rating</span>
            <Star className="size-4.5 text-amber-500 fill-amber-500 shrink-0" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">4.92</span>
            <span className="text-xs text-gray-400 font-medium">dari 120 ulasan</span>
          </div>
        </div>
      </div>

      {/* Main Section: Jadwal Terdekat & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (lg:col-span-8): Jadwal Terdekat */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Jadwal Terdekat</h2>
            <Link href={`/${currentLocale}/teachers/${teacherId}/schedules`}>
              <button
                type="button"
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700/60 rounded-full px-3 py-1 hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Semua</span>
                <ChevronRight className="size-3" />
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100/80 dark:border-slate-800 transition-all hover:bg-gray-50"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative size-11 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.package}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-3 sm:gap-5">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>{item.time}</span>
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{item.tag}</span>
                  </div>

                  <Button
                    size="sm"
                    disabled={item.completed}
                    onClick={() => handleConfirmSchedule(item.id, item.name)}
                    className={`rounded-xl text-xs font-semibold px-4 h-9 shadow-xs cursor-pointer transition ${
                      item.completed
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#00875a] hover:bg-[#007a51] text-white"
                    }`}
                  >
                    {item.completed ? "Selesai" : "Konfirmasi Selesai"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (lg:col-span-4): Requests */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Requests</h2>
            <Link href={`/${currentLocale}/teachers/${teacherId}/orders`}>
              <button
                type="button"
                className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700/60 rounded-full px-3 py-1 hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <span>Semua</span>
                <ChevronRight className="size-3" />
              </button>
            </Link>
          </div>

          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                Tidak ada permintaan bimbingan baru saat ini.
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100/80 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {req.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 border border-orange-200/60">
                      New Request
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{req.package}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{req.timeAgo}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptRequest(req.id, req.name)}
                      className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold py-2 h-8.5 flex-1 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Terima</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectRequest(req.id, req.name)}
                      className="border border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-semibold py-2 h-8.5 flex-1 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="size-3.5" />
                      <span>Tolak</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
