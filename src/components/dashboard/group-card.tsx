"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";

export function GroupCard() {
  return (
    <Card className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[350px]">
      <div>
        <h3 className="text-base font-bold text-gray-900 tracking-tight">
          Top Recitation Group
        </h3>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center my-12">
        <p className="text-sm font-medium text-gray-400 text-center">
          No deposit group data
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          for the selected period
        </p>
      </div>
    </Card>
  );
}
