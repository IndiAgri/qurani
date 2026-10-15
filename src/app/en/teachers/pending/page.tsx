import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PendingPageClient } from "@/components/marketplace/teach/pending-page-client";

export const metadata = {
  title: "Teacher Application Status | Qurani",
  description: "Track your curation status and interview schedule for Qurani teaching.",
};

export default function EnTeachersPendingPage() {
  return (
    <DashboardLayout>
      <PendingPageClient />
    </DashboardLayout>
  );
}
