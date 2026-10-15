import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AboutView } from "@/components/pages/about-view";

export const metadata = {
  title: "About Qurani | Quran Learning Platform",
  description: "Learn more about Qurani's mission, vision, and ecosystem.",
};

export default function EnAboutPage() {
  return (
    <DashboardLayout>
      <AboutView />
    </DashboardLayout>
  );
}
