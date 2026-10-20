import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherCertificatesView } from "@/components/teachers/teacher-certificates-view";

export const metadata = {
  title: "Teacher Certificates | Qurani",
  description: "Manage certificates issued to your students on Qurani.",
};

export default async function EnTeacherCertificatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherCertificatesView teacherId={id} />
    </TeacherLayout>
  );
}
