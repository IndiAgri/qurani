import { MarketplaceInvoicePage } from "@/components/marketplace/invoice/marketplace-inovoice-page";

export const metadata = {
  title: "Faktur Pembayaran / Invoice | Qurani",
  description: "Faktur resmi pembayaran bimbingan Al-Qur'an Qurani.",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MarketplaceInvoicePage id={id} />;
}
