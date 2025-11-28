import { prisma } from "@/backend/prisma";
import { DatasetModification, Prisma } from "@prisma/client";

export class DatasetModificationRepository {
  // Trova tutte le modifiche
  async findAll(limit?: number): Promise<any[]> {
    return await prisma.datasetModification.findMany({
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        dataset: {
          select: {
            datasetId: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  // Crea nuova modifica
  async create(data: {
    userId: number;
    datasetId: number;
    actionType: string;
    versionBefore?: number;
    versionAfter?: number;
    comment?: string;
  }): Promise<DatasetModification> {
    return await prisma.datasetModification.create({
      data: {
        userId: data.userId,
        datasetId: data.datasetId,
        actionType: data.actionType,
        versionBefore: data.versionBefore,
        versionAfter: data.versionAfter,
        comment: data.comment,
      },
    });
  }

  // Aggiorna modifica
  async update(modificationId: number, data: Prisma.DatasetModificationUpdateInput): Promise<any> {
    return await prisma.datasetModification.update({
      where: { modificationId },
      data,
      include: {
        user: { select: { userId: true, firstName: true, lastName: true } },
        dataset: { select: { datasetId: true, name: true } },
      }
    });
  }

  // Elimina modifica
  async delete(modificationId: number): Promise<void> {
    await prisma.datasetModification.delete({
      where: { modificationId },
    });
  }

  // Esiste per ID
  async existsById(modificationId: number): Promise<boolean> {
    const count = await prisma.datasetModification.count({ where: { modificationId } });
    return count > 0;
  }
}
