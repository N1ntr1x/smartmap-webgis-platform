import { UserRole } from "@/types/UserRole";

// Estendiamo il tipo User con le informazioni necessarie per la UI dell'admin
export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

/*
CreateAdminData - Tipo per dati creazione nuovo amministratore
Password sarà provvisoria e l'admin dovrà cambiarla al primo accesso
*/
export interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}