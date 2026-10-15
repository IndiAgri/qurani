import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherOrganizationView } from "@/components/teachers/teacher-organization-view";

export const metadata = {
  title: "Organisasi Afiliasi | Qurani",
  description: "Lembaga, yayasan, dan pesantren afiliasi guru.",
};

export default async function IdTeacherOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherOrganizationView teacherId={id} />
    </TeacherLayout>
  );
}
