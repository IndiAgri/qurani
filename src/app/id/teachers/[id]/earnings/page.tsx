import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherEarningsView } from "@/components/teachers/teacher-earnings-view";

export const metadata = {
  title: "Pendapatan Guru | Qurani",
  description: "Pendapatan, saldo honorarium, dan riwayat penarikan dana guru.",
};

export default async function IdTeacherEarningsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherEarningsView teacherId={id} />
    </TeacherLayout>
  );
}
