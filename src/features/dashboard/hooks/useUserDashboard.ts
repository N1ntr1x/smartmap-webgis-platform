"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStats, SavedChat } from "@/features/dashboard";
import { fetchDashboardStats, fetchSavedChats, deleteSavedChat } from "@/features/dashboard";

/*
useUserDashboard - Hook gestione dashboard utente
Carica statistiche e chat salvate, gestisce eliminazione con aggiornamento ottimistico
*/
export default function useUserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carica dati dashboard da API
  const loadData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const [statsData, chatsData] = await Promise.all([
        fetchDashboardStats(user.id),
        fetchSavedChats(user.id),
      ]);
      setStats(statsData);
      setSavedChats(chatsData);
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore imprevisto.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
  Eliminazione chat con aggiornamento ottimistico:
  1. Rimuove immediatamente dalla UI
  2. Chiama API in background
  3. Se errore, ripristina dati ricaricando
  */
  const handleDeleteChat = useCallback(async (chatId: number) => {
    setSavedChats(prevChats => prevChats.filter(chat => chat.id !== chatId));

    try {
      await deleteSavedChat(chatId);

      // Aggiorna statistiche dopo eliminazione
      if (user) {
        const statsData = await fetchDashboardStats(user.id);
        setStats(statsData);
      }
    } catch (err: any) {
      setError("Eliminazione fallita. Ricarica la pagina.");
      await loadData();
    }
  }, [user, loadData]);

  // Filtra chat per termine di ricerca
  const filteredChats = useMemo(() => {
    if (!searchTerm) {
      return savedChats;
    }
    return savedChats.filter(chat =>
      chat.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [savedChats, searchTerm]);

  return {
    user,
    stats,
    filteredChats,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    handleDeleteChat,
  };
}
