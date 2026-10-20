"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, PanelLeft, ChevronLeft, ChevronRight, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ERROR_CATEGORIES } from "@/data/quran-verses";
import { PRAQURAN_JILIDS, PraQuranPage, PraQuranJilid } from "@/data/praquran-data";
import { useSidebar } from "@/components/ui/sidebar";

interface MarkedPraQuranError {
  tokenId: string;
  tokenText: string;
  errorId: string;
  errorLabel: string;
  errorBg: string;
  errorText: string;
}

interface RecitationPraQuranReaderProps {
  initialJilidId?: string;
  initialPage?: number;
  locale?: string;
}

export function RecitationPraQuranReader({
  initialJilidId = "yanbua-1",
  initialPage = 1,
  locale = "en",
}: RecitationPraQuranReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSidebar } = useSidebar();

  const reciterParam = searchParams?.get("reciter") || "via";
  const jilidParam = searchParams?.get("jilid") || initialJilidId;
  const pageParam = parseInt(searchParams?.get("page") || String(initialPage), 10) || 1;

  const [activeJilidId, setActiveJilidId] = React.useState<string>(jilidParam);
  const [currentPageNum, setCurrentPageNum] = React.useState<number>(pageParam);

  const jilid: PraQuranJilid = PRAQURAN_JILIDS[activeJilidId] || PRAQURAN_JILIDS["yanbua-1"];
  const pageData: PraQuranPage = jilid.pages[currentPageNum] || jilid.pages[1];

  // Marked errors map: tokenId -> MarkedPraQuranError
  const [markedErrors, setMarkedErrors] = React.useState<Record<string, MarkedPraQuranError>>({});

  // Active token being evaluated
  const [activeTokenData, setActiveTokenData] = React.useState<{
    tokenId: string;
    tokenText: string;
  } | null>(null);

  const handleTokenClick = (tokenId: string, tokenText: string) => {
    setActiveTokenData({ tokenId, tokenText });
  };

  const handleSelectError = (error: (typeof ERROR_CATEGORIES)[0]) => {
    if (!activeTokenData) return;

    setMarkedErrors((prev) => ({
      ...prev,
      [activeTokenData.tokenId]: {
        tokenId: activeTokenData.tokenId,
        tokenText: activeTokenData.tokenText,
        errorId: error.id,
        errorLabel: error.label,
        errorBg: error.bg,
        errorText: error.text,
      },
    }));

    setActiveTokenData(null);
  };

  const handleRemoveError = () => {
    if (!activeTokenData) return;
    setMarkedErrors((prev) => {
      const copy = { ...prev };
      delete copy[activeTokenData.tokenId];
      return copy;
    });
    setActiveTokenData(null);
  };

  const handleFinish = () => {
    const errorCount = Object.keys(markedErrors).length;

    // Convert markedErrors to the recap format
    const formattedErrors: Record<string, any> = {};
    Object.entries(markedErrors).forEach(([key, val], idx) => {
      formattedErrors[key] = {
        ayahNumber: currentPageNum,
        wordIndex: idx,
        word: val.tokenText,
        errorId: val.errorId,
        errorLabel: val.errorLabel,
        errorBg: val.errorBg,
        errorText: val.errorText,
      };
    });

    const draft = {
      reciter: reciterParam,
      type: "Pra Quran",
      mode: "pra-quran",
      jilidId: activeJilidId,
      jilidName: jilid.name,
      page: currentPageNum,
      displayTitle: `${jilid.name} Hal ${currentPageNum}`,
      startVerse: 1,
      endVerse: pageData.rows.length,
      markedErrors: formattedErrors,
      juz: 1,
    };

    try {
      sessionStorage.setItem("qurani_recitation_draft", JSON.stringify(draft));
    } catch {}

    router.push(`/${locale}/recitation/quran/recap`);
  };

  const errorCount = Object.keys(markedErrors).length;

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8fafc] select-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-gray-200/80 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
            title="Toggle sidebar"
          >
            <PanelLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              Pra Quran
            </span>
            <span className="text-xs font-bold text-gray-800">{jilid.name}</span>
          </div>
        </div>

        {/* Center Finish Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="px-5 sm:px-8 py-1.5 sm:py-2 rounded-xl bg-[#00875a] hover:bg-[#00754e] active:scale-95 text-white font-medium text-xs sm:text-sm shadow-2xs transition cursor-pointer"
        >
          Finish
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
            title="Settings"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Pra Quran Practice Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 space-y-5">
        {/* Jilid Switcher & Page Navigation */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Jilid Buttons */}
          <div className="flex items-center gap-2">
            {Object.values(PRAQURAN_JILIDS).map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => {
                  setActiveJilidId(j.id);
                  setCurrentPageNum(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeJilidId === j.id
                    ? "bg-[#00875a] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200/80"
                }`}
              >
                {j.name}
              </button>
            ))}
          </div>

          {/* Page Navigator */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPageNum <= 1}
              onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="size-4 text-gray-600" />
            </button>

            <span className="text-xs font-semibold text-gray-800 px-2">
              Halaman {currentPageNum} / {jilid.totalPages}
            </span>

            <button
              type="button"
              disabled={currentPageNum >= jilid.totalPages}
              onClick={() => setCurrentPageNum((p) => Math.min(jilid.totalPages, p + 1))}
              className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              title="Halaman berikutnya"
            >
              <ChevronRight className="size-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Page Header Banner */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold">
            <Sparkles className="size-3.5" />
            <span>Kaidah Yanbu&apos;a - Standar Tartil</span>
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
            {pageData.title}
          </h2>
          <p className="text-xs text-gray-500 font-medium">{pageData.subTitle}</p>
          <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60 max-w-xl mx-auto text-xs text-gray-700 italic">
            💡 {pageData.instruction}
          </div>
        </div>

        {/* Yanbu'a Lesson Box Content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-6">
          <div className="text-center pb-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">
              Ketuk huruf / kata untuk mengoreksi bacaan (14 Kategori Kesalahan)
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              {errorCount} Kesalahan Ditandai
            </span>
          </div>

          {/* Rows of Yanbu'a words */}
          <div className="space-y-4">
            {pageData.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
              >
                {row.words.map((word) => (
                  <div
                    key={word.id}
                    className="p-4 rounded-2xl border border-gray-200/90 bg-[#fafafa] hover:bg-white hover:border-[#00875a]/40 hover:shadow-md transition flex flex-col items-center justify-center gap-2 group select-none"
                  >
                    {/* Arabic Letter Tokens */}
                    <div
                      dir="rtl"
                      className="flex items-center justify-center gap-1.5 flex-wrap"
                      style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                    >
                      {word.tokens.map((token, tIdx) => {
                        const tokenId = `${word.id}-${tIdx}`;
                        const error = markedErrors[tokenId];

                        return (
                          <span
                            key={tokenId}
                            onClick={() => handleTokenClick(tokenId, token)}
                            className={`text-2xl md:text-3xl font-semibold px-2 py-1 rounded-lg cursor-pointer transition-transform duration-150 ${
                              error
                                ? `${error.errorBg} text-gray-950 font-bold ring-2 ring-gray-900/30 scale-105 shadow-2xs`
                                : "text-gray-900 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-110"
                            }`}
                            title={error ? `Kesalahan: ${error.errorLabel}` : "Klik untuk menandai kesalahan"}
                          >
                            {token}
                          </span>
                        );
                      })}
                    </div>

                    {/* Transliteration subtitle */}
                    {word.transliteration && (
                      <span className="text-[11px] font-medium text-gray-400 group-hover:text-gray-600 transition">
                        {word.transliteration}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom helper tip */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <span>
              Penyetor: <strong className="text-gray-800">{reciterParam}</strong>
            </span>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white font-medium text-xs shadow-2xs transition cursor-pointer"
            >
              Selesai &amp; Buat Ringkasan Setoran
            </button>
          </div>
        </div>
      </div>

      {/* 14 Error Categories Dialog */}
      <Dialog open={!!activeTokenData} onOpenChange={(open) => !open && setActiveTokenData(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Evaluasi Huruf/Kata:</span>
              <span
                style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                className="text-2xl text-[#00875a] font-semibold"
              >
                {activeTokenData?.tokenText}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* 3-Column Error Category Grid */}
          <div className="grid grid-cols-3 gap-2.5 py-4">
            {ERROR_CATEGORIES.map((cat) => {
              const isCurrentSelected = activeTokenData && markedErrors[activeTokenData.tokenId]?.errorId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectError(cat)}
                  className={`px-2 py-3 rounded-xl text-xs font-semibold transition cursor-pointer text-center border shadow-2xs ${cat.bg} text-gray-900 ${cat.border} ${
                    isCurrentSelected ? "ring-2 ring-gray-900 scale-105" : "hover:brightness-95"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* If already has error, option to remove */}
          {activeTokenData && markedErrors[activeTokenData.tokenId] && (
            <button
              type="button"
              onClick={handleRemoveError}
              className="w-full py-2 mb-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/70 rounded-xl transition cursor-pointer"
            >
              Hapus Tanda Kesalahan Kata Ini
            </button>
          )}

          {/* Full-width Red Cancel Button */}
          <button
            type="button"
            onClick={() => setActiveTokenData(null)}
            className="w-full py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
