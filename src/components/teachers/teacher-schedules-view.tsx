"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Trash2,
  CalendarDays,
  Calendar,
  X,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SlotInfo {
  id: string;
  timeRange: string;
  type: string;
  status: "available" | "booked";
}

interface DayData {
  hasSession?: boolean;
  hasSlot?: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  slots?: SlotInfo[];
}

interface AvailabilityItem {
  id: string;
  type: "recurring" | "specific_date";
  title: string; // "SENIN", "RABU", or "31 DES 2026"
  mode: "ONLINE" | "TATAP MUKA";
  dateRangeText?: string; // e.g. "15 Okt 2026 - seterusnya"
  slots: string[];
}

const INITIAL_AVAILABILITIES: AvailabilityItem[] = [
  {
    id: "avail-1",
    type: "recurring",
    title: "SENIN",
    mode: "ONLINE",
    dateRangeText: "15 Okt 2026 - seterusnya",
    slots: ["16:00 - 17:00", "17:10 - 18:10", "18:20 - 19:20"],
  },
  {
    id: "avail-2",
    type: "recurring",
    title: "RABU",
    mode: "ONLINE",
    dateRangeText: "15 Okt 2026 - seterusnya",
    slots: ["13:00 - 14:00"],
  },
  {
    id: "avail-3",
    type: "specific_date",
    title: "31 DES 2026",
    mode: "ONLINE",
    slots: ["19:00 - 20:00", "20:00 - 21:00"],
  },
];

export function TeacherSchedulesView({ teacherId = "1" }: { teacherId?: string }) {
  const [activeTab, setActiveTab] = useState<"jadwal" | "ketersediaan" | "libur">("jadwal");

  // Calendar navigation state (defaults to October 2026 as shown in reference)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState("2026-10-15"); // Format: YYYY-MM-DD

  // Mock schedule data mapped by "YYYY-MM-DD"
  const [scheduleData] = useState<Record<string, DayData>>({
    "2026-10-19": {
      hasSlot: true,
      slots: [
        {
          id: "slot-1",
          timeRange: "08:00 - 09:00 WIB",
          type: "Online (Google Meet)",
          status: "available",
        },
      ],
    },
    "2026-10-21": {
      hasSlot: true,
      slots: [
        {
          id: "slot-2",
          timeRange: "10:00 - 11:00 WIB",
          type: "Online (Google Meet)",
          status: "available",
        },
      ],
    },
  });

  // Availabilities list (Tab Ketersediaan) matching original website
  const [availabilities, setAvailabilities] = useState<AvailabilityItem[]>(INITIAL_AVAILABILITIES);

  // Modal State for Add / Edit Availability
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<"recurring" | "specific_date">("recurring");
  const [formTitle, setFormTitle] = useState("SENIN");
  const [formMode, setFormMode] = useState<"ONLINE" | "TATAP MUKA">("ONLINE");
  const [formDateRange, setFormDateRange] = useState("15 Okt 2026 - seterusnya");
  const [formSlots, setFormSlots] = useState<string[]>(["08:00 - 09:00"]);
  const [newSlotStart, setNewSlotStart] = useState("09:00");
  const [newSlotEnd, setNewSlotEnd] = useState("10:00");

  // Holidays list (Tab Libur)
  const [holidays, setHolidays] = useState([
    { id: "h-1", date: "2026-10-29", name: "Maulid Nabi Muhammad SAW" },
    { id: "h-2", date: "2026-12-25", name: "Hari Libur Nasional" },
  ]);

  const monthNamesId = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const daysHeader = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];

  // Helper to format date to Indonesian title e.g. "Kamis, 15 Okt 2026"
  const formatSelectedDateTitle = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
      const shortMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      return `${dayNames[dateObj.getDay()]}, ${day} ${shortMonths[month - 1]} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate("2026-10-15");
  };

  // Build calendar matrix (Sunday to Saturday)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, ...
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  interface CalendarCell {
    dayNum: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }

  const calendarCells: CalendarCell[] = [];

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = currentMonth === 0 ? 12 : currentMonth;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    calendarCells.push({
      dayNum,
      isCurrentMonth: false,
      dateStr,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({
      dayNum: d,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Next month leading days to complete full 35 or 42 grid cells
  const remainingCells = 35 - calendarCells.length;
  const targetTotal = remainingCells >= 0 ? 35 : 42;
  const toAdd = targetTotal - calendarCells.length;
  for (let n = 1; n <= toAdd; n++) {
    const nextMonth = currentMonth === 11 ? 1 : currentMonth + 2;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
    calendarCells.push({
      dayNum: n,
      isCurrentMonth: false,
      dateStr,
    });
  }

  const selectedDayData = scheduleData[selectedDate];

  // Actions for Availability Items
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormType("recurring");
    setFormTitle("SENIN");
    setFormMode("ONLINE");
    setFormDateRange("15 Okt 2026 - seterusnya");
    setFormSlots(["08:00 - 09:00", "09:30 - 10:30"]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AvailabilityItem) => {
    setEditingId(item.id);
    setFormType(item.type);
    setFormTitle(item.title);
    setFormMode(item.mode);
    setFormDateRange(item.dateRangeText || "");
    setFormSlots([...item.slots]);
    setIsModalOpen(true);
  };

  const handleDeleteAvailability = (id: string) => {
    setAvailabilities((prev) => prev.filter((item) => item.id !== id));
    toast.success("Ketersediaan berhasil dihapus");
  };

  const handleSaveAvailability = () => {
    if (editingId) {
      setAvailabilities((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                type: formType,
                title: formTitle,
                mode: formMode,
                dateRangeText: formType === "recurring" ? formDateRange : undefined,
                slots: formSlots,
              }
            : item
        )
      );
      toast.success("Jadwal ketersediaan berhasil diperbarui!");
    } else {
      const newItem: AvailabilityItem = {
        id: `avail-${Date.now()}`,
        type: formType,
        title: formTitle,
        mode: formMode,
        dateRangeText: formType === "recurring" ? formDateRange : undefined,
        slots: formSlots,
      };
      setAvailabilities((prev) => [...prev, newItem]);
      toast.success("Jadwal ketersediaan berhasil ditambahkan!");
    }
    setIsModalOpen(false);
  };

  const handleAddSlot = () => {
    if (!newSlotStart || !newSlotEnd) return;
    const slotString = `${newSlotStart} - ${newSlotEnd}`;
    if (!formSlots.includes(slotString)) {
      setFormSlots([...formSlots, slotString]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    setFormSlots(formSlots.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full px-6 lg:px-8 py-6 font-sans">
      {/* Header: Title & Subtitle */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Jadwal Saya
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Atur jadwal, ketersediaan, dan hari libur mengajar Anda
        </p>
      </div>

      {/* Top Tabs Switcher */}
      <div className="inline-flex items-center gap-1 p-1 bg-gray-100/70 dark:bg-slate-800/60 rounded-2xl border border-gray-200/50 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("jadwal")}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "jadwal"
              ? "bg-[#00875a] text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Jadwal
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ketersediaan")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === "ketersediaan"
              ? "bg-[#00875a] text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Ketersediaan
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("libur")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
            activeTab === "libur"
              ? "bg-[#00875a] text-white shadow-xs"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Libur
        </button>
      </div>

      {/* Tab 1: Jadwal */}
      {activeTab === "jadwal" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Selected Day Details Card */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xs flex flex-col min-h-[380px] lg:min-h-[460px]">
              {/* Day Header */}
              <div className="border-b border-gray-100/80 dark:border-slate-800/80 pb-4">
                <h3 className="text-lg font-bold text-[#00875a]">
                  {formatSelectedDateTitle(selectedDate)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedDayData?.slots?.length
                    ? `${selectedDayData.slots.length} slot tersedia hari ini`
                    : "Tidak ada sesi hari ini"}
                </p>
              </div>

              {/* Day Content */}
              {selectedDayData?.slots?.length ? (
                <div className="space-y-3 py-6 flex-1">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Daftar Slot Bimbingan:
                  </div>
                  {selectedDayData.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                          {slot.timeRange}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          Tersedia
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {slot.type}
                      </p>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button
                      onClick={() => toast.success("Slot bimbingan siap menerima santri!")}
                      className="w-full bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold h-9 shadow-xs"
                    >
                      Atur Ulang Slot
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty state matching original screenshot */
                <div className="flex flex-col items-center justify-center text-center my-auto py-12 flex-1">
                  <div className="size-14 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-gray-400 mb-3 shadow-2xs">
                    <CalendarIcon className="size-7 text-gray-400 stroke-[1.4]" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Jadwal Belum Diatur
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[210px] leading-relaxed">
                    Anda belum mengatur jadwal mengajar untuk hari ini.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Monthly Calendar Grid Card */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-xs">
              {/* Calendar Top Control Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
                {/* Month Navigator */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    aria-label="Previous Month"
                    className="p-1.5 rounded-xl border border-gray-200/90 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="text-base font-bold text-gray-900 dark:text-white min-w-[130px] text-center">
                    {monthNamesId[currentMonth]} {currentYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    aria-label="Next Month"
                    className="p-1.5 rounded-xl border border-gray-200/90 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                {/* Legend & 'Hari ini' Button */}
                <div className="flex items-center flex-wrap gap-4 sm:gap-5">
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      Ada sesi
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                      Tersedia
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                      Libur
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToday}
                    className="px-3.5 py-1.5 rounded-xl border border-gray-200/90 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Hari ini
                  </button>
                </div>
              </div>

              {/* Calendar Grid Table */}
              <div className="border-t border-gray-100 dark:border-slate-800">
                {/* Header Row (MIN, SEN, SEL, RAB, KAM, JUM, SAB) */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-800">
                  {daysHeader.map((d) => (
                    <div
                      key={d}
                      className="py-2.5 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500 tracking-wider"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-gray-100/90 dark:divide-slate-800 border-b border-r border-gray-100/90 dark:border-slate-800">
                  {calendarCells.map((cell, idx) => {
                    const isSelected = selectedDate === cell.dateStr;
                    const cellData = scheduleData[cell.dateStr];
                    const hasSlot = cellData?.hasSlot;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        className={`h-20 sm:h-22 p-1.5 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? "border-2 border-[#00875a] bg-emerald-50/20 dark:bg-emerald-950/20 rounded-xl z-10"
                            : "hover:bg-gray-50/60 dark:hover:bg-slate-800/40"
                        } ${!cell.isCurrentMonth ? "opacity-40" : ""}`}
                      >
                        {/* Day Number */}
                        <div className="flex justify-center items-center">
                          {isSelected ? (
                            <span className="size-7 rounded-full bg-[#00875a] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {cell.dayNum}
                            </span>
                          ) : (
                            <span
                              className={`text-xs font-medium ${
                                cell.isCurrentMonth
                                  ? "text-gray-800 dark:text-gray-200"
                                  : "text-gray-400 dark:text-gray-600"
                              }`}
                            >
                              {cell.dayNum}
                            </span>
                          )}
                        </div>

                        {/* Slot Badge */}
                        <div className="flex flex-col items-center gap-1 mt-auto pb-1">
                          {hasSlot && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-medium border border-blue-100/80 dark:border-blue-800/50">
                              <span className="size-1 rounded-full bg-blue-500" />
                              1 slot
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ketersediaan (Matching original web screenshot 100%) */}
      {activeTab === "ketersediaan" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Card Top Header */}
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Atur Ketersediaan
            </h2>
            <Button
              onClick={handleOpenAddModal}
              className="bg-[#00875a] hover:bg-[#007a51] text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm h-9 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Tambah</span>
            </Button>
          </div>

          {/* Availability Cards 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {availabilities.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between p-4 pb-3">
                    {item.type === "specific_date" ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-[#00875a]">
                        <Calendar className="size-3.5 text-[#00875a] shrink-0" />
                        <span>{item.title}</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#00875a] tracking-wide">
                        {item.title}
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-blue-600 bg-blue-50/90 dark:bg-blue-950/40 border border-blue-100/70 dark:border-blue-900/40 tracking-wider">
                      {item.mode}
                    </span>
                  </div>

                  {/* Banner for recurring date range (e.g. 15 Okt 2026 - seterusnya) */}
                  {item.dateRangeText && (
                    <div className="mx-4 mb-3 p-2 rounded-lg bg-[#fffbeb] border border-[#fef08a] dark:bg-amber-950/20 dark:border-amber-900/40 flex items-center gap-2 text-[11px] font-medium text-[#b45309] dark:text-amber-300">
                      <CalendarDays className="size-3.5 shrink-0" />
                      <span>{item.dateRangeText}</span>
                    </div>
                  )}

                  {/* Time Slots Grid (2 columns) */}
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-2.5">
                      {item.slots.map((slot, idx) => (
                        <div
                          key={idx}
                          className="border border-gray-200/90 dark:border-slate-700/80 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 text-center bg-white dark:bg-slate-800/80 shadow-2xs"
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-gray-100/90 dark:border-slate-800 p-3 px-4 flex items-center justify-end gap-2 bg-transparent mt-auto">
                  <button
                    type="button"
                    onClick={() => handleDeleteAvailability(item.id)}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="text-xs font-semibold text-white bg-[#00875a] hover:bg-[#007a51] px-4 py-1.5 rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    Ubah
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Libur */}
      {activeTab === "libur" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Daftar Hari Libur & Cuti Mengajar
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Pada tanggal libur yang Anda tetapkan, santri tidak dapat memesan sesi bimbingan.
              </p>
            </div>
            <Button
              onClick={() => {
                const datePrompt = prompt("Masukkan tanggal libur (YYYY-MM-DD):", "2026-11-01");
                const namePrompt = prompt("Keterangan libur:", "Cuti Khusus");
                if (datePrompt && namePrompt) {
                  setHolidays([...holidays, { id: `h-${Date.now()}`, date: datePrompt, name: namePrompt }]);
                  toast.success("Hari libur berhasil ditambahkan!");
                }
              }}
              className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold px-4 h-9 shadow-xs cursor-pointer"
            >
              <Plus className="size-4 mr-1.5" />
              <span>Tambah Hari Libur</span>
            </Button>
          </div>

          <div className="space-y-3">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/70 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="size-2.5 rounded-full bg-rose-500" />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                      {h.name}
                    </h5>
                    <p className="text-xs text-gray-500 mt-0.5">{h.date}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHolidays(holidays.filter((item) => item.id !== h.id));
                    toast.success("Hari libur dihapus");
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Dialog for Add / Edit Availability */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {editingId ? "Ubah Ketersediaan Mengajar" : "Tambah Ketersediaan Mengajar"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3 text-xs">
            {/* Tipe Ketersediaan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Tipe Ketersediaan
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormType("recurring");
                    setFormTitle("SENIN");
                  }}
                  className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    formType === "recurring"
                      ? "border-[#00875a] bg-emerald-50/50 text-[#00875a]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Hari Rutin Mingguan
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType("specific_date");
                    setFormTitle("31 DES 2026");
                  }}
                  className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    formType === "specific_date"
                      ? "border-[#00875a] bg-emerald-50/50 text-[#00875a]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Tanggal Spesifik
                </button>
              </div>
            </div>

            {/* Title / Day / Date */}
            {formType === "recurring" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Pilih Hari
                </label>
                <select
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU", "AHAD"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Tanggal Spesifik (Contoh: 31 DES 2026)
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="31 DES 2026"
                  className="rounded-xl border-gray-200 text-xs"
                />
              </div>
            )}

            {/* Mode: ONLINE / TATAP MUKA */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Mode Bimbingan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["ONLINE", "TATAP MUKA"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormMode(m)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      formMode === m
                        ? "border-blue-500 bg-blue-50/50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Periode text (if recurring) */}
            {formType === "recurring" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Keterangan Periode
                </label>
                <Input
                  value={formDateRange}
                  onChange={(e) => setFormDateRange(e.target.value)}
                  placeholder="15 Okt 2026 - seterusnya"
                  className="rounded-xl border-gray-200 text-xs"
                />
              </div>
            )}

            {/* Time Slots List */}
            <div className="space-y-2 pt-1 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Daftar Slot Jam:
              </label>
              <div className="flex flex-wrap gap-2">
                {formSlots.map((slot, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 dark:bg-slate-800 text-xs font-semibold text-gray-800 dark:text-gray-200"
                  >
                    <span>{slot}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add slot input */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="time"
                  value={newSlotStart}
                  onChange={(e) => setNewSlotStart(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="time"
                  value={newSlotEnd}
                  onChange={(e) => setNewSlotEnd(e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-medium"
                />
                <Button
                  type="button"
                  onClick={handleAddSlot}
                  variant="outline"
                  className="rounded-lg text-xs h-8 px-3 cursor-pointer"
                >
                  + Tambah Slot
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-gray-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl text-xs cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={handleSaveAvailability}
              className="bg-[#00875a] hover:bg-[#007a51] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Simpan Ketersediaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
