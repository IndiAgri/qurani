import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { FriendsView } from "@/components/friends/friends-view";

export const metadata = {
  title: "Friends | Qurani",
  description: "Friends and connections - Qurani",
};

export default function FriendsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white">
          <DashboardHeader />
          <div className="flex-1 flex justify-center w-full bg-white">
            <FriendsView />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
