import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SupportView } from "@/components/pages/support-view";

export const metadata = {
  title: "Support & Help Center | Qurani",
  description: "Customer support center and FAQs for Qurani app.",
};

export default function EnSupportPage() {
  return (
    <DashboardLayout>
      <SupportView />
    </DashboardLayout>
  );
}
