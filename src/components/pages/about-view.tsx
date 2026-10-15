"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, ShieldCheck, Heart, Sparkles, Award, Users } from "lucide-react";

export function AboutView() {
  const highlights = [
    {
      icon: BookOpen,
      title: "Al-Qur'an Berbasis AI & Sanad",
      desc: "Menghubungkan santri dengan guru bersanad melalui evaluasi bacaan real-time dengan bantuan teknologi.",
    },
    {
      icon: Award,
      title: "Guru Terverifikasi",
      desc: "Pengajar Qurani adalah asatidz terpilih dengan riwayat pendidikan dan sanad terpercaya.",
    },
    {
      icon: Users,
      title: "Komunitas Hifz Global",
      desc: "Belajar dan saling menyimak tilawah bersama ribuan penghafal Al-Qur'an di seluruh nusantara dan dunia.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-10 space-y-10 font-sans">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#00875a] to-[#006946] p-8 md:p-12 text-white overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Tentang Platform Qurani
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Mendampingi Perjalanan Menghafal Al-Qur&apos;an Anda
          </h1>
          <p className="text-sm md:text-base text-emerald-100 leading-relaxed">
            Qurani adalah platform sosial edukasi Al-Qur&apos;an modern yang mempermudah tilawah, setoran hafalan (talaqqi/tahsin), dan bimbingan guru secara terstruktur dan transparan.
          </p>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="size-11 rounded-xl bg-emerald-50 text-[#00875a] flex items-center justify-center">
                <Icon className="size-5.5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Visi Misi */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="size-5 text-[#00875a]" />
            Misi Kami
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Menghilangkan batasan jarak dan waktu agar setiap muslim dapat mempelajari cara membaca Al-Qur&apos;an dengan makhraj dan tajwid yang sempurna, didampingi langsung oleh ustadz dan ustadzah berkompeten.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="size-5 text-red-500" />
            Nilai Utama
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Ikhlas, Amanah, Mutqin (akurat dalam bacaan), dan Kolaboratif. Kami percaya bahwa teknologi terbaik adalah yang mendekatkan manusia dengan kitab suci Al-Qur&apos;an.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutView;
