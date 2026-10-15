import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { InstallAppView } from "@/components/pages/install-app-view";

export const metadata = {
  title: "Install Qurani App | Mobile & Desktop",
  description: "Download and install Qurani app on Android, iOS, or desktop.",
};

export default function EnInstallAppPage() {
  return (
    <DashboardLayout>
      <InstallAppView />
    </DashboardLayout>
  );
}
