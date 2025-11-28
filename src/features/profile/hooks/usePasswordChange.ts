"use client";

import { useState, useCallback, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { VALIDATION_MESSAGES, VALIDATION_RULES } from "@/features/auth";

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

/*
usePasswordChange - Hook gestione cambio password
Validazione sicurezza e submit API
*/
export default function usePasswordChange() {
    const { user } = useAuth();

    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
        setError(null);
        setSuccessMessage(null);
    }, []);

    const validatePassword = useCallback((): string | null => {
        const { currentPassword, newPassword, confirmNewPassword } = passwordData;

        if (!currentPassword.trim()) {
            return "Inserisci la password attuale";
        }

        if (newPassword.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
            return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
        }

        if (newPassword !== confirmNewPassword) {
            return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
        }

        if (currentPassword === newPassword) {
            return "La nuova password deve essere diversa da quella attuale";
        }

        return null;
    }, [passwordData]);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user) return;

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/me/password`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Errore durante il cambio password");
            }

            setSuccessMessage("✓ Password modificata con successo!");
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [passwordData, user, validatePassword]);

    return {
        passwordData,
        handleChange,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    };
}
