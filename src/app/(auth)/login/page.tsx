import { AuthLayout, LoginForm } from "@/features/auth";
import { APP_CONFIG } from "@/configs/app"

export default function LoginPage() {
  return (
    <AuthLayout
      title={"Accedi a " + APP_CONFIG.name}
      subtitle="Bentornato! Accedi per continuare."
    >
      <LoginForm />
    </AuthLayout>
  );
}
