"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  User,
  BookOpen,
  Clock,
  MapPin,
  AlertCircle,
  Edit3,
  Award,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

interface TeacherData {
  name: string;
  username: string;
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
  location: string;
  bio: string;
  courseAbout: string;
  avatar: string;
  degree: string;
  certification: string;
  languages: string[];
  bankName: string;
  bankAccount: string;
  bankHolder: string;
}

const DEFAULT_TEACHER: TeacherData = {
  name: "Rafi Andika",
  username: "rafi_andika",
  specialization: "Tahfidz, Tajwid",
  experienceYears: 10,
  hourlyRate: 50000,
  location: "Jl. Kebon Sirih No. 1, Menteng, Jakarta Pusat, Indonesia",
  bio: "Assalamualaikum, saya Ustadz Rafi dengan pengalaman 10 tahun mengajar tahfidz dan tahsin. Saya bersertifikat dari LIPIA dan telah membimbing ratusan santri untuk menghafal Al-Quran.",
  courseAbout: "Kursus ini dirancang untuk membantu Anda menguasai Tahfidz, Tajwid dengan bimbingan langsung dari pengajar bersanad secara interaktif dan terstruktur.",
  avatar: "https://c.superprof.com/i/m/17191274/600/20220817152315/17191274.webp",
  degree: "S1 Syariah - Lembaga Ilmu Pengetahuan Islam dan Arab (LIPIA)",
  certification: "Sanad Tahfidz Riwayat Hafsh 'an 'Ashim & Jazariyah",
  languages: ["Bahasa Indonesia", "Bahasa Arab"],
  bankName: "Bank Syariah Indonesia (BSI)",
  bankAccount: "7128938192",
  bankHolder: "Rafi Andika",
};

export function TeacherProfileView({ teacherId = "1" }: { teacherId?: string }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"utama" | "tambahan">("utama");
  const [teacher, setTeacher] = useState<TeacherData>(DEFAULT_TEACHER);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<TeacherData>(DEFAULT_TEACHER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`teacher_profile_${teacherId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeacher(parsed);
        setEditForm(parsed);
      }
    } catch {}
  }, [teacherId]);

  const handleSave = () => {
    setTeacher(editForm);
    try {
      localStorage.setItem(`teacher_profile_${teacherId}`, JSON.stringify(editForm));
    } catch {}
    setIsEditOpen(false);
    toast.success("Profil guru berhasil diperbarui!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 font-sans">
      {/* Page Heading: Profil Guru matching original website */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Profil Guru
      </h1>

      {/* Top Header: Tabs Row & Edit Profil Button */}
      <div className="flex items-center justify-between mb-6">
        {/* Tabs Row */}
        <div className="flex items-center gap-1.5 bg-gray-100/70 dark:bg-slate-800/60 p-1 rounded-2xl border border-gray-200/50">
          <button
            type="button"
            onClick={() => setActiveTab("utama")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "utama"
                ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs border border-gray-200/70"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <User className="size-4 text-gray-700 dark:text-gray-300 shrink-0" />
            <span>Info Utama</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tambahan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "tambahan"
                ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-2xs border border-gray-200/70"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            <BookOpen className="size-4 text-gray-400 shrink-0" />
            <span>Info Tambahan</span>
          </button>
        </div>

        {/* Edit Profil Button on Right */}
        <Button
          onClick={() => {
            setEditForm(teacher);
            setIsEditOpen(true);
          }}
          className="bg-[#00875a] hover:bg-[#007a51] text-white font-semibold rounded-xl px-5 h-10 shadow-xs cursor-pointer transition-all duration-150"
        >
          Edit Profil
        </Button>
      </div>

      {/* Main Grid matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar & Verification Banner */}
        <div className="lg:col-span-4 space-y-4">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 flex flex-col items-center text-center shadow-xs">
            <div className="relative size-36 sm:size-40 rounded-full overflow-hidden shadow-sm mb-4">
              <Image
                src={teacher.avatar}
                alt={teacher.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {teacher.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              @{teacher.username}
            </p>
          </div>

          {/* Verification Notice Card */}
          <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fef08a] dark:bg-amber-950/20 dark:border-amber-900/40 text-left shadow-2xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                  Profil Terverifikasi
                </h4>
                <p className="text-xs text-amber-700/90 dark:text-amber-400/90 mt-1 leading-relaxed">
                  Profil Anda telah diverifikasi oleh tim sebagai duta-besar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="lg:col-span-8">
          {activeTab === "utama" ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Header inside Card */}
              <div className="flex items-center gap-2.5 pb-1">
                <User className="size-5 text-[#00875a]" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Informasi Pribadi
                </h3>
              </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Row 1: Nama & Spesialisasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-700 font-semibold">Nama</label>
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                      {teacher.name}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-700 font-semibold">Spesialisasi</label>
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                      {teacher.specialization}
                    </div>
                  </div>
                </div>

                {/* Row 2: Pengalaman & Biaya per Jam */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-700 font-semibold">
                      Pengalaman Mengajar (Tahun)
                    </label>
                    <div className="flex items-center gap-2 bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                      <Clock className="size-4 text-gray-400 shrink-0" />
                      <span>{teacher.experienceYears}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-700 font-semibold">
                      Biaya per Jam (Rp)
                    </label>
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                      Rp {teacher.hourlyRate.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Row 3: Lokasi Mengajar */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-700 font-semibold flex items-center gap-1">
                    <MapPin className="size-3.5 text-[#00875a]" />
                    <span>Lokasi Mengajar</span>
                  </label>
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                    {teacher.location}
                  </div>
                </div>

                {/* Row 4: Tentang Pengajar */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-700 font-semibold block">Tentang Pengajar</label>
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-normal text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 leading-relaxed">
                    {teacher.bio}
                  </div>
                </div>

                {/* Row 5: Tentang Kursus */}
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-700 font-semibold block">Tentang Kursus</label>
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl px-4 py-3 text-xs sm:text-sm font-normal text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800 leading-relaxed">
                    {teacher.courseAbout}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Info Tambahan Tab */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-slate-800">
                <BookOpen className="size-5 text-[#00875a]" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Informasi Tambahan & Kredensial
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <GraduationCap className="size-4 text-[#00875a]" />
                    <span>Pendidikan Terakhir</span>
                  </label>
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-3.5 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                    {teacher.degree}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <Award className="size-4 text-amber-500" />
                    <span>Sertifikasi & Sanad Keilmuan</span>
                  </label>
                  <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-3.5 text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-slate-800">
                    {teacher.certification}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <Sparkles className="size-4 text-blue-500" />
                    <span>Bahasa Pengantar Bimbingan</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {teacher.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-800/50"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CreditCard className="size-4 text-gray-600" />
                    Rekening Pencairan Honorarium
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-3 border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Bank</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{teacher.bankName}</p>
                    </div>
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-3 border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Nomor Rekening</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{teacher.bankAccount}</p>
                    </div>
                    <div className="bg-gray-50/90 dark:bg-slate-800/60 rounded-xl p-3 border border-gray-100 dark:border-slate-800">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Atas Nama</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{teacher.bankHolder}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profil Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-none shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit3 className="size-5 text-[#00875a]" />
              Edit Profil Guru
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Spesialisasi</label>
                <Input
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pengalaman (Tahun)</label>
                <Input
                  type="number"
                  value={editForm.experienceYears}
                  onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })}
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Biaya per Jam (Rp)</label>
                <Input
                  type="number"
                  value={editForm.hourlyRate}
                  onChange={(e) => setEditForm({ ...editForm, hourlyRate: Number(e.target.value) })}
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Lokasi Mengajar</label>
              <Input
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tentang Pengajar (Bio)</label>
              <Textarea
                rows={3}
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="rounded-xl border-gray-200 resize-none text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tentang Kursus</label>
              <Textarea
                rows={3}
                value={editForm.courseAbout}
                onChange={(e) => setEditForm({ ...editForm, courseAbout: e.target.value })}
                className="rounded-xl border-gray-200 resize-none text-xs sm:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="rounded-xl cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl cursor-pointer"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
