"use client";

import { useState, useCallback, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationSelection } from "@/features/geo";
import { VALIDATION_MESSAGES, VALIDATION_RULES } from "@/features/auth";
import { useUserForm } from "@/features/auth";

/*
useRegisterForm - Hook per gestione form registrazione
Combina validazione dati anagrafici, password e selezione indirizzo
*/
export function useRegisterForm() {
    const { register } = useAuth();

    // Hook riutilizzabile per dati anagrafici (nome, cognome, email)
    const { userData, handleUserChange, validateUserData } = useUserForm();

    // Stato specifico registrazione: password e conferma
    const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
    const { location, handleSelect: handleLocationSelect, selectedAddress } = useLocationSelection();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({ ...prev, [id]: value }));
    }, []);

    // Validazione composita: dati anagrafici + password match
    const validate = useCallback((): string | null => {
        const userValidationError = validateUserData();
        if (userValidationError) return userValidationError;

        if (passwordData.password !== passwordData.confirmPassword) {
            return VALIDATION_MESSAGES.PASSWORD_MISMATCH;
        }
        if (passwordData.password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
            return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
        }

        return null;
    }, [validateUserData, passwordData]);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            await register({
                email: userData.email,
                password: passwordData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                preferredLatitude: location.latitude,
                preferredLongitude: location.longitude,
                preferredAddress: location.address,
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userData, passwordData, location, register, validate]);

    return {
        formData: { ...userData, ...passwordData },
        handleUserChange,
        handlePasswordChange,
        selectedAddress,
        handleLocationSelect,
        handleSubmit,
        isLoading,
        error,
    };
}
