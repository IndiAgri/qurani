"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Search,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  ChevronRight,
  Eye,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DUMMY_STUDENTS } from "@/data/students-data";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export function TeacherStudentsView({ teacherId = "1" }: { teacherId?: string }) {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const [students, setStudents] = useState(DUMMY_STUDENTS);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const filteredStudents = students.filter((s) => {
    const matchTab =
      activeTab === "all" ? true : s.status === activeTab;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.package.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Daftar Santri Bimbingan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau progres hafalan, catatan tajwid, dan riwayat tilawah santri Anda.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Total Santri</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">58</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
            <Users className="size-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Santri Aktif</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
            <BookOpen className="size-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Lulus / Selesai</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">34</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Award className="size-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-gray-400 font-medium">Tingkat Kelulusan</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">98%</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <Sparkles className="size-5" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "active"
                ? "bg-[#00875a] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100"
            }`}
          >
            Santri Aktif
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#00875a] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100"
            }`}
          >
            Selesai Bimbingan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "all"
                ? "bg-[#00875a] text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100"
            }`}
          >
            Semua
          </button>
        </div>

        <div className="flex items-center max-w-sm">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari santri atau paket..."
            className="h-10 rounded-l-xl rounded-r-none border-r-0 border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 shadow-2xs"
          />
          <Button
            type="button"
            size="icon"
            className="size-10 rounded-l-none rounded-r-xl bg-[#00875a] hover:bg-[#007a51] text-white shrink-0 cursor-pointer shadow-xs"
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((s) => {
          const progressPercent = Math.min(
            100,
            Math.round((s.completedSessions / s.totalSessions) * 100) || 0
          );
          return (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                      <Image
                        src={s.avatar}
                        alt={s.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {s.name}
                      </h3>
                      <p className="text-xs text-gray-400">@{s.username}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                      s.mode === "Online"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {s.mode}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Paket Belajar</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {s.package}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Terakhir Disimak</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {s.lastRead}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Progres Sesi</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {s.completedSessions} / {s.totalSessions} Sesi ({progressPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00875a] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedStudent(s)}
                  className="rounded-xl border-gray-200 text-xs font-semibold h-9 flex-1 cursor-pointer"
                >
                  <FileCheck2 className="size-3.5 mr-1" />
                  <span>Riwayat</span>
                </Button>
                <Link
                  href={`/${currentLocale}/teachers/${teacherId}/messages`}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold h-9 cursor-pointer"
                  >
                    <MessageSquare className="size-3.5 mr-1" />
                    <span>Pesan</span>
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail & Riwayat Hafalan Santri */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      >
        {selectedStudent && (
          <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Catatan Bimbingan: {selectedStudent.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 space-y-1">
                <p className="font-bold">Paket: {selectedStudent.package}</p>
                <p className="text-[11px]">
                  Terakhir Dibaca / Dihafal: {selectedStudent.lastRead}
                </p>
                <p className="text-[11px]">
                  Sesi: {selectedStudent.completedSessions} dari {selectedStudent.totalSessions} Sesi Selesai
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Riwayat Pertemuan & Evaluasi:
                </h4>
                {selectedStudent.history && selectedStudent.history.length > 0 ? (
                  <div className="space-y-2">
                    {selectedStudent.history.map((h: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-slate-800 space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {h.surah}
                          </span>
                          <span className="text-[10px] text-gray-400">{h.date}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-gray-300">
                          Catatan Ustadz: {h.note}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 py-3 text-center">
                    Belum ada riwayat evaluasi pertemuan.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl text-xs"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
