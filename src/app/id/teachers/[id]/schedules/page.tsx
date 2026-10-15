import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherSchedulesView } from "@/components/teachers/teacher-schedules-view";

export const metadata = {
  title: "Jadwal Bimbingan | Qurani",
  description: "Jadwal dan kalender sesi bimbingan Al-Quran santri.",
};

export default async function IdTeacherSchedulesPage({
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
