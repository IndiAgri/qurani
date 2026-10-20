import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherCertificatesView } from "@/components/teachers/teacher-certificates-view";

export const metadata = {
  title: "Teacher Certificates | Qurani",
  description: "Kelola sertifikat yang Anda terbitkan kepada murid.",
};

export default async function TeacherCertificatesPage({
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
