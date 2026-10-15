"use client";

import * as React from "react";
import { BookOpen, Users, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  title: string;
  value: string | number;
  icon: React.ElementType;
  badgeBg: string;
  badgeTextColor: string;
}

const stats: StatItem[] = [
  {
    title: "Recitations This Month",
    value: 0,
    icon: BookOpen,
    badgeBg: "bg-blue-50",
    badgeTextColor: "text-blue-500",
  },
  {
    title: "Recipient Bulan Ini",
    value: 0,
    icon: Users,
    badgeBg: "bg-emerald-50",
    badgeTextColor: "text-emerald-500",
  },
  {
    title: "Recitation today",
    value: 0,
    icon: BarChart2,
    badgeBg: "bg-purple-50",
    badgeTextColor: "text-purple-500",
  },
  {
    title: "Popular surah",
    value: "-",
    icon: BarChart2,
    badgeBg: "bg-orange-50",
    badgeTextColor: "text-orange-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-normal text-gray-600 mb-2">
                  {item.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  {item.value}
                </p>
              </div>
              <div
                className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${item.badgeBg} ${item.badgeTextColor}`}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
