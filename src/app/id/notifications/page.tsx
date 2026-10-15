import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { NotificationsView } from "@/components/pages/notifications-view";

export const metadata = {
  title: "Notifikasi | Qurani",
  description: "Daftar notifikasi setoran dan aktivitas teman Qurani",
};

export default function IdNotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsView />
    </DashboardLayout>
  );
}
