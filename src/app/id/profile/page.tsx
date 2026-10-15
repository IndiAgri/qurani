import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProfileView } from "@/components/pages/profile-view";

export const metadata = {
  title: "Profil Pengguna | Qurani",
  description: "Kelola informasi profil santri Qurani",
};

export default function IdProfilePage() {
  return (
    <DashboardLayout>
      <ProfileView />
    </DashboardLayout>
  );
}
