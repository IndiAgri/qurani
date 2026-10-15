import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { TeachLandingPage } from "@/components/marketplace/teach/teach-landing-page";

export const metadata = {
  title: "Teach on Qurani | Become a Quran Teacher",
  description: "Join Qurani as a verified professional Quran teacher.",
};

export default function EnTeachersRegistersPage() {
  return (
    <DashboardLayout>
      <TeachLandingPage locale="en" />
    </DashboardLayout>
  );
}
