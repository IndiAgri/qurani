import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { QuraniSettingsView } from "@/components/pages/qurani-settings-view";

export const metadata = {
  title: "Qurani Settings | Qurani",
  description: "Configure Qurani layout, font type, font size, and recitation error categories",
};

export default function EnPengaturanQuraniPage() {
  return (
    <DashboardLayout showHeader={false}>
      <QuraniSettingsView />
    </DashboardLayout>
  );
}
