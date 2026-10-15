import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherMessagesView } from "@/components/teachers/teacher-messages-view";

export const metadata = {
  title: "Teacher Messages | Qurani",
  description: "Pesan dan ruang konsultasi bimbingan Al-Quran santri.",
};

export default async function EnTeacherMessagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherMessagesView teacherId={id} />
    </TeacherLayout>
  );
}
