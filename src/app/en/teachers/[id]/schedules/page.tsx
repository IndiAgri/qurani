import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherSchedulesView } from "@/components/teachers/teacher-schedules-view";

export const metadata = {
  title: "Teacher Schedules | Qurani",
  description: "Jadwal dan kalender sesi bimbingan Al-Quran santri.",
};

export default async function EnTeacherSchedulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherSchedulesView teacherId={id} />
    </TeacherLayout>
  );
}
