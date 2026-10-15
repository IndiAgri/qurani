"use client";

import React from "react";
import Image from "next/image";
import {
  Building2,
  MapPin,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function TeacherOrganizationView({ teacherId = "1" }: { teacherId?: string }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Lembaga & Organisasi Afiliasi
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Informasi yayasan, pesantren, dan lembaga Al-Quran yang menaungi profil pengajar Anda.
        </p>
      </div>

      {/* Main Org Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00875a] flex items-center justify-center font-bold text-2xl border border-emerald-200/50 shrink-0">
              PQ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pesantren Tahfidz Qurani Nusantara
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <ShieldCheck className="size-3.5" />
                  <span>Terverifikasi Resmi</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                <MapPin className="size-3.5 text-gray-400" />
                <span>Kec. Cisarua, Bogor, Jawa Barat • Akreditasi A (Kemenag RI)</span>
              </p>
            </div>
          </div>
        </div>

        {/* 3 Stats of Org */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-xs text-gray-400">Total Pengajar</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">48 Ustadz/Ustadzah</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-xs text-gray-400">Santri Terdaftar</span>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1.250+ Santri</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
            <span className="text-xs text-gray-400">Sanad & Kurikulum</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">Hafsh & Syathibiyyah</p>
          </div>
        </div>

        {/* Description & Contact */}
        <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Tentang Lembaga</h3>
          <p>
            Pesantren Tahfidz Qurani Nusantara merupakan mitra resmi platform Qurani yang fokus pada standardisasi pengajaran Al-Quran bersanad, tahsin tajwid, dan bimbingan hafalan 30 juz. Seluruh pengajar di bawah naungan lembaga telah melalui uji kompetensi makharijul huruf dan lisensi syahadah resmi.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-gray-500">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-emerald-600" />
              <span>akademik@quraninusantara.sch.id</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5 text-emerald-600" />
              <span>+62 251-825-9912</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="size-3.5 text-emerald-600" />
              <span>www.quraninusantara.sch.id</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
