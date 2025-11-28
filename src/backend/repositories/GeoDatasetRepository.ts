import { prisma } from "@/backend/prisma";
import { GeoDataset, Prisma, PrismaClient } from "@prisma/client";

// REPOSITORY per Dataset — solo accesso al database
export class GeoDatasetRepository {
  getClient(): PrismaClient {
    return prisma;
  }
  // Trova tutti i dataset (opzionalmente include anche gli inattivi)
  async findAll(includeInactive: boolean = false): Promise<any[]> {
    return await prisma.geoDataset.findMany({
      where: includeInactive ? undefined : {
        isActive: true,
        isArchived: false,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // Trova dataset per ID
  async findById(datasetId: number): Promise<any | null> {
    return await prisma.geoDataset.findUnique({
      where: { datasetId },
      include: {
        category: true,
      },
    });
  }

  // Verifica esistenza per ID
  async existsById(datasetId: number): Promise<boolean> {
    const count = await prisma.geoDataset.count({
      where: { datasetId },
    });
    return count > 0;
  }

  // Verifica esistenza per nome
  async existsByName(name: string): Promise<boolean> {
    const count = await prisma.geoDataset.count({
      where: { name },
    });
    return count > 0;
  }

  // Verifica esistenza per file GeoJSON
  async existsByGeojsonFile(geojsonFile: string): Promise<boolean> {
    const count = await prisma.geoDataset.count({
      where: { geojsonFile },
    });
    return count > 0;
  }

  // Crea nuovo dataset
  async create(data: {
    name: string;
    description?: string;
    geojsonFile: string;
    iconFile: string;
    location?: string;
    categoryId: number;
  }): Promise<GeoDataset> {
    return await prisma.geoDataset.create({
      data: {
        name: data.name,
        description: data.description,
        geojsonFile: data.geojsonFile,
        iconFile: data.iconFile,
        location: data.location,
        categoryId: data.categoryId,
        version: 1,
      },
    });
  }

  // Aggiorna metadata dataset
  async update(
    datasetId: number,
    data: Prisma.GeoDatasetUpdateInput
  ): Promise<GeoDataset> {
    return await prisma.geoDataset.update({
      where: { datasetId },
      data,
    });
  }

  // Elimina dataset (hard delete)
  async delete(datasetId: number): Promise<GeoDataset> {
    return await prisma.geoDataset.delete({
      where: { datasetId },
    });
  }
}
