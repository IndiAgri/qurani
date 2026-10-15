import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { RecitationReader } from "@/components/recitation/recitation-reader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Recitation Quran | Qurani",
  description: "Simak dan koreksi setoran bacaan Al-Qur'an",
};

export default async function RecitationQuranPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id, 10) || 1;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500">Memuat bacaan surah...</div>}>
            <RecitationReader surahId={surahId} locale="en" />
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
