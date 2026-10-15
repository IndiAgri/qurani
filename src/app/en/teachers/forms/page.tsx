import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FormsPageClient } from "@/components/marketplace/teach/form-register";

export const metadata = {
  title: "Teacher Registration Form | Qurani",
  description: "Complete your profile, sanad certification, recitation sample, and schedule.",
};

export default function EnTeachersFormsPage() {
  return (
    <DashboardLayout>
      <FormsPageClient />
    </DashboardLayout>
  );
}
