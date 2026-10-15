import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { AboutView } from "@/components/pages/about-view";

export const metadata = {
  title: "Tentang Qurani | Platform Edukasi Al-Qur'an",
  description: "Kenali lebih dekat misi, visi, dan keunggulan ekosistem Qurani.",
};

export default function AboutPage() {
  return (
    <DashboardLayout>
      <AboutView />
    </DashboardLayout>
  );
}
