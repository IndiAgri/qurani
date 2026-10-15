import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { UserPublicProfileView } from "@/components/profile/user-public-profile";

export const metadata = {
  title: "User Profile | Qurani",
  description: "Profil pengguna Qurani - Islamic Social Media Platform",
};

export default async function IdUserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <DashboardLayout>
      <UserPublicProfileView username={username} />
    </DashboardLayout>
  );
}
