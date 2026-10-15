import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SupportView } from "@/components/pages/support-view";

export const metadata = {
  title: "Bantuan & Dukungan | Qurani",
  description: "Pusat bantuan pelanggan dan FAQ seputar aplikasi Qurani.",
};

export default function SupportPage() {
  return (
    <DashboardLayout>
      <SupportView />
    </DashboardLayout>
  );
}
