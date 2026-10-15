"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Settings2,
  CalendarDays,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface ScheduleSession {
  id: string;
  studentName: string;
  studentAvatar: string;
  packageName: string;
  date: string;
  timeRange: string;
  type: "Online" | "Tatap Muka";
  sessionNumber: number;
  totalSessions: number;
  completed: boolean;
  meetLink?: string;
}

const INITIAL_SCHEDULES: ScheduleSession[] = [
  {
    id: "sch-101",
    studentName: "Siti Rahmawati",
    studentAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    packageName: "Tahsin Intensif",
    date: "Hari Ini, 08 Feb 2026",
    timeRange: "08:00 - 09:00 WIB",
    type: "Online",
    sessionNumber: 3,
    totalSessions: 10,
    completed: false,
    meetLink: "https://meet.google.com/qurani-tahsin-live",
  },
  {
    id: "sch-102",
    studentName: "Ahmad Fauzi",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    packageName: "Tahfidz Pemula",
    date: "Hari Ini, 08 Feb 2026",
    timeRange: "10:30 - 11:30 WIB",
    type: "Online",
    sessionNumber: 8,
    totalSessions: 10,
    completed: false,
    meetLink: "https://meet.google.com/qurani-tahfidz-live",
  },
  {
    id: "sch-103",
    studentName: "Lailatul Munawaroh",
    studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    packageName: "Paket 5x Pertemuan",
    date: "Hari Ini, 08 Feb 2026",
    timeRange: "13:30 - 14:30 WIB",
    type: "Tatap Muka",
    sessionNumber: 1,
    totalSessions: 5,
    completed: false,
  },
  {
    id: "sch-104",
    studentName: "Faisal Rahman",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    packageName: "Tartil Dasar",
    date: "Besok, 09 Feb 2026",
    timeRange: "16:00 - 17:00 WIB",
    type: "Online",
    sessionNumber: 2,
    totalSessions: 8,
    completed: false,
    meetLink: "https://meet.google.com/qurani-tartil-live",
  },
  {
    id: "sch-105",
    studentName: "Nurul Hidayah",
    studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    packageName: "Tafsir Intensif",
    date: "Rabu, 11 Feb 2026",
    timeRange: "19:30 - 20:30 WIB",
    type: "Online",
    sessionNumber: 4,
    totalSessions: 8,
    completed: false,
    meetLink: "https://meet.google.com/qurani-tafsir-live",
  },
];

const DAYS_OF_WEEK = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export function TeacherSchedulesView({ teacherId = "1" }: { teacherId?: string }) {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/id") ? "id" : "en";
  const [schedules, setSchedules] = useState<ScheduleSession[]>(INITIAL_SCHEDULES);
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Sen, etc.
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const handleConfirm = (id: string, name: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s))
    );
    toast.success(`Sesi dengan ${name} berhasil dikonfirmasi selesai!`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Jadwal & Kalender Bimbingan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau sesi bimbingan harian dan kelola jam ketersediaan mengajar Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAvailabilityOpen(true)}
            variant="outline"
            className="rounded-xl border-gray-200 text-xs sm:text-sm h-10"
          >
            <Settings2 className="size-4 mr-1.5" />
            <span>Atur Ketersediaan</span>
          </Button>
        </div>
      </div>

      {/* Week Calendar Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Pekan Ini (Februari 2026)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day, idx) => {
            const dateNum = 8 + idx;
            const isSelected = selectedDay === idx;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(idx)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition cursor-pointer ${
                  isSelected
                    ? "bg-[#00875a] text-white shadow-sm"
                    : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                }`}
              >
                <span className="text-[11px] font-medium">{day}</span>
                <span className="text-base font-bold mt-0.5">{dateNum}</span>
                {idx < 3 && (
                  <span
                    className={`size-1.5 rounded-full mt-1.5 ${
                      isSelected ? "bg-white" : "bg-emerald-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Daftar Sesi Bimbingan
          </h2>
          <span className="text-xs text-gray-500">
            Total {schedules.length} sesi terjadwal
          </span>
        </div>

        <div className="space-y-3">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={item.studentAvatar}
                    alt={item.studentName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {item.studentName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        item.type === "Online"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                          : "bg-amber-50 text-amber-700 border border-amber-200/50"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.packageName} • Sesi ke-{item.sessionNumber} dari {item.totalSessions}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400 pt-0.5 font-medium">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      <span>{item.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      <span>{item.timeRange}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                {item.meetLink && !item.completed && (
                  <a
                    href={item.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-emerald-300 text-emerald-700 hover:bg-emerald-50 h-9 text-xs font-semibold cursor-pointer"
                    >
                      <Video className="size-3.5 mr-1" />
                      <span>Masuk Kelas</span>
                    </Button>
                  </a>
                )}

                <Button
                  size="sm"
                  disabled={item.completed}
                  onClick={() => handleConfirm(item.id, item.studentName)}
                  className={`rounded-xl text-xs font-semibold h-9 px-4 shadow-xs cursor-pointer transition ${
                    item.completed
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#00875a] hover:bg-[#007a51] text-white"
                  }`}
                >
                  {item.completed ? "Selesai" : "Konfirmasi Selesai"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Atur Ketersediaan */}
      <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Atur Jam Ketersediaan Mengajar
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-3 text-xs">
            <p className="text-gray-500">
              Pilih rentang jam di mana Anda siap menerima permintaan bimbingan santri:
            </p>
            {["Senin - Jumat", "Sabtu - Ahad"].map((slot, i) => (
              <div
                key={slot}
                className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">{slot}</span>
                  <span className="text-[11px] text-gray-500">08:00 - 21:00 WIB</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  Aktif
                </Badge>
              </div>
            ))}
          </div>

          <DialogFooter className="flex sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAvailabilityOpen(false)}
              className="rounded-xl text-xs"
            >
              Tutup
            </Button>
            <Button
              onClick={() => {
                setIsAvailabilityOpen(false);
                toast.success("Jadwal ketersediaan berhasil disimpan!");
              }}
              className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
