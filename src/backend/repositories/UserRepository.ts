import { prisma } from "@/backend/prisma";
import { User, Prisma, Role } from "@prisma/client";

export class UserRepository {
  // Trova tutti gli utenti
  async findAll(includeInactive: boolean = false): Promise<User[]> {
    return await prisma.user.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Trova utente per ID
  async findById(userId: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { userId },
    });
  }

  // Trova utente per email
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Verifica esistenza per ID
  async existsById(userId: number): Promise<boolean> {
    const count = await prisma.user.count({
      where: { userId },
    });
    return count > 0;
  }

  // Verifica esistenza per email
  async existsByEmail(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  // Crea nuovo utente
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || Role.user,
        preferredLatitude: data.preferredLatitude,
        preferredLongitude: data.preferredLongitude,
        preferredAddress: data.preferredAddress,
      },
    });
  }

  // Aggiorna utente
  async update(userId: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { userId },
      data,
    });
  }

  // Aggiorna password
  async updatePassword(userId: number, passwordHash: string): Promise<User> {
    return await prisma.user.update({
      where: { userId },
      data: { passwordHash },
    });
  }

  // Disattiva utente (soft delete)
  async deactivate(userId: number): Promise<User> {
    return await prisma.user.update({
      where: { userId },
      data: { isActive: false },
    });
  }

  // Riattiva utente
  async activate(userId: number): Promise<User> {
    return await prisma.user.update({
      where: { userId },
      data: { isActive: true },
    });
  }

  async countByRole(role: Role): Promise<number> {
    return await prisma.user.count({
      where: { role },
    });
  }

  // Elimina utente (hard delete)
  async delete(userId: number): Promise<User> {
    return await prisma.user.delete({
      where: { userId },
    });
  }
}
