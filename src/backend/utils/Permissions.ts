import { Role } from '@prisma/client';
import { JWTPayload } from './jwt';

export class PermissionManager {
  // Verifica se currentUser può modificare targetUser
  static canModifyUser(
    currentUser: JWTPayload,
    targetUser: { userId: number; role: Role }
  ): boolean {
    // Super_admin può modificare chiunque
    if (currentUser.role === Role.super_admin) return true;

    // Admin può modificare solo user normali
    if (currentUser.role === Role.admin && targetUser.role === Role.user) {
      return true;
    }

    // Utente può modificare solo se stesso
    if (currentUser.userId === targetUser.userId) return true;

    return false;
  }

  // Verifica se currentUser può eliminare targetUser
  static canDeleteUser(
    currentUser: JWTPayload,
    targetUser: { userId: number; role: Role }
  ): boolean {
    // Solo super_admin può eliminare
    if (currentUser.role !== Role.super_admin) return false;

    // Non può eliminare se stesso
    if (currentUser.userId === targetUser.userId) return false;

    return true;
  }

  // Verifica se currentUser può cambiare ruolo di targetUser
  static canChangeRole(
    currentUser: JWTPayload,
    targetUserId: number,
    newRole: string
  ): boolean {
    // Solo super_admin può cambiare ruoli
    if (currentUser.role !== Role.super_admin) return false;

    // Non può cambiare il proprio ruolo
    if (currentUser.userId === targetUserId) return false;

    return true;
  }

  // Verifica se currentUser può creare admin
  static canCreateAdmin(currentUser: JWTPayload, roleToCreate: string): boolean {
    // Solo super_admin può creare admin e super_admin
    return currentUser.role === Role.super_admin;
  }
}
