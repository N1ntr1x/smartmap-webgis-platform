"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

/*
useAccountDeletion - Hook gestione eliminazione account
Validazione conferma e logout automatico
*/
export default function useAccountDeletion() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = useCallback(async () => {
        if (!user) return;

        setError(null);

        if (deleteConfirm !== "ELIMINA") {
            setError("Devi digitare \"ELIMINA\" per confermare");
            return;
        }

        if (!acceptTerms) {
            setError("Devi accettare le conseguenze dell'eliminazione");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/me`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Errore durante l'eliminazione dell'account");
            }

            await logout();
            router.push("/");

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    }, [user, logout, router, deleteConfirm, acceptTerms]);

    return {
        deleteConfirm,
        setDeleteConfirm,
        acceptTerms,
        setAcceptTerms,
        handleDelete,
        isLoading,
        error,
    };
}
