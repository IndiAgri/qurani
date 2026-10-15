import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MarketplaceCheckoutPage } from "@/components/marketplace/checkout/marketplace-checkout-page";

export const metadata = {
  title: "Pembayaran Aman | Qurani",
  description: "Checkout dan pembayaran bimbingan Al-Qur'an - Qurani",
};

export default function CheckoutPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <MarketplaceCheckoutPage />
      </div>
    </DashboardLayout>
  );
}
