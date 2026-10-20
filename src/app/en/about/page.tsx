import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AboutView } from "@/components/pages/about-view";

export const metadata = {
  title: "About | Qurani",
  description: "Modern Quran application - Read, listen, and learn the Holy Quran with advanced features and beautiful interface",
};

export default function EnAboutPage() {
  return (
    <DashboardLayout>
      <AboutView />
    </DashboardLayout>
  );
}
