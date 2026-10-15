import { ForgotPasswordView } from "@/components/auth/forgot-password-view";

export const metadata = {
  title: "Reset Kata Sandi | Qurani",
  description: "Reset kata sandi akun Qurani Anda",
};

export default function IdForgotPasswordPage() {
  return <ForgotPasswordView locale="id" />;
}
