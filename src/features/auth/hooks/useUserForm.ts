"use client";

import { useState, useCallback } from "react";
import { VALIDATION_MESSAGES, VALIDATION_RULES } from "@/features/auth";

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

/*
useUserForm - Hook riutilizzabile per dati anagrafici utente
Condiviso tra form registrazione e form profilo
Centralizza validazione nome, cognome, email
*/
export function useUserForm(initialData?: Partial<UserFormData>) {

  const [userData, setUserData] = useState<UserFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
  });

  const handleUserChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData(prev => ({ ...prev, [id]: value }));
  }, []);

  // Validazione centralizzata dati anagrafici
  const validateUserData = useCallback((): string | null => {
    const { firstName, lastName, email } = userData;

    if (firstName.trim().length < 2) return VALIDATION_MESSAGES.NAME_TOO_SHORT;
    if (firstName.length > VALIDATION_RULES.NAME_MAX_LENGTH) return VALIDATION_MESSAGES.NAME_TOO_LONG;

    // Cognome opzionale ma se presente validato
    if (lastName && lastName.trim().length > 0) {
      if (lastName.trim().length < 2) return VALIDATION_MESSAGES.LASTNAME_TOO_SHORT;
      if (lastName.length > VALIDATION_RULES.LASTNAME_MAX_LENGTH) return VALIDATION_MESSAGES.LASTNAME_TOO_LONG;
    }

    if (email.trim().length < 5) return VALIDATION_MESSAGES.EMAIL_TOO_SHORT;
    if (email.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) return VALIDATION_MESSAGES.EMAIL_TOO_LONG;

    return null;
  }, [userData]);

  return {
    userData,
    setUserData, // Per popolare form profilo con dati esistenti
    handleUserChange,
    validateUserData,
  };
}
