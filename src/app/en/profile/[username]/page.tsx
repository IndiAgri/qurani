import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { UserPublicProfileView } from "@/components/profile/user-public-profile";

export const metadata = {
  title: "User Profile | Qurani",
  description: "User profile Qurani - Islamic Social Media Platform",
};

export default async function EnUserProfilePage({
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
