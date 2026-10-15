import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { RecitationPraQuranReader } from "@/components/recitation/recitation-praquran-reader";

export const metadata = {
  title: "Pra Quran Yanbu'a | Qurani",
  description: "Latihan dan setoran materi Pra Al-Qur'an kaidah Yanbu'a",
};

export default function PraQuranRecitationPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500">
                Memuat materi Yanbu&apos;a...
              </div>
            }
          >
            <RecitationPraQuranReader locale="en" />
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
