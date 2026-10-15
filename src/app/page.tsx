"use client";

import * as React from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { LandingView } from "@/components/landing/landing-view";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#e6f4f1] flex flex-col items-center justify-center gap-2">
        <Loader2 className="size-8 animate-spin text-[#00875a]" />
        <span className="text-xs text-gray-500 font-medium">Memuat Qurani...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingView locale="en" />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          <DashboardHeader />
          <main className="flex-1 flex justify-center w-full overflow-y-auto">
            <DashboardView />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
