import { prisma } from "@/backend/prisma";
import { Category } from "@prisma/client";

export class CategoryRepository {
  // Trova tutte le categorie
  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }

  // Trova categoria per ID
  async findById(categoryId: number): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { categoryId },
    });
  }

  // Trova categoria per nome
  async findByName(name: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  // Verifica esistenza per ID
  async existsById(categoryId: number): Promise<boolean> {
    const count = await prisma.category.count({
      where: { categoryId },
    });
    return count > 0;
  }

  // Verifica esistenza per nome
  async existsByName(name: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { name },
    });
    return count > 0;
  }

  // Conta layer per categoria
  async countLayers(categoryId: number): Promise<number> {
    return await prisma.geoDataset.count({
      where: {
        categoryId,
        isActive: true,
        isArchived: false,
      },
    });
  }

  // Crea nuova categoria
  async create(data: { name: string; description?: string }): Promise<Category> {
    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
  }

  // Aggiorna categoria
  async update(
    categoryId: number,
    data: { name?: string; description?: string }
  ): Promise<Category> {
    return await prisma.category.update({
      where: { categoryId },
      data,
    });
  }

  // Elimina categoria — fallisce se ci sono layer associati (ON DELETE RESTRICT)
  async delete(categoryId: number): Promise<Category> {
    return await prisma.category.delete({
      where: { categoryId },
    });
  }
}
