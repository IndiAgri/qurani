import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherProfileView } from "@/components/teachers/teacher-profile-view";

export const metadata = {
  title: "Profil Guru | Qurani",
  description: "Kelola profil dan informasi pengajar Qurani Anda.",
};

export default async function IdTeacherProfilePage({
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
