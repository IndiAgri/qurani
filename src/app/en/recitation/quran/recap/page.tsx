import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { RecitationRecap } from "@/components/recitation/recitation-recap";

export const metadata = {
  title: "Recitation Recap | Qurani",
  description: "Rekapitulasi dan evaluasi hasil setoran bacaan Al-Qur'an",
};

export default function RecitationRecapPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Memuat rekap setoran...</div>}>
            <RecitationRecap locale="en" />
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
