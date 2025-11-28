"use client"

import Link from "next/link";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { FormInput } from "@/components/ui";
import { ErrorMessage, Button } from "@/components/ui";

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    error,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ErrorMessage message={error} />

      <FormInput
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="esempio@email.com"
        required
        maxLength={100}
        minLength={8}
        disabled={isLoading}
      />

      <FormInput
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        minLength={8}
        disabled={isLoading}
      />

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Accesso in corso..." : "Accedi"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Non hai un account?{" "}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Registrati
        </Link>
      </p>
    </form>
  );
}
