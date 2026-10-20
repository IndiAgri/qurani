"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, BookOpen, AlertCircle } from "lucide-react";
import { SURAT_LIST } from "@/data/quran-data";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface MarkedErrorItem {
  ayahNumber: number;
  wordIndex: number;
  word: string;
  errorId: string;
  errorLabel: string;
  errorBg: string;
  errorText: string;
}

interface RecitationDraft {
  reciter: string;
  type: string;
  surahId: number;
  startVerse: number;
  endVerse: number;
  markedErrors: Record<string, MarkedErrorItem>;
  markedAyahErrors?: Record<number, any>;
  juz: number;
  page: number;
}

const CONCLUSIONS = [
  { value: "Excellent", label: "Excellent" },
  { value: "Very Good", label: "Very Good" },
  { value: "Good", label: "Good" },
  { value: "Pass", label: "Pass" },
  { value: "Weak", label: "Weak" },
  { value: "Not Pass", label: "Not Pass" },
];

export function RecitationRecap({ locale = "en" }: { locale?: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [draft, setDraft] = React.useState<RecitationDraft | null>(null);
  const [reciter, setReciter] = React.useState("nanas nanas");
  const [startSurahId, setStartSurahId] = React.useState("1");
  const [startVerse, setStartVerse] = React.useState("1");
  const [endSurahId, setEndSurahId] = React.useState("1");
  const [endVerse, setEndVerse] = React.useState("7");
  const [conclusion, setConclusion] = React.useState("");
  const [hasConclusionError, setHasConclusionError] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [specialNotes, setSpecialNotes] = React.useState("");

  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem("qurani_recitation_draft");
      if (saved) {
        const parsed: RecitationDraft = JSON.parse(saved);
        setDraft(parsed);
        setReciter(parsed.reciter || "nanas nanas");
        setStartSurahId(String(parsed.surahId || 1));
        setEndSurahId(String(parsed.surahId || 1));
        setStartVerse(String(parsed.startVerse || 1));
        setEndVerse(String(parsed.endVerse || 7));
      }
    } catch {}
  }, []);

  const startSurah = SURAT_LIST.find((s) => s.id === parseInt(startSurahId, 10)) || SURAT_LIST[0];
  const endSurah = SURAT_LIST.find((s) => s.id === parseInt(endSurahId, 10)) || SURAT_LIST[0];

  const errorList: MarkedErrorItem[] = React.useMemo(() => {
    if (!draft?.markedErrors) {
      // Fallback matching screenshot sample if no live error
      return [
        {
          ayahNumber: 1,
          wordIndex: 1,
          word: "وَإِيَّاكَ",
          errorId: "lupa",
          errorLabel: "Lupa",
          errorBg: "bg-[#f97316]",
          errorText: "text-white",
        },
      ];
    }
    const list = Object.values(draft.markedErrors);
    return list.length > 0
      ? list
      : [
          {
            ayahNumber: 1,
            wordIndex: 1,
            word: "وَإِيَّاكَ",
            errorId: "lupa",
            errorLabel: "Lupa",
            errorBg: "bg-[#f97316]",
            errorText: "text-white",
          },
        ];
  }, [draft]);

  const uniqueVersesWithError = React.useMemo(() => {
    return new Set(errorList.map((e) => e.ayahNumber)).size;
  }, [errorList]);

  const handleSave = () => {
    if (!conclusion) {
      setHasConclusionError(true);
      return;
    }

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;

    const surahNameClean = startSurah.name.replace(/\s*\(\d+\)/, "");
    let reciteLabel = `${draft?.type || "Tahsin"} ${surahNameClean} ${startVerse}-${endVerse}`;

    if ((draft as any)?.mode === "pra-quran") {
      reciteLabel = `Pra Quran ${(draft as any)?.jilidName || "Yanbu'a Jilid 1"} Hal ${(draft as any)?.page || 1}`;
    } else if ((draft as any)?.mode === "juz") {
      reciteLabel = `${draft?.type || "Tahsin"} Juz ${(draft as any)?.juzId || 1}`;
    } else if ((draft as any)?.mode === "page") {
      reciteLabel = `${draft?.type || "Tahsin"} Halaman ${(draft as any)?.pageId || 1}`;
    }

    const currentUserName = user?.username || user?.name || "indi";
    const startSurahClean = startSurah.name.replace(/\s*\(\d+\)/, "").trim();
    const endSurahClean = endSurah.name.replace(/\s*\(\d+\)/, "").trim();

    const newRecord = {
      id: `rec-${Date.now()}`,
      time: formattedDate,
      reciter: reciter.split("-")[0].trim() || "nanas nanas",
      reciterUsername: "@nanas",
      reciterLocation: "Malang - Jawa Timur",
      reciterAvatar: "",
      recipient: currentUserName,
      recite: reciteLabel,
      startSurah: startSurahClean || "Al-Fatihah",
      endSurah: endSurahClean || "Al-Fatihah",
      startVerse: String(startVerse || "1"),
      endVerse: String(endVerse || "7"),
      juz: (draft as any)?.juzId || 1,
      page: (draft as any)?.page || 1,
      result: conclusion || "Pass",
      conclusion: conclusion || "Pass",
      statusGrade:
        conclusion === "Excellent" || conclusion === "Very Good"
          ? "mumtaz"
          : conclusion === "Not Pass"
          ? "murajaah"
          : "jayyid",
      signature: "verified",
      isSigned: true,
      notes: [notes.trim(), specialNotes.trim()].filter(Boolean).join(" • ") || "-",
      duration: "4m 15s",
      markedErrors: errorList,
      markedAyahErrors: draft?.markedAyahErrors ? Object.values(draft.markedAyahErrors) : [],
      errorCount: errorList.length,
    };

    // Save to localStorage
    try {
      const existingStr = localStorage.getItem("qurani_recitation_results");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem("qurani_recitation_results", JSON.stringify([newRecord, ...existing]));
      window.dispatchEvent(new Event("qurani_recitation_updated"));
    } catch {}

    // Sync to Supabase recitation_sessions if configured
    if (isSupabaseConfigured) {
      supabase
        .from("recitation_sessions")
        .insert({
          id: newRecord.id,
          time: newRecord.time,
          reciter: newRecord.reciter,
          recipient: newRecord.recipient,
          recite: newRecord.recite,
          result: newRecord.result,
          status_grade: newRecord.statusGrade,
          signature: newRecord.signature,
          notes: newRecord.notes,
          duration: newRecord.duration,
          error_count: newRecord.errorCount,
          marked_errors: newRecord.markedErrors,
          ayah_errors: newRecord.markedAyahErrors,
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase insert session error:", error.message);
        });
    }

    toast.success("Hasil setoran berhasil disimpan!", {
      description: `${reciteLabel} • Predikat: ${conclusion}`,
    });

    router.push(`/${locale}/recitation`);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] p-4 sm:p-6 lg:p-8 flex justify-center select-none">
      {/* Centered Width Container Matching User Screenshot Exactly */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Header with Back button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-white text-gray-700 transition cursor-pointer"
            title="Back to recitation"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            Recitation
          </h1>
        </div>

        {/* Card 1: Recitation Details (Matching Screenshot Exactly) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
            <BookOpen className="size-4.5 text-gray-900 stroke-[2]" />
            <span>Recitation Details</span>
          </div>

          {/* Row 1: Reciter (Fixed/Disabled matching screenshot) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Reciter</label>
            <input
              type="text"
              value={reciter.includes(" - ") ? reciter.split(" - ")[0].trim() : reciter}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-xs sm:text-sm text-gray-500 cursor-not-allowed select-none focus:outline-none"
            />
          </div>

          {/* Row 2: Start Surah & Start Verse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Start Surah</label>
              <Select value={startSurahId} disabled>
                <SelectTrigger disabled className="w-full text-xs sm:text-sm h-11 rounded-xl bg-gray-50/70 text-gray-500 border-gray-200 cursor-not-allowed select-none">
                  <SelectValue>{startSurah.name.replace(/\s*\(\d+\)/, "")}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl bg-white">
                  {SURAT_LIST.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)} className="text-xs sm:text-sm">
                      {s.name.replace(/\s*\(\d+\)/, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Start Verse</label>
              <Select value={startVerse} onValueChange={(val) => val && setStartVerse(val)}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-11 rounded-xl bg-white border-gray-200">
                  <SelectValue>{startVerse}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl bg-white">
                  {Array.from({ length: startSurah.totalAyat || 7 }, (_, i) => String(i + 1)).map((v) => (
                    <SelectItem key={v} value={v} className="text-xs sm:text-sm">
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: End Surah & End Verse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">End Surah</label>
              <Select value={endSurahId} disabled>
                <SelectTrigger disabled className="w-full text-xs sm:text-sm h-11 rounded-xl bg-gray-50/70 text-gray-500 border-gray-200 cursor-not-allowed select-none">
                  <SelectValue>{endSurah.name.replace(/\s*\(\d+\)/, "")}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl bg-white">
                  {SURAT_LIST.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)} className="text-xs sm:text-sm">
                      {s.name.replace(/\s*\(\d+\)/, "")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">End Verse</label>
              <Select value={endVerse} onValueChange={(val) => val && setEndVerse(val)}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-11 rounded-xl bg-white border-gray-200">
                  <SelectValue>{endVerse}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl bg-white">
                  {Array.from({ length: endSurah.totalAyat || 7 }, (_, i) => String(i + 1)).map((v) => (
                    <SelectItem key={v} value={v} className="text-xs sm:text-sm">
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Conclusion & Notes (Directly matching screenshot) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={cn("text-xs font-medium", hasConclusionError ? "text-red-500" : "text-gray-700")}>
                Conclusion
              </label>
              <Select
                value={conclusion}
                onValueChange={(val) => {
                  if (val) {
                    setConclusion(val);
                    setHasConclusionError(false);
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full text-xs sm:text-sm h-11 rounded-xl bg-white",
                    hasConclusionError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  )}
                >
                  <SelectValue placeholder="Select Conclusion" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white">
                  {CONCLUSIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-xs sm:text-sm">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasConclusionError && (
                <p className="text-xs text-red-500 mt-1">Conclusion is required</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                className="w-full px-4 h-11 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
              />
            </div>
          </div>

          {/* Save Button (Aligned Right Directly Below Notes) */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00875a] hover:bg-[#00734c] text-white text-xs sm:text-sm font-semibold shadow-2xs transition cursor-pointer"
            >
              <Save className="size-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Card 2: Summary (N) (Matching Screenshot Exactly) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Summary Title */}
          <div className="p-5 pb-3 text-sm font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="size-4.5 text-gray-700" />
            <span>Summary ({errorList.length})</span>
          </div>

          {/* Emerald Header Banner with Pills */}
          <div className="bg-[#00875a] px-5 py-3 flex items-center gap-2.5">
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00875a] font-bold text-xs">
              Juz {draft?.juz || 1}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white text-[#00875a] font-bold text-xs">
              Page {draft?.page || 1}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#ef4444] text-white font-bold text-xs">
              {uniqueVersesWithError} Verses
            </span>
            <span className="px-3.5 py-1 rounded-full bg-[#ef4444] text-white font-bold text-xs">
              {errorList.length} Words
            </span>
          </div>

          {/* Summary Content Body */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
              <span className="size-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">!</span>
              <span>Word Errors</span>
            </div>

            {errorList.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Tidak ada catatan kesalahan kata.</p>
            ) : (
              <div className="space-y-2.5">
                {errorList.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="size-5 rounded-full bg-[#2563eb] text-white text-[11px] font-bold flex items-center justify-center">
                        {err.ayahNumber}
                      </span>
                      <span
                        dir="rtl"
                        style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                        className="text-lg text-gray-900 font-normal"
                      >
                        {err.word}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${err.errorBg || "bg-[#f97316] text-white"}`}
                    >
                      {err.errorLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Conclusion & Notes in Summary Card matching reference screenshot */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="space-y-1.5">
                <label className={cn("text-xs font-medium", hasConclusionError ? "text-red-500" : "text-gray-700")}>
                  Conclusion
                </label>
                <Select
                  value={conclusion}
                  onValueChange={(val) => {
                    if (val) {
                      setConclusion(val);
                      setHasConclusionError(false);
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full text-xs sm:text-sm h-11 rounded-xl bg-white",
                      hasConclusionError ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                    )}
                  >
                    <SelectValue placeholder="Select Conclusion" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white">
                    {CONCLUSIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-xs sm:text-sm">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasConclusionError && (
                  <p className="text-xs text-red-500 mt-1">Conclusion is required</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Notes</label>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Special Notes"
                  rows={4}
                  className="w-full p-4 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00875a] resize-y placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
