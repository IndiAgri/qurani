import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FormsPageClient } from "@/components/marketplace/teach/form-register";

export const metadata = {
  title: "Formulir Pendaftaran Pengajar | Qurani",
  description: "Lengkapi data diri, sanad, rekaman tilawah, dan jadwal bimbingan Anda.",
};

export default function TeachersFormsPage() {
  return (
    <DashboardLayout>
      <FormsPageClient />
    </DashboardLayout>
  );
}
