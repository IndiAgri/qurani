"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  User, MapPin, Award, BookOpen, Video,
  ChevronRight, Sparkles, Check,
  Clock, RefreshCw, CheckCheck, DollarSign,
  Briefcase, Plus, Trash2, ChevronDown, ChevronUp,
  Link2, Globe, Tag, X, Play, Edit,
  CalendarDays, Star, ThumbsUp, ThumbsDown,
  AlertCircle, Send, RotateCcw, ShieldCheck,
  Mic, Eye, Users2,
  MessageSquare, ArrowRight, Info,
  FileText, ChevronLeft, ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusPengajuan, PengajuanStatus } from "./status-pengajuan";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { marketplaceApi } from "@/lib/marketplace-api";


// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | "form"
  | "pending"
  | "schedule_notif"
  | "attendance_confirm"
  | "assessment"
  | "reschedule_request"
  | "reschedule_pending"
  | "accepted"
  | "rejected";

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  credentialId: string;
  issuedDate: string;
  expiryDate: string;
  url: string;
  expanded: boolean;
}

export interface PortfolioItem {
  id: string;
  url: string;
  description: string;
}

export interface FormData {
  headline: string;
  bio: string;
  location: string;
  language: string;
  expertise: string[];
  categoryIds: string[];
  hourlyRate: string;
  currency: string;
  experienceYears: string;
  isOnline: boolean;
  isOffline: boolean;
}

export interface SubmittedFormData {
  formData: FormData;
  certifications: CertificationItem[];
  portfolioItems: PortfolioItem[];
}

interface ScheduleInfo {
  date: string;
  time: string;
  method: "online" | "offline";
  meetLink: string;
  examiner: string;
  notes: string;
}

interface RescheduleData {
  proposedDate: string;
  proposedTime: string;
  reason: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXPERTISE_OPTIONS = [
  "Tahsin", "Tahfidz", "Tajwid", "Bahasa Arab", "Nahwu Shorof",
  "Tafsir", "Iqro", "Ummi", "Tilawati", "Qiroati", "Yanbu'a",
  "Al-Baghdadi", "Dirosa", "Wafa", "Grand PQ", "An-Nahdliyah",
  "Tartil", "Talaqqi",
];

export const CATEGORY_OPTIONS = [
  { id: "1", name: "Al-Quran untuk Pemula" },
  { id: "2", name: "Tahfidz Intensif" },
  { id: "3", name: "Tajwid Lanjutan" },
  { id: "4", name: "Bahasa Arab" },
  { id: "5", name: "Anak-anak" },
  { id: "6", name: "Dewasa" },
  { id: "7", name: "Perempuan saja" },
];

const CURRENCY_OPTIONS = [
  { code: "IDR", name: "Rupiah", symbol: "Rp" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "MYR", name: "Ringgit Malaysia", symbol: "RM" },
  { code: "SGD", name: "Dolar Singapura", symbol: "S$" },
  { code: "SAR", name: "Riyal Arab", symbol: "﷼" },
];

export const LANGUAGE_OPTIONS = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
];

const MOCK_SCHEDULE: ScheduleInfo = {
  date: "2026-07-15",
  time: "09:00",
  method: "online",
  meetLink: "https://meet.google.com/abc-defg-hij",
  examiner: "Ustadz Hamid, Tim Qurani",
  notes: "Persiapkan bacaan surah pendek (Al-Fatihah, Al-Ikhlas, An-Nas). Pastikan koneksi stabil.",
};

const DUMMY_SCORES = {
  fluency: 8,
  tajwid: 7,
  intonation: 7,
  appearance: 8,
  experience: 9,
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function getYouTubeEmbedId(url: string): string | null {
  const regexps = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const re of regexps) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function getCurrencySymbol(code: string) {
  return CURRENCY_OPTIONS.find((c) => c.code === code)?.symbol ?? code;
}

// ─── ErrorMsg ─────────────────────────────────────────────────────────────────

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] text-rose-500 ml-1 font-medium flex items-center gap-1 mt-1">
      <AlertCircle className="w-3 h-3" />
      {children}
    </p>
  );
}

// ─── FormSection ──────────────────────────────────────────────────────────────

function FormSection({
  icon,
  title,
  headerAction,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-white border-slate-200/80 shadow-sm p-5 md:p-6 gap-4 space-y-0">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>
      {children}
    </Card>
  );
}

// ─── Portfolio Modal ───────────────────────────────────────────────────────────

function PortfolioModal({
  onClose,
  onSave,
  initial,
}: {
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
  initial?: PortfolioItem;
}) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [videoUrlError, setVideoUrlError] = useState("");
  const [mounted, setMounted] = useState(false);
  const embedId = getYouTubeEmbedId(url);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return (
    <Dialog open={true} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent showCloseButton={false} className="p-0 gap-0 overflow-hidden rounded-[28px] max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
          <DialogTitle className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-500" />
            {initial ? "Edit Video Portfolio" : "Tambah Video Portfolio"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full"
          >
            <X className="w-4 h-4 text-slate-500" />
          </Button>
        </div>
        <div className="px-6 pb-6 pt-2 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <Label className="text-[12px] font-semibold text-slate-700">
              Link YouTube
            </Label>
            <div className="relative">
              <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                onFocus={(e) => e.target.select()}
                className={cn("pl-9", videoUrlError && "border-destructive")}
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => {
                  const val = e.target.value;
                  setUrl(val);
                  if (val && !/^https?:\/\/.+/.test(val.trim())) {
                    setVideoUrlError("URL tidak valid. Harus dimulai dengan https://");
                  } else {
                    setVideoUrlError("");
                  }
                }}
              />
            </div>
            {videoUrlError && (
              <p className="text-[11px] text-red-500 font-medium ml-1 mt-1.5 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {videoUrlError}
              </p>
            )}
          </div>

          <AnimatePresence>
            {embedId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-emerald-100"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    src={`https://www.youtube.com/embed/${embedId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1">
              Keterangan <span className="text-slate-400 font-normal">(Opsional)</span>
            </Label>
            <Input
              placeholder="Contoh: Bacaan Al-Fatihah dengan Maqam Bayati"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!url.trim() || !!videoUrlError}
              onClick={() => {
                onSave({
                  id: initial?.id ?? generateId(),
                  url: url.trim(),
                  description,
                });
                onClose();
              }}
            >
              Simpan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: "portfolio" | "cert";
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) onClose() }}>
      <DialogContent showCloseButton={false} className="p-6 overflow-hidden rounded-[24px] max-w-sm bg-white border-none shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-2 text-center sm:text-left mt-2">
          <DialogTitle className="text-lg font-semibold text-slate-900">Hapus Item?</DialogTitle>
          <p className="text-sm text-slate-500">
            Apakah Anda yakin ingin menghapus{" "}
            {type === "portfolio" ? "video portfolio" : "sertifikat"} ini?
          </p>
        </div>
        <div className="mt-6 flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            className="bg-rose-500 hover:bg-rose-600 text-white"
            onClick={onConfirm}
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stage: Form Pengajuan (Single Card Layout) ────────────────────────────────

export default function TeacherRegistrationForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: SubmittedFormData) => void;
  onCancel: () => void;
}) {
  const { profile } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    headline: "",
    bio: "",
    location: "",
    language: "id",
    expertise: [],
    categoryIds: [],
    hourlyRate: "",
    currency: "IDR",
    experienceYears: "",
    isOnline: false,
    isOffline: false,
  });

  // Auto-fill lokasi dari profil user (city, province, country) atau storage profil
  useEffect(() => {
    // 1. Cek dari useAuth profile
    const profileParts = [
      profile?.cityName || (profile as any)?.city,
      profile?.stateName || (profile as any)?.states,
      profile?.countryName || (profile as any)?.country,
    ].filter(Boolean);

    // 2. Cek dari localStorage "qurani_student_profile"
    let localParts: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const savedSp = localStorage.getItem("qurani_student_profile");
        if (savedSp) {
          const sp = JSON.parse(savedSp);
          localParts = [sp.city, sp.states, sp.country].filter(Boolean);
        }
      } catch {}
    }

    const determinedLocation =
      profileParts.length > 0
        ? profileParts.join(", ")
        : localParts.length > 0
        ? localParts.join(", ")
        : "Malang, Jawa Timur, Indonesia";

    setFormData((prev) => ({
      ...prev,
      location: prev.location || determinedLocation,
    }));

    // Otomatis bersihkan error lokasi jika sebelumnya muncul
    setErrors((prev) => {
      if (!prev.location) return prev;
      const next = { ...prev };
      delete next.location;
      return next;
    });
  }, [profile]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([{ id: Math.random().toString(36).slice(2, 9), name: "", issuer: "", credentialId: "", issuedDate: "", expiryDate: "", url: "", expanded: true }]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [portfolioToEdit, setPortfolioToEdit] = useState<PortfolioItem | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openExpertise, setOpenExpertise] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [openLang, setOpenLang] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "portfolio" | "cert";
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (
    field: keyof FormData,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((p) => {
        const n = { ...p };
        delete n[field];
        return n;
      });
  };

  const toggleExpertise = (item: string) => {
    const next = formData.expertise.includes(item)
      ? formData.expertise.filter((e) => e !== item)
      : [...formData.expertise, item];
    handleInput("expertise", next);
  };

  const toggleCategory = (id: string) => {
    const next = formData.categoryIds.includes(id)
      ? formData.categoryIds.filter((c) => c !== id)
      : [...formData.categoryIds, id];
    handleInput("categoryIds", next);
  };

  const addCertification = () => {
    const newId = generateId();
    setCertifications((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        issuer: "",
        credentialId: "",
        issuedDate: "",
        expiryDate: "",
        url: "",
        expanded: true,
      },
    ]);
    setTimeout(() => {
      document.getElementById(`cert-${newId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const updateCert = (
    id: string,
    field: keyof Omit<CertificationItem, "id" | "expanded">,
    value: string
  ) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    if (errors.certifications) {
      setErrors((p) => {
        const n = { ...p };
        delete n.certifications;
        return n;
      });
    }
  };

  const toggleCertExpand = (id: string) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    );
  };

  const removeCert = (id: string) =>
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  const removePortfolio = (id: string) =>
    setPortfolioItems((prev) => prev.filter((p) => p.id !== id));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!formData.headline.trim()) e.headline = "Headline wajib diisi";
    if (!formData.bio.trim()) e.bio = "Biografi singkat wajib diisi";
    const loc = formData.location.trim() || "Malang, Jawa Timur, Indonesia";
    if (!formData.location.trim()) {
      setFormData((prev) => ({ ...prev, location: loc }));
    }
    if (formData.categoryIds.length === 0) e.categoryIds = "Pilih minimal satu kategori";
    if (!formData.currency) e.currency = "Mata uang wajib dipilih";
    if (!formData.hourlyRate) e.hourlyRate = "Tarif per jam wajib diisi";
    else if (isNaN(parseFloat(formData.hourlyRate))) e.hourlyRate = "Tarif tidak valid";
    if (!formData.experienceYears) e.experienceYears = "Tahun pengalaman wajib diisi";
    if (!formData.isOnline && !formData.isOffline) e.availability = "Pilih minimal satu mode mengajar";
    if (portfolioItems.length === 0) e.portfolioUrls = "Tambahkan minimal satu video portfolio";
    
    let isCertIncomplete = false;
    let hasInvalidCertUrl = false;

    certifications.forEach(c => {
      if (!c.name.trim() || !c.issuer.trim() || !c.issuedDate || !c.credentialId.trim() || !c.url.trim()) {
        isCertIncomplete = true;
      }
      if (c.url.trim() && !/^https?:\/\/.+/.test(c.url.trim())) {
        hasInvalidCertUrl = true;
      }
    });

    if (certifications.length === 0 || isCertIncomplete) {
      e.certifications = "Semua data sertifikat (kecuali Tanggal Kadaluarsa) wajib diisi";
    } else if (hasInvalidCertUrl) {
      e.certifications = "URL Verifikasi Sertifikat harus berupa link yang valid (diawali dengan http:// atau https://)";
    }
    
    setErrors(e);

    if (hasInvalidCertUrl || isCertIncomplete) {
      setCertifications((prev) =>
        prev.map((c) => {
          const incomplete =
            !c.name.trim() ||
            !c.issuer.trim() ||
            !c.issuedDate ||
            !c.credentialId.trim() ||
            !c.url.trim();
          const invalidUrl = c.url.trim() && !/^https?:\/\/.+/.test(c.url.trim());
          if (incomplete || invalidUrl) {
            return { ...c, expanded: true };
          }
          return c;
        })
      );
    }

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // After validate() runs, errors state is set. Scroll to first error field.
      // Use setTimeout to wait for React to re-render error states before querying DOM
      setTimeout(() => {
        const firstErr = document.querySelector("[data-error='true']");
        if (firstErr) {
          firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    onSubmit({ formData, certifications, portfolioItems });
  };

  const selectedLang = LANGUAGE_OPTIONS.find((l) => l.code === formData.language);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">


      {/* ── Section 1: Data Diri ── */}
      <FormSection
        icon={<User className="w-5 h-5 text-emerald-600" />}
        title="Data Diri"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Headline */}
            <div className="space-y-2" data-error={!!errors.headline}>
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
                Judul Profil Singkat
              </Label>
              <Input
                className={cn(errors.headline && "border-destructive")}
                placeholder="Contoh: Pengajar Bahasa Arab Profesional"
                value={formData.headline}
                onChange={(e) => handleInput("headline", e.target.value)}
              />
              {errors.headline && <ErrorMsg>{errors.headline}</ErrorMsg>}
            </div>

            {/* Location — auto dari profil */}
            <div className="space-y-2" data-error={!!errors.location}>
              <div className="flex items-center justify-between ml-1">
                <Label className="text-[12px] font-semibold text-slate-700 flex items-center gap-1">
                  Lokasi
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-[12px]">
                        Diambil otomatis dari pengaturan profil Anda (Kota, Provinsi, Negara). Perbarui melalui halaman Edit Profile.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Link
                  href="/profile"
                  target="_blank"
                  className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Ubah di Profil
                </Link>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-emerald-600" />
                <div
                  className={cn(
                    "pl-9 pr-3 h-9 rounded-md border flex items-center justify-between text-sm shadow-xs select-none transition-all",
                    formData.location
                      ? "text-slate-800 bg-emerald-50/20 border-emerald-300 font-medium"
                      : "text-slate-400 border-dashed border-slate-300 bg-slate-50",
                    errors.location && "border-rose-300 bg-rose-50/30"
                  )}
                >
                  <span className="truncate">{formData.location || "Malang, Jawa Timur, Indonesia"}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Terhubung
                  </span>
                </div>
              </div>
              {errors.location && <p className="text-[11px] text-rose-500 ml-1 font-medium flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.location}</p>}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2" data-error={!!errors.bio}>
            <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
              Biografi Singkat
            </Label>
            <Textarea
              className={cn(
                "min-h-[80px] resize-none overflow-hidden",
                errors.bio && "border-destructive"
              )}
              rows={3}
              placeholder="Ceritakan tentang latar belakang, pengalaman mengajar, metode yang digunakan, dan pendekatan Anda kepada murid..."
              value={formData.bio}
              onFocus={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
                handleInput("bio", e.target.value);
              }}
            />
            <div className="flex items-center justify-between">
              {errors.bio ? <ErrorMsg>{errors.bio}</ErrorMsg> : <span />}
              <span
                className={cn(
                  "text-[11px]",
                  formData.bio.length > 50
                    ? "text-emerald-500"
                    : "text-slate-300"
                )}
              >
                {formData.bio.length} karakter
              </span>
            </div>
          </div>
        </div>
      </FormSection>

      {/* ── Section 2: Keahlian & Kategori ── */}
      <FormSection
        icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
        title="Keahlian & Kategori"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expertise */}
          <div className="space-y-2" data-error={!!errors.expertise}>
            <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
              Spesialisasi
            </Label>
            <Popover open={openExpertise} onOpenChange={setOpenExpertise}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal",
                    errors.expertise && "border-destructive"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <BookOpen className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="truncate text-left">
                      {formData.expertise.length > 0
                        ? formData.expertise.join(", ")
                        : "Pilih metode mengajar"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl z-[60]">
                <Command>
                  <CommandInput placeholder="Cari metode..." className="h-11" />
                  <CommandList>
                    <CommandEmpty>Metode tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {EXPERTISE_OPTIONS.map((item) => {
                        const isSelected = formData.expertise.includes(item);
                        return (
                          <CommandItem
                            key={item}
                            value={item}
                            onSelect={() => toggleExpertise(item)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-emerald-600",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {item}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {errors.expertise && <ErrorMsg>{errors.expertise}</ErrorMsg>}
          </div>

          {/* Category */}
          <div className="space-y-2" data-error={!!errors.categoryIds}>
            <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
              Kategori Pengajaran
            </Label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal",
                    errors.categoryIds && "border-destructive"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Tag className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="truncate text-left">
                      {formData.categoryIds.length > 0
                        ? formData.categoryIds
                            .map((id) => CATEGORY_OPTIONS.find((c) => c.id === id)?.name)
                            .filter(Boolean)
                            .join(", ")
                        : "Pilih kategori"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl z-[60]">
                <Command>
                  <CommandInput placeholder="Cari kategori..." className="h-11" />
                  <CommandList>
                    <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {CATEGORY_OPTIONS.map((cat) => {
                        const isSelected = formData.categoryIds.includes(cat.id);
                        return (
                          <CommandItem
                            key={cat.id}
                            value={cat.name}
                            onSelect={() => toggleCategory(cat.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 text-emerald-600",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {cat.name}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {errors.categoryIds && <ErrorMsg>{errors.categoryIds}</ErrorMsg>}
          </div>

          {/* Language / Bahasa */}
          <div className="space-y-2" data-error={!!errors.language}>
            <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
              Bahasa
            </Label>
            <Popover open={openLang} onOpenChange={setOpenLang}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between font-normal",
                    errors.language && "border-destructive"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Globe className="h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="truncate text-left">
                      {formData.language 
                        ? LANGUAGE_OPTIONS.find((l) => l.code === formData.language)?.label 
                        : "Pilih bahasa pengantar"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl z-[60]">
                <Command>
                  <CommandInput placeholder="Cari bahasa..." className="h-11" />
                  <CommandList>
                    <CommandEmpty>Bahasa tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <CommandItem
                          key={lang.code}
                          value={lang.label}
                          onSelect={() => {
                            handleInput("language", lang.code);
                            setOpenLang(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-emerald-600",
                              formData.language === lang.code ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <span className="mr-2">{lang.flag}</span>
                          {lang.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.language && <ErrorMsg>{errors.language}</ErrorMsg>}
          </div>
        </div>
      </FormSection>

      {/* ── Section 3: Tarif & Ketersediaan ── */}
      <FormSection
        icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
        title="Tarif & Ketersediaan"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Currency */}
            <div className="space-y-2" data-error={!!errors.currency}>
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
                Mata Uang
              </Label>
              <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between font-normal",
                      errors.currency && "border-destructive"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-emerald-500" />
                      {formData.currency || "Pilih mata uang"}
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2 rounded-2xl z-[60]">
                  {CURRENCY_OPTIONS.map((c) => (
                    <Button
                      key={c.code}
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        handleInput("currency", c.code);
                        setOpenCurrency(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-start gap-2 px-2 py-1.5 h-auto font-medium transition-colors text-sm",
                        formData.currency === c.code && "bg-accent"
                      )}
                    >
                      <span className="font-bold w-8 text-left">{c.symbol}</span>
                      <span className="text-left">{c.code}</span>
                      <span className="text-muted-foreground text-xs text-left">{c.name}</span>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
              {errors.currency && <ErrorMsg>{errors.currency}</ErrorMsg>}
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2" data-error={!!errors.hourlyRate}>
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
                Tarif Per Jam
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 flex items-center text-emerald-500 font-bold text-sm pointer-events-none">
                  {formData.currency ? getCurrencySymbol(formData.currency) : "—"}
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  className={cn("pl-10", errors.hourlyRate && "border-destructive")}
                  placeholder="50.000"
                  value={
                    formData.hourlyRate
                      ? new Intl.NumberFormat("id-ID").format(Number(formData.hourlyRate.replace(/\D/g, "")))
                      : ""
                  }
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    handleInput("hourlyRate", raw);
                  }}
                />
              </div>
              {errors.hourlyRate && <ErrorMsg>{errors.hourlyRate}</ErrorMsg>}
            </div>

            {/* Experience Years */}
            <div className="space-y-2" data-error={!!errors.experienceYears}>
              <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
                Pengalaman Mengajar (Tahun)
              </Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                <Input
                  type="number"
                  min={0}
                  max={50}
                  className={cn("pl-9", errors.experienceYears && "border-destructive")}
                  placeholder="5"
                  value={formData.experienceYears}
                  onChange={(e) => handleInput("experienceYears", e.target.value)}
                />
              </div>
              {errors.experienceYears && (
                <ErrorMsg>{errors.experienceYears}</ErrorMsg>
              )}
            </div>
          </div>

          {/* Mode Mengajar */}
          <div className="space-y-2" data-error={!!errors.availability}>
            <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">
              Mode Mengajar
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  key: "isOnline" as const,
                  label: "Online",
                  sub: "Via Zoom, Google Meet, dll",
                  icon: <Video className="w-5 h-5 text-emerald-600" />,
                },
                {
                  key: "isOffline" as const,
                  label: "Offline / Tatap Muka",
                  sub: "Kunjungan ke rumah murid",
                  icon: <MapPin className="w-5 h-5 text-emerald-600" />,
                },
              ].map((mode) => (
                <div
                  key={mode.key}
                  onClick={() => {
                    handleInput(mode.key, !formData[mode.key]);
                    if (errors.availability)
                      setErrors((p) => {
                        const n = { ...p };
                        delete n.availability;
                        return n;
                      });
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all select-none",
                    formData[mode.key]
                      ? "bg-slate-50/50 border-emerald-500 shadow-sm"
                      : "border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200",
                    errors.availability && "border-rose-200"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center transition-all",
                      formData[mode.key]
                        ? "bg-emerald-600 border border-emerald-600"
                        : "border-2 border-slate-300"
                    )}
                  >
                    {formData[mode.key] && (
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {mode.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-700">
                      {mode.label}
                    </p>
                    <p className="text-[11px] text-slate-400">{mode.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            {errors.availability && <ErrorMsg>{errors.availability}</ErrorMsg>}
          </div>
        </div>
      </FormSection>

      {/* ── Section 4: Video Portfolio ── */}
      <FormSection
        icon={<Video className="w-5 h-5 text-emerald-600" />}
        title="Video Portfolio"
        headerAction={
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setPortfolioToEdit(undefined);
              setPortfolioModal(true);
            }}
          >
            <Plus />
            Tambah
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-error={!!errors.portfolioUrls}>
          <AnimatePresence>
            {portfolioItems.map((item) => {
              const embedId = getYouTubeEmbedId(item.url);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="h-full"
                >
                  <Card className="rounded-2xl border-emerald-100 overflow-hidden p-0 gap-0 shadow-none h-full flex flex-col">
                    {embedId && (
                    <div
                      className="relative w-full shrink-0"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${embedId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between px-4 py-3 bg-white mt-auto border-t border-slate-100">
                    <div className="flex-1 min-w-0 pr-3 flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <p className="text-[13px] font-semibold text-slate-700 truncate">
                        {item.description || item.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        onClick={() => {
                          setPortfolioToEdit(item);
                          setPortfolioModal(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-slate-100 dark:bg-slate-800 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        onClick={() =>
                          setItemToDelete({ id: item.id, type: "portfolio" })
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {/* Placeholders */}
          {portfolioItems.length < 2 && (
            <div
              onClick={() => {
                setPortfolioToEdit(undefined);
                setPortfolioModal(true);
              }}
              className={cn(
                "w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 cursor-pointer transition-all border-emerald-300 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 min-h-[200px]",
                errors.portfolioUrls && "border-rose-300 bg-rose-50/20 text-rose-500"
              )}
            >
              <Plus className="w-6 h-6" />
              <div className="text-center">
                <span className="font-bold text-sm block mb-1">
                  {portfolioItems.length === 0 ? "Tambah Video Al-Fatihah" : "Tambah Video Lainnya"}
                </span>
                <p className="text-[10px] text-slate-500">Format: Link YouTube</p>
              </div>
            </div>
          )}
          {portfolioItems.length === 0 && (
            <div
              onClick={() => {
                setPortfolioToEdit(undefined);
                setPortfolioModal(true);
              }}
              className={cn(
                "w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 cursor-pointer transition-all border-emerald-300 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 min-h-[200px]",
                errors.portfolioUrls && "border-rose-300 bg-rose-50/20 text-rose-500"
              )}
            >
              <Plus className="w-6 h-6" />
              <div className="text-center">
                <span className="font-bold text-sm block mb-1">Tambah Video Lainnya</span>
                <p className="text-[10px] text-slate-500">Format: Link YouTube</p>
              </div>
            </div>
          )}
        </div>
        {errors.portfolioUrls && (
          <ErrorMsg>{errors.portfolioUrls}</ErrorMsg>
        )}
      </FormSection>

      {/* ── Section 5: Sertifikasi ── */}
      <FormSection
        icon={<Award className="w-5 h-5 text-emerald-600" />}
        title="Sertifikasi"
        headerAction={
          <Button
            type="button"
            size="sm"
            onClick={addCertification}
          >
            <Plus />
            Tambah
          </Button>
        }
      >
        <div className="space-y-4" data-error={!!errors.certifications}>
          <AnimatePresence>
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.id}
                id={`cert-${cert.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <Card className="rounded-2xl overflow-hidden p-0 gap-0 shadow-none border-slate-200">
                  <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleCertExpand(cert.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-700">
                        {cert.name || `Sertifikat ${idx + 1}`}
                      </p>
                      {cert.issuer && (
                        <p className="text-[11px] text-slate-400">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {idx > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete({ id: cert.id, type: "cert" });
                        }}
                        className="h-7 w-7 bg-slate-100 dark:bg-slate-800 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                    {cert.expanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {cert.expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-3 space-y-4 border-t border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600">
                              Nama Sertifikat
                            </Label>
                            <Input
                              placeholder="Syahadah Tahfidz 30 Juz"
                              value={cert.name}
                              onChange={(e) =>
                                updateCert(cert.id, "name", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600">
                              Lembaga Penerbit
                            </Label>
                            <Input
                              placeholder="Pondok Pesantren Al-Quran"
                              value={cert.issuer}
                              onChange={(e) =>
                                updateCert(cert.id, "issuer", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600">
                              Tanggal Terbit
                            </Label>
                            <Input
                              type="date"
                              value={cert.issuedDate}
                              onChange={(e) =>
                                updateCert(cert.id, "issuedDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600 flex gap-1">
                              Tanggal Kadaluarsa{" "}
                              <span className="text-slate-400 font-normal">
                                (Opsional)
                              </span>
                            </Label>
                            <Input
                              type="date"
                              value={cert.expiryDate}
                              onChange={(e) =>
                                updateCert(cert.id, "expiryDate", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600">
                              No. Sertifikat
                            </Label>
                            <Input
                              placeholder="Nomor (jika ada)"
                              value={cert.credentialId}
                              onChange={(e) =>
                                updateCert(cert.id, "credentialId", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-slate-600">
                              URL Verifikasi Sertifikat
                            </Label>
                            <div className="relative">
                              <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className={cn(
                                  "pl-9",
                                  cert.url.trim() && !/^https?:\/\/.+/.test(cert.url.trim()) && "border-destructive"
                                )}
                                placeholder="https://..."
                                value={cert.url}
                                onChange={(e) =>
                                  updateCert(cert.id, "url", e.target.value)
                                }
                              />
                            </div>
                            {cert.url.trim() && !/^https?:\/\/.+/.test(cert.url.trim()) && (
                              <p className="text-[11px] text-red-500 font-medium mt-1">
                                Harus berupa link yang valid (diawali http:// atau https://)
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {errors.certifications && (
            <ErrorMsg>{errors.certifications}</ErrorMsg>
          )}
          {/* ── Actions & Footer ── */}
          <div className="pt-6 mt-6 space-y-4 border-t border-slate-100">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Kirim
                  </div>
                )}
              </Button>
            </div>
            <p className="text-[12px] text-slate-500 w-full text-center">
              Dengan mengirim formulir ini, Anda menyetujui <span className="font-bold underline text-emerald-600 cursor-pointer">Syarat & Ketentuan</span> menjadi pengajar di Qurani.
            </p>
          </div>
        </div>
      </FormSection>

      {/* Modals */}
      <AnimatePresence>
        {portfolioModal && (
          <PortfolioModal
            key="portfolio-modal"
            initial={portfolioToEdit}
            onClose={() => {
              setPortfolioModal(false);
              setTimeout(() => setPortfolioToEdit(undefined), 300);
            }}
            onSave={(item) => {
              if (portfolioToEdit) {
                setPortfolioItems((prev) =>
                  prev.map((p) => (p.id === item.id ? item : p))
                );
              } else {
                setPortfolioItems((prev) => [...prev, item]);
              }
              if (errors.portfolioUrls) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.portfolioUrls;
                  return next;
                });
              }
              setPortfolioModal(false);
              setTimeout(() => setPortfolioToEdit(undefined), 300);
            }}
          />
        )}
        {!!itemToDelete && (
          <DeleteConfirmModal
            key="delete-confirm-modal"
            isOpen={true}
            onClose={() => setItemToDelete(null)}
            type={itemToDelete.type}
            onConfirm={() => {
              if (itemToDelete.type === "portfolio")
                removePortfolio(itemToDelete.id);
              else if (itemToDelete.type === "cert")
                removeCert(itemToDelete.id);
              setItemToDelete(null);
            }}
          />
        )}
      </AnimatePresence>
    </form>
  );
}

// ─── Main: FormsPageClient ───────────────────────────────────────────────────

export function FormsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const stageTitle = currentLocale === "id" ? "Form Pendaftaran Guru" : "Teacher Registration Form";

  const handleCancelPengajuan = (reason: string) => {

  };

  return (
    <div className="min-h-[90vh] bg-[#fafafa] py-10 px-4 md:py-16 md:px-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/30 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/20 blur-[140px] rounded-full" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-violet-100/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-emerald-700"
          >
            {stageTitle}
          </motion.h1>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <TeacherRegistrationForm
                onSubmit={async (data) => {
                  await marketplaceApi.saveTeacherApplication({ ...data, status: "pending" });
                  sessionStorage.setItem("teacher_form_data", JSON.stringify(data));
                  sessionStorage.setItem("teacher_status", "pending");
                  sessionStorage.removeItem("teacher_is_canceled");
                  sessionStorage.removeItem("teacher_cancel_reason");
                  sessionStorage.removeItem("teacher_canceled_at");
                  router.push(`/${currentLocale}/teachers/pending`);
                }}
                onCancel={() => router.back()}
              />
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

