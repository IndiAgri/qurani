import { Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { RecitationRecapDetail } from "@/components/recitation/recitation-recap-detail";

export const metadata = {
  title: "Recitation Detail | Qurani",
  description: "Rincian dan rekapitulasi penilaian setoran Al-Qur'an",
};

export default async function RecitationRecapIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardLayout showHeader={false}>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-gray-400">
            Memuat detail setoran...
          </div>
        }
      >
        <RecitationRecapDetail sessionId={id} locale="id" />
      </Suspense>
    </DashboardLayout>
  );
}
