import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherSubpageView } from "@/components/teachers/teacher-subpage-view";

export const metadata = {
  title: "Teacher Certificates | Qurani",
  description: "View teacher certificates, sanad credentials, and teaching licenses.",
};

export default async function EnTeacherCertificatesPage({
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
