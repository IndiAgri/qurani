import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { DashboardHeader } from "@/components/layouts/header";
import { MarketplaceChatPage } from "@/components/marketplace/chat/marketplace-chat-page";

export const metadata = {
  title: "Messages | Qurani",
  description: "Chat and Messages - Qurani Islamic Learning Platform",
};

export default function ChatDetailPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-white">
          <DashboardHeader />
          <main className="flex-1 flex w-full bg-white overflow-hidden">
            <MarketplaceChatPage />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
