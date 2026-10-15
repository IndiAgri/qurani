"use client";

import * as React from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import { DUMMY_TRAINERS, type Trainer } from "@/data/trainers-data";
import { TeacherBanner } from "@/components/teachers/teacher-banner";
import { TeacherFilter } from "@/components/teachers/teacher-filter";
import { TeacherCard } from "@/components/teachers/teacher-card";

export function TeachersView() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [learningMode, setLearningMode] = React.useState("All");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [selectedMethod, setSelectedMethod] = React.useState("");
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Filtering
  const filteredTrainers = React.useMemo(() => {
    return DUMMY_TRAINERS.filter((t) => {
      // Search query (name, method, location)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(query);
        const matchesLocation = t.location.toLowerCase().includes(query);
        const matchesMethod = t.methods.some((m) =>
          m.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesLocation && !matchesMethod) return false;
      }

      // Learning mode
      if (learningMode === "Online" && t.teachingMode === "Offline") return false;
      if (learningMode === "Offline" && t.teachingMode === "Online") return false;

      // Time session
      if (selectedTime && !t.sessions.includes(selectedTime as any)) {
        return false;
      }

      // Method
      if (
        selectedMethod &&
        !t.methods.some(
          (m) => m.toLowerCase() === selectedMethod.toLowerCase()
        )
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, learningMode, selectedTime, selectedMethod]);

  const handleReset = () => {
    setSearchQuery("");
    setLearningMode("All");
    setSelectedTime("");
    setSelectedMethod("");
    setSelectedLanguage("");
  };

  return (
    <div className="flex-1 p-6 space-y-8 max-w-[1600px] w-full">
      {/* 1. Hero Carousel Banner */}
      <TeacherBanner />

      {/* 2. Section Header: Title & Search Bar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Quran Teachers <span className="text-[#00875a]">Professional</span>
        </h2>

        {/* Search bar & View mode toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center w-full sm:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, method, location"
                className="h-10 w-full rounded-l-2xl border border-r-0 border-gray-200/90 bg-white px-4 text-xs text-gray-800 placeholder:text-gray-400 shadow-2xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              aria-label="Search"
              className="h-10 px-4 rounded-r-2xl bg-[#00875a] hover:bg-[#007a51] text-white flex items-center justify-center transition shadow-2xs cursor-pointer"
            >
              <Search className="size-4" />
            </button>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center p-1 rounded-2xl border border-gray-200/90 bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List View"
              className={`p-1.5 rounded-xl transition cursor-pointer ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Filter Sidebar (Sticky) + Teachers Cards Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        {/* Sticky Filter Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 self-start z-10">
          <TeacherFilter
            learningMode={learningMode}
            setLearningMode={setLearningMode}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onReset={handleReset}
            onApply={() => {}}
          />
        </aside>

        {/* Teachers Cards List */}
        <div className="flex-1 min-w-0 w-full">
          {filteredTrainers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm">
                No teachers found matching your filters.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-4 py-2 rounded-xl bg-[#00875a] text-white text-xs font-medium cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredTrainers.map((trainer) => (
                <TeacherCard
                  key={trainer.id}
                  trainer={trainer}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
