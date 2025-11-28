"use client";

import { useState, useCallback, FormEvent, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserForm } from "@/features/auth/hooks/useUserForm";

/*
useProfileData - Hook gestione dati personali profilo
Validazione, submit API e feedback utente
*/
export default function useProfileData() {
    const { user } = useAuth();
    const { userData, setUserData, handleUserChange, validateUserData } = useUserForm();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setUserData({
                firstName: user.firstName,
                lastName: user.lastName || "",
                email: user.email,
            });
        }
    }, [user, setUserData]);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user) return;

        const validationError = validateUserData();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: userData.firstName.trim(),
                    lastName: userData.lastName.trim() || null,
                    email: userData.email.trim(),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Errore durante l'aggiornamento del profilo");
            }

            setSuccessMessage("Profilo aggiornato con successo!");
            setTimeout(() => window.location.reload(), 1000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userData, user, validateUserData]);

    return {
        formData: userData,
        handleChange: handleUserChange,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    };
}
