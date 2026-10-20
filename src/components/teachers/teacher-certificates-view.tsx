"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Download,
  ChevronDown,
  Award,
  Sparkles,
  Printer,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface CertificateItem {
  id: string;
  certNumber: string;
  recipientName: string;
  courseName: string;
  issuedDate: string;
  validUntil: string;
  status: "Active" | "Revoked" | "Expired";
}

const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1",
    certNumber: "QRN-2026-0001",
    recipientName: "Budi Santoso",
    courseName: "Tahfidz 1 Juz",
    issuedDate: "1 Aug 2026",
    validUntil: "1 Aug 2027",
    status: "Active",
  },
  {
    id: "cert-2",
    certNumber: "QRN-2026-0002",
    recipientName: "Siti Aminah",
    courseName: "Tahsin",
    issuedDate: "27 Jul 2026",
    validUntil: "27 Jul 2027",
    status: "Revoked",
  },
  {
    id: "cert-3",
    certNumber: "QRN-2025-0010",
    recipientName: "Ahmad Fauzi",
    courseName: "Basic Quran",
    issuedDate: "1 Jul 2025",
    validUntil: "1 Jul 2026",
    status: "Expired",
  },
  {
    id: "cert-4",
    certNumber: "QRN-2026-0003",
    recipientName: "Dewi Rahayu",
    courseName: "Tahfidz 5 Juz",
    issuedDate: "5 Aug 2026",
    validUntil: "5 Aug 2027",
    status: "Active",
  },
  {
    id: "cert-5",
    certNumber: "QRN-2026-0004",
    recipientName: "Nur Hidayah",
    courseName: "Tajwid Lanjutan",
    issuedDate: "10 Aug 2026",
    validUntil: "10 Aug 2027",
    status: "Active",
  },
];

export function TeacherCertificatesView({ teacherId = "1" }: { teacherId?: string }) {
  const [activeTab, setActiveTab] = useState<"diterbitkan" | "template">("diterbitkan");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter logic
  const filteredCertificates = INITIAL_CERTIFICATES.filter((item) => {
    const matchesSearch =
      item.certNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleDownload = (cert: CertificateItem) => {
    toast.success(`Mengunduh sertifikat ${cert.certNumber} (${cert.recipientName})...`);
  };

  const handlePreview = (cert: CertificateItem) => {
    setPreviewCert(cert);
    setIsPreviewOpen(true);
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sertifikat
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola sertifikat yang Anda terbitkan kepada murid
        </p>
      </div>

      {/* Top 4 Stats Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
        {/* Card 1: Total Diterbitkan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Diterbitkan
            </span>
            <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <FileText className="size-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            5
          </span>
        </div>

        {/* Card 2: Aktif */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Aktif
            </span>
            <div className="size-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-[#00875a]">
            3
          </span>
        </div>

        {/* Card 3: Dicabut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Dicabut
            </span>
            <div className="size-8 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500">
              <XCircle className="size-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-rose-600">
            1
          </span>
        </div>

        {/* Card 4: Kedaluwarsa */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Kedaluwarsa
            </span>
            <div className="size-8 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
              <Clock className="size-4" />
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-600">
            1
          </span>
        </div>
      </div>

      {/* Tabs Row (Diterbitkan & Template) */}
      <div className="border-b border-gray-200/80 dark:border-slate-800 mb-6 flex items-center gap-6 text-sm">
        <button
          type="button"
          onClick={() => setActiveTab("diterbitkan")}
          className={`pb-2.5 font-semibold transition-all cursor-pointer ${
            activeTab === "diterbitkan"
              ? "text-[#00875a] border-b-2 border-[#00875a] -mb-px"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          Diterbitkan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("template")}
          className={`pb-2.5 font-semibold transition-all cursor-pointer ${
            activeTab === "template"
              ? "text-[#00875a] border-b-2 border-[#00875a] -mb-px"
              : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
          }`}
        >
          Template
        </button>
      </div>

      {/* Content for Tab 1: Diterbitkan */}
      {activeTab === "diterbitkan" && (
        <>
          {/* Search Bar & Status Filter */}
          <div className="flex items-center gap-3 mb-6">
            {/* Search Input with integrated green button */}
            <div className="flex items-center w-full max-w-sm sm:max-w-md shadow-2xs">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor atau nama penerima..."
                  className="h-10 w-full rounded-l-xl border border-r-0 border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
                />
                <Search className="size-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                aria-label="Search"
                className="h-10 px-3.5 rounded-r-xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center cursor-pointer transition shadow-xs shrink-0"
              >
                <Search className="size-4" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer shadow-2xs focus:outline-none transition">
                <Filter className="size-3.5 text-gray-600 dark:text-gray-400" />
                <span>
                  {statusFilter === "all"
                    ? "Semua Status"
                    : statusFilter === "active"
                    ? "Active"
                    : statusFilter === "revoked"
                    ? "Revoked"
                    : "Expired"}
                </span>
                <ChevronDown className="size-3 text-gray-400 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl p-1 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800"
              >
                <DropdownMenuItem
                  onClick={() => setStatusFilter("all")}
                  className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${
                    statusFilter === "all" ? "font-bold text-[#00875a]" : ""
                  }`}
                >
                  Semua Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("active")}
                  className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${
                    statusFilter === "active" ? "font-bold text-[#00875a]" : ""
                  }`}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("revoked")}
                  className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${
                    statusFilter === "revoked" ? "font-bold text-[#00875a]" : ""
                  }`}
                >
                  Revoked
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter("expired")}
                  className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${
                    statusFilter === "expired" ? "font-bold text-[#00875a]" : ""
                  }`}
                >
                  Expired
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Certificates Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="py-4 px-6 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      No. Sertifikat
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Penerima
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Kursus
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Tgl Diterbitkan
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Berlaku Sampai
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      Status
                    </th>
                    <th className="py-4 px-6 text-xs font-semibold text-gray-800 dark:text-gray-200 text-right sm:text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/90 dark:divide-slate-800/80">
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map((cert) => (
                      <tr
                        key={cert.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* No. Sertifikat (Green text) */}
                        <td className="py-4.5 px-6 font-semibold text-xs text-[#00875a] whitespace-nowrap">
                          {cert.certNumber}
                        </td>

                        {/* Penerima (Bold dark text) */}
                        <td className="py-4.5 px-4 font-bold text-xs text-gray-900 dark:text-white whitespace-nowrap">
                          {cert.recipientName}
                        </td>

                        {/* Kursus */}
                        <td className="py-4.5 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {cert.courseName}
                        </td>

                        {/* Tgl Diterbitkan */}
                        <td className="py-4.5 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {cert.issuedDate}
                        </td>

                        {/* Berlaku Sampai */}
                        <td className="py-4.5 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {cert.validUntil}
                        </td>

                        {/* Status (Pill badges with icons) */}
                        <td className="py-4.5 px-4 whitespace-nowrap">
                          {cert.status === "Active" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                              <CheckCircle2 className="size-3.5 stroke-[2.2]" />
                              <span>Active</span>
                            </span>
                          )}
                          {cert.status === "Revoked" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40">
                              <XCircle className="size-3.5 stroke-[2.2]" />
                              <span>Revoked</span>
                            </span>
                          )}
                          {cert.status === "Expired" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                              <Clock className="size-3.5 stroke-[2.2]" />
                              <span>Expired</span>
                            </span>
                          )}
                        </td>

                        {/* Aksi (Eye & Download icons) */}
                        <td className="py-4.5 px-6 whitespace-nowrap text-right sm:text-center">
                          <div className="flex items-center justify-end sm:justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => handlePreview(cert)}
                              aria-label="Lihat Sertifikat"
                              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(cert)}
                              aria-label="Unduh Sertifikat"
                              className="text-gray-500 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
                            >
                              <Download className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                        Tidak ada sertifikat yang cocok dengan pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Content for Tab 2: Template */}
      {activeTab === "template" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Template Sertifikat Tahsin & Tartil",
              desc: "Cocok untuk program evaluasi makharijul huruf, tajwid, dan kelancaran baca Al-Quran.",
              color: "border-emerald-300",
            },
            {
              title: "Template Syahadah Tahfidz Al-Quran",
              desc: "Format resmi penerbitan syahadah hafalan juz tertentu (Juz 30, Juz 29, atau 30 Juz).",
              color: "border-blue-300",
            },
            {
              title: "Template Sanad Matan Al-Jazariyyah",
              desc: "Format kredensial sanad keilmuan dan ijazah qira'ah bersambung.",
              color: "border-purple-300",
            },
          ].map((template, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-slate-800 dark:to-slate-800/50 border border-emerald-100 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                  <Award className="size-8 text-[#00875a] mb-2" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    Qurani Verified Certificate
                  </span>
                  <span className="text-[10px] text-gray-500">Standar Resmi Sertifikasi</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {template.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {template.desc}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => toast.success(`Template ${template.title} siap digunakan!`)}
                  className="w-full bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold h-9 cursor-pointer"
                >
                  Gunakan Template
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="size-5 text-[#00875a]" />
              Preview Sertifikat Digital
            </DialogTitle>
          </DialogHeader>

          {previewCert && (
            <div className="py-4 space-y-4">
              {/* Certificate Paper Frame */}
              <div className="relative p-6 sm:p-8 rounded-2xl border-4 border-double border-emerald-700/30 bg-gradient-to-b from-[#fbfdfa] to-[#f4f9f4] dark:from-slate-950 dark:to-slate-900 text-center space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/10">
                  <span className="text-xs font-bold text-[#00875a] tracking-widest uppercase">
                    QURANI ACADEMY
                  </span>
                  <span className="text-[11px] font-semibold text-gray-400">
                    {previewCert.certNumber}
                  </span>
                </div>

                <div className="py-4 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-wide">
                    SERTIFIKAT KELULUSAN
                  </h3>
                  <p className="text-xs text-gray-500">
                    Diberikan secara resmi kepada santri berprestasi:
                  </p>
                  <h4 className="text-lg sm:text-xl font-bold text-[#00875a] py-1 underline decoration-emerald-300 underline-offset-8">
                    {previewCert.recipientName}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 max-w-md mx-auto pt-2">
                    Telah menyelesaikan program bimbingan <strong>{previewCert.courseName}</strong> dengan predikat kelulusan memuaskan.
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-800/10 flex items-center justify-between text-left text-[11px] text-gray-500">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Pengajar Pembimbing:</p>
                    <p>Ustadz Rafi Andika</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Diterbitkan Pada:</p>
                    <p>{previewCert.issuedDate} • Berlaku s/d {previewCert.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-gray-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="rounded-xl text-xs cursor-pointer"
            >
              Tutup
            </Button>
            {previewCert && (
              <Button
                onClick={() => handleDownload(previewCert)}
                className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Unduh PDF
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
