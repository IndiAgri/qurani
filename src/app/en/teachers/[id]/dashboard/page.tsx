import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherDashboardView } from "@/components/teachers/teacher-dashboard-view";

export const metadata = {
  title: "Teacher Dashboard | Qurani",
  description: "Monitor your teaching schedules, students, and performance.",
};

export default async function EnTeacherDashboardPage({
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
