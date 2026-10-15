import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { QuraniSettingsView } from "@/components/pages/qurani-settings-view";

export const metadata = {
  title: "Qurani Settings | Qurani",
  description: "Pengaturan tampilan, layout, ukuran font, dan kategori evaluasi Qurani",
};

export default function PengaturanQuraniPage() {
  return (
    <DashboardLayout showHeader={false}>
      <QuraniSettingsView />
    </DashboardLayout>
  );
}
