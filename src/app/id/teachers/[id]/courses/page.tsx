import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherCoursesView } from "@/components/teachers/teacher-courses-view";

export const metadata = {
  title: "Kursus Guru | Qurani",
  description: "Kelola paket bimbingan dan kursus Al-Quran Anda.",
};

export default async function IdTeacherCoursesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherCoursesView teacherId={id} />
    </TeacherLayout>
  );
}
