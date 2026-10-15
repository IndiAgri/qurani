import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MarketplaceOrdersDetailPage } from "@/components/marketplace/orders/marketplace-orders-detail-page";

export const metadata = {
  title: "Detail Pesanan | Qurani",
  description: "Detail pesanan dan invoice bimbingan - Qurani",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <div className="w-full">
        <MarketplaceOrdersDetailPage id={id} />
      </div>
    </DashboardLayout>
  );
}
