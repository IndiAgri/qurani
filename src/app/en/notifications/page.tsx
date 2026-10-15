import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { NotificationsView } from "@/components/pages/notifications-view";

export const metadata = {
  title: "Notifications | Qurani",
  description: "Recitation updates and friend activity notifications",
};

export default function EnNotificationsPage() {
  return (
    <DashboardLayout>
      <NotificationsView />
    </DashboardLayout>
  );
}
