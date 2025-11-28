"use client";

import { useState, useCallback, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useLoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({
        email: email,
        password: password
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    isLoading,
    error,
  };
}
