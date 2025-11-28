import { UserRepository } from "@/backend/repositories";
import {
  UpdateUserByAdminDTO,
  CreateAdminDTO,
  UpdateOwnProfileDTO,
  ChangePasswordDTO,
  ResetPasswordByAdminDTO,
  UserResponseDTO,
  UserListItemDTO,
} from "@/backend/dto";
import {
  validateEmail,
  validatePassword,
  validateName
} from "@/backend/utils";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { JWTPayload } from "@/backend/utils";
import { PermissionManager } from "@/backend/utils";
import { AppError } from "@/backend/errors"

const SALT_ROUNDS = 10;

export class UserService {
  private userRepository = new UserRepository();

  /*
  Crea un nuovo admin (solo super_admin può farlo)
  - Valida input (email, password, nome)
  - Verifica unicità email
  - Hash della password
  - Crea utente con ruolo admin
  */
  async createAdmin(dto: CreateAdminDTO): Promise<UserResponseDTO> {
    validateEmail(dto.email);
    validatePassword(dto.password);
    validateName(dto.firstName, "Nome");

    const exists = await this.userRepository.existsByEmail(dto.email);
    if (exists) throw new AppError("Email già registrata", 409);

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.admin,
    });

    return this.mapUserToResponse(user);
  }

  /*
  Ottiene tutti gli utenti
  - Se includeInactive=true include anche gli utenti disattivati
  */
  async getAllUsers(includeInactive = false): Promise<UserListItemDTO[]> {
    const users = await this.userRepository.findAll(includeInactive);
    return users.map(user => this.mapUserToListItem(user));
  }

  // Restituisce un utente per ID
  async getUserById(userId: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(`Utente con ID ${userId} non trovato`, 404);
    return this.mapUserToResponse(user);
  }

  // Aggiorna un utente come admin (verifica permessi tramite PermissionManager)
  async updateUserByAdmin(targetUserId: number, dto: UpdateUserByAdminDTO, currentUser: JWTPayload): Promise<UserResponseDTO> {
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) throw new AppError(`Utente con ID ${targetUserId} non trovato`, 404);

    if (!PermissionManager.canModifyUser(currentUser, targetUser)) {
      throw new AppError("Permessi insufficienti per modificare questo utente.", 403);
    }

    const updatedUser = await this.userRepository.update(targetUserId, dto);
    return this.mapUserToResponse(updatedUser);
  }

  // Aggiorna il proprio profilo (email, nome, cognome, ...)
  async updateOwnProfile(userId: number, dto: UpdateOwnProfileDTO): Promise<UserResponseDTO> {
    const exists = await this.userRepository.existsById(userId);
    if (!exists) throw new AppError(`Utente con ID ${userId} non trovato`, 404);

    if (dto.email) {
      validateEmail(dto.email);
      const emailExists = await this.userRepository.existsByEmail(dto.email);
      const user = await this.userRepository.findById(userId);
      if (emailExists && user?.email !== dto.email) {
        throw new AppError("Email già in uso", 409);
      }
    }

    if (dto.firstName) validateName(dto.firstName, "Nome");
    if (dto.lastName) validateName(dto.lastName, "Cognome");

    const updatedUser = await this.userRepository.update(userId, dto);
    return this.mapUserToResponse(updatedUser);
  }

  // Cambia la propria password
  async changePassword(userId: number, dto: ChangePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError(`Utente con ID ${userId} non trovato`, 404);

    const isValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isValid) throw new AppError("Password attuale non corretta", 401);

    validatePassword(dto.newPassword);

    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.userRepository.updatePassword(userId, newHash);
  }

  /*
  Reset password da admin
  - Carica target e verifica esistenza
  - Verifica permessi dell'admin corrente
  - Valida nuova password e aggiorna hash
  */
  async resetPasswordByAdmin(targetUserId: number, dto: ResetPasswordByAdminDTO, currentUser: JWTPayload): Promise<void> {
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) throw new AppError(`Utente con ID ${targetUserId} non trovato`, 404);

    if (!PermissionManager.canModifyUser(currentUser, targetUser)) {
      throw new AppError("Permessi insufficienti per resettare la password di questo utente.", 403);
    }

    validatePassword(dto.newPassword);
    const newHash = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.userRepository.updatePassword(targetUserId, newHash);
  }

  /*
  Elimina un utente (hard delete)
  - Carica target e verifica esistenza
  - Verifica permessi con PermissionManager
  - Esegue delete
  */
  async deleteUser(targetUserId: number, currentUser: JWTPayload): Promise<void> {
    const targetUser = await this.userRepository.findById(targetUserId);
    if (!targetUser) throw new AppError(`Utente con ID ${targetUserId} non trovato`, 404);

    if (!PermissionManager.canDeleteUser(currentUser, targetUser)) {
      throw new AppError("Permessi insufficienti per eliminare questo utente.", 403);
    }

    await this.userRepository.delete(targetUserId);
  }

  /*
  Elimina il proprio account
  - Vietato agli admin
  - Se super_admin: consente solo se non è l'ultimo
  - Esegue delete dell'utente corrente
  */
  async deleteOwnAccount(currentUser: JWTPayload): Promise<void> {
    if (currentUser.role === Role.admin) {
      throw new AppError(
        "Gli amministratori non possono eliminare il proprio account.",
        403
      );
    }

    if (currentUser.role === Role.super_admin) {
      const superAdminCount = await this.userRepository.countByRole(
        Role.super_admin
      );

      if (superAdminCount <= 1) {
        throw new AppError(
          "Non puoi eliminare l'ultimo super amministratore.",
          403
        );
      }
    }

    await this.userRepository.delete(currentUser.userId);
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  private mapUserToResponse(user: any): UserResponseDTO {
    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      preferredLatitude: user.preferredLatitude,
      preferredLongitude: user.preferredLongitude,
      preferredAddress: user.preferredAddress,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapUserToListItem(user: any): UserListItemDTO {
    return {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
