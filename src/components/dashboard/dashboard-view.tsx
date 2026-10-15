"use client";

import * as React from "react";
import { User, Users, Calendar, ChevronDown, Check } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { GroupCard } from "@/components/dashboard/group-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardView() {
  const [role, setRole] = React.useState<"reciter" | "recipient">("reciter");
  const [period, setPeriod] = React.useState("This month");

  const periods = [
    "Today",
    "This week",
    "This month",
    "Last month",
    "This year",
  ];

  return (
    <div className="flex-1 p-6 space-y-6 max-w-7xl w-full">
      {/* Dashboard Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dashboard
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {/* Reciter / Recipient Switcher */}
          <div className="flex items-center gap-1 bg-transparent">
            <button
              type="button"
              onClick={() => setRole("reciter")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                role === "reciter"
                  ? "bg-[#00875a] text-white hover:bg-[#007a51] shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <User className="size-4" />
              <span>Reciter</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("recipient")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                role === "recipient"
                  ? "bg-[#00875a] text-white hover:bg-[#007a51] shadow-2xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Users className="size-4" />
              <span>Recipient</span>
            </button>
          </div>

          {/* Period selector dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200/90 bg-white text-xs sm:text-sm shadow-2xs hover:bg-gray-50 transition focus:outline-none cursor-pointer">
              <Calendar className="size-4 text-gray-600" />
              <span className="text-gray-500 font-normal">Period:</span>
              <span className="font-medium text-gray-900">{period}</span>
              <ChevronDown className="size-3.5 text-gray-400 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border border-gray-100 shadow-md p-1"
            >
              {periods.map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 cursor-pointer rounded-lg"
                >
                  <span>{p}</span>
                  {period === p && (
                    <Check className="size-3.5 text-emerald-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <StatsCards />

      {/* 2 Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GroupCard />
        <ChartCard />
      </div>
    </div>
  );
}
