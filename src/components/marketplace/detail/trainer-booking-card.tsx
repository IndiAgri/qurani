"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import {
  Check,
  Award,
  Users,
  Clock,
  BookOpen,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  SunDim,
  Sun,
  Moon,
  BadgeCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import {
  getCourses,
  ensureSeedData,
  type CourseDto,
} from "@/data/trainers-data";
import CourseDetailModal from "./course-detail-modal";

interface TrainerBookingCardProps {
  trainer: any;
  selectedPackageId: string;
  setSelectedPackageId: (id: string) => void;
  locale: string;
  router: any;
  hideBookingButton?: boolean;
  onCourseDetail?: (courseId: string) => void;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Pemula",
  2: "Menengah",
  3: "Mahir",
  4: "Semua Level",
};
const MODE_LABELS: Record<number, string> = {
  1: "Online",
  2: "Offline",
};

export function TrainerBookingCard({
  trainer,
  selectedPackageId,
  setSelectedPackageId,
  locale,
  router: routerProp,
  hideBookingButton = false,
  onCourseDetail,
}: TrainerBookingCardProps) {
  const { t } = useI18n();
  const routerHook = useRouter();
  const router = routerProp ?? routerHook;
  const [packages, setPackages] = useState<CourseDto[]>([]);
  const [detailPackageId, setDetailPackageId] = useState<string | null>(null);
  const [profileHourlyRate, setProfileHourlyRate] = useState<number | null>(
    null,
  );

  // Load published packages (formerly courses) for this trainer
  useEffect(() => {
    ensureSeedData();
    const allCourses = getCourses(trainer.id);
    // Only show packages that are published (isPublic = true)
    const published = allCourses.filter((c) => c.isPublic && c.isActive);
    setPackages(published);

    // Auto-select first package if current selection is invalid or empty
    if (
      published.length > 0 &&
      (!selectedPackageId || !published.find((p) => p.id === selectedPackageId))
    ) {
      setSelectedPackageId(published[0].id);
    }

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

    // Listen perubahan localStorage dari tab lain
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
    return () => window.removeEventListener("storage", handleStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainer.id]); // Hanya re-run saat trainer berubah, bukan setiap kali selectedPackageId berubah

  // Session time labels mapping
  const SESSION_LABELS = {
    morning: {
      label: t("marketplace_detail.pagi", "Pagi"),
      time: "06:00–12:00",
      icon: SunDim,
      color: "text-orange-500",
    },
    afternoon: {
      label: t("marketplace_detail.siang", "Siang"),
      time: "12:00–18:00",
      icon: Sun,
      color: "text-amber-500",
    },
    night: {
      label: t("marketplace_detail.malam", "Malam"),
      time: "18:00–22:00",
      icon: Moon,
      color: "text-blue-500",
    },
  };

  const selectedPackage =
    packages.find((p) => p.id === selectedPackageId) || null;

  // Helper: hitung harga runtime untuk satu paket dari profil guru
  const getPackageRuntimePrices = (pkg: any) => {
    // Untuk semua trainer: hitung sessionPrice & packagePrice dari profil jika trainer 1
    const isTrainer1 = trainer.id === "1";
    const rateToUse = isTrainer1
      ? (profileHourlyRate ?? pkg.hourlyRate ?? trainer.pricePerSession ?? 0)
      : (pkg.hourlyRate ?? 0);

    const runtimeSessionPrice =
      isTrainer1 && rateToUse > 0 && pkg.duration > 0
        ? Math.round(rateToUse * (pkg.duration / 60))
        : pkg.sessionPrice || 0;
    const runtimePackagePrice =
      isTrainer1 && runtimeSessionPrice > 0 && pkg.totalSessions > 0
        ? Math.round(runtimeSessionPrice * pkg.totalSessions)
        : pkg.packagePrice || 0;
    const runtimeBasePrice =
      pkg.totalSessions > 1 ? runtimePackagePrice : runtimeSessionPrice;

    // ── Selalu gunakan discountPrice yang tersimpan dari data kursus ──
    // Tidak override dengan persentase hardcoded agar sinkron dengan halaman guru
    const storedDiscountPrice = pkg.discountPrice ?? null;
    const runtimeDiscountPrice =
      storedDiscountPrice && storedDiscountPrice > 0 && storedDiscountPrice < runtimeBasePrice
        ? storedDiscountPrice
        : null;

    const discountPct =
      runtimeDiscountPrice && runtimeBasePrice > 0
        ? Math.round(((runtimeBasePrice - runtimeDiscountPrice) / runtimeBasePrice) * 100)
        : 0;

    return {
      runtimeSessionPrice,
      runtimePackagePrice,
      runtimeBasePrice,
      runtimeDiscountPrice,
      discountPct,
    };
  };

  let isSelectedPackageDiscountValid = false;
  let selectedPackageEffectiveDiscountUntil = selectedPackage?.discountUntil;
  const selectedRuntimePrices = selectedPackage
    ? getPackageRuntimePrices(selectedPackage)
    : null;
  const baseHeaderPrice = selectedRuntimePrices?.runtimeBasePrice ?? 0;

  if (
    selectedPackage &&
    selectedRuntimePrices?.runtimeDiscountPrice &&
    selectedRuntimePrices.runtimeDiscountPrice < baseHeaderPrice
  ) {
    if (!selectedPackageEffectiveDiscountUntil) {
      // Fallback for dummy data if discount exists but no date is set
      selectedPackageEffectiveDiscountUntil = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ).toISOString();
    }
    if (new Date(selectedPackageEffectiveDiscountUntil) > new Date()) {
      isSelectedPackageDiscountValid = true;
    }
  }

  // Determine what to show in the header price area
  const displayPrice = selectedPackage
    ? isSelectedPackageDiscountValid
      ? selectedRuntimePrices!.runtimeDiscountPrice!
      : baseHeaderPrice
    : trainer.pricePerSession;

  const displayOriginalPrice =
    selectedPackage &&
    isSelectedPackageDiscountValid &&
    baseHeaderPrice > selectedRuntimePrices!.runtimeDiscountPrice!
      ? baseHeaderPrice
      : null;

  const displayName = selectedPackage
    ? selectedPackage.title
    : t("marketplace_detail.price_per_session", "Harga Per Sesi");

  const discountPercent =
    displayOriginalPrice && displayOriginalPrice > displayPrice
      ? Math.round(
          ((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100,
        )
      : 0;

  const handlePesanSekarang = () => {
    if (selectedPackage) {
      sessionStorage.setItem(
        `selected_package_${trainer.id}`,
        selectedPackageId,
      );
      sessionStorage.setItem(
        `selected_course_${trainer.id}`,
        selectedPackage.id,
      );
      sessionStorage.setItem(`selected_booking_type_${trainer.id}`, "paket");
      
      // Hapus data checkout lama agar state restore di halaman booking tidak menimpa pilihan baru ini
      sessionStorage.removeItem("checkout_data");
      
      router.push(`/${locale}/teachers/${trainer.id}/books`);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden sticky top-4">
      {/* Price Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-6 py-6 border-b border-emerald-100 dark:border-emerald-800/50 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>

        <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-3">
          {displayName}
        </h3>

        <div className="flex flex-col items-center gap-0.5">
          {displayOriginalPrice && discountPercent > 0 && (
            <span className="text-[14px] text-slate-500 line-through font-semibold mb-0.5">
              Rp{displayOriginalPrice.toLocaleString("id-ID")}
            </span>
          )}

          <div className="flex items-start justify-center w-full">
            <div className="flex items-baseline">
              <span className="text-xl xl:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mr-0.5">
                Rp
              </span>
              <span className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none">
                {displayPrice.toLocaleString("id-ID")}
              </span>
              {selectedPackage && (
                <span className="text-slate-500 dark:text-slate-400 font-medium text-[13px] xl:text-sm ml-1 shrink-0">
                  / {selectedPackage.totalSessions} sesi
                </span>
              )}
            </div>
            {displayOriginalPrice && discountPercent > 0 && (
              <Badge
                variant="secondary"
                className="bg-rose-100 text-rose-500 hover:bg-rose-200 dark:bg-rose-900/40 dark:text-rose-400 border-none font-bold text-[9px] px-1.5 py-0 h-4 rounded-full ml-1.5 xl:ml-2 mt-1 xl:mt-1.5 shrink-0"
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>
        </div>

        {displayOriginalPrice &&
          discountPercent > 0 &&
          selectedPackageEffectiveDiscountUntil && (
            <div className="mt-4 flex flex-col items-center justify-center gap-1.5 w-full">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Promo berakhir dalam:
                </span>
              </div>
              <CountdownTimer
                targetDate={selectedPackageEffectiveDiscountUntil}
                className="mt-0"
              />
            </div>
          )}
      </div>
      <div className="p-6 space-y-6">
        {/* Benefit Highlights */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                {t("marketplace_detail.garansi_aman", "Garansi Aman")}
              </p>
              <p className="text-[9px] text-slate-400">
                {t(
                  "marketplace_detail.garansi_aman_desc",
                  "Pembayaran aman & bisa reschedule.",
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-800 dark:text-white">
                {t("marketplace_detail.jadwal_fleksibel", "Jadwal Fleksibel")}
              </p>
              <p className="text-[9px] text-slate-400">
                {t(
                  "marketplace_detail.jadwal_fleksibel_desc",
                  "Tentukan waktu belajar sesuai keinginan.",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Paket List */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            {t("marketplace_detail.booking_card_title", "Pilih Paket Belajar")}
          </p>

          {packages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center space-y-2">
              <BookOpen className="h-8 w-8 text-slate-200 mx-auto" />
              <p className="text-[11px] font-medium text-slate-400">
                Guru belum memiliki paket yang dipublikasikan
              </p>
            </div>
          ) : (
            packages.map((pkg) => {
              const { runtimeBasePrice, runtimeDiscountPrice, discountPct: pkgDiscountPct } = getPackageRuntimePrices(pkg);
              const basePrice = runtimeBasePrice;
              let effectivePkgDiscountUntil = pkg.discountUntil;
              let isPkgDiscountValid = false;

              if (runtimeDiscountPrice && runtimeDiscountPrice < basePrice) {
                if (!effectivePkgDiscountUntil) {
                  effectivePkgDiscountUntil = new Date(
                    Date.now() + 24 * 60 * 60 * 1000,
                  ).toISOString();
                }
                if (new Date(effectivePkgDiscountUntil) > new Date()) {
                  isPkgDiscountValid = true;
                }
              }

              const isSelected = selectedPackageId === pkg.id;
              const effectivePrice = isPkgDiscountValid
                ? runtimeDiscountPrice!
                : basePrice;
              const originalPrice =
                isPkgDiscountValid && basePrice > effectivePrice
                  ? basePrice
                  : null;
              const discountPct = pkgDiscountPct;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={cn(
                    "relative p-3 rounded-xl border transition-all duration-300 cursor-pointer group",
                    isSelected
                      ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/20 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700 bg-white dark:bg-slate-900",
                  )}
                >
                  {/* Header: radio + title + optional certificate badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 mt-0.5",
                          isSelected
                            ? "border-emerald-500 bg-emerald-500 shadow-sm shadow-emerald-200 dark:shadow-none"
                            : "border-slate-300 dark:border-slate-600 group-hover:border-emerald-400",
                        )}
                      >
                        {isSelected && (
                          <Check className="h-3 w-3 text-white stroke-[3.5] animate-in zoom-in duration-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-[13px] font-bold leading-tight transition-colors duration-300 line-clamp-2",
                            "text-slate-900 dark:text-white",
                          )}
                        >
                          {pkg.title}
                        </p>
                      </div>
                    </div>
                    {Boolean(pkg.hasCertificate) && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 h-4 font-bold border-emerald-300 text-emerald-600 shrink-0"
                      >
                        <BadgeCheck className="h-2.5 w-2.5 mr-0.5" />
                        Bersertifikat
                      </Badge>
                    )}
                  </div>

                  {/* Meta badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pl-8 mb-2">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 h-4 border-slate-200 text-slate-500 font-bold cursor-help"
                          >
                            <GraduationCap className="h-2.5 w-2.5 mr-0.5" />
                            {LEVEL_LABELS[pkg.level] ?? "Pemula"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Tingkat Kursus</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className="text-[9px] px-1.5 h-4 border-slate-200 text-slate-500 font-bold cursor-help"
                          >
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            {pkg.duration} mnt
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>Durasi Kursus</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-0.5 pl-8 mt-1">
                    {originalPrice && (
                      <span className="text-[12px] text-slate-500 line-through font-semibold">
                        Rp{originalPrice.toLocaleString("id-ID")}
                      </span>
                    )}
                    <div className="flex items-start">
                      <div className="flex items-baseline">
                        <span
                          className={cn(
                            "text-sm font-bold transition-colors duration-300 mr-0.5",
                            "text-emerald-600 dark:text-emerald-400",
                          )}
                        >
                          Rp
                        </span>
                        <span
                          className={cn(
                            "text-xl font-bold transition-colors duration-300 leading-none",
                            "text-emerald-600 dark:text-emerald-400",
                          )}
                        >
                          {effectivePrice.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium ml-1">
                          / {pkg.totalSessions} sesi
                        </span>
                      </div>
                      {originalPrice && discountPct > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-rose-100 text-rose-500 dark:bg-rose-900/40 dark:text-rose-400 border-none font-bold text-[8px] px-1 py-0 h-3 rounded-full ml-1.5 mt-0.5"
                        >
                          -{discountPct}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-1 pl-8">
                    <button
                      className="text-[10px] px-2 h-6 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCourseDetail) {
                          onCourseDetail(pkg.id);
                        } else {
                          setDetailPackageId(pkg.id);
                        }
                      }}
                    >
                      Detail
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Preferensi Waktu */}
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            {t("marketplace_detail.preferensi_waktu", "Preferensi Waktu")}
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SESSION_LABELS)
              .filter(([key]) => trainer.sessions.includes(key))
              .map(([key, data]) => {
                const Icon = data.icon;
                return (
                  <Popover key={key}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border transition-all duration-300 bg-white dark:bg-slate-900 shadow-sm cursor-help min-w-[75px] active:scale-95 hover:border-emerald-300 border-emerald-500/20"
                      >
                        <Icon
                          className={cn("h-3.5 w-3.5 shrink-0", data.color)}
                        />
                        <span className="text-[9px] font-bold text-slate-800 dark:text-white leading-none uppercase tracking-tight">
                          {data.label}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 p-5 rounded-[1.2rem] border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                      side="top"
                      sideOffset={12}
                    >
                      <div className="space-y-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            {data.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          {t(
                            "marketplace_detail.available_time_desc",
                            `Guru bersedia mengajar di rentang waktu {{time}}.`,
                            { time: data.time },
                          )}
                        </p>
                        <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
                          <p className="text-[9px] text-slate-400 font-bold italic leading-tight">
                            {t(
                              "marketplace_detail.exact_schedule_hint",
                              "Jadwal pasti per jam bisa dipilih di halaman selanjutnya.",
                            )}
                          </p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
          </div>
        </div>

        {!hideBookingButton && (
          <div className="space-y-4 pt-2">
            {/* Validation message */}
            {packages.length > 0 && !selectedPackageId && (
              <p className="text-[10px] text-amber-500 font-medium text-center">
                Pilih salah satu paket terlebih dahulu
              </p>
            )}
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 font-black transition-all shadow-lg shadow-emerald-200 dark:shadow-emerald-950/20 active:scale-[0.98] group disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={packages.length > 0 && !selectedPackageId}
              onClick={handlePesanSekarang}
            >
              {t("marketplace_detail.pesan_sekarang", "Pesan Sekarang")}
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-[10px] text-slate-400 text-center font-medium">
              {t(
                "marketplace_detail.no_additional_fee",
                "Tidak ada biaya tambahan saat Checkout",
              )}
            </p>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        pkg={packages.find((p) => p.id === detailPackageId) || null}
        trainer={trainer}
        open={!!detailPackageId}
        onClose={() => setDetailPackageId(null)}
        onSelect={(id) => setSelectedPackageId(id)}
        selectedPackageId={selectedPackageId}
      />
    </div>
  );
}
