import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherDashboardView } from "@/components/teachers/teacher-dashboard-view";

export const metadata = {
  title: "Dashboard Guru | Qurani",
  description: "Pantau jadwal bimbingan, santri aktif, dan performa mengajar Anda.",
};

export default async function IdTeacherDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherDashboardView teacherId={id} />
    </TeacherLayout>
  );
}
