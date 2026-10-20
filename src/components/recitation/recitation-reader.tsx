"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, PanelLeft, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SURAH_VERSES, ERROR_CATEGORIES, QuranSurahDetail, SURAH_CALLIGRAPHY_TITLES } from "@/data/quran-verses";
import { SURAT_LIST, JUZ_LIST, HALAMAN_LIST } from "@/data/quran-data";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";
import { RecitationSettingsDialog } from "./recitation-settings-dialog";
import { useQuraniSettings } from "@/hooks/use-qurani-settings";

export interface AyahErrorCategoryItem {
  id: string;
  label: string;
  bg: string;
  border: string;
  text: string;
  customBg?: string;
  customText?: string;
}

export const AYAH_ERROR_CATEGORIES: AyahErrorCategoryItem[] = [
  { id: "terlewat", label: "Ayat Terlewat / Lupa", bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-950" },
  { id: "tertukar", label: "Ayat Tertukar / Sambung", bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-950" },
  { id: "tersendat", label: "Tidak Lancar (Terbata)", bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-950" },
  { id: "waqaf_salah", label: "Waqaf & Ibtida Salah", bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-950" },
];

export interface MarkedAyahError {
  ayahNumber: number;
  errorId: string;
  errorLabel: string;
  errorBg: string;
  errorBorder: string;
  customBg?: string;
  customText?: string;
}

interface RawWord {
  id: number;
  char_type_name: "word" | "end";
  location: string;
  page_number?: number;
  line_number?: number;
  text_uthmani: string;
}

interface RawVerse {
  id: number;
  page_number: number;
  verse_number: number;
  verse_key: string;
  juz_number: number;
  words: RawWord[];
}

interface PageGroup {
  pageNumber: number;
  verses: RawVerse[];
}

interface MarkedError {
  ayahNumber: number;
  wordIndex: number;
  word: string;
  errorId: string;
  errorLabel: string;
  errorBg: string;
  errorText: string;
  customBg?: string;
  customText?: string;
}

interface RecitationReaderProps {
  surahId?: number;
  juzId?: number;
  pageId?: number;
  mode?: "surah" | "juz" | "page";
  locale?: string;
}

export function RecitationReader({
  surahId = 1,
  juzId = 1,
  pageId = 1,
  mode = "surah",
  locale = "en",
}: RecitationReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggleSidebar } = useSidebar();

  const reciterParam = searchParams?.get("reciter") || "via - via";
  const typeParam = searchParams?.get("type") || "Tahsin";

  const surahMeta = SURAT_LIST.find((s) => s.id === surahId) || SURAT_LIST[0];
  const juzMeta = JUZ_LIST.find((j) => j.id === juzId) || JUZ_LIST[0];
  const pageMeta = HALAMAN_LIST.find((p) => p.id === pageId) || HALAMAN_LIST[0];

  let displayTitle = surahMeta.name;
  let calligraphyTitle = SURAH_CALLIGRAPHY_TITLES[surahId] || `سُورَةُ ${surahMeta.arabicName || surahMeta.name}`;
  let hasBasmalah = surahId !== 1 && surahId !== 9;

  if (mode === "juz") {
    displayTitle = `Juz ${juzId} (${juzMeta.startSurat} - ${juzMeta.endSurat})`;
    calligraphyTitle = juzMeta.arabicName ? `الجُزْءُ ${juzMeta.arabicName.replace("الجزء ", "")}` : `الجُزْءُ ${juzId}`;
    hasBasmalah = false;
  } else if (mode === "page") {
    displayTitle = `Page ${pageId} (Juz ${pageMeta.juz})`;
    calligraphyTitle = `صَفْحَةُ ${pageId}`;
    hasBasmalah = false;
  }

  // Qurani Global / User Settings Hook
  const { settings: quraniSettings } = useQuraniSettings();

  const readerFontFamily =
    quraniSettings.fontType === "indopak"
      ? "'Noto Nastaliq Urdu', 'Gulzar', 'Urdu Typesetting', serif"
      : "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif";

  const readerFontSizeStyle = React.useMemo(() => {
    const sizeMap: Record<number, { size: string; leading: string }> = {
      1: { size: "15px", leading: "2.1" },
      2: { size: "17px", leading: "2.1" },
      3: { size: "19px", leading: "2.2" },
      4: { size: "22px", leading: "2.3" },
      5: { size: "25px", leading: "2.4" },
      6: { size: "29px", leading: "2.5" },
      7: { size: "33px", leading: "2.6" },
      8: { size: "38px", leading: "2.7" },
      9: { size: "43px", leading: "2.8" },
      10: { size: "50px", leading: "2.9" },
    };
    return sizeMap[quraniSettings.fontSize] || sizeMap[3];
  }, [quraniSettings.fontSize]);

  const isMushafLayout = quraniSettings.layout === "mushaf_uthmani";

  // Dynamic Ayah Error Categories based on settings
  const dynamicAyahCategories = React.useMemo(() => {
    const enabledCustom = quraniSettings.verseErrors.filter((v) => v.enabled);
    if (enabledCustom.length > 0) {
      return enabledCustom.map((item) => ({
        id: item.id,
        label: item.label,
        bg: item.bg.startsWith("#") ? "" : item.bg,
        border: "border-gray-200",
        text: item.text,
        customBg: item.bg,
        customText: item.text,
      }));
    }
    return AYAH_ERROR_CATEGORIES;
  }, [quraniSettings.verseErrors]);

  // Dynamic Word Error Categories based on settings
  const dynamicWordCategories = React.useMemo(() => {
    const enabledCustom = quraniSettings.wordErrors?.filter((v) => v.enabled);
    if (enabledCustom && enabledCustom.length > 0) {
      return enabledCustom.map((item) => ({
        id: item.id,
        label: item.label,
        bg: item.bg.startsWith("#") ? "" : item.bg,
        border: "border-gray-200",
        text: item.text,
        customBg: item.bg,
        customText: item.text,
      }));
    }
    return ERROR_CATEGORIES.map((item) => ({
      ...item,
      customBg: undefined as string | undefined,
      customText: undefined as string | undefined,
    }));
  }, [quraniSettings.wordErrors]);

  // Pages & Verses state
  const [pages, setPages] = React.useState<PageGroup[]>([]);
  const [visiblePageCount, setVisiblePageCount] = React.useState<number>(3);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Marked errors state (keyed by `${ayahNumber}-${wordIndex}`)
  const [markedErrors, setMarkedErrors] = React.useState<Record<string, MarkedError>>({});
  
  // Marked Ayah errors state (keyed by ayahNumber)
  const [markedAyahErrors, setMarkedAyahErrors] = React.useState<Record<number, MarkedAyahError>>({});
  const [activeAyahNumber, setActiveAyahNumber] = React.useState<number | null>(null);

  // Settings dialog state
  const [isSettingsOpen, setIsSettingsOpen] = React.useState<boolean>(false);

  // Active word being evaluated
  const [activeWordData, setActiveWordData] = React.useState<{
    ayahNumber: number;
    wordIndex: number;
    word: string;
  } | null>(null);

  // Fetch JSON data based on mode (surah / juz / page)
  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // If surah mode and pre-cached in memory (like Al-Fatihah fallback)
    if (mode === "surah" && SURAH_VERSES[surahId] && surahId === 1) {
      const v1 = SURAH_VERSES[1];
      const page1Verses: RawVerse[] = v1.verses.map((v) => ({
        id: v.ayahNumber,
        page_number: 1,
        verse_number: v.ayahNumber,
        verse_key: `1:${v.ayahNumber}`,
        juz_number: 1,
        words: [
          ...v.words.map((w, i) => ({
            id: i,
            char_type_name: "word" as const,
            location: `1:${v.ayahNumber}:${i + 1}`,
            text_uthmani: w,
          })),
          {
            id: 999,
            char_type_name: "end" as const,
            location: `1:${v.ayahNumber}:end`,
            text_uthmani: ["١", "٢", "٣", "٤", "٥", "٦", "٧"][v.ayahNumber - 1] || `${v.ayahNumber}`,
          },
        ],
      }));

      setPages([{ pageNumber: 1, verses: page1Verses }]);
      setIsLoading(false);
      return;
    }

    const jsonUrl =
      mode === "juz"
        ? `/json/juz/${juzId}.json`
        : mode === "page"
        ? `/json/page/${pageId}.json`
        : `/json/surah/${surahId}.json`;

    fetch(jsonUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`Gagal memuat data ${mode}`);
        return res.json();
      })
      .then((data: RawVerse[]) => {
        if (!isMounted) return;

        // Group verses by page_number
        const groupedMap = new Map<number, RawVerse[]>();
        data.forEach((verse) => {
          const p = verse.page_number || 1;
          if (!groupedMap.has(p)) {
            groupedMap.set(p, []);
          }
          groupedMap.get(p)!.push(verse);
        });

        const sortedPages: PageGroup[] = Array.from(groupedMap.entries())
          .sort(([a], [b]) => a - b)
          .map(([pNum, vList]) => ({
            pageNumber: pNum,
            verses: vList,
          }));

        setPages(sortedPages);
        // Default to showing first 5 pages for long surahs/juz, or all if fewer
        setVisiblePageCount(Math.min(5, sortedPages.length));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading json:", err);
        if (isMounted) {
          // Fallback to SURAH_VERSES if available
          if (mode === "surah" && SURAH_VERSES[surahId]) {
            const fb = SURAH_VERSES[surahId];
            setPages([{
              pageNumber: fb.page,
              verses: fb.verses.map((v) => ({
                id: v.ayahNumber,
                page_number: fb.page,
                verse_number: v.ayahNumber,
                verse_key: `${surahId}:${v.ayahNumber}`,
                juz_number: fb.juz,
                words: [
                  ...v.words.map((w, i) => ({
                    id: i,
                    char_type_name: "word" as const,
                    location: `${surahId}:${v.ayahNumber}:${i + 1}`,
                    text_uthmani: w,
                  })),
                  {
                    id: 999,
                    char_type_name: "end" as const,
                    location: `${surahId}:${v.ayahNumber}:end`,
                    text_uthmani: `${v.ayahNumber}`,
                  },
                ],
              })),
            }]);
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahId, juzId, pageId, mode]);

  const handleWordClick = (ayahNumber: number, wordIndex: number, word: string) => {
    setActiveWordData({ ayahNumber, wordIndex, word });
  };

  const handleSelectError = (error: {
    id: string;
    label: string;
    bg?: string;
    text?: string;
    border?: string;
    customBg?: string;
    customText?: string;
  }) => {
    if (!activeWordData) return;
    const key = `${activeWordData.ayahNumber}-${activeWordData.wordIndex}`;
    
    setMarkedErrors((prev) => ({
      ...prev,
      [key]: {
        ayahNumber: activeWordData.ayahNumber,
        wordIndex: activeWordData.wordIndex,
        word: activeWordData.word,
        errorId: error.id,
        errorLabel: error.label,
        errorBg: error.bg || "",
        errorText: error.text || "text-gray-950",
        customBg: error.customBg,
        customText: error.customText,
      },
    }));

    setActiveWordData(null);
  };

  const handleAyahClick = (ayahNumber: number) => {
    setActiveAyahNumber(ayahNumber);
  };

  const handleSelectAyahError = (error: {
    id: string;
    label: string;
    bg?: string;
    border?: string;
    customBg?: string;
    customText?: string;
  }) => {
    if (!activeAyahNumber) return;
    setMarkedAyahErrors((prev) => ({
      ...prev,
      [activeAyahNumber]: {
        ayahNumber: activeAyahNumber,
        errorId: error.id,
        errorLabel: error.label,
        errorBg: error.bg || "",
        errorBorder: error.border || "border-gray-300",
        customBg: error.customBg,
        customText: error.customText,
      },
    }));
    toast.warning(`Ayat ${activeAyahNumber} ditandai: ${error.label}`);
    setActiveAyahNumber(null);
  };

  const handleRemoveAyahError = () => {
    if (!activeAyahNumber) return;
    setMarkedAyahErrors((prev) => {
      const copy = { ...prev };
      delete copy[activeAyahNumber];
      return copy;
    });
    toast.info(`Tanda kesalahan Ayat ${activeAyahNumber} dihapus`);
    setActiveAyahNumber(null);
  };

  const handleRemoveError = () => {
    if (!activeWordData) return;
    const key = `${activeWordData.ayahNumber}-${activeWordData.wordIndex}`;
    setMarkedErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setActiveWordData(null);
  };

  const handleFinish = () => {
    const firstVerse = pages[0]?.verses[0];
    const lastPage = pages[pages.length - 1];
    const lastVerse = lastPage?.verses[lastPage.verses.length - 1];
    const initialJuz = firstVerse?.juz_number || (mode === "juz" ? juzId : 1);
    const initialPage = pages[0]?.pageNumber || (mode === "page" ? pageId : 1);

    const draft = {
      reciter: reciterParam,
      type: typeParam,
      mode,
      surahId,
      juzId,
      pageId,
      displayTitle,
      startVerse: firstVerse?.verse_number || 1,
      endVerse: lastVerse?.verse_number || (mode === "surah" ? surahMeta.totalAyat : 1),
      markedErrors,
      markedAyahErrors,
      juz: initialJuz,
      page: initialPage,
    };

    try {
      sessionStorage.setItem("qurani_recitation_draft", JSON.stringify(draft));
    } catch {}

    router.push(`/${locale}/recitation/quran/recap`);
  };

  const visiblePages = pages.slice(0, visiblePageCount);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white select-none">
      {/* Top Action Bar (Matching Screenshot 1 & 3) */}
      <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
            title="Toggle sidebar"
          >
            <PanelLeft className="size-5" />
          </button>
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
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition cursor-pointer"
            title="Pengaturan Setoran"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Quran Reading Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-6 max-w-[1120px] mx-auto w-full">
        {/* Surah/Juz/Page Calligraphy Title Header */}
        {/* Surah/Juz/Page Calligraphy Title Header matching Screenshot */}
        <div className="text-center my-4 md:my-6">
          <h1 
            style={{ fontFamily: readerFontFamily }}
            className="text-2xl md:text-4xl font-bold text-gray-900 tracking-wide select-none"
          >
            {calligraphyTitle}
          </h1>
        </div>

        {/* Basmalah (Only for surahs where Basmalah is NOT Ayah 1) */}
        {hasBasmalah && (
          <div className="text-center mb-4">
            <p 
              style={{ fontFamily: readerFontFamily }}
              className="text-base md:text-lg font-normal text-gray-800 select-none"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <Loader2 className="size-6 animate-spin text-[#00875a]" />
            <span className="text-xs">Memuat ayat Al-Qur&apos;an...</span>
          </div>
        )}

        {/* Quran Verses Content Grouped by Page */}
        {!isLoading && visiblePages.map((page) => (
          <div key={page.pageNumber} className="w-full">
            <div 
              dir="rtl"
              className={`w-full ${
                isMushafLayout ? "text-center" : "text-justify"
              } text-gray-900 font-normal px-2 py-1 select-none`}
              style={{
                fontFamily: readerFontFamily,
                fontSize: readerFontSizeStyle.size,
                lineHeight: readerFontSizeStyle.leading,
              }}
            >
              {page.verses.map((verse) => {
                const ayahErr = markedAyahErrors[verse.verse_number];
                return (
                  <span
                    key={verse.verse_number}
                    style={
                      ayahErr?.customBg
                        ? { backgroundColor: ayahErr.customBg, color: ayahErr.customText || "#0f172a" }
                        : undefined
                    }
                    className={`inline transition-colors duration-200 ${
                      ayahErr && !ayahErr.customBg
                        ? `${ayahErr.errorBg} rounded px-1 border-b-2 ${ayahErr.errorBorder}`
                        : ayahErr?.customBg
                        ? "rounded px-1.5 py-0.5"
                        : ""
                    }`}
                  >
                    {verse.words.map((word, wordIdx) => {
                      if (word.char_type_name === "end") {
                        return (
                          <span
                            key={word.id || wordIdx}
                            onClick={() => handleAyahClick(verse.verse_number)}
                            className={`inline-block font-normal mx-0.5 text-xs select-none cursor-pointer px-1 py-0.5 rounded transition ${
                              ayahErr
                                ? "bg-rose-600 text-white font-bold ring-2 ring-rose-300"
                                : "text-gray-400 hover:text-[#00875a] hover:bg-emerald-50"
                            }`}
                            title={
                              ayahErr
                                ? `Ayat ${verse.verse_number}: ${ayahErr.errorLabel} (Klik untuk ubah)`
                                : `Klik tanda ayat ۝ untuk evaluasi satu Ayat ${verse.verse_number}`
                            }
                          >
                            ۝{word.text_uthmani}
                          </span>
                        );
                      }

                      const errorKey = `${verse.verse_number}-${wordIdx}`;
                      const error = markedErrors[errorKey];

                      return (
                        <span
                          key={word.id || wordIdx}
                          onClick={() => handleWordClick(verse.verse_number, wordIdx, word.text_uthmani)}
                          style={
                            error?.customBg
                              ? { backgroundColor: error.customBg, color: error.customText || "#0f172a" }
                              : undefined
                          }
                          className={`inline-block mx-0.5 px-1 py-0.5 rounded cursor-pointer transition-colors duration-150 ${
                            error && !error.customBg
                              ? `${error.errorBg} text-gray-950 font-normal`
                              : error?.customBg
                              ? "font-normal"
                              : "hover:bg-gray-100/90 text-gray-900"
                          }`}
                          title={error ? `Kesalahan: ${error.errorLabel}` : "Klik untuk menandai kesalahan"}
                        >
                          {word.text_uthmani}
                        </span>
                      );
                    })}
                    {" "}
                  </span>
                );
              })}
            </div>

            {/* Page Separator (Only shown if pageSummary is show) */}
            {quraniSettings.pageSummary === "show" && (
              <div className="w-full flex items-center gap-3 my-4 md:my-5">
                <div className="flex-1 h-[1px] bg-gray-200" />
                <span className="text-[11px] font-normal text-gray-500 tracking-wider select-none">
                  Page {page.pageNumber}
                </span>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </div>
            )}
          </div>
        ))}

        {/* Load More Pages Button (for long surahs like Al-Baqarah) */}
        {!isLoading && visiblePageCount < pages.length && (
          <div className="flex items-center justify-center my-6">
            <button
              type="button"
              onClick={() => setVisiblePageCount((prev) => Math.min(prev + 3, pages.length))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 shadow-2xs transition cursor-pointer"
            >
              <span>Tampilkan Halaman Berikutnya ({visiblePageCount} dari {pages.length} Halaman)</span>
              <ChevronDown className="size-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Word Error Dialog (Matching Screenshot 5) */}
      <Dialog open={!!activeWordData} onOpenChange={(open) => !open && setActiveWordData(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <span>Word Error:</span>
              <span 
                style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                className="text-xl text-[#00875a] font-normal"
              >
                {activeWordData?.word}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* 3-Column Error Category Grid */}
          <div className="grid grid-cols-3 gap-2.5 py-4">
            {dynamicWordCategories.map((cat) => {
              const currentKey = activeWordData ? `${activeWordData.ayahNumber}-${activeWordData.wordIndex}` : "";
              const isCurrentSelected = markedErrors[currentKey]?.errorId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectError(cat)}
                  style={
                    cat.customBg
                      ? { backgroundColor: cat.customBg, color: cat.customText || "#0f172a" }
                      : undefined
                  }
                  className={`px-2 py-3 rounded-xl text-xs font-semibold transition cursor-pointer text-center border shadow-2xs ${
                    cat.customBg ? "" : cat.bg
                  } text-gray-900 ${cat.border || "border-gray-200"} ${
                    isCurrentSelected ? "ring-2 ring-gray-900 scale-105" : "hover:brightness-95"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* If already has error, option to remove */}
          {activeWordData && markedErrors[`${activeWordData.ayahNumber}-${activeWordData.wordIndex}`] && (
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
            onClick={() => setActiveWordData(null)}
            className="w-full py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
        </DialogContent>
      </Dialog>

      {/* Ayah Error Dialog (Menandai 1 Ayat Penuh) */}
      <Dialog open={activeAyahNumber !== null} onOpenChange={(open) => !open && setActiveAyahNumber(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
            <div>
              <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className="size-4 text-rose-600" />
                <span>Evaluasi Ayat #{activeAyahNumber}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 text-left mt-0.5">
                Pilih jenis catatan atau kesalahan untuk seluruh ayat ini
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Ayah Error Categories */}
          <div className="space-y-2 py-3">
            {dynamicAyahCategories.map((cat) => {
              const isSelected = activeAyahNumber !== null && markedAyahErrors[activeAyahNumber]?.errorId === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectAyahError(cat)}
                  style={
                    cat.customBg
                      ? { backgroundColor: cat.customBg, color: cat.customText || "#0f172a" }
                      : undefined
                  }
                  className={`w-full p-3 rounded-2xl text-left border transition flex items-center justify-between shadow-2xs ${
                    cat.customBg ? "" : cat.bg
                  } ${cat.border || "border-gray-200"} ${
                    isSelected ? "ring-2 ring-gray-900 font-bold scale-[1.01]" : "hover:brightness-95"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">{cat.label}</span>
                    <span className="text-[10px] opacity-80">Tandai ayat ini dalam evaluasi</span>
                  </div>
                  {isSelected && <span className="text-xs font-bold">✓ Terpilih</span>}
                </button>
              );
            })}
          </div>

          {/* Remove Ayah error button if already marked */}
          {activeAyahNumber !== null && markedAyahErrors[activeAyahNumber] && (
            <button
              type="button"
              onClick={handleRemoveAyahError}
              className="w-full py-2.5 mb-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/70 rounded-xl transition cursor-pointer"
            >
              Hapus Tanda Kesalahan Ayat Ini
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveAyahNumber(null)}
            className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </DialogContent>
      </Dialog>

      {/* Recitation Settings Modal */}
      <RecitationSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
