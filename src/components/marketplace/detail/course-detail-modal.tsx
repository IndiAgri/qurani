"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { courseApi } from "@/lib/booking";
import { TrainerMediaPopup } from "@/components/marketplace/detail/trainer-media-popup";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Play,
  Star,
  Target,
  Layers,
  X,
  Video,
  Image as ImageIcon,
  ExternalLink,
  GraduationCap,
  Wifi,
  WifiOff,
  MonitorSmartphone,
  Shield,
  Languages,
  Users,
  FileText,
  ListChecks,
  LayoutList,
  Tags,
  PlayCircle,
  Wallet,
} from "lucide-react";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { cn } from "@/lib/utils";

// -- Helpers

const LEVEL_LABELS: Record<number, { label: string; className: string }> = {
  1: {
    label: "Pemula",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  2: {
    label: "Menengah",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  3: {
    label: "Mahir",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  },
  4: {
    label: "Semua Level",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

// -- Section wrapper

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2.5 rounded-xl shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

// -- Props

export interface CourseDetailModalProps {
  pkg: any | null;
  trainer?: any | null;
  open?: boolean;
  onClose: () => void;
  onSelect?: (pkgId: string) => void;
  selectedPackageId?: string | null;
  hideSelectButton?: boolean;
}

export default function CourseDetailModal({
  pkg,
  trainer,
  open = false,
  onClose,
  onSelect,
  selectedPackageId,
  hideSelectButton = false,
}: CourseDetailModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [mounted, setMounted] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [profileHourlyRate, setProfileHourlyRate] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(open);
    if (open) {
      document.body.style.overflow = "hidden";
      courseApi
        .getCategories()
        .then((res) => {
          if (Array.isArray(res)) setCategories(res);
          else if (res && (res as any).data) setCategories((res as any).data);
        })
        .catch(console.error);

      // Baca harga per jam dari profil guru untuk kalkulasi harga runtime
      try {
        const profileStr = localStorage.getItem("trainer_profile");
        if (profileStr) {
          const profile = JSON.parse(profileStr);
          if (profile && !isNaN(profile.pricePerSession)) {
            setProfileHourlyRate(Number(profile.pricePerSession));
          }
        }
      } catch (e) {}

      // Listen perubahan localStorage dari tab lain atau dispatch manual
      const handleStorage = (e: StorageEvent) => {
        if (e.key === "trainer_profile" && e.newValue) {
          try {
            const profile = JSON.parse(e.newValue);
            if (profile && !isNaN(profile.pricePerSession)) {
              setProfileHourlyRate(Number(profile.pricePerSession));
            }
          } catch {}
        }
      };
      window.addEventListener("storage", handleStorage);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("storage", handleStorage);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!pkg || !isOpen || !mounted) return null;

  const description = pkg.description || "";
  const level = pkg.level;
  const languageCode = pkg.language;
  const languageLabel =
    languageCode === "id"
      ? "Indonesia"
      : languageCode === "ar"
        ? "Arab"
        : languageCode === "en"
          ? "Inggris"
          : languageCode;
  const hasCertificate = Boolean(pkg.hasCertificate);

  const storedSessionPrice = pkg.sessionPrice || 0;
  const storedPackagePrice = pkg.packagePrice || 0;
  const discountPrice = pkg.discountPrice || 0;
  const totalSessions = pkg.totalSessions || 1;
  const ageRestriction = pkg.ageRestriction || null;
  const targetAudience = pkg.targetAudience || "";
  const currency = pkg.currency || "IDR";
  const categoryName =
    categories.find((cat) => String(cat.id) === String(pkg.categoryId))?.name ||
    pkg.category ||
    null;

  // Kalkulasi harga runtime dari profil guru HANYA untuk trainer id 1
  const hourlyRateForPkg = pkg.hourlyRate || 0;
  const duration = pkg.duration || 0;
  const isTrainer1 = trainer?.id === "1" || String(pkg.trainerId) === "1";
  const rateToUse = isTrainer1 ? (profileHourlyRate ?? hourlyRateForPkg) : hourlyRateForPkg;
  
  const sessionPrice = isTrainer1 && rateToUse > 0 && duration > 0
      ? Math.round(rateToUse * (duration / 60))
      : storedSessionPrice;
  const packagePrice = isTrainer1 && sessionPrice > 0 && totalSessions > 0
      ? Math.round(sessionPrice * totalSessions)
      : storedPackagePrice;

  const images: string[] = Array.from(
    new Set(
      Array.isArray(pkg.images)
        ? pkg.images.map((img: any) => img.value || img.url || img)
        : [],
    ),
  );

  const videos: string[] = [];
  if (pkg.videoUrl) videos.push(pkg.videoUrl);
  if (pkg.previewUrl && !videos.includes(pkg.previewUrl))
    videos.push(pkg.previewUrl);

  const outcomes = Array.isArray(pkg.learningOutcomes)
    ? pkg.learningOutcomes.map((item: any) => item.value || item)
    : [];
  const requirements = Array.isArray(pkg.requirements)
    ? pkg.requirements.map((item: any) => item.value || item)
    : [];
  const syllabus = Array.isArray(pkg.syllabus) ? pkg.syllabus : [];

  const subtitles =
    Array.isArray(pkg.subtitles) && pkg.subtitles.length > 0
      ? pkg.subtitles.map((i: any) => i.value || i)
      : [];
  const tags = Array.isArray(pkg.tags)
    ? pkg.tags.map((i: any) => i.value || i)
    : [];

  const basePrice = packagePrice > 0 ? packagePrice : sessionPrice;

  // ── Selalu gunakan discountPrice yang tersimpan dari data kursus ──
  // Tidak override dengan persentase hardcoded agar sinkron dengan halaman guru
  const runtimeDiscountPrice = discountPrice > 0 && discountPrice < basePrice ? discountPrice : 0;

  let effectiveDiscountUntil = pkg.discountUntil;
  let isDiscountValid = false;
  if (runtimeDiscountPrice > 0 && runtimeDiscountPrice < basePrice) {
    if (!effectiveDiscountUntil) {
      effectiveDiscountUntil = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString();
    }
    if (new Date(effectiveDiscountUntil) > new Date()) {
      isDiscountValid = true;
    }
  }

  const effectiveTotalPrice = isDiscountValid ? runtimeDiscountPrice : basePrice;
  const effectiveSessionPrice = Math.round(effectiveTotalPrice / totalSessions);

  const organizationName = pkg.organizationId ? "-" : "-";
  const levelInfo = level ? LEVEL_LABELS[level as number] : null;
  const isSelected = selectedPackageId === pkg.id;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  const modal = createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Box */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-20">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex flex-col gap-3 pr-10">
            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">
              {pkg.packageName || pkg.title || "Detail Kursus"}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {hasCertificate && (
                <Badge
                  variant="outline"
                  className="px-2.5 py-0.5 border-emerald-200 text-emerald-600 dark:text-emerald-400 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-xs font-medium rounded-full flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Bersertifikat
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col lg:flex-row relative">
          {/* Left: scrollable content side */}
          <div className="flex-1 p-4 md:p-6 space-y-5 bg-slate-50/30 dark:bg-slate-950 order-2 lg:order-1">
            {/* Deskripsi */}
            {description && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader icon={FileText} title="Tentang Program Ini" />
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap text-sm">
                    {description}
                  </div>
                </div>
              </Card>
            )}

            {/* Target Audiens */}
            {targetAudience && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader
                    icon={Users}
                    title="Untuk Siapa Program Ini?"
                  />
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {targetAudience}
                  </div>
                </div>
              </Card>
            )}

            {/* Silabus */}
            {syllabus.length > 0 && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader
                    icon={LayoutList}
                    title="Silabus Pembelajaran"
                  />
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    Terdiri dari {syllabus.length} modul komprehensif.
                  </p>
                  <div className="space-y-4">
                    {syllabus.map((mod: any, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-emerald-600 text-white h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm shrink-0">
                            {i + 1}
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                            {mod.title}
                          </h3>
                        </div>
                        {mod.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 ml-10 leading-relaxed">
                            {mod.description}
                          </p>
                        )}
                        {Array.isArray(mod.topics) && mod.topics.length > 0 && (
                          <div className="space-y-2 ml-10">
                            {mod.topics.map((t: any, j: number) => (
                              <div
                                key={j}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm gap-2"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <PlayCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                  <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words">
                                    {t.title}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Outcomes */}
            {outcomes.length > 0 && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader icon={Target} title="Hasil Pembelajaran" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {outcomes.map((item: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words min-w-0 flex-1">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader icon={ListChecks} title="Syarat Pendaftaran" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {requirements.map((item: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words min-w-0 flex-1">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Galeri & Dokumentasi */}
            {(videos.length > 0 || images.length > 0) && (
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden p-0">
                <div className="p-5">
                  <SectionHeader
                    icon={ImageIcon}
                    title="Galeri & Dokumentasi"
                  />

                  {videos.length > 0 && (
                    <div className="mb-8 space-y-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Video className="w-5 h-5 text-emerald-500" /> Video
                        Pembelajaran
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((vid, idx) => {
                          let embedUrl = vid;
                          if (vid.includes("youtube.com/watch?v="))
                            embedUrl = vid.replace("watch?v=", "embed/");
                          else if (vid.includes("youtu.be/"))
                            embedUrl = vid.replace(
                              "youtu.be/",
                              "youtube.com/embed/",
                            );
                          return (
                            <div
                              key={idx}
                              className="group relative flex flex-col rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all"
                            >
                              <div className="relative aspect-video w-full cursor-pointer">
                                <iframe
                                  src={embedUrl}
                                  className="absolute inset-0 w-full h-full pointer-events-none"
                                  allowFullScreen
                                />
                                <div
                                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all z-0"
                                  onClick={() =>
                                    setPreviewItem({
                                      type: "video",
                                      url: vid,
                                      title: "Video Pembelajaran",
                                    })
                                  }
                                >
                                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                    <ExternalLink className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-emerald-500" /> Foto
                        Dokumentasi
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all duration-300">
                          <div
                            className="aspect-video relative cursor-pointer group"
                            onClick={() =>
                              setPreviewItem({
                                type: "image",
                                url: images[0],
                                title: "Foto Dokumentasi",
                                images,
                              })
                            }
                          >
                            <img
                              src={images[0]}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              alt="Gallery"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all">
                              <div className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                <ExternalLink className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right: static price card */}
          <div className="lg:w-[340px] xl:w-[360px] shrink-0 p-5 lg:sticky lg:top-0 lg:h-fit border-b lg:border-b-0 lg:border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-4 z-10 order-1 lg:order-2">
            {/* Harga diletakkan paling atas */}

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-6 border-b border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden flex flex-col items-center text-center rounded-xl border w-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-widest mb-3">
                TOTAL HARGA
              </h3>

              <div className="flex flex-col items-center gap-0.5 w-full">
                {isDiscountValid && (
                  <span className="text-sm text-slate-500 line-through font-semibold mb-0.5">
                    {formatCurrency(basePrice)}
                  </span>
                )}

                <div className="flex items-start justify-center w-full">
                  <div className="flex items-baseline">
                    <span className="text-base xl:text-lg font-bold text-slate-800 tracking-tight mr-0.5">
                      {currency === "IDR" ? "Rp" : currency}
                    </span>
                    <span className="text-2xl xl:text-3xl font-bold text-slate-900 tracking-tighter leading-none">
                      {isDiscountValid
                        ? runtimeDiscountPrice.toLocaleString("id-ID")
                        : basePrice.toLocaleString("id-ID")}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-xs xl:text-sm ml-1 shrink-0">
                      / {totalSessions > 1 ? `${totalSessions} sesi` : "sesi"}
                    </span>
                  </div>
                  {isDiscountValid && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-100 text-rose-500 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 border-none font-bold text-[9px] px-1.5 py-0 h-4 rounded-full ml-1.5 xl:ml-2 mt-1 xl:mt-1.5 shrink-0"
                    >
                      -
                      {Math.round(
                        ((basePrice - runtimeDiscountPrice) / basePrice) * 100,
                      )}
                      %
                    </Badge>
                  )}
                </div>
              </div>

              {isDiscountValid && effectiveDiscountUntil && (
                <div className="mt-4 flex flex-col items-center justify-center gap-1.5 w-full">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Promo berakhir dalam:
                    </span>
                  </div>
                  <CountdownTimer
                    targetDate={effectiveDiscountUntil}
                    className="mt-0"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2.5 mt-4">
              {/* Kategori */}
              {categoryName && (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-emerald-500" /> Kategori
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                  >
                    {categoryName}
                  </Badge>
                </div>
              )}

              {/* Tingkat Kursus */}
              {levelInfo && (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4 text-emerald-500" /> Tingkat
                    Kursus
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                  >
                    {levelInfo.label}
                  </Badge>
                </div>
              )}
              {/* Bahasa */}
              {languageCode && (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <Languages className="h-4 w-4 text-emerald-500" /> Bahasa
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                  >
                    {languageLabel}
                  </Badge>
                </div>
              )}
              {/* Batas Usia */}
              {ageRestriction ? (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4 text-emerald-500" /> Minimal usia
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                  >
                    {ageRestriction} Tahun
                  </Badge>
                </div>
              ) : null}
              {/* Sesi */}
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium text-sm">
                  <Layers className="h-4 w-4 text-emerald-500" /> Total Sesi
                </span>
                <Badge
                  variant="secondary"
                  className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                >
                  {totalSessions} Sesi
                </Badge>
              </div>
              {/* Durasi */}
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium text-sm">
                  <Clock className="h-4 w-4 text-emerald-500" /> Durasi / Sesi
                </span>
                <Badge
                  variant="secondary"
                  className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                >
                  {pkg.duration || 0} Menit
                </Badge>
              </div>
              {/* Harga per sesi */}
              {effectiveSessionPrice > 0 && (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <Wallet className="h-4 w-4 text-emerald-500" /> Harga per
                    sesi
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatCurrency(effectiveSessionPrice)}
                  </span>
                </div>
              )}
              {/* Organisasi */}
              {organizationName !== "-" && (
                <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm font-medium">
                    <Shield className="h-4 w-4 text-emerald-500" /> Organisasi
                  </span>
                  <Badge
                    variant="secondary"
                    className="font-medium text-sm text-slate-700 dark:text-slate-200 rounded-md"
                  >
                    {organizationName}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Fixed Action */}
        {!hideSelectButton && (
          <div className="px-5 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md z-20">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none font-semibold text-sm"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                if (onSelect) onSelect(pkg.id);
                onClose();
              }}
              disabled={isSelected}
              className="flex-1 sm:flex-none font-semibold text-sm px-8"
            >
              {isSelected ? "Sedang Dipilih" : "Pilih Paket Ini"}
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );

  return (
    <>
      {modal}
      <TrainerMediaPopup
        previewItem={previewItem}
        setPreviewItem={setPreviewItem}
      />
    </>
  );
}
