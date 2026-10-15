import { RegisterView } from "@/components/auth/register-view";

export const metadata = {
  title: "Qurani - Create Account",
  description: "Create your Qurani account",
};

export default function EnRegisterPage() {
  return <RegisterView locale="en" />;
}
