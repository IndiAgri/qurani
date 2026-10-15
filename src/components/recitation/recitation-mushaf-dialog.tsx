"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Eye,
  Info,
} from "lucide-react";
import { RecitationRecord, RecitationErrorItem } from "./recitation-results";
import { SURAT_LIST } from "@/data/quran-data";
import { SURAH_VERSES, SURAH_CALLIGRAPHY_TITLES } from "@/data/quran-verses";

interface RecitationMushafDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: RecitationRecord | null;
  onOpenEmail?: () => void;
}

interface RawVerseData {
  verse_number: number;
  words: {
    id: number;
    text_uthmani: string;
    char_type_name: "word" | "end";
  }[];
}

export function RecitationMushafDialog({
  open,
  onOpenChange,
  record,
  onOpenEmail,
}: RecitationMushafDialogProps) {
  const [versesData, setVersesData] = React.useState<RawVerseData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Extract surah ID from recite string, e.g. "Tahsin Al-Fatihah 1-7" or "Tahfidz Yasin 1-13"
  const surahInfo = React.useMemo(() => {
    if (!record) return { surahId: 1, surahName: "Al-Fatihah", ayatRange: "1-7" };

    const lower = record.recite.toLowerCase();
    for (const s of SURAT_LIST) {
      const cleanName = s.name.replace(/\s*\(\d+\)/, "").toLowerCase();
      if (lower.includes(cleanName)) {
        return {
          surahId: s.id,
          surahName: s.name.replace(/\s*\(\d+\)/, ""),
          ayatRange: record.recite.match(/\d+-\d+/)?.[0] || `1-${s.totalAyat}`,
        };
      }
    }
    return { surahId: 1, surahName: "Al-Fatihah", ayatRange: "1-7" };
  }, [record]);

  // Load Quran verse words
  React.useEffect(() => {
    if (!open || !record) return;

    setIsLoading(true);
    const surahId = surahInfo.surahId;

    // First check local static fallback
    if (SURAH_VERSES[surahId] && surahId === 1) {
      const v1 = SURAH_VERSES[1];
      const parsed: RawVerseData[] = v1.verses.map((v) => ({
        verse_number: v.ayahNumber,
        words: [
          ...v.words.map((w, i) => ({
            id: i,
            text_uthmani: w,
            char_type_name: "word" as const,
          })),
          {
            id: 999,
            text_uthmani: ["١", "٢", "٣", "٤", "٥", "٦", "٧"][v.ayahNumber - 1] || `${v.ayahNumber}`,
            char_type_name: "end" as const,
          },
        ],
      }));
      setVersesData(parsed);
      setIsLoading(false);
      return;
    }

    // Try fetching from public JSON
    fetch(`/json/surah/${surahId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("JSON not found");
        return res.json();
      })
      .then((json: any[]) => {
        const parsed: RawVerseData[] = json.map((v) => ({
          verse_number: v.verse_number,
          words: v.words.map((w: any) => ({
            id: w.id,
            text_uthmani: w.text_uthmani,
            char_type_name: w.char_type_name,
          })),
        }));
        setVersesData(parsed.slice(0, 30)); // render preview up to 30 verses
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback demo verse construction
        if (SURAH_VERSES[surahId]) {
          const fb = SURAH_VERSES[surahId];
          setVersesData(
            fb.verses.map((v) => ({
              verse_number: v.ayahNumber,
              words: [
                ...v.words.map((w, i) => ({
                  id: i,
                  text_uthmani: w,
                  char_type_name: "word" as const,
                })),
                {
                  id: 999,
                  text_uthmani: `${v.ayahNumber}`,
                  char_type_name: "end" as const,
                },
              ],
            }))
          );
        } else {
          // generic fallback
          setVersesData([
            {
              verse_number: 1,
              words: [
                { id: 1, text_uthmani: "بِسْمِ", char_type_name: "word" },
                { id: 2, text_uthmani: "ٱللَّهِ", char_type_name: "word" },
                { id: 3, text_uthmani: "ٱلرَّحْمَـٰنِ", char_type_name: "word" },
                { id: 4, text_uthmani: "ٱلرَّحِيمِ", char_type_name: "word" },
                { id: 999, text_uthmani: "١", char_type_name: "end" },
              ],
            },
          ]);
        }
        setIsLoading(false);
      });
  }, [open, record, surahInfo]);

  if (!record) return null;

  const calligraphy =
    SURAH_CALLIGRAPHY_TITLES[surahInfo.surahId] || `سُورَةُ ${surahInfo.surahName}`;

  // Build error lookup: key can be ayahNumber + word or exact word match
  const errorsList = record.markedErrors || [];

  const findWordError = (ayahNum: number, wordText: string) => {
    return errorsList.find((e) => {
      if (e.ayahNumber && e.ayahNumber === ayahNum) {
        if (!e.word || e.word.trim() === wordText.trim()) return true;
      }
      return e.word && e.word.trim() === wordText.trim();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-2xl">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-emerald-50 text-[#00875a] flex items-center justify-center shadow-2xs">
                <BookOpen className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 text-left flex items-center gap-2">
                  <span>Tampilan Mushaf Beranotasi</span>
                  <Badge className="bg-emerald-100/90 text-emerald-800 border-0 text-[10px] font-bold">
                    {record.result}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 text-left">
                  Santri: <span className="font-bold text-gray-800">{record.reciter}</span> • Penilai:{" "}
                  <span className="font-semibold text-gray-700">{record.recipient}</span> • {record.time}
                </DialogDescription>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onOpenEmail && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenEmail}
                  className="rounded-xl text-xs gap-1.5 border-emerald-200 text-[#00875a] hover:bg-emerald-50"
                >
                  <Mail className="size-3.5" />
                  <span>Kirim ke Email Ortu</span>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="rounded-xl text-xs gap-1.5"
              >
                <Printer className="size-3.5" />
                <span>Cetak Mushaf</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Legend of Error Annotations */}
        <div className="my-3 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-amber-600 shrink-0" />
            <span className="font-semibold text-amber-900">
              Keterangan Tanda Evaluasi ({errorsList.length} Kesalahan Ditemukan):
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#fda4af] text-rose-950 border border-rose-200">
              Tasydid / Mad
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#fde047] text-amber-950 border border-amber-200">
              Harakat / Waqaf
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#fdba74] text-orange-950 border border-orange-200">
              Ghunnah / Qalqalah
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#99f6e4] text-teal-950 border border-teal-200">
              Makhraj
            </span>
          </div>
        </div>

        {/* Mushaf Page Presentation Paper */}
        <div className="relative my-2 p-6 md:p-10 rounded-3xl bg-[#fdfbf7] border-2 border-emerald-900/10 shadow-inner select-none">
          {/* Ornamental Frame Border */}
          <div className="absolute inset-2 md:inset-3 border border-emerald-700/15 rounded-2xl pointer-events-none" />

          {/* Surah Calligraphy Banner */}
          <div className="text-center mb-6 space-y-1">
            <h2
              style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" }}
              className="text-2xl md:text-4xl font-bold text-gray-900 tracking-wide"
            >
              {calligraphy}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Surah {surahInfo.surahName} • {surahInfo.ayatRange}
            </p>
          </div>

          {/* Basmalah */}
          {surahInfo.surahId !== 9 && (
            <div className="text-center mb-6">
              <p
                style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" }}
                className="text-lg md:text-xl font-normal text-gray-800"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}

          {/* Quran Text with Highlights */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-gray-400">
              Memuat lembar Mushaf Al-Qur&apos;an...
            </div>
          ) : (
            <div
              dir="rtl"
              className="w-full text-justify text-[16px] md:text-[19px] leading-[2.3] md:leading-[2.5] text-gray-900 font-normal px-2"
              style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" }}
            >
              {versesData.map((verse) => (
                <span key={verse.verse_number} className="inline">
                  {verse.words.map((word, wIdx) => {
                    if (word.char_type_name === "end") {
                      return (
                        <span
                          key={word.id || wIdx}
                          className="inline-block text-[#00875a] font-bold mx-1 text-xs select-none"
                        >
                          ۝{word.text_uthmani}
                        </span>
                      );
                    }

                    const err = findWordError(verse.verse_number, word.text_uthmani);

                    return (
                      <span
                        key={word.id || wIdx}
                        className={`inline-block mx-0.5 px-1 py-0.5 rounded transition ${
                          err
                            ? `${err.errorBg || "bg-rose-200"} text-gray-950 font-semibold ring-1 ring-black/10 shadow-2xs`
                            : "text-gray-900"
                        }`}
                        title={err ? `Catatan Penilai: ${err.errorLabel}` : undefined}
                      >
                        {word.text_uthmani}
                      </span>
                    );
                  })}
                  {" "}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Notes from Teacher */}
        {record.notes && (
          <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-xs font-bold text-gray-800 block">
              Catatan Evaluasi Guru Pembimbing:
            </span>
            <p className="text-xs text-gray-600 leading-relaxed italic">
              &ldquo;{record.notes}&rdquo;
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
