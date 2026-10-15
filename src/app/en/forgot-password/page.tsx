import { ForgotPasswordView } from "@/components/auth/forgot-password-view";

export const metadata = {
  title: "Reset Password | Qurani",
  description: "Reset your Qurani password",
};

export default function EnForgotPasswordPage() {
  return <ForgotPasswordView locale="en" />;
}
