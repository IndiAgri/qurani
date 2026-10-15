import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherSubpageView } from "@/components/teachers/teacher-subpage-view";

export const metadata = {
  title: "Teacher Certificates | Qurani",
  description: "Daftar sertifikat keilmuan dan sanad Al-Quran pengajar.",
};

export default async function TeacherCertificatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherSubpageView type="certificates" teacherId={id} />
    </TeacherLayout>
  );
}
