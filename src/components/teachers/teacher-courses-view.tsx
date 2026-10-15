"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Eye,
  Users,
  Star,
  Search,
  Plus,
  MoreVertical,
  Clock,
  Calendar,
  Award,
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
import { toast } from "sonner";

interface CourseItem {
  id: string;
  title: string;
  image: string;
  isPublic: boolean;
  tags: string[];
  studentsCount: number;
  durationMinutes: number;
  sessionsCount: number;
  hasSpecialBadge?: boolean;
}

export function TeacherCoursesView({ teacherId = "1" }: { teacherId?: string }) {
  const [activeTab, setActiveTab] = useState<"paket" | "ulasan">("paket");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "Tahfidz",
    level: "Pemula",
    durationMinutes: 60,
    sessionsCount: 8,
  });

  const [courses, setCourses] = useState<CourseItem[]>([
    {
      id: "crs-1",
      title: "Tahfidz Pemula",
      image: "https://images.unsplash.com/photo-1584281722573-b6f7f2b963bf?auto=format&fit=crop&w=600&q=80",
      isPublic: true,
      tags: ["Tahfidz", "Pemula"],
      studentsCount: 20,
      durationMinutes: 60,
      sessionsCount: 4,
    },
    {
      id: "crs-2",
      title: "Tahfidz Intensif",
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80",
      isPublic: true,
      tags: ["Tahfidz", "Pemula"],
      studentsCount: 17,
      durationMinutes: 60,
      sessionsCount: 8,
    },
    {
      id: "crs-3",
      title: "Tahfidz Mahir",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
      isPublic: true,
      tags: ["Tahfidz", "Pemula"],
      studentsCount: 21,
      durationMinutes: 60,
      sessionsCount: 12,
      hasSpecialBadge: true,
    },
  ]);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) {
      toast.error("Nama kursus harus diisi");
      return;
    }

    const created: CourseItem = {
      id: `crs-${Date.now()}`,
      title: newCourse.title.trim(),
      image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80",
      isPublic: true,
      tags: [newCourse.category, newCourse.level],
      studentsCount: 0,
      durationMinutes: Number(newCourse.durationMinutes) || 60,
      sessionsCount: Number(newCourse.sessionsCount) || 8,
    };

    setCourses((prev) => [created, ...prev]);
    setIsCreateOpen(false);
    setNewCourse({
      title: "",
      category: "Tahfidz",
      level: "Pemula",
      durationMinutes: 60,
      sessionsCount: 8,
    });
    toast.success("Kursus baru berhasil dibuat!");
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans space-y-6 sm:space-y-8">
      {/* Top Header: Kursus Saya & + Buat Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Kursus Saya
        </h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#00875a] hover:bg-[#007a51] text-white font-semibold rounded-xl px-5 h-10 text-sm shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
        >
          <Plus className="size-4" />
          <span>Buat</span>
        </Button>
      </div>

      {/* 4 Stat Cards in a row matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Kursus */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Kursus</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <BookOpen className="size-5" />
          </div>
        </div>

        {/* Card 2: Kursus Publik */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Kursus Publik</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          </div>
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Eye className="size-5" />
          </div>
        </div>

        {/* Card 3: Total Murid */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Murid</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">58</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Users className="size-5" />
          </div>
        </div>

        {/* Card 4: Rata-rata Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Rata-rata Rating</span>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">4.3</p>
          </div>
          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400">
            <Star className="size-5" />
          </div>
        </div>
      </div>

      {/* Sub Tabs: Paket Belajar & Ulasan */}
      <div className="border-b border-gray-200/80 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("paket")}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === "paket"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <span>Paket Belajar</span>
            {activeTab === "paket" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#00875a]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ulasan")}
            className={`pb-3 text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === "ulasan"
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
          >
            <span>Ulasan</span>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              11
            </span>
            {activeTab === "ulasan" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#00875a]" />
            )}
          </button>
        </div>
      </div>

      {/* Search Input Row with attached green button */}
      <div className="flex items-center max-w-sm">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari kursus..."
          className="h-10 rounded-l-xl rounded-r-none border-r-0 border-gray-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 placeholder:text-gray-400 shadow-2xs focus-visible:ring-emerald-500"
        />
        <Button
          type="button"
          size="icon"
          className="size-10 rounded-l-none rounded-r-xl bg-[#00875a] hover:bg-[#007a51] text-white shrink-0 cursor-pointer shadow-xs"
        >
          <Search className="size-4" />
        </Button>
      </div>

      {/* Course Cards Grid */}
      {activeTab === "paket" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col transition-all hover:shadow-md group pb-2.5"
            >
              {/* Image thumbnail with badges */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                {/* Top left badge: Publik */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Publik</span>
                  </span>
                </div>

                {/* Top right: Three dots menu */}
                <button
                  type="button"
                  className="absolute top-3 right-3 size-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition cursor-pointer"
                >
                  <MoreVertical className="size-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-start gap-3">
                  {/* Big Square Book Icon */}
                  <div className="size-11 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen className="size-5" />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {course.hasSpecialBadge && (
                        <div className="size-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <Award className="size-3" />
                        </div>
                      )}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {course.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer metadata with colorful icons */}
                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-emerald-500" />
                    <span>{course.studentsCount} Murid</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-blue-500" />
                    <span>{course.durationMinutes} mnt</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-500" />
                    <span>{course.sessionsCount} sesi</span>
                  </span>
                </div>
              </div>

              {/* Bottom pill indicator accent */}
              <div className="w-10 h-1 bg-[#00875a] rounded-full mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        /* Ulasan Tab Content */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Ulasan dari Santri</h3>
          <div className="space-y-3">
            {[
              {
                name: "Fatkul Huda",
                rating: 5,
                comment: "Metode bimbingan Ustadz Rafi sangat terstruktur dan mudah dipahami. Bacaan tajwid saya meningkat pesat.",
                time: "2 hari yang lalu",
              },
              {
                name: "Ahmad Zaki",
                rating: 5,
                comment: "Sangat sabar dan teliti dalam membetulkan makhraj huruf. Recommended banget!",
                time: "1 minggu yang lalu",
              },
              {
                name: "Siti Sarah",
                rating: 4,
                comment: "Waktu belajar fleksibel dan bimbingannya sangat ramah.",
                time: "2 minggu yang lalu",
              },
            ].map((rev, i) => (
              <div key={i} className="p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{rev.name}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} className="size-3 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-gray-400 block">{rev.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Buat Kursus Baru */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Buat Kursus Baru
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateCourse} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Nama Kursus
              </label>
              <Input
                required
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="Contoh: Tahfidz Intensif Juz 30"
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Kategori
                </label>
                <Input
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Tingkat
                </label>
                <Input
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Durasi per Sesi (menit)
                </label>
                <Input
                  type="number"
                  value={newCourse.durationMinutes}
                  onChange={(e) => setNewCourse({ ...newCourse, durationMinutes: Number(e.target.value) })}
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Jumlah Sesi
                </label>
                <Input
                  type="number"
                  value={newCourse.sessionsCount}
                  onChange={(e) => setNewCourse({ ...newCourse, sessionsCount: Number(e.target.value) })}
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl cursor-pointer"
              >
                Simpan & Terbitkan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
