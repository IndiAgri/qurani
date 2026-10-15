import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle2, XCircle, CalendarDays, Award, User, MapPin, BookOpen,
  ChevronDown, Check, Globe, DollarSign, Briefcase, Video, Play, Link2, X, Info, Tag, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";



import {
  SubmittedFormData,
  LANGUAGE_OPTIONS,
  CATEGORY_OPTIONS,
  getCurrencySymbol,
} from "./form-register";
import { EvaluationRegister } from "./evaluation - register";
import { KonfirmasiSeleksi } from "./konfirmasi-seleksi";

export type PengajuanStatus = "pending" | "diterima" | "ditolak" | "ditolak_pengajuan" | "ditolak_seleksi" | "jadwal_seleksi" | "konfirmasi" | "reschedule" | "dibatalkan";

export interface StatusPengajuanProps {
  status: PengajuanStatus;
  submittedData: SubmittedFormData;
  onCancelPengajuan: (reason: string) => void;
  submittedAt?: string | Date;
  canceledAt?: string | Date;
  cancelReason?: string;
  isCanceled?: boolean;
  rejectionReason?: string;
}

function formatRelativeTime(dateInput?: string | Date) {
  if (!dateInput) return "Baru saja";
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Baru saja";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} hari yang lalu`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} bulan yang lalu`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun yang lalu`;
}

function formatFullDate(dateInput?: string | Date) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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
    <Card className="p-5 md:p-6 gap-4 space-y-0 bg-white border-slate-200/80 shadow-sm">
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

export function StatusPengajuan({
  status,
  submittedData,
  onCancelPengajuan,
  submittedAt,
  canceledAt,
  cancelReason: initialCancelReason,
  isCanceled: isCanceledProp = false,
  rejectionReason,
}: StatusPengajuanProps) {
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedCancelReason, setSelectedCancelReason] = useState("");
  const [cancelReasonInput, setCancelReasonInput] = useState("");
  const [internalIsCanceled, setInternalIsCanceled] = useState(false);
  const [localCancelReason, setLocalCancelReason] = useState("");
  const [isKonfirmasiDone, setIsKonfirmasiDone] = useState(false);
  const [rescheduleData, setRescheduleData] = useState("");

  const isCanceled = isCanceledProp || internalIsCanceled;

  const statusConfig = {
    pending: {
      bannerBg: "bg-amber-50",
      textColor: "text-amber-800",
      descColor: "text-amber-700",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      icon: <Clock className="w-8 h-8 text-amber-600" />,
      title: "Pengajuan sedang ditinjau",
      desc: "Tim kami sedang meninjau data Anda. Kami akan mengirimkan notifikasi melewati email Anda.",
    },
    diterima: {
      bannerBg: "bg-emerald-50",
      textColor: "text-emerald-800",
      descColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      title: "Seleksi Diterima",
      desc: "Selamat! Pengajuan Anda sebagai guru telah diterima. Selamat bergabung di Qurani.",
    },
    ditolak: {
      bannerBg: "bg-rose-50",
      textColor: "text-rose-800",
      descColor: "text-rose-700",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      title: "Pengajuan Belum Diterima",
      desc: "Mohon maaf, pengajuan Anda saat ini belum dapat kami terima.",
    },
    jadwal_seleksi: {
      bannerBg: "bg-emerald-50",
      textColor: "text-emerald-800",
      descColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <CalendarDays className="w-8 h-8 text-emerald-600" />,
      title: "Jadwal Seleksi Ditentukan",
      desc: "Admin telah meninjau data Anda dan kami mengundang Anda untuk mengikuti seleksi. Silakan konfirmasi kehadiran Anda.",
    },
    dibatalkan: {
      bannerBg: "bg-rose-50",
      textColor: "text-rose-800",
      descColor: "text-rose-700",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      title: "Pengajuan Dibatalkan",
      desc: "Pengajuan calon guru telah Anda batalkan.",
    },
    ditolak_pengajuan: {
      bannerBg: "bg-rose-50",
      textColor: "text-rose-800",
      descColor: "text-rose-700",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      title: "Pengajuan Ditolak",
      desc: "Mohon maaf, pengajuan Anda tidak lolos pada tahap tinjauan awal. Admin telah menolak pengajuan ini sebelum masuk ke tahap seleksi.",
    },
    ditolak_seleksi: {
      bannerBg: "bg-rose-50",
      textColor: "text-rose-800",
      descColor: "text-rose-700",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      title: "Seleksi Gagal",
      desc: "Mohon maaf, Anda tidak lolos pada tahap seleksi. Terima kasih telah meluangkan waktu untuk mengikuti proses ini.",
    },
    konfirmasi: {
      bannerBg: "bg-emerald-50",
      textColor: "text-emerald-800",
      descColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      title: "Pengajuan Diterima",
      desc: "Pengajuan Anda telah diterima. Silakan konfirmasi jadwal untuk mengikuti seleksi guru.",
    },
    reschedule: {
      bannerBg: "bg-amber-50",
      textColor: "text-amber-800",
      descColor: "text-amber-700",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      icon: <CalendarDays className="w-8 h-8 text-amber-600" />,
      title: "Ajukan Reschedule Seleksi",
      desc: "Tidak bisa hadir pada jadwal yang ditentukan? Ajukan permintaan reschedule dengan menyertakan alasan dan usulan jadwal pengganti Anda.",
    },
  };

  let activeConfig = statusConfig[status];

  if ((status === 'konfirmasi' || status === 'jadwal_seleksi') && isKonfirmasiDone) {
    activeConfig = {
      bannerBg: "bg-emerald-50",
      textColor: "text-emerald-800",
      descColor: "text-emerald-700",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      title: "Jadwal Seleksi Terkonfirmasi",
      desc: "Anda telah mengonfirmasi kehadiran untuk jadwal seleksi ini. Silakan persiapkan diri Anda dengan baik.",
    };
  }

  if ((status === 'konfirmasi' || status === 'reschedule') && rescheduleData) {
    activeConfig = {
      bannerBg: "bg-amber-50",
      textColor: "text-amber-800",
      descColor: "text-amber-700",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      icon: <Clock className="w-8 h-8 text-amber-600" />,
      title: "Pengajuan Jadwal Ulang",
      desc: "Anda telah mengajukan penjadwalan ulang. Tim kami akan segera meninjau dan memberikan jadwal seleksi yang baru.",
    };
  }

  if (status === 'pending' && isCanceled) {
    activeConfig = {
      bannerBg: "bg-rose-50",
      textColor: "text-rose-800",
      descColor: "text-rose-700",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100",
      icon: <XCircle className="w-8 h-8 text-rose-600" />,
      title: "Pengajuan Dibatalkan",
      desc: "Pengajuan calon guru telah Anda batalkan.",
    };
  }


  const { formData, certifications, portfolioItems } = submittedData;
  const selectedLang = LANGUAGE_OPTIONS.find((l) => l.code === formData.language);
  const selectedCats = CATEGORY_OPTIONS.filter((c) =>
    formData.categoryIds.includes(c.id)
  );

  const isFormVisible = true;
  const isDataDiriVisible = status === 'pending' || status === 'dibatalkan' || status === 'ditolak_pengajuan';

  return (
    <div className={cn("w-full items-start gap-6 lg:gap-8", isFormVisible ? "grid grid-cols-1 lg:grid-cols-12" : "flex justify-center")}>
      
      {/* LEFT COLUMN: Form Data */}
      {isFormVisible && (
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 order-2 lg:order-1 w-full">
          {isDataDiriVisible ? (
            <>
            {/* Data Diri */}
            <FormSection icon={<User className="w-5 h-5 text-emerald-600" />} title="Data Diri">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Judul Profil Singkat</Label>
                    <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                      {formData.headline || "—"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 flex items-center gap-1">
                      Lokasi
                      <TooltipProvider delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[200px] text-[12px]">
                            Diisi otomatis dari profil Anda. Ubah di Pengaturan Profil.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative pointer-events-none">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                      <div className="pl-9 h-9 rounded-md border border-input bg-transparent flex items-center text-sm text-slate-700 shadow-sm select-none">
                        {formData.location || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Biografi Singkat</Label>
                    <div className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm whitespace-pre-wrap min-h-[80px]">
                      {formData.bio || ""}
                    </div>
                    <div className="flex items-center justify-end">
                      <span className={cn("text-[11px]", formData.bio.length > 50 ? "text-emerald-500" : "text-slate-300")}>
                        {formData.bio.length} karakter
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Keahlian & Kategori */}
            <FormSection icon={<BookOpen className="w-5 h-5 text-emerald-600" />} title="Keahlian & Kategori">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex flex-col space-y-2 h-full">
                  <Label className="text-[12px] font-semibold text-slate-700 ml-1 block shrink-0">Spesialisasi</Label>
                  <div className="min-h-10 h-full w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-start">
                    {formData.expertise.length > 0 
                      ? formData.expertise.join(", ")
                      : <span className="text-muted-foreground opacity-50">Pilih metode mengajar</span>}
                  </div>
                </div>
                <div className="flex flex-col space-y-2 h-full">
                  <Label className="text-[12px] font-semibold text-slate-700 ml-1 block shrink-0">Kategori Pengajaran</Label>
                  <div className="min-h-10 h-full w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-start">
                    {selectedCats.length > 0 
                      ? selectedCats.map((cat: any) => cat.name).join(", ")
                      : <span className="text-muted-foreground opacity-50">Pilih kategori</span>}
                  </div>
                </div>
                <div className="space-y-2">
                <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Bahasa</Label>
                <Button variant="outline" className="w-full justify-between font-normal pointer-events-none">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-emerald-500" />
                      {selectedLang?.label || "Pilih bahasa pengantar"}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </div>
              </div>
            </FormSection>

            {/* Tarif & Ketersediaan */}
            <FormSection icon={<DollarSign className="w-5 h-5 text-emerald-600" />} title="Tarif & Ketersediaan">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Mata Uang</Label>
                    <Button variant="outline" className="w-full justify-between font-normal pointer-events-none bg-transparent">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-emerald-500" />
                        {formData.currency || "Pilih mata uang"}
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Tarif Per Jam</Label>
                    <div className="relative pointer-events-none">
                      <span className="absolute left-3 top-2.5 flex items-center text-emerald-500 font-bold text-sm pointer-events-none">
                        {formData.currency ? getCurrencySymbol(formData.currency) : "—"}
                      </span>
                      <Input readOnly value={
                        formData.hourlyRate
                          ? new Intl.NumberFormat("id-ID").format(Number(formData.hourlyRate.replace(/\D/g, "")))
                          : ""
                      } className="pl-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Pengalaman Mengajar (Tahun)</Label>
                    <div className="relative pointer-events-none">
                      <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-emerald-500" />
                      <Input readOnly value={formData.experienceYears || ""} className="pl-9" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pointer-events-none">
                  <Label className="text-[12px] font-semibold text-slate-700 ml-1 block">Mode Mengajar</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        key: "isOnline",
                        label: "Online",
                        sub: "Via Zoom, Google Meet, dll",
                        icon: <Video className="w-5 h-5 text-emerald-600" />,
                        active: formData.isOnline
                      },
                      {
                        key: "isOffline",
                        label: "Offline / Tatap Muka",
                        sub: "Kunjungan ke rumah murid",
                        icon: <MapPin className="w-5 h-5 text-emerald-600" />,
                        active: formData.isOffline
                      },
                    ].map((mode) => (
                      <div key={mode.key} className={cn("relative rounded-xl border p-4 flex gap-4 items-start transition-all", mode.active ? "border-emerald-500" : "border-slate-200 opacity-50")}>
                        <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5", mode.active ? "border-emerald-500 bg-emerald-500" : "border-slate-300")}>
                          {mode.active && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {mode.icon}
                            <h4 className="font-bold text-sm text-slate-800">{mode.label}</h4>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{mode.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Video Portfolio */}
            <FormSection icon={<Video className="w-5 h-5 text-emerald-600" />} title="Video Portfolio">
              <div className="pt-2 space-y-4">
                {portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map((item: any, idx: number) => {
                      const embedId = getYouTubeEmbedId(item.url);
                      return (
                        <div key={item.id} className="h-full">
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
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-400">—</p>
                )}
              </div>
            </FormSection>

            {/* Sertifikasi */}
            <FormSection icon={<Award className="w-5 h-5 text-emerald-600" />} title="Sertifikasi">
              <div className="pt-2">
                {certifications.length > 0 ? (
                  <div className="space-y-4">
                    {certifications.map((cert: any, idx: number) => (
                      <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-0 gap-0 shadow-none">
                        <div className="flex items-center justify-between px-5 py-4 pointer-events-none">
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
                        </div>
                        <div className="px-5 pb-6 pt-3 space-y-4 border-t border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 block">
                                Nama Sertifikat
                              </Label>
                              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                                {cert.name || "—"}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 block">
                                Lembaga Penerbit
                              </Label>
                              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                                {cert.issuer || "—"}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 block">
                                Tanggal Terbit
                              </Label>
                              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                                {cert.issuedDate ? formatFullDate(cert.issuedDate) : "—"}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 flex gap-1">
                                Tanggal Kadaluarsa <span className="text-slate-400 font-normal">(Opsional)</span>
                              </Label>
                              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700">
                                {cert.expiryDate ? formatFullDate(cert.expiryDate) : "—"}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 block">
                                No. Sertifikat
                              </Label>
                              <div className="min-h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm flex items-center text-slate-700 break-all">
                                {cert.credentialId || "—"}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[11px] font-semibold text-slate-600 block">
                                URL Verifikasi Sertifikat
                              </Label>
                              <div className="relative flex items-center">
                                <Link2 className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm items-center">
                                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline truncate w-full block">
                                    {cert.url}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-slate-400">—</p>
                )}
              </div>
            </FormSection>
            </>
          ) : (
            <>
              {(status === 'konfirmasi' || status === 'jadwal_seleksi') && (
                <KonfirmasiSeleksi
                  mode="konfirmasi"
                  onConfirm={() => setIsKonfirmasiDone(true)}
                  isConfirmed={isKonfirmasiDone}
                  onReschedule={(reason) => setRescheduleData(reason)}
                  isRescheduled={!!rescheduleData}
                />
              )}
              {status === 'reschedule' && (
                <KonfirmasiSeleksi
                  mode="reschedule"
                  onReschedule={(reason) => setRescheduleData(reason)}
                  isRescheduled={!!rescheduleData}
                />
              )}
              
              {(status === 'diterima' || status === 'ditolak' || status === 'ditolak_seleksi') && (
                <EvaluationRegister />
              )}
            </>
          )}
        </div>
      )}

      {/* RIGHT COLUMN: Tahap Pendaftaran & Status */}
      <div className={cn("flex flex-col gap-6 order-1 lg:order-2 lg:sticky lg:top-24", isFormVisible ? "lg:col-span-5 xl:col-span-4" : "w-full max-w-xl")}>
        
        {/* Tahap Pendaftaran (Stepper) */}
        <Card className="p-5 md:p-6 gap-4 space-y-0 bg-white border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">Tahap Pendaftaran</h3>
            </div>
          </div>
          
          <div className="flex items-center justify-between relative mt-2 mb-2 z-0">
            {/* Connecting lines */}
            <div className="absolute top-5 left-[15%] right-[15%] h-[2px] bg-slate-100 z-0" />
            <div className={`absolute top-5 left-[15%] right-1/2 h-[2px] transition-all duration-700 z-0 ${status !== 'pending' ? 'bg-emerald-500' : 'bg-transparent'}`} />
            <div className={`absolute top-5 left-1/2 right-[15%] h-[2px] transition-all duration-700 z-0 ${(status === 'diterima' || status === 'ditolak_pengajuan' || status === 'ditolak_seleksi' || status === 'ditolak') ? 'bg-emerald-500' : 'bg-transparent'}`} />

            {/* Step 1: Pendaftaran Dikirim */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shadow-sm">
                <Check className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-800">Pendaftaran Dikirim</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{formatFullDate(submittedAt)}</p>
              </div>
            </div>

            {/* Step 2: Sedang Ditinjau / Seleksi */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/3">
              <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                status === 'pending' || status === 'reschedule' ? 'bg-amber-100' : 'bg-emerald-100'
              }`}>
                {status === 'pending' || status === 'reschedule' ? (
                  <Clock className="w-5 h-5 text-amber-600" />
                ) : (status === 'jadwal_seleksi' || status === 'konfirmasi') ? (
                  <CalendarDays className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-800">
                  {status === 'pending' ? 'Sedang Ditinjau' : 
                   (status === 'jadwal_seleksi' || status === 'konfirmasi' || status === 'reschedule') ? 'Seleksi' : 
                   'Ditinjau'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {status === 'pending' ? 'Menunggu admin' : 'Tahap lanjutan'}
                </p>
              </div>
            </div>

            {/* Step 3: Selesai */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-1/3">
              <div className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                (status === 'diterima' || status === 'ditolak' || status === 'ditolak_seleksi' || status === 'ditolak_pengajuan') ? 'bg-emerald-100' : 'bg-slate-100'
              }`}>
                <User className={`w-5 h-5 ${
                  (status === 'diterima' || status === 'ditolak' || status === 'ditolak_seleksi' || status === 'ditolak_pengajuan') ? 'text-emerald-600' : 'text-slate-400'
                }`} />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-800">Selesai</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Hasil akhir</p>
              </div>
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex gap-3 items-start shadow-sm">
              <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Tim kami sedang memproses data Anda sesuai dengan tahapan yang sedang aktif. Kami akan mengirimkan notifikasi melalui email.
              </p>
            </div>
          )}
        </Card>

        {/* Banner Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={cn("flex flex-col text-left p-6 sm:px-8 sm:py-6 shadow-sm gap-4 relative overflow-hidden bg-white border-slate-200/80")}>
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", activeConfig.iconBg)}>
              {React.cloneElement(activeConfig.icon as React.ReactElement<any>, { className: cn((activeConfig.icon as React.ReactElement<any>).props.className, "w-5 h-5") })}
            </div>
            <h2 className={cn("text-sm font-extrabold", activeConfig.textColor)}>
              {activeConfig.title}
            </h2>
          </div>
          
          <div className="w-full relative z-10 space-y-4">
            {activeConfig.desc && (
              <p className={cn("text-[13px] text-slate-600 leading-relaxed")}>
                {activeConfig.desc}
              </p>
            )}

            {status === 'pending' && isCanceled && (
              <div className="mt-4 flex flex-col items-start gap-3 w-full">
                {(localCancelReason || initialCancelReason) && (
                  <Alert variant="destructive" className="w-full text-left bg-rose-100/50 border-rose-200">
                    <AlertTitle className="font-bold text-sm">Alasan Pembatalan:</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1 text-xs">
                      {localCancelReason || initialCancelReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {status === 'dibatalkan' && (
              <div className="mt-4 flex flex-col items-start gap-3 w-full">
                {initialCancelReason && (
                  <Alert variant="destructive" className="w-full text-left bg-rose-100/50 border-rose-200">
                    <AlertTitle className="font-bold text-sm">Alasan Pembatalan:</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1 text-xs">
                      {initialCancelReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {(status === 'ditolak' || status === 'ditolak_pengajuan' || status === 'ditolak_seleksi') && (
              <div className="mt-4 flex flex-col items-start gap-3 w-full">
                {rejectionReason && (
                  <Alert variant="destructive" className="w-full text-left bg-rose-100/50 border-rose-200">
                    <AlertTitle className="font-bold text-sm">Alasan Penolakan:</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap mt-1 text-xs">
                      {rejectionReason}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {(status === 'konfirmasi' || status === 'reschedule') && rescheduleData && (
              <div className="mt-4 flex flex-col items-start gap-3 w-full">
                <Alert className="w-full text-left bg-amber-100/50 border-amber-200/60 text-amber-800">
                  <AlertTitle className="font-bold text-sm">Alasan Menjadwalkan Ulang:</AlertTitle>
                  <AlertDescription className="break-all whitespace-pre-wrap mt-1 text-amber-700 text-xs">
                    {rescheduleData}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {status === 'pending' && !isCanceled && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  className="w-full text-rose-600 border-rose-200 bg-white hover:text-rose-700 hover:bg-rose-50 font-semibold text-sm rounded-xl h-12"
                  onClick={() => setShowCancelPrompt(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Batalkan Pengajuan
                </Button>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg flex items-start gap-2 border border-amber-100">
                  <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-800">Pembatalan hanya dapat dilakukan selama proses peninjauan.</p>
                </div>
              </div>
            )}
          </div>
          </Card>
        </motion.div>

        {/* Reapply Card */}
        {(status === 'ditolak_pengajuan' || status === 'ditolak_seleksi' || status === 'ditolak' || status === 'dibatalkan' || (status === 'pending' && isCanceled)) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="flex flex-col text-left p-6 sm:px-8 sm:py-6 shadow-sm gap-4 relative overflow-hidden bg-white border-slate-200/80 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-sm font-extrabold text-slate-800">Mengajukan Kembali?</h2>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed z-10">
                Tetap semangat! Anda dapat mempersiapkan diri lebih matang dan mengajukan kembali pendaftaran Anda sebagai guru.
              </p>
              <div className="mt-2 pt-4 border-t border-slate-100 z-10">
                <Link href="/teachers/registers" className="w-full block">
                  <Button className="w-full">
                    Ajukan Kembali
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

      </div>

      {/* Cancel Prompt Modal */}
      <Dialog open={showCancelPrompt} onOpenChange={setShowCancelPrompt}>
        <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Batalkan Pengajuan?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-[13px] text-slate-500">
              Pilih alasan pembatalan untuk memberitahu kami.
            </p>
            <div className="flex items-center justify-between">
              <Label className="text-[12px] font-bold text-slate-700">Alasan Pembatalan</Label>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Wajib</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Berubah pikiran",
                "Ingin memperbaiki dan melengkapi data",
                "Ingin mendaftar kembali di lain waktu",
                "Lainnya"
              ].map((reason) => {
                const isSelected = selectedCancelReason === reason;
                return (
                  <div 
                    key={reason} 
                    className={cn(
                      "flex items-center space-x-3 rounded-xl border p-4 transition-colors cursor-pointer",
                      isSelected ? "border-rose-500 bg-rose-50/50" : "border-slate-200 hover:bg-slate-50"
                    )} 
                    onClick={() => {
                      setSelectedCancelReason(reason);
                      if (reason === "Lainnya") {
                        setTimeout(() => textareaRef.current?.focus(), 50);
                      }
                    }}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                      isSelected ? "bg-rose-500 border-rose-500" : "border-slate-300 bg-transparent"
                    )}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>
                    <span className={cn("text-[13px] font-medium w-full", isSelected ? "text-rose-600" : "text-slate-700")}>
                      {reason}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {selectedCancelReason === "Lainnya" && (
              <Textarea
                ref={textareaRef}
                placeholder="Tuliskan alasan lainnya..."
                value={cancelReasonInput}
                onChange={(e) => setCancelReasonInput(e.target.value)}
                className="resize-none min-h-[80px] text-[13px]"
              />
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCancelPrompt(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!selectedCancelReason || (selectedCancelReason === "Lainnya" && !cancelReasonInput.trim())}
              onClick={() => {
                const finalReason = selectedCancelReason === "Lainnya" 
                  ? cancelReasonInput 
                  : selectedCancelReason;
                onCancelPengajuan(finalReason);
                setLocalCancelReason(finalReason);
                setInternalIsCanceled(true);
                setShowCancelPrompt(false);
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }, 100);
              }}
            >
              Batalkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
