"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

export function ChartCard() {
  return (
    <Card className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[350px]">
      <div>
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          Top Recitation Type
        </h3>
      </div>

      {/* Chart graphic */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <div className="relative w-full h-48 pl-6 pr-2">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-6 w-5 flex flex-col justify-between text-xs text-gray-600 font-normal select-none">
            <span className="text-right">4</span>
            <span className="text-right">3</span>
            <span className="text-right">2</span>
            <span className="text-right">1</span>
            <span className="text-right">0</span>
          </div>

          {/* Grid lines container */}
          <div className="relative w-full h-full flex flex-col justify-between pb-6">
            {/* Level 4 line */}
            <div className="w-full border-t border-dashed border-gray-300 h-0" />
            {/* Level 3 line */}
            <div className="w-full border-t border-dashed border-gray-300 h-0" />
            {/* Level 2 line */}
            <div className="w-full border-t border-dashed border-gray-300 h-0" />
            {/* Level 1 line */}
            <div className="w-full border-t border-dashed border-gray-300 h-0" />
            {/* Level 0 solid line */}
            <div className="w-full border-t border-solid border-gray-400 h-0" />

            {/* Vertical dotted guide in center */}
            <div className="absolute left-1/2 top-0 bottom-6 w-0 border-l border-dashed border-gray-300 pointer-events-none" />

            {/* X Axis Label */}
            <div className="absolute bottom-0 inset-x-0 flex justify-center text-xs text-gray-600 font-normal select-none">
              Oct 2026
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-xs bg-[#00bba6]" />
            <span className="text-xs font-medium text-[#00bba6]">Juz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-xs bg-[#f97316]" />
            <span className="text-xs font-medium text-[#f97316]">Page</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-xs bg-[#3b82f6]" />
            <span className="text-xs font-medium text-[#3b82f6]">Surah</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
