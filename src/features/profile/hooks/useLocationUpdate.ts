"use client";

import { useState, useCallback, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocationSelection } from "@/features/geo";

/*
useLocationUpdate - Hook gestione posizione preferita
Geocoding e submit API
*/
export default function useLocationUpdate() {
    const { user } = useAuth();
    const { location, handleSelect: handleLocationSelect, selectedAddress: displayAddress } = useLocationSelection();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user) return;

        setIsLoading(true);

        try {
            const res = await fetch(`/api/users/me`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    preferredLatitude: location.latitude || undefined,
                    preferredLongitude: location.longitude || undefined,
                    preferredAddress: location.address || undefined,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Errore durante l'aggiornamento della posizione");
            }

            setSuccessMessage("Posizione aggiornata con successo!");
            setTimeout(() => window.location.reload(), 1000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [location, user]);

    return {
        displayAddress,
        handleLocationSelect,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    };
}
