import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherSettingsView } from "@/components/teachers/teacher-settings-view";

export const metadata = {
  title: "Teacher Settings | Qurani",
  description: "Pengaturan akun, tarif mengajar, dan preferensi notifikasi.",
};

export default async function EnTeacherSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherSettingsView teacherId={id} />
    </TeacherLayout>
  );
}
