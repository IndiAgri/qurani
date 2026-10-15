import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherProfileView } from "@/components/teachers/teacher-profile-view";

export const metadata = {
  title: "Teacher Profile | Qurani",
  description: "View and edit your Quran teacher profile on Qurani.",
};

export default async function EnTeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherProfileView teacherId={id} />
    </TeacherLayout>
  );
}
