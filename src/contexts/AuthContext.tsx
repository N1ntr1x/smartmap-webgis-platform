"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType, AuthLoginParams, AuthRegisterParams } from "@/features/auth";
import { UserRole } from "@/types/UserRole";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Stato dell'utente: null = non autenticato, User = autenticato
  const [user, setUser] = useState<User | null>(null);
  // Flag per indicare il caricamento iniziale (es. controllo sessione)
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verifica auth solo al mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Funzione per controllare lo stato di autenticazione restituendo i dati dell'utente corrente
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        // Riceve i dati e salva l'oggetto utente nello State user
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Callback di Login
  const login = useCallback(async (params: AuthLoginParams) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Errore durante il login");
    }

    const data = await res.json();
    setUser(data.user);
    router.push("/map");
  }, [router]);

  // Callback di Register
  const register = useCallback(async (params: AuthRegisterParams) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Errore durante la registrazione");
    }

    const data = await res.json();
    setUser(data.user);
    router.push("/map");
  }, [router]);

  // Callback di Logout
  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  // Memoizza un valore booleano derivata da user per evitare re-render
  const isAuthenticated = useMemo(() => !!user, [user]); // !!user: user ? true : false

  const isAdmin = useMemo(() =>
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN,
    [user?.role]
  );

  const isSuperAdmin = useMemo(() =>
    user?.role === UserRole.SUPER_ADMIN,
    [user?.role]
  );

  // Memoizza l"intero value object
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isLoading,
    login,
    register,
    logout,
  }), [user, isAuthenticated, isAdmin, isSuperAdmin, isLoading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook per ricavare il contesto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve essere usato dentro AuthProvider");
  }
  return context;
}
