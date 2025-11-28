"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

import { Spinner } from "@/components/ui"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading
  if (isLoading) {
    return <Spinner />
  }

  // Non autenticato → nascosto (redirect in corso)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
