import { LoginView } from "@/components/auth/login-view";

export const metadata = {
  title: "Qurani - Modern Quran App",
  description: "Login to your Qurani account",
};

export default function LoginPage() {
  return <LoginView locale="en" />;
}
