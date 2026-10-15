import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MarketplaceBookingPage } from "@/components/marketplace/book/marketplace-booking-page";

export const metadata = {
  title: "Pilih Jadwal Belajar | Qurani",
  description: "Pilih paket dan jadwal sesi bimbingan bersama guru - Qurani",
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardLayout>
      <div className="w-full">
        <MarketplaceBookingPage id={id} />
      </div>
    </DashboardLayout>
  );
}
