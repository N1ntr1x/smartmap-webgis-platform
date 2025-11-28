import { DashboardStats, SavedChat } from "@/features/dashboard";

/*
Servizio API dashboard utente
Centralizza chiamate per statistiche, chat salvate e eliminazione
*/

// Recupera statistiche aggregate utente
export async function fetchDashboardStats(userId: number): Promise<DashboardStats> {
  const res = await fetch(`/api/chatbot/responses/stats?userId=${userId}`);
  if (!res.ok) {
    throw new Error("Errore nel recupero delle statistiche");
  }
  const data = await res.json();

  return {
    savedChatsCount: data.stats.totalResponses || 0,
    totalMarkers: data.stats.totalMarkers || 0,
    lastSaveDate: data.stats.lastResponseDate,
  };
}

// Recupera lista chat salvate utente
export async function fetchSavedChats(userId: number): Promise<SavedChat[]> {
  const res = await fetch(`/api/chatbot/responses?userId=${userId}&list=true`);
  if (!res.ok) {
    throw new Error("Errore nel recupero delle chat salvate");
  }
  const data = await res.json();
  return data.responses || [];
}

// Elimina chat salvata specifica
export async function deleteSavedChat(chatId: number): Promise<void> {
  const res = await fetch(`/api/chatbot/responses/${chatId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Errore durante l'eliminazione della chat");
  }
}
