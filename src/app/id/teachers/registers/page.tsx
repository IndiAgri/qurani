import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { TeachLandingPage } from "@/components/marketplace/teach/teach-landing-page";

export const metadata = {
  title: "Daftar Jadi Guru Al-Qur'an | Qurani",
  description: "Bergabung menjadi mitra pengajar bersanad dan profesional di Qurani.",
};

export default function IdTeachersRegistersPage() {
  return (
    <DashboardLayout>
      <TeachLandingPage locale="id" />
    </DashboardLayout>
  );
}
