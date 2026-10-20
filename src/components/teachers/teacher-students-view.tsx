"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  GraduationCap,
  BookOpen,
  Clock,
  MessageSquare,
  ChevronRight,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";

interface StudentData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  packageName: string;
  method: "Online" | "Offline";
  dateRange: string;
  completedSessions: number;
  totalSessions: number;
  progressPercent: number;
  status: "Aktif" | "Selesai" | "Dibatalkan";
  notes?: string;
  email?: string;
}

const INITIAL_STUDENTS: StudentData[] = [
  {
    id: "std-1",
    name: "Siti Rahmawati",
    username: "@siti_rahma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageName: "Tahsin Intensif",
    method: "Online",
    dateRange: "12 Jan 2026 - 05 Feb 2026",
    completedSessions: 3,
    totalSessions: 8,
    progressPercent: 38,
    status: "Aktif",
    email: "siti.rahmawati@gmail.com",
    notes: "Sudah menyelesaikan makharijul huruf halqiyyah dan lisaniyyah dengan baik.",
  },
  {
    id: "std-2",
    name: "Ahmad Fauzi",
    username: "@ahmad_fauzi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    packageName: "Tahfidz Pemula",
    method: "Offline",
    dateRange: "05 Feb 2026 - 26 Feb 2026",
    completedSessions: 1,
    totalSessions: 4,
    progressPercent: 25,
    status: "Aktif",
    email: "ahmad.fauzi@gmail.com",
    notes: "Setoran Juz 30 (Surah An-Naba' ayat 1 - 20) lancar.",
  },
  {
    id: "std-3",
    name: "Lailatul Munawaroh",
    username: "@laila_munawar",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    packageName: "Tajwid Mahir",
    method: "Online",
    dateRange: "20 Des 2025 - 10 Jan 2026",
    completedSessions: 4,
    totalSessions: 4,
    progressPercent: 100,
    status: "Selesai",
    email: "laila.munawar@gmail.com",
    notes: "Lulus ujian Matan Al-Jazariyyah dengan predikat Mumtaz.",
  },
  {
    id: "std-4",
    name: "Faisal Rahman",
    username: "@faisal_r",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    packageName: "Tartil Dasar",
    method: "Offline",
    dateRange: "28 Feb 2026 - 21 Mar 2026",
    completedSessions: 0,
    totalSessions: 4,
    progressPercent: 0,
    status: "Dibatalkan",
    email: "faisal.rahman@gmail.com",
    notes: "Dibatalkan atas permintaan santri karena kendala jadwal pekerjaan.",
  },
];

export function TeacherStudentsView({ teacherId = "1" }: { teacherId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredStudents = INITIAL_STUDENTS.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : item.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Murid Saya
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau perkembangan belajar dan setoran murid Anda
        </p>
      </div>

      {/* Top 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {/* Card 1: Total Murid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Total Murid
            </span>
            <GraduationCap className="size-4.5 text-blue-500 shrink-0" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            15
          </span>
        </div>

        {/* Card 2: Selesai */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Selesai
            </span>
            <BookOpen className="size-4.5 text-purple-500 shrink-0" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            3
          </span>
        </div>

        {/* Card 3: Aktif */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Aktif
            </span>
            <Clock className="size-4.5 text-emerald-500 shrink-0" />
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            10
          </span>
        </div>
      </div>

      {/* Search Bar & Filter Button */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search input with integrated green button on right */}
        <div className="flex items-center w-full max-w-sm sm:max-w-md shadow-2xs">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari murid, username, atau program..."
            className="h-10 w-full rounded-l-xl border border-r-0 border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button
            type="button"
            aria-label="Search"
            className="h-10 px-3.5 rounded-r-xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center cursor-pointer transition shadow-xs shrink-0"
          >
            <Search className="size-4" />
          </button>
        </div>

        {/* Filter Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60 flex items-center gap-2 cursor-pointer shadow-2xs focus:outline-none transition">
            <Filter className="size-3.5 text-gray-600 dark:text-gray-400" />
            <span>Filter</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1 bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800">
            <DropdownMenuItem
              onClick={() => setFilterStatus("all")}
              className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${filterStatus === "all" ? "font-bold text-[#00875a]" : ""}`}
            >
              Semua Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterStatus("aktif")}
              className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${filterStatus === "aktif" ? "font-bold text-[#00875a]" : ""}`}
            >
              Status: Aktif
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterStatus("selesai")}
              className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${filterStatus === "selesai" ? "font-bold text-[#00875a]" : ""}`}
            >
              Status: Selesai
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilterStatus("dibatalkan")}
              className={`text-xs px-3 py-2 rounded-lg cursor-pointer ${filterStatus === "dibatalkan" ? "font-bold text-[#00875a]" : ""}`}
            >
              Status: Dibatalkan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Students Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  MURID
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  PAKET
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  METODE
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  RENTANG WAKTU
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  PROGRES SESI
                </th>
                <th className="py-4 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/90 dark:divide-slate-800/80">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Murid Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                            {student.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                            {student.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Paket Column */}
                    <td className="py-4 px-4 text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {student.packageName}
                    </td>

                    {/* Metode Column */}
                    <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {student.method}
                    </td>

                    {/* Rentang Waktu Column */}
                    <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {student.dateRange}
                    </td>

                    {/* Progres Sesi Column */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5 min-w-[120px]">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-[#00875a]">
                            {student.completedSessions}/{student.totalSessions} SESI
                          </span>
                          <span className="text-gray-400 font-medium">
                            {student.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-[#00875a] rounded-full transition-all duration-300"
                            style={{ width: `${student.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {student.status === "Aktif" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                          Aktif
                        </span>
                      )}
                      {student.status === "Selesai" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Selesai
                        </span>
                      )}
                      {student.status === "Dibatalkan" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                          Dibatalkan
                        </span>
                      )}
                    </td>

                    {/* Aksi Column */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/${currentLocale}/teachers/${teacherId}/messages`)
                          }
                          aria-label={`Chat with ${student.name}`}
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
                        >
                          <MessageSquare className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDetailOpen(true);
                          }}
                          className="text-xs font-semibold text-[#00875a] hover:text-[#007a51] flex items-center gap-0.5 cursor-pointer transition"
                        >
                          <span>Detail</span>
                          <ChevronRight className="size-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-gray-400">
                    Tidak ada murid yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Murid Modal Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="size-5 text-[#00875a]" />
              Detail Informasi Murid
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-4 py-3 text-xs">
              {/* Profile Card */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-gray-400 text-xs">{selectedStudent.username}</p>
                  {selectedStudent.email && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{selectedStudent.email}</p>
                  )}
                </div>
                <div>
                  {selectedStudent.status === "Aktif" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
                      Aktif
                    </span>
                  )}
                  {selectedStudent.status === "Selesai" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                      Selesai
                    </span>
                  )}
                  {selectedStudent.status === "Dibatalkan" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                      Dibatalkan
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Program Belajar</span>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    {selectedStudent.packageName}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Metode Bimbingan</span>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    {selectedStudent.method}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Rentang Waktu</span>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                    {selectedStudent.dateRange}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Progres Sesi</span>
                  <p className="text-xs font-semibold text-[#00875a] mt-0.5">
                    {selectedStudent.completedSessions} dari {selectedStudent.totalSessions} sesi ({selectedStudent.progressPercent}%)
                  </p>
                </div>
              </div>

              {/* Catatan Tilawah / Guru */}
              {selectedStudent.notes && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                    Catatan Perkembangan Santri:
                  </span>
                  <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedStudent.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-gray-100 dark:border-slate-800">
            <Button
              onClick={() => setIsDetailOpen(false)}
              className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold px-5 cursor-pointer"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
