import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { TeacherOrdersView } from "@/components/teachers/teacher-orders-view";

export const metadata = {
  title: "Pesanan Bimbingan | Qurani",
  description: "Daftar pemesanan bimbingan Al-Quran dari santri.",
};

export default async function IdTeacherOrdersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <TeacherLayout>
      <TeacherOrdersView teacherId={id} />
    </TeacherLayout>
  );
}
