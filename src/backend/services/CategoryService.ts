import { CategoryRepository } from "@/backend/repositories";
import {
  CategoryDTO,
  CategoryResponseDTO,
} from "@/backend/dto";
import { AppError } from "@/backend/errors"

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  // Ottieni tutte le categorie
  async getAllCategories(): Promise<CategoryResponseDTO[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map(category => this.mapToResponse(category));
  }

  // Aggiorna categoria
  async updateCategory(categoryId: number, dto: CategoryDTO): Promise<any> {
    if (!await this.categoryRepository.existsById(categoryId)) {
      throw new AppError(`Categoria con ID ${categoryId} non trovata`, 404);
    }
    if (dto.name) {
      this.validateCategoryName(dto.name);
      const category = await this.categoryRepository.findById(categoryId);
      if (category && dto.name !== category.name && await this.categoryRepository.existsByName(dto.name)) {
        throw new AppError(`Il nome categoria "${dto.name}" è già in uso.`, 409);
      }
    }
    return await this.categoryRepository.update(categoryId, dto);
  }

  // Elimina categoria
  async deleteCategory(categoryId: number): Promise<void> {
    if (!await this.categoryRepository.existsById(categoryId)) {
      throw new AppError(`Categoria con ID ${categoryId} non trovata`, 404);
    }
    const layersCount = await this.categoryRepository.countLayers(categoryId);
    if (layersCount > 0) {
      throw new AppError(`Impossibile eliminare: ${layersCount} dataset utilizzano questa categoria.`, 409);
    }
    await this.categoryRepository.delete(categoryId);
  }

  // Crea nuova categoria
  async createCategory(dto: CategoryDTO): Promise<any> {
    this.validateCategoryName(dto.name);

    const exists = await this.categoryRepository.existsByName(dto.name);
    if (exists) {
      throw new AppError(`Categoria "${dto.name}" esiste già`, 409);
    }

    return await this.categoryRepository.create({
      name: dto.name,
      description: dto.description,
    });
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  private mapToResponse(category: any): CategoryResponseDTO {
    return {
      id: category.categoryId,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  // Validazione nome categoria
  private validateCategoryName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new AppError("Nome categoria obbligatorio", 422);
    }

    if (name.length < 2) {
      throw new AppError("Nome categoria troppo corto (minimo 2 caratteri)", 422);
    }

    if (name.length > 100) {
      throw new AppError("Nome categoria troppo lungo (massimo 100 caratteri)", 422);
    }
  }
}
