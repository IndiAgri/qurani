"use client";

import React from "react";
import Image from "next/image";
import { Download, Smartphone, Monitor, CheckCircle, QrCode } from "lucide-react";
import { toast } from "sonner";

export function InstallAppView() {
  const handleDownload = (platform: string) => {
    toast.success(`Mengunduh installer untuk ${platform}`, {
      description: "Aplikasi Qurani Mobile versi 2.4 siap diinstall.",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-10 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00875a] text-xs font-semibold">
          <Smartphone className="size-3.5" />
          Qurani Everywhere
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Instal Qurani di Perangkat Anda
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Nikmati kemudahan menyimak hafalan, muraja&apos;ah offline, dan konsultasi bersama ustadz kapan saja dan di mana saja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Mobile Platforms Card */}
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-emerald-50 text-[#00875a] flex items-center justify-center">
              <Smartphone className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Aplikasi Mobile</h3>
              <p className="text-xs text-gray-500">Android & iOS</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-[#00875a] shrink-0" />
              <span>Deteksi makhraj berbasis suara real-time</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-[#00875a] shrink-0" />
              <span>Mushaf digital standar Kemenag & Madinah offline</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="size-4 text-[#00875a] shrink-0" />
              <span>Notifikasi jadwal talaqqi & target harian</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleDownload("Android")}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Download className="size-4" />
              <span>Unduh Android (APK)</span>
            </button>
            <button
              onClick={() => handleDownload("iOS")}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Download className="size-4" />
              <span>Unduh iOS (IPA)</span>
            </button>
          </div>
        </div>

        {/* Desktop / PWA Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#0a231b] to-emerald-900 text-white shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center backdrop-blur-md">
              <Monitor className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Desktop & PWA</h3>
              <p className="text-xs text-emerald-200">Windows, MacOS & Web Browser</p>
            </div>
          </div>

          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Pasang langsung sebagai Progressive Web App (PWA) di Google Chrome, Microsoft Edge, atau Safari tanpa perlu download file besar.
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleDownload("Web App PWA")}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-gray-950 text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Download className="size-4" />
              <span>Pasang PWA Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallAppView;
