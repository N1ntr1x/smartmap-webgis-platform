import { Role } from '@prisma/client';
import { UserRole } from '@/backend/types/UserRole';

// DTO per creazione admin (solo super_admin)
export interface CreateAdminDTO {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  role: UserRole.ADMIN;
}

// DTO per aggiornamento profilo proprio (utente)
export interface UpdateOwnProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferredLatitude?: number;
  preferredLongitude?: number;
  preferredAddress?: string;
}

export interface UpdateUserByAdminDTO {
  isActive?: boolean;
}

// DTO per cambio password (proprio)
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}

// DTO per reset password da admin
export interface ResetPasswordByAdminDTO {
  newPassword: string;
}


// Output DTOs

// DTO per risposta completa utente
export interface UserResponseDTO {
  userId: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: Role;
  isActive: boolean;
  preferredLatitude: number | null;
  preferredLongitude: number | null;
  preferredAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// DTO per lista utenti (admin view)
export interface UserListItemDTO {
  userId: number;
  email: string;
  firstName: string;
  lastName: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}
