import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PendingPageClient } from "@/components/marketplace/teach/pending-page-client";

export const metadata = {
  title: "Status Pengajuan Pengajar | Qurani",
  description: "Pantau status kurasi berkas dan jadwal seleksi pengajar Qurani.",
};

export default function TeachersPendingPage() {
  return (
    <DashboardLayout>
      <PendingPageClient />
    </DashboardLayout>
  );
}
