"use client";

import React from "react";
import { Settings, Bell, Lock, Globe, Moon, Sun, Save, Shield } from "lucide-react";
import { toast } from "sonner";

export function SettingsView() {
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [soundEffect, setSoundEffect] = React.useState(true);
  const [autoRecap, setAutoRecap] = React.useState(true);

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 space-y-8 font-sans">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Settings className="size-6 text-[#00875a]" />
          Pengaturan Akun & Preferensi
        </h1>
        <p className="text-xs text-gray-500">Kelola preferensi notifikasi, tampilan, dan keamanan sistem Qurani.</p>
      </div>
      {/* Shortcut ke Qurani Settings */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#00875a] uppercase tracking-wider block">
            Pengaturan Tampilan Al-Qur&apos;an
          </span>
          <h2 className="text-sm font-bold text-gray-900">
            Qurani Settings (Layout, Font Arab, Ukuran, Kategori Kesalahan)
          </h2>
          <p className="text-xs text-gray-600">
            Kustomisasi tata letak Flexible / Mushaf Uthmani, font Utsmani / IndoPak, dan kategori evaluasi setoran.
          </p>
        </div>
        <a
          href="/profile/pengaturan-qurani"
          className="px-4 py-2 bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold rounded-xl transition shadow-xs shrink-0 cursor-pointer"
        >
          Buka Qurani Settings
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100">
        {/* Notifikasi */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="size-5 text-[#00875a]" />
            <h2 className="text-sm font-bold text-gray-900">Notifikasi & Pengingat</h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Notifikasi jadwal setoran & pesan guru via email</span>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
                className="size-4 accent-[#00875a] rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Efek suara interaktif saat evaluasi ayat</span>
              <input
                type="checkbox"
                checked={soundEffect}
                onChange={(e) => setSoundEffect(e.target.checked)}
                className="size-4 accent-[#00875a] rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Otomatis buat rekap setelah selesai talaqqi</span>
              <input
                type="checkbox"
                checked={autoRecap}
                onChange={(e) => setAutoRecap(e.target.checked)}
                className="size-4 accent-[#00875a] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Keamanan */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <Shield className="size-5 text-[#00875a]" />
            <h2 className="text-sm font-bold text-gray-900">Keamanan & Kata Sandi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            <input
              type="password"
              placeholder="Kata sandi saat ini"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a]"
            />
            <input
              type="password"
              placeholder="Kata sandi baru"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00875a]/20 focus:border-[#00875a]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 flex justify-end">
          <button
            onClick={handleSave}
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Save className="size-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsView;
