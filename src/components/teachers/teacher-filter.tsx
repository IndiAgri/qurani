"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  Sparkles,
  Video,
  Home,
  Sunrise,
  Sun,
  Moon,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeacherFilterProps {
  learningMode: string;
  setLearningMode: (mode: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const methodsList = [
  "All Methods",
  "Ummi",
  "Tilawati",
  "Iqro",
  "Qiroati",
  "Yanbu'a",
  "Tartil",
  "Talaqqi",
];

const languagesList = [
  "All Languages",
  "Indonesia",
  "English",
  "Arabic",
  "Javanese",
  "Sundanese",
];

export function TeacherFilter({
  learningMode,
  setLearningMode,
  selectedTime,
  setSelectedTime,
  selectedMethod,
  setSelectedMethod,
  selectedLanguage,
  setSelectedLanguage,
  onReset,
  onApply,
}: TeacherFilterProps) {
  return (
    <div className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-800 tracking-wider">
        <SlidersHorizontal className="size-4 text-emerald-600" />
        <span>FILTER</span>
      </div>

      {/* 1. Learning Mode */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider">
          LEARNING MODE
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* All */}
          <button
            type="button"
            onClick={() => setLearningMode("All")}
            className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition cursor-pointer ${
              learningMode === "All"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="size-4 mb-1 text-emerald-500" />
            <span className="text-xs">All</span>
          </button>

          {/* Online */}
          <button
            type="button"
            onClick={() => setLearningMode("Online")}
            className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition cursor-pointer ${
              learningMode === "Online"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Video className="size-4 mb-1 text-gray-500" />
            <span className="text-xs">Online</span>
          </button>

          {/* Offline */}
          <button
            type="button"
            onClick={() => setLearningMode("Offline")}
            className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition cursor-pointer ${
              learningMode === "Offline"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home className="size-4 mb-1 text-gray-500" />
            <span className="text-xs">Offline</span>
          </button>
        </div>
      </div>

      {/* 2. Time */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider">
          TIME
        </span>
        <div className="grid grid-cols-3 gap-2">
          {/* Morning */}
          <button
            type="button"
            onClick={() => setSelectedTime(selectedTime === "morning" ? "" : "morning")}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition cursor-pointer ${
              selectedTime === "morning"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sunrise className="size-4 mb-1 text-gray-500" />
            <span className="text-xs">Morning</span>
          </button>

          {/* Afternoon */}
          <button
            type="button"
            onClick={() => setSelectedTime(selectedTime === "afternoon" ? "" : "afternoon")}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition cursor-pointer ${
              selectedTime === "afternoon"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sun className="size-4 mb-1 text-gray-500" />
            <span className="text-xs">Afternoon</span>
          </button>

          {/* Evening */}
          <button
            type="button"
            onClick={() => setSelectedTime(selectedTime === "night" ? "" : "night")}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition cursor-pointer ${
              selectedTime === "night"
                ? "border-2 border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold"
                : "border border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Moon className="size-4 mb-1 text-gray-500" />
            <span className="text-xs">Evening</span>
          </button>
        </div>
      </div>

      {/* 3. Method */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider">
          METHOD
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 text-xs text-gray-700 hover:bg-gray-100 transition focus:outline-none cursor-pointer">
            <span className={selectedMethod ? "font-medium text-gray-900" : "text-gray-500"}>
              {selectedMethod || "Select Method"}
            </span>
            <ChevronRight className="size-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-[200px] rounded-2xl border border-gray-100 shadow-lg p-1 max-h-56 overflow-y-auto"
          >
            {methodsList.map((method) => (
              <DropdownMenuItem
                key={method}
                onClick={() => setSelectedMethod(method === "All Methods" ? "" : method)}
                className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-xl"
              >
                <span>{method}</span>
                {((!selectedMethod && method === "All Methods") || selectedMethod === method) && (
                  <Check className="size-3.5 text-emerald-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 4. Language */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold text-gray-400 tracking-wider">
          LANGUAGE
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-gray-100 bg-gray-50/60 text-xs text-gray-700 hover:bg-gray-100 transition focus:outline-none cursor-pointer">
            <span className={selectedLanguage ? "font-medium text-gray-900" : "text-gray-500"}>
              {selectedLanguage || "Select Language"}
            </span>
            <ChevronRight className="size-4 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--anchor-width) min-w-[200px] rounded-2xl border border-gray-100 shadow-lg p-1 max-h-56 overflow-y-auto"
          >
            {languagesList.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => setSelectedLanguage(lang === "All Languages" ? "" : lang)}
                className="flex items-center justify-between text-xs px-3 py-2 cursor-pointer rounded-xl"
              >
                <span>{lang}</span>
                {((!selectedLanguage && lang === "All Languages") || selectedLanguage === lang) && (
                  <Check className="size-3.5 text-emerald-600" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-5 py-2 rounded-xl bg-[#00875a] hover:bg-[#00784f] text-white text-xs font-medium shadow-2xs transition cursor-pointer"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
