"use client";

import * as React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { RecitationNotificationPopup } from "@/components/notifications/recitation-notification-popup";

export function DashboardLayout({
  children,
  showHeader = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          {showHeader && <DashboardHeader />}
          <main className="flex-1 w-full bg-[#f8fafc]">
            {children}
          </main>
        </SidebarInset>
        <RecitationNotificationPopup />
      </div>
    </SidebarProvider>
  );
}
