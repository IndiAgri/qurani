import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { MarketplaceMainPage } from "@/components/marketplace/main/marketplace-main-page";

export const metadata = {
  title: "Teacher | Qurani",
  description: "Quran Teachers Professional - Qurani",
};

export default function TeachersPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          <DashboardHeader />
          <div className="flex-1 flex justify-center w-full">
            <div className="max-w-[1600px] w-full p-4 sm:p-6">
              <MarketplaceMainPage />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
