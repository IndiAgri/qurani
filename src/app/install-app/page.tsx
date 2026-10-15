import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { InstallAppView } from "@/components/pages/install-app-view";

export const metadata = {
  title: "Pasang Aplikasi Qurani | Mobile & PWA",
  description: "Unduh dan instal aplikasi Qurani di Android, iOS, atau komputer desktop.",
};

export default function InstallAppPage() {
  return (
    <DashboardLayout>
      <InstallAppView />
    </DashboardLayout>
  );
}
