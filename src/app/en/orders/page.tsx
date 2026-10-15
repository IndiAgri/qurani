import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MarketplaceOrdersPage } from "@/components/marketplace/orders/marketplace-orders-page";

export const metadata = {
  title: "Pesanan Saya | Qurani",
  description: "Riwayat pesanan dan jadwal bimbingan - Qurani",
};

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <MarketplaceOrdersPage />
      </div>
    </DashboardLayout>
  );
}
