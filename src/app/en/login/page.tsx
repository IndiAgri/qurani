import { LoginView } from "@/components/auth/login-view";

export const metadata = {
  title: "Qurani - Modern Quran App",
  description: "Login to your Qurani account",
};

export default function EnLoginPage() {
  return <LoginView locale="en" />;
}
