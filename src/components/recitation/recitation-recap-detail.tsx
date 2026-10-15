"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Check,
  FileText,
  ArrowLeftRight,
  AlertCircle,
} from "lucide-react";

interface MarkedErrorItem {
  ayahNumber?: number;
  wordIndex?: number;
  word?: string;
  errorId?: string;
  errorLabel: string;
  errorBg?: string;
  errorText?: string;
}

interface RecitationRecord {
  id: string;
  time?: string;
  reciter: string;
  reciterUsername?: string;
  reciterLocation?: string;
  reciterAvatar?: string;
  recipient?: string;
  recite?: string;
  startSurah?: string;
  endSurah?: string;
  startVerse?: string | number;
  endVerse?: string | number;
  juz?: number;
  page?: number;
  conclusion?: string;
  result?: string;
  notes?: string;
  markedErrors?: MarkedErrorItem[];
  errorCount?: number;
}

const DEFAULT_DEMO_RECAP: RecitationRecord = {
  id: "db63hg6fdq70010hhjmg",
  time: "13 Okt 2026, 13.15",
  reciter: "02_Alvia Agustin",
  reciterUsername: "@alvia",
  reciterLocation: "Malang - Jawa Timur",
  reciterAvatar: "/img/avatar-alvia.jpg",
  startSurah: "Al-Ikhlas",
  endSurah: "Al-Ikhlas",
  startVerse: "1",
  endVerse: "4",
  juz: 30,
  page: 604,
  conclusion: "Good",
  result: "Good",
  notes: "-",
  errorCount: 3,
  markedErrors: [
    { errorLabel: "Lainnya", word: "Lainnya" },
    { errorLabel: "Qalqalah", word: "Qalqalah" },
    { errorLabel: "Mad", word: "Mad" },
  ],
};

import { DEFAULT_RECITATION_RECORDS } from "@/components/recitation/recitation-results";

export function RecitationRecapDetail({
  sessionId,
  locale = "id",
}: {
  sessionId?: string;
  locale?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = locale || (pathname.startsWith("/en") ? "en" : "id");

  const [record, setRecord] = useState<RecitationRecord>(DEFAULT_DEMO_RECAP);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check in localStorage
    try {
      const stored = localStorage.getItem("qurani_recitation_results");
      if (stored) {
        const list: RecitationRecord[] = JSON.parse(stored);
        if (sessionId) {
          const found = list.find((item) => item.id === sessionId);
          if (found) {
            setRecord(found);
            return;
          }
        }
      }
    } catch {}

    // 2. Check in DEFAULT_RECITATION_RECORDS if provided
    if (sessionId) {
      const foundInDefault = DEFAULT_RECITATION_RECORDS.find(
        (item) => item.id === sessionId
      );
      if (foundInDefault) {
        setRecord(foundInDefault as any);
        return;
      }
    }

    // 3. Fallback to demo record (Photo 1 & 2)
    setRecord(DEFAULT_DEMO_RECAP);
  }, [sessionId]);

  // Parse recite string (e.g. "Tahsin Al-Ikhlas 1-4", "tahfidz Al-Ma'idah 1–120") if startSurah is not set
  const parsedRecite = React.useMemo(() => {
    if (!record.recite) return null;
    const clean = record.recite.replace(/–/g, "-");
    const parts = clean.trim().split(" ");
    if (parts.length >= 2) {
      const last = parts[parts.length - 1];
      if (last.includes("-")) {
        const [v1, v2] = last.split("-");
        const surah = parts.slice(1, parts.length - 1).join(" ");
        return {
          surah: surah || "Al-Ikhlas",
          startVerse: v1 || "1",
          endVerse: v2 || "4",
        };
      }
    }
    return null;
  }, [record.recite]);

  const reciterName = record.reciter || "02_Alvia Agustin";
  const reciterSub =
    record.reciterUsername && record.reciterLocation
      ? `${record.reciterUsername} - ${record.reciterLocation}`
      : "@alvia - Malang - Jawa Timur";
  const reciterAvatar = record.reciterAvatar || "/img/avatar-alvia.jpg";

  const startSurah = record.startSurah || parsedRecite?.surah || "Al-Ikhlas";
  const endSurah = record.endSurah || parsedRecite?.surah || "Al-Ikhlas";
  const startVerse = record.startVerse ?? parsedRecite?.startVerse ?? "1";
  const endVerse = record.endVerse ?? parsedRecite?.endVerse ?? "4";

  const conclusion = record.conclusion || record.result || "Good";
  const notes = record.notes || "-";

  const surahInfoMap: Record<string, { juz: number; page: number }> = {
    almaidah: { juz: 6, page: 106 },
    yasin: { juz: 22, page: 440 },
    alikhlas: { juz: 30, page: 604 },
    alfatihah: { juz: 1, page: 1 },
    annas: { juz: 30, page: 604 },
    almulk: { juz: 29, page: 562 },
    alwaqiah: { juz: 27, page: 534 },
    alkahfi: { juz: 15, page: 293 },
    arrahman: { juz: 27, page: 531 },
    maryam: { juz: 16, page: 305 },
  };

  const lookupInfo =
    surahInfoMap[startSurah.toLowerCase().replace(/[^a-z]/g, "")];
  const juz = record.juz || lookupInfo?.juz || 30;
  const page = record.page || lookupInfo?.page || 604;

  const errors =
    record.markedErrors && record.markedErrors.length > 0
      ? record.markedErrors
      : (record.errorCount ?? 0) === 0
      ? []
      : DEFAULT_DEMO_RECAP.markedErrors || [];
  const errorCount = record.errorCount ?? errors.length;

  return (
    <div
      className="flex flex-col min-h-screen w-full bg-[#f8fafc] p-4 sm:p-6 lg:p-8 space-y-6"
      suppressHydrationWarning
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-gray-200/80 text-gray-700 transition cursor-pointer shadow-2xs"
            title="Kembali"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Recitation
          </h1>
        </div>

        {/* Show Mushaf Button (Matching Screenshot 1) */}
        <button
          type="button"
          onClick={() => router.push(`/${currentLocale}/recitation`)}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <BookOpen className="size-4 stroke-[2]" />
          <span>Show Mushaf</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5 sm:p-8 space-y-6">
        {/* Section 1: Reciter (Soft Baby Blue Container) */}
        <div className="rounded-2xl p-5 bg-[#edf2fe] border border-blue-100/80 space-y-3">
          <div className="flex items-center gap-2 text-[#2563eb] font-bold text-sm sm:text-base">
            <span className="size-2 rounded-full bg-[#2563eb]" />
            <span>Reciter</span>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 flex items-center gap-3.5 shadow-2xs border border-white/80">
            <div className="relative size-12 rounded-full overflow-hidden shrink-0 border border-gray-100 bg-gray-50">
              <Image
                src={reciterAvatar}
                alt={reciterName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 leading-tight">
                {reciterName}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{reciterSub}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Recitation (Soft Mint Green Container) */}
        <div className="rounded-2xl p-5 bg-[#e6f8ee] border border-emerald-100/80 space-y-3">
          <div className="flex items-center gap-2 text-[#00875a] font-bold text-sm sm:text-base">
            <span className="size-2 rounded-full bg-[#00875a]" />
            <span>Recitation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-[#d6f5e3]/70 border border-emerald-200/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800">
              <span>Start Surah: </span>
              <span className="font-bold text-gray-950">{startSurah}</span>
            </div>

            <div className="bg-[#d6f5e3]/70 border border-emerald-200/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800">
              <span>End Surah: </span>
              <span className="font-bold text-gray-950">{endSurah}</span>
            </div>

            <div className="bg-[#d6f5e3]/70 border border-emerald-200/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800">
              <span>Start Verse: </span>
              <span className="font-bold text-gray-950">{startVerse}</span>
            </div>

            <div className="bg-[#d6f5e3]/70 border border-emerald-200/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800">
              <span>End Verse: </span>
              <span className="font-bold text-gray-950">{endVerse}</span>
            </div>
          </div>
        </div>

        {/* Section 3: Assessment (Soft Lilac / Purple Container) */}
        <div className="rounded-2xl p-5 bg-[#faeffb] border border-purple-100/80 space-y-3">
          <div className="flex items-center gap-2 text-[#9333ea] font-bold text-sm sm:text-base">
            <span className="size-2 rounded-full bg-[#9333ea]" />
            <span>Assessment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Conclusion Card */}
            <div className="bg-white rounded-xl p-4 flex items-center gap-3.5 shadow-2xs border border-white/80">
              <div className="size-10 rounded-full bg-[#c026d3] text-white flex items-center justify-center shrink-0">
                <Check className="size-5 stroke-[2.8]" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  Conclusion
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-950 block mt-0.5">
                  {conclusion}
                </span>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-xl p-4 flex items-center gap-3.5 shadow-2xs border border-white/80">
              <div className="size-10 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                <FileText className="size-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs text-gray-400 font-medium block">
                  Notes
                </span>
                <span className="text-sm sm:text-base font-medium text-gray-700 block mt-0.5">
                  {notes}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Summary (Word Errors, Matching Screenshot 2) */}
        <div className="space-y-3 pt-2">
          {/* Summary Header */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
            <span className="size-5 rounded-full border border-gray-900 flex items-center justify-center text-xs font-bold leading-none select-none">
              !
            </span>
            <span>Summary ({errorCount})</span>
          </div>

          {/* Banner Box Container */}
          <div className="rounded-2xl overflow-hidden border border-emerald-100 shadow-2xs">
            {/* Top Emerald Banner */}
            <div className="bg-[#00875a] p-3 sm:p-3.5 flex items-center gap-2.5">
              <span className="bg-[#00734c] text-white text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                Juz {juz}
              </span>
              <span className="bg-emerald-500/30 text-white text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">
                Page {page}
              </span>
              <span className="bg-[#ef4444] text-white text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                {errorCount} Words
              </span>
            </div>

            {/* Content Body */}
            <div className="bg-white p-4 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-500 text-xs sm:text-sm font-bold">
                <span className="size-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold leading-none select-none">
                  !
                </span>
                <span>Word Errors</span>
              </div>

              {/* Error Items List */}
              {errors && errors.length > 0 ? (
                <div className="space-y-2.5">
                  {errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-[#fff5f5] border border-rose-100/90 rounded-xl p-3 flex items-center gap-3 transition"
                    >
                      {/* Number in Blue Circle */}
                      <span className="size-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>

                      {/* Arrow / Exchange Icon */}
                      <ArrowLeftRight className="size-3.5 text-gray-500 shrink-0" />

                      {/* Orange Category Badge */}
                      <span className="bg-[#f97316] text-white text-xs font-semibold px-2.5 py-0.5 rounded-md shadow-2xs">
                        {err.errorLabel || "Lainnya"}
                      </span>

                      {/* Word text if available */}
                      {err.word && err.word !== err.errorLabel && (
                        <span className="text-xs text-gray-700 font-arabic ml-auto">
                          {err.word}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs sm:text-sm text-emerald-600 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  Alhamdulillah, tidak ada catatan kesalahan bacaan.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecitationRecapDetail;
