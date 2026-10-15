import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherCoursesView } from "@/components/teachers/teacher-courses-view";

export const metadata = {
  title: "Teacher Courses | Qurani",
  description: "Manage your Quran teaching packages and courses.",
};

export default async function EnTeacherCoursesPage({
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
