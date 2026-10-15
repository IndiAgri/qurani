"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Award,
  BookCheck,
  TrendingUp,
  Target,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { RecitationForm } from "@/components/recitation/recitation-form";
import { RecitationCarousel } from "@/components/recitation/recitation-carousel";
import { RecitationResults } from "@/components/recitation/recitation-results";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function RecitationView() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [isStatOpen, setIsStatOpen] = React.useState(false);

  const handleRecitationAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">
          Quran Recitation
        </h1>

        <button
          type="button"
          onClick={() => setIsStatOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00875a] hover:bg-[#00784f] text-white text-xs sm:text-sm font-medium shadow-2xs transition cursor-pointer"
        >
          <BarChart3 className="size-4" />
          <span>Statistic</span>
        </button>
      </div>

      {/* Top Grid: Form (Left) & Carousel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <RecitationForm onRecitationAdded={handleRecitationAdded} locale={currentLocale} />
        <RecitationCarousel />
      </div>

      {/* Bottom Section: Recitation Results Table */}
      <RecitationResults refreshTrigger={refreshTrigger} />

      {/* Recitation Statistics Modal */}
      <Dialog open={isStatOpen} onOpenChange={setIsStatOpen}>
        <DialogContent className="sm:max-w-xl bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-emerald-50 text-[#00875a] flex items-center justify-center">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 text-left">
                  Statistik Setoran & Evaluasi Hafalan
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 text-left">
                  Ringkasan performa bacaan dan pencapaian target hafalan Al-Qur&apos;an
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* 4 Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                  Total Setoran
                </span>
                <span className="text-xl font-bold text-emerald-950 mt-1">18 Sesi</span>
                <span className="text-[10px] text-emerald-600 mt-0.5">Bulan ini</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                  Rata-rata Skor
                </span>
                <span className="text-xl font-bold text-blue-950 mt-1">93.5%</span>
                <span className="text-[10px] text-blue-600 mt-0.5">Predikat Mumtaz</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">
                  Kelulusan
                </span>
                <span className="text-xl font-bold text-amber-950 mt-1">94%</span>
                <span className="text-[10px] text-amber-700 mt-0.5">17 dari 18 lulus</span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex flex-col justify-between">
                <span className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider">
                  Target Aktif
                </span>
                <span className="text-xl font-bold text-teal-950 mt-1">Juz 30</span>
                <span className="text-[10px] text-teal-700 mt-0.5">85% Tercapai</span>
              </div>
            </div>

            {/* Target Progress Section */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Target className="size-4 text-[#00875a]" />
                  Progress Hafalan Surah Pilihan
                </span>
                <Badge className="bg-emerald-100/80 text-emerald-800 border-0 text-[10px] font-bold">
                  Target Triwulan
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-gray-700">Surah Al-Mulk (67)</span>
                    <span className="font-bold text-[#00875a]">100% (Selesai)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00875a] rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-gray-700">Surah Ar-Rahman (55)</span>
                    <span className="font-bold text-[#00875a]">90%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00875a] rounded-full w-[90%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-gray-700">Surah Yasin (36)</span>
                    <span className="font-bold text-[#00875a]">80%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00875a] rounded-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-medium text-gray-700">Surah Al-Waqi&apos;ah (56)</span>
                    <span className="font-bold text-emerald-600">75%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="p-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-white shadow-2xs flex items-center justify-center text-amber-500">
                  <Award className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-xs">Pencapaian: Penghafal Istiqomah</p>
                  <p className="text-[10px] text-gray-500">Setoran konsisten 5 hari berturut-turut dengan predikat Mumtaz</p>
                </div>
              </div>
              <Badge className="bg-[#00875a] text-white border-0 text-[10px] font-bold">
                Level 3
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
