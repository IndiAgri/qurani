import MyWalletPage from "@/components/wallet/my-wallet-page";

export const metadata = {
  title: "Detail Saldo Tersedia | Qurani",
  description: "Detail saldo tersedia dompet Qurani",
};

export default function SaldoTersediaPage() {
  return <MyWalletPage initialView="detail" initialStat="saldo" />;
}
