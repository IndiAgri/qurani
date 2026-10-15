"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  CalendarDays,
  Users,
  Award,
  MessageSquare,
  Wallet,
  Building2,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubpageConfig {
  title: string;
  description: string;
  icon: React.ElementType;
}

const CONFIG_MAP: Record<string, SubpageConfig> = {
  orders: {
    title: "Pesanan Bimbingan",
    description: "Daftar pemesanan sesi bimbingan Al-Quran dari santri Anda.",
    icon: FileText,
  },
  courses: {
    title: "Kursus & Program",
    description: "Kelola kurikulum, materi sanad, dan paket belajar yang Anda tawarkan.",
    icon: BookOpen,
  },
  schedules: {
    title: "Jadwal & Kalender Mengajar",
    description: "Atur ketersediaan jam mengajar dan pantau agenda bimbingan santri.",
    icon: CalendarDays,
  },
  students: {
    title: "Daftar Santri Bimbingan",
    description: "Data santri aktif, progres hafalan, dan riwayat tilawah mereka.",
    icon: Users,
  },
  certificates: {
    title: "Sertifikat & Sanad Keilmuan",
    description: "Daftar sertifikat keilmuan, ijazah sanad Al-Quran, dan lisensi mengajar Anda.",
    icon: Award,
  },
  messages: {
    title: "Pesan & Konsultasi",
    description: "Ruang diskusi dan konsultasi tilawah antara guru dan santri.",
    icon: MessageSquare,
  },
  earnings: {
    title: "Pendapatan & Saldo",
    description: "Rekap pendapatan sesi bimbingan dan pencairan dana ke rekening.",
    icon: Wallet,
  },
  organization: {
    title: "Lembaga & Organisasi",
    description: "Informasi afiliasi pondok pesantren atau yayasan Al-Quran Anda.",
    icon: Building2,
  },
  settings: {
    title: "Pengaturan Guru",
    description: "Kelola preferensi akun guru, tarif per jam, dan notifikasi jadwal.",
    icon: Settings,
  },
};

export function TeacherSubpageView({
  type,
  teacherId = "1",
}: {
  type: string;
  teacherId?: string;
}) {
  const config = CONFIG_MAP[type] || {
    title: "Manajemen Guru",
    description: "Halaman pengelolaan aktivitas guru Al-Quran.",
    icon: BookOpen,
  };

  const Icon = config.icon;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00875a]">
            <Icon className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {config.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold px-4 h-10 shadow-xs cursor-pointer">
            <Plus className="size-4 mr-1.5" />
            <span>Tambah Data</span>
          </Button>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 shadow-xs text-center py-16 space-y-4">
        <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00875a] flex items-center justify-center mx-auto">
          <Icon className="size-8" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Kelola {config.title} Anda
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Data bimbingan Anda tersinkronisasi secara otomatis dengan aplikasi Qurani. Anda dapat menambahkan atau memperbarui data kapan saja.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="outline"
            className="rounded-xl border-gray-200 text-xs font-semibold cursor-pointer"
          >
            Segarkan Data
          </Button>
        </div>
      </div>
    </div>
  );
}
