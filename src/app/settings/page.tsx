import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SettingsView } from "@/components/pages/settings-view";

export const metadata = {
  title: "Pengaturan | Qurani",
  description: "Pengaturan akun dan preferensi aplikasi Qurani",
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsView />
    </DashboardLayout>
  );
}
