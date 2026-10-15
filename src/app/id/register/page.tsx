import { RegisterView } from "@/components/auth/register-view";

export const metadata = {
  title: "Qurani - Daftar Akun",
  description: "Daftar akun Qurani Anda",
};

export default function IdRegisterPage() {
  return <RegisterView locale="id" />;
}
