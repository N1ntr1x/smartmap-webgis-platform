"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminUser } from "@/features/admin";
import { fetchAllUsers, updateUserStatus, deleteUser, createAdminUser, CreateAdminData, resetUserPassword } from "@/features/admin";

/*
useAdminUsers - Hook custom per gestione completa utenti
Fornisce operazioni CRUD: fetch, create, update status, delete, reset password
Implementa aggiornamento ottimistico dello stato locale per UX immediata
*/
export default function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica lista utenti dal server
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await fetchAllUsers();
      setUsers(fetchedUsers);
    } catch (err: unknown) {
      setError("Impossibile caricare la lista utenti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /*
  Crea nuovo admin e aggiorna lista locale immediatamente
  Aggiunge nuovo utente in cima per feedback visivo immediato
  */
  const handleCreateUser = async (userData: CreateAdminData): Promise<AdminUser> => {
    const newUser = await createAdminUser(userData);
    setUsers(prevUsers => [newUser, ...prevUsers]);
    return newUser;
  };

  // Aggiorna stato attivo/disattivo utente con aggiornamento ottimistico
  const handleUpdateStatus = async (userId: number, isActive: boolean) => {
    try {
      await updateUserStatus(userId, isActive);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive } : u));
    } catch {
      alert("Errore nell'aggiornamento dello stato.");
    }
  };

  // Elimina utente e aggiorna lista locale rimuovendolo
  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      alert("Errore nell'eliminazione dell'utente.");
    }
  };

  // Reset password utente, nessun aggiornamento locale necessario
  const handleResetPassword = async (userId: number, newPassword: string) => {
    await resetUserPassword(userId, newPassword);
    alert("Password resettata con successo!");
  };

  return {
    users,
    isLoading,
    error,
    handleUpdateStatus,
    handleDeleteUser,
    handleCreateUser,
    handleResetPassword
  };
}
