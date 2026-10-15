import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { MarketplaceDetailPage } from "@/components/marketplace/detail/marketplace-detail-page";

export const metadata = {
  title: "Profile Teacher | Qurani",
  description: "Teacher detail and course booking - Qurani",
};

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#f8fafc]">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#f8fafc]">
          <DashboardHeader />
          <div className="flex-1 flex justify-center w-full">
            <div className="max-w-[1600px] w-full p-4 sm:p-6">
              <MarketplaceDetailPage id={id} />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
