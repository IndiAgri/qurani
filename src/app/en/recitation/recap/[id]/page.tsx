import { Suspense } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { RecitationRecapDetail } from "@/components/recitation/recitation-recap-detail";

export const metadata = {
  title: "Recitation Detail | Qurani",
  description: "Recitation assessment recap and details",
};

export default async function RecitationRecapIdEnPage({
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
            Loading recitation recap...
          </div>
        }
      >
        <RecitationRecapDetail sessionId={id} locale="en" />
      </Suspense>
    </DashboardLayout>
  );
}
