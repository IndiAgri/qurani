"use client";

import React from "react";
import Image from "next/image";

// SVG Icon Components matching the official website exactly
function CoinIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
      <path d="M12 7v10" />
    </svg>
  );
}

function HeartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
    </svg>
  );
}

function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </svg>
  );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
    </svg>
  );
}

function TargetIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  );
}

function UsersIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
    </svg>
  );
}

function SparklesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
    </svg>
  );
}

function SunIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
      <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
    </svg>
  );
}

function MoonIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </svg>
  );
}

function InfinityIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.828 9.172a4 4 0 1 0 0 5.656a10 10 0 0 0 2.172 -2.828a10 10 0 0 1 2.172 -2.828a4 4 0 1 1 0 5.656a10 10 0 0 1 -2.172 -2.828a10 10 0 0 0 -2.172 -2.828" />
    </svg>
  );
}

function HeartHandshakeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      <path d="M12 6l-3.293 3.293a1 1 0 0 0 0 1.414l.543 .543c.69 .69 1.81 .69 2.5 0l1 -1a3.182 3.182 0 0 1 4.5 0l2.25 2.25" />
      <path d="M12.5 15.5l2 2" />
      <path d="M15 13l2 2" />
    </svg>
  );
}

export function AboutView() {
  return (
    <div className="p-3 sm:p-6 lg:p-8">
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          
          {/* ================= HERO HEADER ================= */}
          <div className="text-center mb-16 sm:mb-20 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center justify-center mb-2 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600/40 dark:via-emerald-500/30 dark:to-teal-600/40 rounded-3xl blur-2xl opacity-30 dark:opacity-50 animate-pulse" />
                <Image
                  src="/icons/Qurani - Logo Green.png"
                  alt="Qurani Logo"
                  width={120}
                  height={120}
                  priority
                  className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 md:w-[120px] md:h-[120px] object-contain drop-shadow-md"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-emerald-600 dark:text-emerald-400 uppercase">
                  QURANI
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-50 leading-tight">
                Perjalanan Menuju
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400 bg-clip-text text-transparent">
                  Kedekatan dengan Al-Quran
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed pt-2">
                Qurani hadir sebagai sahabat setia dalam perjalanan spiritual Anda. Kami memahami bahwa menjaga konsistensi membaca Al-Quran di tengah kesibukan hidup modern bukanlah hal yang mudah.
              </p>
            </div>
          </div>

          {/* ================= SECTION 1: DUKUNG MISI KAMI ================= */}
          <div className="mb-16 sm:mb-20">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-600/40 dark:via-emerald-500/30 dark:to-teal-600/40 rounded-3xl p-1 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-600/20">
              <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-5 sm:p-8 md:p-12">
                <div className="max-w-4xl mx-auto">
                  
                  {/* Title & Coin Icon */}
                  <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-600 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 mb-4 sm:mb-5">
                      <CoinIcon className="w-8 h-8 sm:w-9 sm:h-9" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2 sm:mb-3">
                      Dukung Misi Kami
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                      Bantu kami terus mengembangkan Qurani untuk lebih banyak umat
                    </p>
                  </div>

                  {/* Why Donation Matters */}
                  <div className="space-y-6 mb-8">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-5 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <HeartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        Mengapa Donasi Anda Penting?
                      </h3>
                      <ul className="space-y-3 text-sm sm:text-base text-gray-700 dark:text-slate-300">
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 dark:text-emerald-400 mt-1 font-bold">•</span>
                          <span><strong>100% Open Source</strong> - Qurani akan selamanya gratis dan terbuka untuk semua</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 dark:text-emerald-400 mt-1 font-bold">•</span>
                          <span><strong>Biaya Server & Infrastruktur</strong> - Mendukung ribuan pengguna aktif setiap hari</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 dark:text-emerald-400 mt-1 font-bold">•</span>
                          <span><strong>Pengembangan Fitur Baru</strong> - Audio recitation, tafsir, dan pembelajaran interaktif</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="text-emerald-600 dark:text-emerald-400 mt-1 font-bold">•</span>
                          <span><strong>Tim Volunteer</strong> - Apresiasi untuk kontributor yang terus menyempurnakan platform</span>
                        </li>
                      </ul>
                    </div>

                    {/* 2 Feature Cards: Transparansi & Ikhlas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-600/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <HeartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-slate-100">Transparansi</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                          Semua penggunaan dana akan dilaporkan secara terbuka di GitHub
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-600/30 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                            <StarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h4 className="font-bold text-gray-900 dark:text-slate-100">Ikhlas</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                          Tidak ada iklan, tidak ada premium features - murni lillahi ta&apos;ala
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Hadith Quote */}
                  <div className="text-center space-y-4 pt-2">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 italic">
                      “Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia” - HR. Ahmad, ath-Thabrani
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                      <a
                        href="https://github.com/sponsors/iqbalkahini"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-700 text-white font-semibold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-95"
                      >
                        <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 shrink-0" />
                        <span>Donasi via GitHub Sponsors</span>
                      </a>
                      <a
                        href="https://github.com/iqbalkahini/Qurani"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold text-sm sm:text-base rounded-xl transition-all duration-300 active:scale-95"
                      >
                        <GithubIcon className="w-5 h-5 shrink-0" />
                        <span>atau Contribute Code</span>
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                      Donasi berapapun sangat berarti untuk keberlangsungan platform ini
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 2: MENGAPA QURANI ADA? ================= */}
          <div className="mb-16 sm:mb-20">
            <div className="text-card-foreground flex flex-col gap-6 shadow-sm border-none bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:bg-slate-800/90 p-1 rounded-3xl">
              <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 sm:w-12 h-1 bg-gradient-to-r from-emerald-500 to-cyan-600 dark:from-emerald-500/80 dark:to-teal-500/80 rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50">
                      Mengapa Qurani Ada?
                    </h2>
                  </div>
                  <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-slate-300 leading-relaxed">
                    <p className="text-base sm:text-lg md:text-xl font-light italic text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-500 dark:border-emerald-500/60 pl-4 sm:pl-6 py-2">
                      “Dan Kami turunkan kepadamu Al-Quran, agar kamu menerangkan kepada umat manusia apa yang telah diturunkan kepada mereka.”
                      <span className="block mt-2 text-sm sm:text-base font-normal not-italic">— QS. An-Nahl: 44</span>
                    </p>
                    <p>
                      Kami percaya bahwa setiap Muslim berhak memiliki <strong>hubungan yang dekat dan bermakna dengan Al-Quran</strong>. Namun, kita semua tahu tantangannya: kesibukan kerja, distraksi digital, dan terkadang kurangnya motivasi untuk konsisten.
                    </p>
                    <p>
                      Qurani lahir dari sebuah kepedulian sederhana: <strong className="text-emerald-600 dark:text-emerald-400">bagaimana jika ada sebuah tempat di mana setiap Muslim dapat saling mendukung, mengingatkan, dan memotivasi dalam membaca Al-Quran?</strong>
                    </p>
                    <p>
                      Bukan sekadar aplikasi pencatat hafalan. Bukan sekadar platform sosial. Tapi <strong>sebuah komunitas spiritual</strong> yang memahami perjuangan Anda, merayakan pencapaian Anda, dan menguatkan Anda di saat lemah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 3: PERJALANAN SPIRITUAL ANDA ================= */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2 sm:mb-3">
                Perjalanan Spiritual Anda
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                Kami tidak hanya membantu Anda membaca, tapi menemani Anda bertransformasi
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Card 1: Konsistensi */}
              <div className="group">
                <div className="text-card-foreground flex flex-col gap-4 sm:gap-6 rounded-2xl py-6 sm:py-8 shadow-sm h-full border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm">
                  <div className="px-6 text-center relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 mb-5 sm:mb-6 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <TargetIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-slate-100">
                      Konsistensi dalam Tilawah
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      Bangun kebiasaan membaca Al-Quran setiap hari dengan sistem tracking yang memotivasi dan mengingatkan Anda.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Belajar Bersama */}
              <div className="group">
                <div className="text-card-foreground flex flex-col gap-4 sm:gap-6 rounded-2xl py-6 sm:py-8 shadow-sm h-full border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm">
                  <div className="px-6 text-center relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 mb-5 sm:mb-6 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-slate-100">
                      Belajar Bersama
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      Temukan teman seperjalanan yang memiliki visi yang sama dalam mempelajari dan mengamalkan Al-Quran.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Dukungan Komunitas */}
              <div className="group">
                <div className="text-card-foreground flex flex-col gap-4 sm:gap-6 rounded-2xl py-6 sm:py-8 shadow-sm h-full border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm">
                  <div className="px-6 text-center relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 mb-5 sm:mb-6 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <HeartIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-slate-100">
                      Dukungan Komunitas
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      Saling menguatkan dan memotivasi dalam perjalanan spiritual menuju kedekatan dengan Allah SWT.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: Pertumbuhan Spiritual */}
              <div className="group">
                <div className="text-card-foreground flex flex-col gap-4 sm:gap-6 rounded-2xl py-6 sm:py-8 shadow-sm h-full border-2 border-transparent hover:border-emerald-400 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 hover:-translate-y-2 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm">
                  <div className="px-6 text-center relative">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 mb-5 sm:mb-6 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900 dark:text-slate-100">
                      Pertumbuhan Spiritual
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                      Rasakan transformasi diri melalui konsistensi membaca, memahami, dan mengamalkan ayat-ayat suci.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ================= SECTION 4: DAMPAK NYATA, TRANSFORMASI NYATA ================= */}
          <div className="mb-16 sm:mb-20">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-600/40 dark:via-emerald-500/30 dark:to-teal-600/40 rounded-3xl p-1 shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-600/20">
              <div className="bg-white dark:bg-slate-800/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-12">
                <div className="text-center mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2 sm:mb-3">
                    Dampak Nyata, Transformasi Nyata
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400">
                    Bukan sekadar angka, tapi kehidupan yang berubah
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                  
                  {/* Pillar 1 */}
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 dark:from-emerald-600 dark:to-teal-600 mb-4 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 transition-transform duration-300">
                      <SunIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                      Setiap Hari
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Ribuan Muslim memulai hari mereka dengan membaca Al-Quran melalui Qurani
                    </p>
                  </div>

                  {/* Pillar 2 */}
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 dark:from-emerald-600 dark:to-teal-600 mb-4 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 transition-transform duration-300">
                      <MoonIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                      Setiap Malam
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Konsistensi membaca sebelum tidur membangun kebiasaan spiritual yang kuat
                    </p>
                  </div>

                  {/* Pillar 3 */}
                  <div className="text-center group">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 dark:from-emerald-600 dark:to-teal-600 mb-4 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 transition-transform duration-300">
                      <InfinityIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                      Tanpa Batas
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Komunitas global yang terus berkembang, saling mendukung dalam perjalanan Al-Quran
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 5: NILAI YANG KAMI PEGANG ================= */}
          <div className="mb-16 sm:mb-20">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2 sm:mb-3">
                Nilai yang Kami Pegang
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
                Prinsip yang memandu setiap keputusan dan langkah kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              
              {/* Value 1 */}
              <div className="text-card-foreground flex flex-col gap-6 rounded-2xl border-none shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 transition-all duration-500 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm group hover:-translate-y-2">
                <div className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                  <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <HeartHandshakeIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-3 text-gray-900 dark:text-slate-100 text-center">
                    Ikhlas & Tulus
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed text-center">
                    Kami percaya setiap langkah dalam mendekatkan diri kepada Al-Quran harus dimulai dengan niat yang tulus dan ikhlas karena Allah SWT.
                  </p>
                </div>
              </div>

              {/* Value 2 */}
              <div className="text-card-foreground flex flex-col gap-6 rounded-2xl border-none shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 transition-all duration-500 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm group hover:-translate-y-2">
                <div className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                  <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-3 text-gray-900 dark:text-slate-100 text-center">
                    Kekuatan Ukhuwah
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed text-center">
                    Persaudaraan sesama Muslim adalah fondasi kuat yang mendorong kita untuk saling mengingatkan dan mendukung dalam kebaikan.
                  </p>
                </div>
              </div>

              {/* Value 3 */}
              <div className="text-card-foreground flex flex-col gap-6 rounded-2xl border-none shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-500/10 transition-all duration-500 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm group hover:-translate-y-2">
                <div className="pt-8 sm:pt-10 pb-8 sm:pb-10 px-6 sm:px-8">
                  <div className="text-center mb-5 sm:mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 dark:from-emerald-600 dark:via-emerald-500 dark:to-teal-600 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <StarIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-3 text-gray-900 dark:text-slate-100 text-center">
                    Perjalanan Berkelanjutan
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-slate-400 leading-relaxed text-center">
                    Belajar Al-Quran adalah perjalanan seumur hidup. Kami hadir untuk menemani Anda di setiap langkahnya, dari ayat pertama hingga khatam.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= SECTION 6: VISI KAMI UNTUK MASA DEPAN ================= */}
          <div className="mb-8 sm:mb-12">
            <div className="text-card-foreground flex flex-col gap-6 rounded-3xl border-none shadow-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-slate-800/80 dark:to-slate-800/60 backdrop-blur-sm">
              <div className="pt-8 pb-8 sm:pt-12 sm:pb-12 px-6 sm:px-8 md:px-16">
                <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 dark:from-emerald-600 dark:to-teal-600 text-white shadow-lg shadow-amber-500/30 dark:shadow-emerald-600/30">
                    <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Visi Kami untuk Masa Depan
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                    Kami bermimpi tentang dunia di mana <strong className="text-emerald-600 dark:text-emerald-400">setiap Muslim, di mana pun mereka berada, memiliki akses kepada komunitas pendukung</strong> yang menguatkan mereka dalam perjalanan Al-Quran.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-slate-400 leading-relaxed">
                    Bukan tentang teknologi. Bukan tentang fitur. Tapi tentang <strong>membangun generasi Qurani</strong> yang mencintai, memahami, dan mengamalkan Al-Quran dalam kehidupan sehari-hari.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AboutView;
