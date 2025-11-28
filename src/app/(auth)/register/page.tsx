import { AuthLayout, RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea il tuo account"
      subtitle="Registrati per iniziare"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
