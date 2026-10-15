import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { ProfileView } from "@/components/pages/profile-view";

export const metadata = {
  title: "User Profile | Qurani",
  description: "Manage your Qurani user profile",
};

export default function EnProfilePage() {
  return (
    <DashboardLayout>
      <ProfileView />
    </DashboardLayout>
  );
}
