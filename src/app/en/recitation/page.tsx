import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { RecitationView } from "@/components/recitation/recitation-view";

export const metadata = {
  title: "Recitation | Qurani",
  description: "Quran Recitation - Qurani",
};

export default function RecitationPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          <DashboardHeader />
          <main className="flex-1 flex justify-center w-full overflow-y-auto">
            <RecitationView />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
