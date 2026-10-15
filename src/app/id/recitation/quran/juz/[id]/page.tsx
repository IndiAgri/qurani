import { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { RecitationReader } from "@/components/recitation/recitation-reader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Setoran Qur'an Juz | Qurani",
  description: "Simak dan koreksi setoran bacaan Al-Qur'an per Juz",
};

export default async function RecitationJuzIdPage({ params }: PageProps) {
  const { id } = await params;
  const juzId = parseInt(id, 10) || 1;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white">
          <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8 text-sm text-gray-500">Memuat bacaan juz...</div>}>
            <RecitationReader juzId={juzId} mode="juz" locale="id" />
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
