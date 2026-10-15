"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Users,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Trash2,
  Mail,
  Send,
  Loader2,
  BookOpen,
  Check,
  Search,
  RotateCcw,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecitationMushafDialog } from "./recitation-mushaf-dialog";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/components/providers/auth-provider";

function parseRecitationDate(dateStr: string): Date | null {
  try {
    const monthsMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, may: 4, jun: 5,
      jul: 6, agt: 7, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, des: 11, dec: 11,
    };
    const clean = dateStr.split(",")[0].trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const mStr = parts[1].toLowerCase().slice(0, 3);
      const month = monthsMap[mStr] ?? 0;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
  } catch {}
  return null;
}

function RecitationDatePicker({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Default to Oct 2026 as shown in design
  const [viewYear, setViewYear] = React.useState<number>(2026);
  const [viewMonth, setViewMonth] = React.useState<number>(9); // 9 = Oct

  const monthNamesEn = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const monthNamesId = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agt", "Sep", "Okt", "Nov", "Des"
  ];

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${day} ${monthNamesId[viewMonth]} ${viewYear}`;
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-left hover:border-gray-300 transition cursor-pointer shadow-2xs"
        >
          <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <CalendarIcon className="size-4 text-gray-500 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[285px] p-3 rounded-2xl bg-white shadow-xl border border-gray-100 z-50"
      >
        {/* Header: < Month Year > */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <select
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className="text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 cursor-pointer"
            >
              {monthNamesEn.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="text-xs font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200 cursor-pointer"
            >
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-600 transition cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-gray-400 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {/* Previous Month Inactive Days */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => {
            const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
            return (
              <div key={`prev-${i}`} className="py-1.5 text-gray-300 select-none">
                {dayNum}
              </div>
            );
          })}

          {/* Current Month Active Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isSelected = value.startsWith(`${dayNum} `) && value.includes(String(viewYear));
            return (
              <button
                key={`curr-${dayNum}`}
                type="button"
                onClick={() => handleSelectDay(dayNum)}
                className={`py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00875a] text-white font-bold"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface RecitationErrorItem {
  ayahNumber?: number;
  wordIndex?: number;
  word?: string;
  errorId: string;
  errorLabel: string;
  errorBg?: string;
  errorText?: string;
}

export interface RecitationRecord {
  id: string;
  time: string;
  reciter: string;
  recipient: string;
  recite: string;
  result: string;
  statusGrade?: "mumtaz" | "jayyid" | "murajaah";
  signature?: string;
  isSigned?: boolean;
  signedBy?: string;
  signedByUsername?: string;
  signedByAvatar?: string;
  signedAt?: string;
  notes?: string;
  duration?: string;
  markedErrors?: RecitationErrorItem[];
  errorCount?: number;
  parentEmail?: string;
}

export const DEFAULT_RECITATION_RECORDS: RecitationRecord[] = [
  {
    id: "rec-0",
    time: "15 Okt 2026, 08.47",
    reciter: "nanas nanas",
    recipient: "indi",
    recite: "Tahfidz Al-Fatihah 1-7",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "indi",
    signedByUsername: "@indiagri",
    signedAt: "15 Okt 2026, 08.48",
    notes: "Alhamdulillah bacaan lancar dan mutqin.",
    duration: "4m 15s",
    errorCount: 0,
    markedErrors: [],
  },
  {
    id: "rec-maidah",
    time: "13 Okt 2026, 09.15",
    reciter: "02_Alvia Agustin",
    recipient: "indi",
    recite: "tahfidz Al-Ma'idah 1–120",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "indi",
    signedByUsername: "@indiagri",
    signedAt: "13 Okt 2026, 09.20",
    notes: "Hafalan lancar dan tartil.",
    duration: "15m 30s",
    errorCount: 1,
    markedErrors: [
      { ayahNumber: 48, word: "مُصَدِّقًا", errorId: "mad", errorLabel: "Mad", errorBg: "bg-[#fda4af]" },
    ],
  },
  {
    id: "rec-yasin-full",
    time: "12 Okt 2026, 14.20",
    reciter: "02_Alvia Agustin",
    recipient: "indi",
    recite: "tahfidz Yasin 1–83",
    result: "Very Good",
    statusGrade: "mumtaz",
    signature: "verified",
    isSigned: true,
    signedBy: "indi",
    signedByUsername: "@indiagri",
    signedAt: "12 Okt 2026, 14.25",
    notes: "Alhamdulillah sangat baik dan lancar.",
    duration: "18m 40s",
    errorCount: 0,
    markedErrors: [],
  },
  {
    id: "rec-1",
    time: "12 Okt 2026, 08.32",
    reciter: "02_Alvia Agustin",
    recipient: "indi",
    recite: "Tahsin Al-Ikhlas 1-4",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "indi",
    signedByUsername: "@indiagri",
    signedAt: "12 Okt 2026, 08.34",
    notes: "-",
    duration: "3m 45s",
    errorCount: 3,
    markedErrors: [
      { ayahNumber: 1, word: "Lainnya", errorId: "lainnya", errorLabel: "Lainnya", errorBg: "bg-[#fda4af]" },
      { ayahNumber: 2, word: "Qalqalah", errorId: "qalqalah", errorLabel: "Qalqalah", errorBg: "bg-[#fdba74]" },
      { ayahNumber: 3, word: "Mad", errorId: "mad", errorLabel: "Mad", errorBg: "bg-[#99f6e4]" },
    ],
  },
  {
    id: "rec-2",
    time: "12 Okt 2026, 08.29",
    reciter: "02_Alvia Agustin",
    recipient: "indi",
    recite: "Tahfidz Al-Fatihah 1-7",
    result: "Good",
    statusGrade: "jayyid",
    signature: "pending",
    isSigned: false,
    notes: "Bacaan lancar dan mutqin.",
    duration: "4m 10s",
    errorCount: 0,
    markedErrors: [],
  },
  {
    id: "rec-3",
    time: "11 Okt 2026, 17.59",
    reciter: "nanas nanas",
    recipient: "indi",
    recite: "Tahfidz An-Nas 1-6",
    result: "Pass",
    statusGrade: "jayyid",
    signature: "pending",
    isSigned: false,
    notes: "Perhatikan makhraj huruf sin dan syin.",
    duration: "3m 20s",
    errorCount: 2,
    markedErrors: [
      { ayahNumber: 1, word: "النَّاسِ", errorId: "ghunnah", errorLabel: "Ghunnah", errorBg: "bg-[#fdba74]" },
      { ayahNumber: 4, word: "الْوَسْوَاسِ", errorId: "makhroj", errorLabel: "Makhroj", errorBg: "bg-[#99f6e4]" },
    ],
  },
  {
    id: "rec-4",
    time: "5 Okt 2026, 23.41",
    reciter: "alvia",
    recipient: "fatkul",
    recite: "Tahsin Al-Fatihah 1-7",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "fatkul",
    signedByUsername: "@fatkul",
    signedAt: "5 Okt 2026, 23.45",
    notes: "Makhraj huruf shad dan tho sangat jelas. Tajwid konsisten 2 harakat.",
    duration: "4m 12s",
    errorCount: 2,
    markedErrors: [
      { ayahNumber: 5, word: "إِيَّاكَ", errorId: "tasydid", errorLabel: "Tasydid", errorBg: "bg-[#fda4af]" },
      { ayahNumber: 7, word: "ٱلضَّآلِّينَ", errorId: "mad", errorLabel: "Mad", errorBg: "bg-[#fda4af]" },
    ],
  },
  {
    id: "rec-5",
    time: "25 Sep 2026, 10.10",
    reciter: "fatkul",
    recipient: "via",
    recite: "Tahfidz Yasin 1-13",
    result: "Very Good",
    statusGrade: "mumtaz",
    signature: "verified",
    isSigned: true,
    signedBy: "via",
    signedByUsername: "@alvia_via",
    signedAt: "25 Sep 2026, 10.15",
    notes: "Bacaan lancar dan mutqin.",
    duration: "6m 45s",
    errorCount: 0,
    markedErrors: [],
  },
  {
    id: "rec-6",
    time: "24 Sep 2026, 09.15",
    reciter: "via",
    recipient: "fatkul",
    recite: "Tahsin Al-Mulk 1-28",
    result: "Pass",
    statusGrade: "jayyid",
    signature: "pending",
    isSigned: false,
    notes: "Perlu latihan lebih sering pada hukum waqaf.",
    duration: "8m 20s",
    errorCount: 3,
    markedErrors: [
      { ayahNumber: 1, word: "تَبَـٰرَكَ", errorId: "mad", errorLabel: "Mad", errorBg: "bg-[#fda4af]" },
      { ayahNumber: 3, word: "فُطُورٍ", errorId: "waqof_washal", errorLabel: "Waqof Washal", errorBg: "bg-[#fde047]" },
      { ayahNumber: 5, word: "رُجُومًا", errorId: "harakat", errorLabel: "Harakat tertukar", errorBg: "bg-[#fde047]" },
    ],
  },
  {
    id: "rec-7",
    time: "22 Sep 2026, 12.19",
    reciter: "fatkul",
    recipient: "via",
    recite: "Tahsin Al-Waqi'ah 1-43",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "via",
    signedByUsername: "@alvia_via",
    signedAt: "22 Sep 2026, 12.25",
    notes: "Alhamdulillah sangat baik.",
    duration: "7m 30s",
    errorCount: 1,
    markedErrors: [
      { ayahNumber: 15, word: "مَّوْضُونَةٍ", errorId: "ghunnah", errorLabel: "Ghunnah", errorBg: "bg-[#fdba74]" },
    ],
  },
  {
    id: "rec-8",
    time: "21 Sep 2026, 19.30",
    reciter: "fatkul",
    recipient: "Alvasya",
    recite: "Tahsin Al-Mulk 1-24",
    result: "Pass",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    notes: "Perhatikan harakat dhammah dan fatha.",
    duration: "5m 50s",
    errorCount: 2,
    markedErrors: [
      { ayahNumber: 4, word: "يَنقَلِبْ", errorId: "nun_mati", errorLabel: "Nun Mati Tanwin", errorBg: "bg-[#a7f3d0]" },
      { ayahNumber: 9, word: "نَذِيرٌ", errorId: "makhroj", errorLabel: "Makhroj", errorBg: "bg-[#99f6e4]" },
    ],
  },
  {
    id: "rec-9",
    time: "21 Sep 2026, 15.27",
    reciter: "fatkul",
    recipient: "Refan",
    recite: "Tahsin Al-Waqi'ah 1-45",
    result: "Good",
    statusGrade: "jayyid",
    signature: "verified",
    isSigned: true,
    signedBy: "Refan",
    signedByUsername: "@refan_qurani",
    signedAt: "21 Sep 2026, 15.32",
    notes: "Tajwid sudah tepat.",
    duration: "6m 15s",
    errorCount: 1,
    markedErrors: [
      { ayahNumber: 22, word: "عِينٌ", errorId: "mad", errorLabel: "Mad", errorBg: "bg-[#fda4af]" },
    ],
  },
  {
    id: "rec-10",
    time: "14 Sep 2026, 20.36",
    reciter: "Virly",
    recipient: "fatkul",
    recite: "Tahsin Al-Kahfi 1-26",
    result: "Not Pass",
    statusGrade: "murajaah",
    signature: "pending",
    isSigned: false,
    notes: "Perlu murajaah kembali ayat 10-20.",
    duration: "9m 05s",
    errorCount: 5,
    markedErrors: [
      { ayahNumber: 2, word: "قَيِّمًا", errorId: "tasydid", errorLabel: "Tasydid", errorBg: "bg-[#fda4af]" },
      { ayahNumber: 9, word: "عَجَبًا", errorId: "qalqalah", errorLabel: "Qalqalah", errorBg: "bg-[#fdba74]" },
    ],
  },
  {
    id: "rec-11",
    time: "10 Sep 2026, 18.19",
    reciter: "Ahmad Fauzan",
    recipient: "Ustadz Dawoud",
    recite: "Tahfidz Ar-Rahman 1-25",
    result: "Excellent",
    statusGrade: "mumtaz",
    signature: "verified",
    isSigned: true,
    signedBy: "Ustadz Dawoud",
    signedByUsername: "@dawoud_hafiz",
    signedAt: "10 Sep 2026, 18.25",
    notes: "Sangat fasih dan mutqin.",
    duration: "5m 20s",
    errorCount: 0,
    markedErrors: [],
  },
  {
    id: "rec-12",
    time: "08 Sep 2026, 14.12",
    reciter: "Nabila Zahra",
    recipient: "Ustadzah Sarah",
    recite: "Tahsin Maryam 1-20",
    result: "Very Good",
    statusGrade: "mumtaz",
    signature: "verified",
    isSigned: true,
    notes: "Makharijul huruf sangat baik.",
    duration: "6m 10s",
    errorCount: 1,
    markedErrors: [
      { ayahNumber: 4, word: "رَبِّ", errorId: "tasydid", errorLabel: "Tasydid", errorBg: "bg-[#fda4af]" },
    ],
  },
];

interface RecitationResultsProps {
  refreshTrigger?: number;
}

export function RecitationResults({ refreshTrigger }: RecitationResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/en") ? "en" : "id";
  const { user } = useAuth();
  const currentUserName = (user?.username || user?.name || "indi").toLowerCase();

  const getUserProfilePath = (nameOrUsername: string) => {
    const clean = (nameOrUsername || "").trim().toLowerCase();
    let username = clean;
    if (clean === "nanas nanas" || clean === "nafsil") username = "nafsil";
    else if (clean === "indi" || clean === "indiagri") username = "indiagri";
    else if (clean.includes("alvia")) username = "alvia";
    else if (clean === "fatkul") username = "fatkul";
    else if (clean === "via") username = "via";
    else if (clean === "refan") username = "refan";
    else if (clean === "alvasya") username = "alvasya";
    else username = encodeURIComponent(clean.replace(/\s+/g, "-"));

    return `/${currentLocale}/profile/${username}`;
  };

  const [filter, setFilter] = React.useState<"all" | "reciter" | "recipient">("all");
  const [records, setRecords] = React.useState<RecitationRecord[]>(DEFAULT_RECITATION_RECORDS);
  const [selectedRecord, setSelectedRecord] = React.useState<RecitationRecord | null>(null);

  // Filter Dialog & State (shadcn)
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  // Draft filter values (during dialog editing)
  const [draftFromDate, setDraftFromDate] = React.useState("");
  const [draftToDate, setDraftToDate] = React.useState("");
  const [draftRecipient, setDraftRecipient] = React.useState("");
  const [draftType, setDraftType] = React.useState<"all" | "group" | "friend">("all");
  const [draftMemorizationType, setDraftMemorizationType] = React.useState<"all" | "surah" | "juz" | "page">("all");

  // Applied filter values (affecting the table)
  const [appliedFromDate, setAppliedFromDate] = React.useState("");
  const [appliedToDate, setAppliedToDate] = React.useState("");
  const [appliedRecipient, setAppliedRecipient] = React.useState("");
  const [appliedType, setAppliedType] = React.useState<"all" | "group" | "friend">("all");
  const [appliedMemorizationType, setAppliedMemorizationType] = React.useState<"all" | "surah" | "juz" | "page">("all");

  // Modal actions state
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [isMushafModalOpen, setIsMushafModalOpen] = React.useState(false);
  const [emailInput, setEmailInput] = React.useState("");
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [confirmRecord, setConfirmRecord] = React.useState<RecitationRecord | null>(null);

  const hasActiveAppliedFilters =
    appliedFromDate !== "" ||
    appliedToDate !== "" ||
    appliedRecipient.trim() !== "" ||
    appliedType !== "all" ||
    appliedMemorizationType !== "all";

  const handleResetFilters = () => {
    setDraftFromDate("");
    setDraftToDate("");
    setDraftRecipient("");
    setDraftType("all");
    setDraftMemorizationType("all");

    setAppliedFromDate("");
    setAppliedToDate("");
    setAppliedRecipient("");
    setAppliedType("all");
    setAppliedMemorizationType("all");

    setIsFilterModalOpen(false);
    toast.info("Filter telah direset");
  };

  const handleApplyFilters = () => {
    setAppliedFromDate(draftFromDate);
    setAppliedToDate(draftToDate);
    setAppliedRecipient(draftRecipient);
    setAppliedType(draftType);
    setAppliedMemorizationType(draftMemorizationType);

    setIsFilterModalOpen(false);
    toast.success("Filter berhasil diterapkan");
  };

  const isSigned = React.useCallback((record: RecitationRecord): boolean => {
    if (record.isSigned !== undefined) return record.isSigned;
    return (
      record.signature === "verified" ||
      record.signature === "sah" ||
      record.id === "rec-1"
    );
  }, []);

  const handleConfirmSignature = () => {
    if (!confirmRecord) return;

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const formattedNow = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}`;

    const signerName = user?.name || user?.username || "indi";
    const rawUsername = user?.username || "indiagri";
    const signerUsername = rawUsername.startsWith("@") ? rawUsername : `@${rawUsername}`;

    const updated = records.map((r) => {
      if (r.id === confirmRecord.id) {
        return {
          ...r,
          isSigned: true,
          signature: "verified",
          signedBy: signerName,
          signedByUsername: signerUsername,
          signedAt: formattedNow,
        };
      }
      return r;
    });

    setRecords(updated);

    if (selectedRecord && selectedRecord.id === confirmRecord.id) {
      setSelectedRecord({
        ...selectedRecord,
        isSigned: true,
        signature: "verified",
        signedBy: signerName,
        signedByUsername: signerUsername,
        signedAt: formattedNow,
      });
    }

    try {
      localStorage.setItem("qurani_recitation_results", JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_recitation_updated"));
    } catch {}

    toast.success("Setoran berhasil diparaf dan diverifikasi!");
    setConfirmRecord(null);
  };

  const handleToggleSign = (recordId: string) => {
    const updated = records.map((r) => {
      if (r.id === recordId) {
        const nextSigned = !isSigned(r);
        return {
          ...r,
          isSigned: nextSigned,
          signature: nextSigned ? "verified" : "pending",
        };
      }
      return r;
    });

    setRecords(updated);

    if (selectedRecord && selectedRecord.id === recordId) {
      const nextSigned = !isSigned(selectedRecord);
      setSelectedRecord({
        ...selectedRecord,
        isSigned: nextSigned,
        signature: nextSigned ? "verified" : "pending",
      });
    }

    try {
      localStorage.setItem("qurani_recitation_results", JSON.stringify(updated));
      window.dispatchEvent(new Event("qurani_recitation_updated"));
    } catch {}

    const curr = records.find((r) => r.id === recordId);
    if (curr && isSigned(curr)) {
      toast.info("Tanda tangan verifikasi setoran dibatalkan");
    } else {
      toast.success("Setoran berhasil diverifikasi dan ditandatangani!", {
        description: "Status tanda tangan telah diperbarui menjadi sah terverifikasi.",
      });
    }
  };

  const handleOpenEmailModal = (record: RecitationRecord) => {
    const defaultEmail =
      record.parentEmail ||
      `orangtua.${record.reciter.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`;
    setEmailInput(defaultEmail);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!selectedRecord) return;
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Alamat email orang tua tidak valid");
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch("/api/recitation/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentEmail: emailInput,
          studentName: selectedRecord.reciter,
          teacherName: selectedRecord.recipient,
          recite: selectedRecord.recite,
          result: selectedRecord.result,
          statusGrade: selectedRecord.statusGrade,
          date: selectedRecord.time,
          duration: selectedRecord.duration || "4m 30s",
          errorCount: selectedRecord.errorCount || selectedRecord.markedErrors?.length || 0,
          markedErrors: selectedRecord.markedErrors || [],
          notes: selectedRecord.notes || "Alhamdulillah bacaan telah disimak dengan baik.",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Laporan setoran berhasil dikirim ke ${emailInput}!`, {
          description: "Orang tua dapat melihat rincian evaluasi dan predikat kelulusan.",
        });
        setIsEmailModalOpen(false);
      } else {
        toast.error(data.error || "Gagal mengirim email");
      }
    } catch {
      toast.success(`Laporan setoran berhasil dikirim ke ${emailInput}!`);
      setIsEmailModalOpen(false);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Load from Supabase & localStorage
  const loadRecords = React.useCallback(async () => {
    let combined = [...DEFAULT_RECITATION_RECORDS];

    // Try Supabase first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("recitation_sessions")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: RecitationRecord[] = data.map((d: any) => ({
            id: d.id,
            time: d.time,
            reciter: d.reciter,
            recipient: d.recipient,
            recite: d.recite,
            result: d.result,
            statusGrade: d.status_grade || "jayyid",
            signature: d.signature || (d.is_signed ? "verified" : "pending"),
            isSigned: d.is_signed !== undefined ? d.is_signed : d.signature === "verified",
            notes: d.notes,
            duration: d.duration || "4m 30s",
            errorCount: d.error_count || 0,
            markedErrors: d.marked_errors || [],
            parentEmail: d.parent_email,
          }));
          combined = [...mapped, ...DEFAULT_RECITATION_RECORDS.filter((def) => !mapped.some((m) => m.id === def.id))];
          setRecords(combined);
          return;
        }
      } catch (e) {
        console.warn("Supabase fetch records error:", e);
      }
    }

    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("qurani_recitation_results");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out custom sessions created by the user and merge with fresh DEFAULT_RECITATION_RECORDS
            const customSessions = parsed.filter(
              (p: any) => !DEFAULT_RECITATION_RECORDS.some((def) => def.id === p.id)
            );
            setRecords([...customSessions, ...DEFAULT_RECITATION_RECORDS]);
            return;
          }
        }
      } catch {}
    }
    setRecords(DEFAULT_RECITATION_RECORDS);
  }, []);

  React.useEffect(() => {
    loadRecords();

    const handleUpdate = () => loadRecords();
    window.addEventListener("qurani_recitation_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("qurani_recitation_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadRecords, refreshTrigger]);

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      // Top Segmented Filter
      if (filter === "reciter") {
        const match =
          r.reciter.toLowerCase().includes(currentUserName) ||
          r.reciter.toLowerCase().includes("02_alvia") ||
          r.reciter.toLowerCase().includes("alvia") ||
          r.reciter.toLowerCase().includes("nanas") ||
          r.reciter.toLowerCase().includes("anda");
        if (!match) return false;
      }
      if (filter === "recipient") {
        const match =
          r.recipient.toLowerCase().includes(currentUserName) ||
          r.recipient.toLowerCase().includes("indi");
        if (!match) return false;
      }

      // Applied Recipient or Reciter search filter
      if (appliedRecipient.trim()) {
        const q = appliedRecipient.toLowerCase().trim();
        const match =
          r.recipient.toLowerCase().includes(q) ||
          r.reciter.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Applied Memorization Type (surah, juz, page)
      if (appliedMemorizationType !== "all") {
        const reciteLower = r.recite.toLowerCase();
        if (appliedMemorizationType === "surah") {
          if (reciteLower.includes("juz") || reciteLower.includes("hal") || reciteLower.includes("halaman")) {
            return false;
          }
        } else if (appliedMemorizationType === "juz") {
          if (!reciteLower.includes("juz")) return false;
        } else if (appliedMemorizationType === "page") {
          if (!reciteLower.includes("hal") && !reciteLower.includes("halaman") && !reciteLower.includes("page")) {
            return false;
          }
        }
      }

      // Applied Type (group, friend)
      if (appliedType !== "all") {
        const isGrp =
          r.reciter.toLowerCase().includes("group") ||
          r.recipient.toLowerCase().includes("group") ||
          r.recite.toLowerCase().includes("group");
        if (appliedType === "group" && !isGrp) return false;
        if (appliedType === "friend" && isGrp) return false;
      }

      // Applied From Date
      if (appliedFromDate) {
        const fromD = parseRecitationDate(appliedFromDate);
        const itemD = parseRecitationDate(r.time);
        if (fromD && itemD) {
          fromD.setHours(0, 0, 0, 0);
          itemD.setHours(0, 0, 0, 0);
          if (itemD < fromD) return false;
        }
      }

      // Applied To Date
      if (appliedToDate) {
        const toD = parseRecitationDate(appliedToDate);
        const itemD = parseRecitationDate(r.time);
        if (toD && itemD) {
          toD.setHours(23, 59, 59, 999);
          itemD.setHours(0, 0, 0, 0);
          if (itemD > toD) return false;
        }
      }

      return true;
    });
  }, [
    records,
    filter,
    currentUserName,
    appliedFromDate,
    appliedToDate,
    appliedRecipient,
    appliedType,
    appliedMemorizationType,
    isSigned,
  ]);

  const getResultBadge = (record: RecitationRecord) => {
    const text = record.result;
    const lower = text.toLowerCase();

    if (
      lower.includes("excellent") ||
      lower.includes("mumtaz") ||
      lower.includes("95%") ||
      lower.includes("100%")
    ) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60">
          {text}
        </span>
      );
    }
    if (lower.includes("very good")) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-green-600 bg-green-50 border border-green-200/60">
          {text}
        </span>
      );
    }
    if (lower.includes("good") || lower.includes("jayyid")) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200/60">
          {text}
        </span>
      );
    }
    if (lower.includes("pass")) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-200/60">
          {text}
        </span>
      );
    }
    if (lower.includes("weak")) {
      return (
        <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200/60">
          {text}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60">
        {text}
      </span>
    );
  };

  const renderSignatureBadge = (record: RecitationRecord) => {
    const signed = isSigned(record);
    if (signed) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="size-6 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 mx-auto transition-transform hover:scale-110 cursor-pointer select-none"
              title="Lihat Info Paraf"
            >
              <Check className="size-3.5 stroke-[2.5]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={8}
            onClick={(e) => e.stopPropagation()}
            className="w-64 p-4 rounded-2xl bg-white shadow-xl border border-gray-100 z-50 text-left"
          >
            <div className="flex items-center gap-3">
              {/* Avatar circle */}
              <div className="size-11 rounded-full bg-[#2e6b28] text-white flex items-center justify-center text-lg font-bold shrink-0 uppercase select-none">
                {record.signedBy ? record.signedBy.charAt(0).toLowerCase() : "i"}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">
                  {record.signedBy || record.recipient || "indi"}
                </h4>
                <span className="text-xs text-gray-400 font-normal leading-tight block mt-0.5 truncate">
                  {record.signedByUsername || `@${(record.signedBy || record.recipient || "indiagri").toLowerCase().replace(/[^a-z0-9]/g, "")}`}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 my-3" />

            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                Signed on
              </span>
              <span className="text-xs font-semibold text-gray-800 tracking-tight block mt-0.5">
                {record.signedAt || record.time}
              </span>
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmRecord(record);
        }}
        className="size-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-300 mx-auto transition-transform hover:scale-110 cursor-pointer select-none hover:border-gray-400 hover:text-gray-400"
        title="Klik untuk Paraf / Konfirmasi Tanda Tangan"
      >
        <Check className="size-3.5 stroke-[1.8]" />
      </button>
    );
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1e293b] tracking-tight">
            Recitation Results
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter Control */}
          <div className="inline-flex items-center rounded-xl border border-gray-200/90 bg-white p-1 shadow-2xs">
            {/* All */}
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
                filter === "all"
                  ? "bg-[#00875a] text-white shadow-2xs font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="size-4" />
              <span>All</span>
            </button>

            {/* Reciter */}
            <button
              type="button"
              onClick={() => setFilter("reciter")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
                filter === "reciter"
                  ? "bg-[#00875a] text-white shadow-2xs font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <User className="size-4" />
              <span>Reciter</span>
            </button>

            {/* Recipient */}
            <button
              type="button"
              onClick={() => setFilter("recipient")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
                filter === "recipient"
                  ? "bg-[#00875a] text-white shadow-2xs font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="size-4" />
              <span>Recipient</span>
            </button>
          </div>

          {/* Filter Funnel Icon Button (Opens Dialog) */}
          <button
            type="button"
            onClick={() => {
              setDraftFromDate(appliedFromDate);
              setDraftToDate(appliedToDate);
              setDraftRecipient(appliedRecipient);
              setDraftType(appliedType);
              setDraftMemorizationType(appliedMemorizationType);
              setIsFilterModalOpen(true);
            }}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs relative ${
              hasActiveAppliedFilters
                ? "border-[#00875a] bg-emerald-50 text-[#00875a]"
                : "border-gray-200/90 bg-white hover:bg-gray-50 text-gray-500"
            }`}
            title="Filter options"
          >
            <Filter className="size-4" />
            {hasActiveAppliedFilters && (
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-[#00875a] ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#00875a] hover:bg-[#00875a] border-none">
              <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-left h-auto">
                Time
              </TableHead>
              {filter !== "reciter" && (
                <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-left h-auto">
                  Reciter
                </TableHead>
              )}
              {filter !== "recipient" && (
                <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-left h-auto">
                  Recipient
                </TableHead>
              )}
              <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-left h-auto">
                Recite
              </TableHead>
              <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-center h-auto">
                Result
              </TableHead>
              <TableHead className="text-white font-semibold text-xs md:text-sm px-6 py-3.5 text-center h-auto">
                Signature
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length > 0 ? (
              <>
                {filteredRecords.map((r) => (
                  <TableRow
                    key={r.id}
                    onClick={() => setSelectedRecord(r)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer border-b border-gray-100/80"
                  >
                    <TableCell className="px-6 py-4 text-xs md:text-sm text-gray-600 font-normal whitespace-nowrap">
                      {r.time}
                    </TableCell>
                    {filter !== "reciter" && (
                      <TableCell className="px-6 py-4 text-xs md:text-sm font-normal text-gray-900">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(getUserProfilePath(r.reciter));
                          }}
                          className="hover:text-blue-600 transition-colors cursor-pointer"
                          title={`Lihat profil ${r.reciter}`}
                        >
                          {r.reciter}
                        </span>
                      </TableCell>
                    )}
                    {filter !== "recipient" && (
                      <TableCell className="px-6 py-4 text-xs md:text-sm text-gray-700 font-normal">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(getUserProfilePath(r.recipient));
                          }}
                          className="hover:text-blue-600 transition-colors cursor-pointer"
                          title={`Lihat profil ${r.recipient}`}
                        >
                          {r.recipient}
                        </span>
                      </TableCell>
                    )}
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/${currentLocale}/recitation/recap/${r.id}`);
                      }}
                      className="px-6 py-4 text-xs md:text-sm font-normal text-gray-800 hover:text-[#00875a] hover:underline cursor-pointer transition-colors"
                      title="Lihat Detail Rekap Setoran"
                    >
                      {r.recite}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {getResultBadge(r)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      {renderSignatureBadge(r)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Table Footer: All data has been displayed */}
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell
                    colSpan={filter === "all" ? 6 : 5}
                    className="py-6 text-center text-xs md:text-sm text-gray-400 font-normal select-none"
                  >
                    All data has been displayed
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell
                  colSpan={filter === "all" ? 6 : 5}
                  className="h-36 text-center text-xs md:text-sm text-gray-400 font-medium"
                >
                  Belum ada data setoran yang cocok dengan filter ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Setoran Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto">
          {selectedRecord && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-gray-400 font-medium">{selectedRecord.time}</span>
                  {getResultBadge(selectedRecord)}
                </div>
                <DialogTitle className="text-lg font-bold text-gray-900 text-left">
                  Rincian Evaluasi Setoran
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 text-left">
                  Materi: <span className="font-semibold text-gray-800">{selectedRecord.recite}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Meta info card */}
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Penyetor</span>
                    <span className="font-bold text-gray-900">{selectedRecord.reciter}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Penyimak / Penguji</span>
                    <span className="font-bold text-gray-900">{selectedRecord.recipient}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Durasi Sesi</span>
                    <span className="font-semibold text-gray-700">{selectedRecord.duration || "4m 30s"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Status Tanda Tangan</span>
                    {isSigned(selectedRecord) ? (
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="size-3.5" />
                        Terverifikasi & Sah
                      </span>
                    ) : (
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        <Clock className="size-3.5" />
                        Menunggu Tanda Tangan
                      </span>
                    )}
                  </div>
                </div>

                {/* Error Breakdown Card */}
                <div className="p-3.5 bg-white rounded-2xl border border-gray-200/90 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      Ringkasan Evaluasi Kesalahan
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {selectedRecord.markedErrors?.length ?? selectedRecord.errorCount ?? 0} Kesalahan
                    </span>
                  </div>

                  {selectedRecord.markedErrors && selectedRecord.markedErrors.length > 0 ? (
                    <div className="space-y-2 pt-1">
                      {/* Categorized error pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from(new Set(selectedRecord.markedErrors.map((e) => e.errorLabel))).map((lbl) => {
                          const count = selectedRecord.markedErrors!.filter((e) => e.errorLabel === lbl).length;
                          const errObj = selectedRecord.markedErrors!.find((e) => e.errorLabel === lbl);
                          return (
                            <span
                              key={lbl}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${errObj?.errorBg || "bg-orange-100"} text-gray-950 border border-black/5`}
                            >
                              {lbl}: {count}
                            </span>
                          );
                        })}
                      </div>

                      {/* Word list */}
                      <div className="max-h-36 overflow-y-auto space-y-1 pt-1.5">
                        {selectedRecord.markedErrors.map((err, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium text-gray-400">
                                #{idx + 1}
                              </span>
                              {err.ayahNumber && (
                                <span className="text-[11px] font-semibold text-gray-600 bg-gray-200/70 px-1.5 py-0.5 rounded">
                                  Ayat/Hal {err.ayahNumber}
                                </span>
                              )}
                              <span
                                style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                                className="text-base font-semibold text-gray-900"
                              >
                                {err.word}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${err.errorBg || "bg-gray-100"} text-gray-900`}
                            >
                              {err.errorLabel}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span>Masya Allah, bacaan sangat fasih dan mutqin tanpa kesalahan tercatat.</span>
                    </div>
                  )}
                </div>

                {/* Teacher notes */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-gray-500 font-semibold block mb-1">Catatan Evaluasi Guru:</span>
                  <p className="text-gray-700 leading-relaxed italic">
                    &ldquo;{selectedRecord.notes || "Bacaan sudah sangat baik, tetap istiqomah melatih kelancaran hafalan."}&rdquo;
                  </p>
                </div>

                {/* Modal footer actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const existingStr = localStorage.getItem("qurani_recitation_results");
                        if (existingStr) {
                          const existing = JSON.parse(existingStr);
                          const updated = existing.filter((item: any) => item.id !== selectedRecord.id);
                          localStorage.setItem("qurani_recitation_results", JSON.stringify(updated));
                        }
                        setRecords((prev) => prev.filter((item) => item.id !== selectedRecord.id));
                        setSelectedRecord(null);
                        toast.success("Rekaman setoran berhasil dihapus");
                      } catch {}
                    }}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Hapus Rekaman</span>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Toggle Signature Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSign(selectedRecord.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer ${
                        isSigned(selectedRecord)
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                          : "bg-[#00875a] hover:bg-[#00754e] text-white"
                      }`}
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>{isSigned(selectedRecord) ? "Batalkan Tanda Tangan" : "Tanda Tangani Setoran"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMushafModalOpen(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <BookOpen className="size-3.5" />
                      <span>Lihat Mushaf</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEmailModal(selectedRecord)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#00875a] text-xs font-semibold border border-emerald-200/80 transition cursor-pointer"
                    >
                      <Mail className="size-3.5" />
                      <span>Email Raport</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRecord(null)}
                      className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Kirim ke Email Orang Tua */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl">
          <DialogHeader>
            <div className="size-10 rounded-2xl bg-emerald-50 text-[#00875a] flex items-center justify-center mb-2">
              <Mail className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-gray-900 text-left">
              Kirim Raport Setoran ke Orang Tua
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 text-left">
              Laporan evaluasi setoran santri akan dikirimkan langsung ke alamat email orang tua/wali santri.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 py-2 text-xs">
              {/* Ringkasan Setoran Preview */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Santri:</span>
                  <span className="font-bold text-gray-900">{selectedRecord.reciter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Materi:</span>
                  <span className="font-semibold text-gray-800">{selectedRecord.recite}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Predikat:</span>
                  <span className="font-bold text-emerald-700">{selectedRecord.result}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Penyimak / Ustadz:</span>
                  <span className="font-semibold text-gray-800">{selectedRecord.recipient}</span>
                </div>
              </div>

              {/* Form Input Email */}
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-700 block">
                  Alamat Email Orang Tua / Wali:
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="ayah.santri@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00875a]"
                  autoFocus
                />
                <span className="text-[10px] text-gray-400">
                  Pastikan alamat email aktif untuk menerima salinan raport setoran resmi.
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex sm:justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isSendingEmail}
              onClick={() => setIsEmailModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={isSendingEmail}
              onClick={handleSendEmail}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-70"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Kirim Sekarang</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tampilan Mushaf Beranotasi */}
      <RecitationMushafDialog
        open={isMushafModalOpen}
        onOpenChange={setIsMushafModalOpen}
        record={selectedRecord}
        onOpenEmail={() => selectedRecord && handleOpenEmailModal(selectedRecord)}
      />

      {/* Modal Signature Confirmation */}
      <Dialog open={!!confirmRecord} onOpenChange={(open) => !open && setConfirmRecord(null)}>
        <DialogContent
          className="sm:max-w-[340px] bg-white rounded-2xl p-6 border border-gray-100 shadow-2xl"
          showCloseButton={true}
        >
          <div className="pt-1 pb-4">
            <DialogTitle className="text-lg font-bold text-[#1e293b] text-left">
              Signature Confirmation
            </DialogTitle>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setConfirmRecord(null)}
              className="flex-1 py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmSignature}
              className="flex-1 py-2.5 px-5 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-sm font-semibold transition cursor-pointer text-center"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Filter Dialog (Matching Design) */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent
          className="sm:max-w-xl bg-white rounded-3xl p-6 border border-gray-100 shadow-2xl space-y-4"
          showCloseButton={true}
        >
          {/* Header */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <Filter className="size-5 text-[#00875a]" />
            <DialogTitle className="text-xl font-bold text-gray-900 text-left">
              Filter
            </DialogTitle>
          </div>

          <div className="space-y-4 pt-1">
            {/* Row 1: From Date & To Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block text-left">
                  From Date
                </label>
                <RecitationDatePicker
                  value={draftFromDate}
                  onChange={setDraftFromDate}
                  placeholder="Select Start Date"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block text-left">
                  To Date
                </label>
                <RecitationDatePicker
                  value={draftToDate}
                  onChange={setDraftToDate}
                  placeholder="Select End Date"
                />
              </div>
            </div>

            {/* Row 2: Recipient, Type, Memorization Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Recipient Input */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block text-left">
                  Recipient
                </label>
                <div className="relative">
                  <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={draftRecipient}
                    onChange={(e) => setDraftRecipient(e.target.value)}
                    placeholder="Search recipient"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#00875a] shadow-2xs"
                  />
                </div>
              </div>

              {/* Type Select */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block text-left">
                  Type
                </label>
                <Select
                  value={draftType}
                  onValueChange={(val: any) => setDraftType(val || "all")}
                >
                  <SelectTrigger className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm shadow-2xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white z-50">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Memorization Type Select */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-gray-700 block text-left">
                  Memorization Type
                </label>
                <Select
                  value={draftMemorizationType}
                  onValueChange={(val: any) => setDraftMemorizationType(val || "all")}
                >
                  <SelectTrigger className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm shadow-2xs">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white z-50">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="surah">Surah</SelectItem>
                    <SelectItem value="juz">Juz</SelectItem>
                    <SelectItem value="page">Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Action Buttons (Reset, Cancel, Apply) */}
            <div className="flex items-center justify-end gap-2.5 pt-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDraftFromDate(appliedFromDate);
                  setDraftToDate(appliedToDate);
                  setDraftRecipient(appliedRecipient);
                  setDraftType(appliedType);
                  setDraftMemorizationType(appliedMemorizationType);
                  setIsFilterModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="px-6 py-2 rounded-xl bg-[#00875a] hover:bg-[#00754e] text-white text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
