import { AdminUser, CreateAdminData } from "@/features/admin";

/*
Recupera lista completa utenti dal server
Mappa risposta API al tipo AdminUser per consistenza frontend
*/
export async function fetchAllUsers(): Promise<AdminUser[]> {
  const res = await fetch("/api/users");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore nel recupero della lista utenti");
  }
  const data = await res.json();
  return data.users.map((user: any) => ({
    id: user.userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive,
    createdAt: new Date(user.createdAt),
  }));
}

/*
Crea nuovo amministratore o super admin
Solo SuperAdmin può chiamare questa API
Ritorna l'utente creato per aggiornamento ottimistico UI
*/
export async function createAdminUser(userData: CreateAdminData): Promise<AdminUser> {
  const res = await fetch("/api/users/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore durante la creazione dell'utente.");
  }

  const { user } = await res.json();
  // Mappiamo la risposta per coerenza con tipo AdminUser
  return {
    id: user.userId,
    ...user
  };
}

// Aggiorna stato attivo/disattivo utente
export async function updateUserStatus(userId: number, isActive: boolean): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore durante l'aggiornamento dello stato utente.");
  }
}

// Elimina utente permanentemente dal sistema
export async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore durante l'eliminazione dell'utente.");
  }
}

// Recupera lista categorie dataset disponibili
export async function fetchCategories(): Promise<{ id: number; name: string }[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Errore nel recupero delle categorie");
  const data = await res.json();
  return data.categories.map((cat: any) => ({ id: cat.id, name: cat.name }));
}

/*
Upload nuovo dataset GeoJSON con metadati e icona opzionale
Usa FormData per multipart/form-data (file + JSON)
Browser imposta automaticamente Content-Type con boundary corretto
*/
export async function uploadDataset(formData: FormData): Promise<any> {
  const res = await fetch("/api/geodatasets", {
    method: "POST",
    body: formData, // Non impostare Content-Type manualmente
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore durante il caricamento del dataset.");
  }

  return res.json();
}

// Reset password utente con nuova password provvisoria
export async function resetUserPassword(userId: number, newPassword: string): Promise<void> {
  const res = await fetch(`/api/users/${userId}/reset-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Errore durante il reset della password.");
  }
}
