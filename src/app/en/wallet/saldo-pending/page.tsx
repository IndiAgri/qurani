import MyWalletPage from "@/components/wallet/my-wallet-page";

export const metadata = {
  title: "Detail Saldo Pending | Qurani",
  description: "Detail saldo pending dompet Qurani",
};

export default function SaldoPendingPage() {
  return <MyWalletPage initialView="detail" initialStat="pending" />;
}
