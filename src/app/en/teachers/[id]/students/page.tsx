import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherStudentsView } from "@/components/teachers/teacher-students-view";

export const metadata = {
  title: "Teacher Students | Qurani",
  description: "Daftar santri bimbingan Al-Quran dan progres hafalan.",
};

export default async function EnTeacherStudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherStudentsView teacherId={id} />
    </TeacherLayout>
  );
}
