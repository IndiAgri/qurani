import { LoginView } from "@/components/auth/login-view";

export const metadata = {
  title: "Qurani - Modern Quran App",
  description: "Masuk ke akun Qurani Anda",
};

export default function IdLoginPage() {
  return <LoginView locale="id" />;
}
