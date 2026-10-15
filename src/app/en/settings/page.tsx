import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SettingsView } from "@/components/pages/settings-view";

export const metadata = {
  title: "Settings | Qurani",
  description: "Account settings and preferences for Qurani app",
};

export default function EnSettingsPage() {
  return (
    <DashboardLayout>
      <SettingsView />
    </DashboardLayout>
  );
}
