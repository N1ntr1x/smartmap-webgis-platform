import { DatasetModificationRepository } from "@/backend/repositories";
import { GeoDatasetRepository } from "@/backend/repositories";
import { UserRepository } from "@/backend/repositories";
import {
  CreateDatasetModificationDTO,
  DatasetModificationResponseDTO,
  UpdateDatasetModificationDTO,
} from "@/backend/dto";
import { AppError } from "@/backend/errors"

export class DatasetModificationService {
  private modificationRepository: DatasetModificationRepository;
  private datasetRepository: GeoDatasetRepository;
  private userRepository: UserRepository;

  constructor() {
    this.modificationRepository = new DatasetModificationRepository();
    this.datasetRepository = new GeoDatasetRepository();
    this.userRepository = new UserRepository();
  }

  // Ottieni tutte le modifiche
  async getAllModifications(limit?: number): Promise<DatasetModificationResponseDTO[]> {
    const modifications = await this.modificationRepository.findAll(limit);
    return modifications.map(mod => this.mapToResponse(mod));
  }

  // Crea nuova modifica
  async createModification(dto: CreateDatasetModificationDTO): Promise<any> {
    this.validateActionType(dto.actionType);

    // Verifica esistenza riferimenti
    const userExists = await this.userRepository.existsById(dto.userId);
    if (!userExists) {
      throw new AppError(`Utente con ID ${dto.userId} non trovato`, 404);
    }

    const datasetExists = await this.datasetRepository.existsById(dto.datasetId);
    if (!datasetExists) {
      throw new AppError(`Dataset con ID ${dto.datasetId} non trovato`, 404);
    }

    return await this.modificationRepository.create({
      userId: dto.userId,
      datasetId: dto.datasetId,
      actionType: dto.actionType,
      versionBefore: dto.versionBefore,
      versionAfter: dto.versionAfter,
      comment: dto.comment,
    });
  }

  // Aggiorna modifica
  async updateModification(modificationId: number, dto: UpdateDatasetModificationDTO): Promise<DatasetModificationResponseDTO> {
    if (!await this.modificationRepository.existsById(modificationId)) {
      throw new AppError(`Modifica con ID ${modificationId} non trovata`, 404);
    }
    const updated = await this.modificationRepository.update(modificationId, dto);
    return this.mapToResponse(updated);
  }

  // Elimina modifica
  async deleteModification(modificationId: number): Promise<void> {
    if (!await this.modificationRepository.existsById(modificationId)) {
      throw new AppError(`Modifica con ID ${modificationId} non trovata`, 404);
    }
    await this.modificationRepository.delete(modificationId);
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  private mapToResponse(mod: any): DatasetModificationResponseDTO {
    return {
      id: mod.modId,
      actionType: mod.actionType,
      versionBefore: mod.versionBefore,
      versionAfter: mod.versionAfter,
      comment: mod.comment,
      createdAt: mod.createdAt,
      user: {
        id: mod.user.userId,
        firstName: mod.user.firstName,
        lastName: mod.user.lastName,
      },
      dataset: {
        id: mod.dataset.datasetId,
        name: mod.dataset.name,
      },
    };
  }

  // Validazione action type
  private validateActionType(actionType: string): void {
    const validTypes = ["created", "updated", "file_replaced", "archived", "restored"];

    if (!actionType || actionType.trim().length === 0) {
      throw new AppError("Action type obbligatorio", 422);
    }

    if (!validTypes.includes(actionType)) {
      throw new AppError(
        `Action type non valido. Validi: ${validTypes.join(", ")}`,
        422
      );
    }
  }
}
