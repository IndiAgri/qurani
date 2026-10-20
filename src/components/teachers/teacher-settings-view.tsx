"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Wallet,
  Video,
  Globe,
  Save,
  CheckCircle2,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TeacherSettingsView({ teacherId = "1" }: { teacherId?: string }) {
  const [hourlyRate, setHourlyRate] = useState("50000");
  const [maxStudents, setMaxStudents] = useState("10");
  const [meetUrl, setMeetUrl] = useState("https://meet.google.com/qurani-tahsin-live");
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pengaturan akun guru berhasil disimpan!");
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Pengaturan Guru
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola tarif bimbingan, preferensi notifikasi, dan link ruang kelas online Anda.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Tarif & Kapasitas Bimbingan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-slate-800">
            <DollarSign className="size-5 text-[#00875a]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Tarif & Kapasitas Mengajar
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Tarif Dasar Sesi (Rp / Jam)
              </label>
              <Input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="h-10 rounded-xl"
              />
              <span className="text-[11px] text-gray-400">
                Tarif default yang akan tampil di katalog marketplace guru.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-gray-700 dark:text-gray-300">
                Maksimal Santri Aktif Bersamaan
              </label>
              <Input
                type="number"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
                className="h-10 rounded-xl"
              />
              <span className="text-[11px] text-gray-400">
                Saat kuota penuh, tombol booking akan otomatis nonaktif sementara.
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Ruang Kelas Online */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-slate-800">
            <Video className="size-5 text-blue-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Ruang Kelas Bimbingan Online
            </h3>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-gray-700 dark:text-gray-300">
              Link Default Google Meet / Zoom
            </label>
            <Input
              type="url"
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              className="h-10 rounded-xl"
            />
            <span className="text-[11px] text-gray-400">
              Tautan ini akan otomatis disertakan pada jadwal santri saat sesi berlangsung.
            </span>
          </div>
        </div>

        {/* Card 3: Notifikasi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-slate-800">
            <Bell className="size-5 text-amber-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Notifikasi Pengingat
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Notifikasi WhatsApp Sesi & Pesanan Baru
                </span>
                <span className="text-[11px] text-gray-400">
                  Dapatkan pesan WhatsApp instan setiap ada pengajuan bimbingan masuk.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                className="size-4 accent-[#00875a]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  Email Rekap Mingguan & Honorarium
                </span>
                <span className="text-[11px] text-gray-400">
                  Ringkasan jam mengajar dan bukti transfer pencairan honor setiap pekan.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="size-4 accent-[#00875a]"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#00875a] hover:bg-[#007a51] text-white font-semibold rounded-xl px-6 h-10 text-sm shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Save className="size-4" />
            <span>Simpan Pengaturan</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
