import { GeoDatasetRepository } from "@/backend/repositories";
import { CategoryRepository } from "@/backend/repositories/CategoryRepository";
import { DatasetModificationRepository } from "@/backend/repositories/DatasetModificationRepository";
import { DatasetPaths, MarkerValidator } from "@/backend/utils";
import {
  CreateGeoDatasetDTO,
  UpdateGeoDatasetDTO,
  GeoDatasetResponseDTO,
  GeoDatasetStatsDTO,
  ServiceCreateGeoDatasetDTO,
} from "@/backend/dto";
import { writeFile, mkdir, readFile, stat, readdir } from "fs/promises";
import path from "path";
import { AppError } from "@/backend/errors"

export class GeoDatasetService {
  private datasetRepository: GeoDatasetRepository;
  private categoryRepository: CategoryRepository;
  private modificationRepository: DatasetModificationRepository;

  constructor() {
    this.datasetRepository = new GeoDatasetRepository();
    this.categoryRepository = new CategoryRepository();
    this.modificationRepository = new DatasetModificationRepository();
  }

  // Ottieni tutti i dataset con dati completi
  async getAllDatasets(): Promise<GeoDatasetResponseDTO[]> {
    const datasets = await this.datasetRepository.findAll();

    const enrichedDatasets = await Promise.all(
      datasets.map((dataset) => this.enrichDatasetWithFiles(dataset))
    );

    return enrichedDatasets.filter(
      (dataset): dataset is GeoDatasetResponseDTO => dataset !== null
    );
  }

  // Ottieni dataset con SOLO statistiche (no GeoJSON)
  async getDatasetsStats(includeInactive: boolean = false): Promise<GeoDatasetStatsDTO[]> {
    const datasets = await this.datasetRepository.findAll(includeInactive);

    const statsDatasets = await Promise.all(
      datasets.map(async (dataset) => this.mapToStatsDTO(dataset))
    );

    return statsDatasets;
  }

  // Ottieni singolo dataset per ID
  async getDatasetById(datasetId: number): Promise<GeoDatasetResponseDTO> {
    const dataset = await this.datasetRepository.findById(datasetId);

    if (!dataset) {
      throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);
    }

    const enrichedDataset = await this.enrichDatasetWithFiles(dataset);

    if (!enrichedDataset) {
      throw new AppError(`Errore caricando file per dataset ID ${datasetId}`, 500);
    }

    return enrichedDataset;
  }

  /*
  Crea nuovo dataset
  - Valida nome e unicità (nome e file)
  - Risolve/crea categoria
  - Transazione DB: crea record e log modifica
  - Scrive file su disco (GeoJSON + icona)
  - Aggiorna icona se personalizzata
  - Restituisce record creato
  */
  async createDataset(dto: ServiceCreateGeoDatasetDTO): Promise<any> {
    this.validateDatasetName(dto.name);

    if (await this.datasetRepository.existsByName(dto.name)) {
      throw new AppError(`Un dataset con nome "${dto.name}" esiste già.`, 409);
    }
    if (await this.datasetRepository.existsByGeojsonFile(dto.fileName)) {
      throw new AppError(`Il nome file "${dto.fileName}" è già stato usato.`, 409);
    }

    // Verifica se il file è un geojson
    if (!dto.fileName.toLowerCase().endsWith('.geojson')) {
      throw new AppError(`Il file deve avere estensione .geojson`, 422);
    }

    // Parsing e verifica completa del file geojson
    let geojsonContent: unknown;
    try {
      const buffer = await dto.geojsonFile.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      geojsonContent = JSON.parse(text);
    } catch (error) {
      throw new AppError("Il file caricato non è un JSON valido", 422);
    }

    // Verifica di ogni singolo Marker (Defense in Depth - Livello 1)
    MarkerValidator.validateGeoJsonForPlatform(geojsonContent);

    // Risolvi categoria
    let categoryId: number;
    const potentialId = parseInt(dto.category);

    if (!isNaN(potentialId) && (await this.categoryRepository.existsById(potentialId))) {
      categoryId = potentialId;
    } else {
      const existingCategory = await this.categoryRepository.findByName(dto.category);
      if (existingCategory) {
        categoryId = existingCategory.categoryId;
      } else {
        const newCategory = await this.categoryRepository.create({ name: dto.category });
        categoryId = newCategory.categoryId;
      }
    }

    // 1. TRANSAZIONE DATABASE PRIMA (senza file)
    const finalDto: CreateGeoDatasetDTO = {
      name: dto.name,
      description: dto.description,
      location: dto.location,
      geojsonFile: dto.fileName,
      iconFile: "icon.png", // Default
      categoryId,
    };

    const newDataset = await this.datasetRepository.getClient().$transaction(async (tx) => {
      const dataset = await tx.geoDataset.create({
        data: finalDto as any,
      });

      await tx.datasetModification.create({
        data: {
          userId: dto.userId,
          datasetId: dataset.datasetId,
          actionType: "created",
          versionBefore: 0,
          versionAfter: 1,
          comment: dto.comment || "Creazione del dataset.",
        },
      });

      return dataset;
    });

    // 2. CARICA FILE DOPO (DB è già garantito)
    const datasetFolder = DatasetPaths.getDatasetFolder(dto.fileName);
    await mkdir(datasetFolder, { recursive: true });

    const geojsonPath = DatasetPaths.getGeoJsonPath(dto.fileName);
    await writeFile(geojsonPath, Buffer.from(await dto.geojsonFile.arrayBuffer()));

    let iconFileName = "icon.png";
    if (dto.iconFile) {
      const iconExtension = dto.iconFile.name.split(".").pop()?.toLowerCase() || "png";
      iconFileName = `icon.${iconExtension}`;
      const iconPath = DatasetPaths.getIconPath(dto.fileName, iconFileName);
      await writeFile(iconPath, Buffer.from(await dto.iconFile.arrayBuffer()));
    }

    // Se l'icona è diversa, aggiorna il record
    if (iconFileName !== "icon.png") {
      await this.datasetRepository.update(newDataset.datasetId, {
        iconFile: iconFileName,
      });
    }

    return newDataset;
  }

  /*
  Restituisce l'elenco di documenti PDF del dataset
  - Verifica esistenza dataset
  - Legge la cartella uploads associata
  - Filtra file con estensione .pdf
  - Se non esiste la cartella, restituisce []
  */
  async getDatasetDocuments(datasetId: number): Promise<string[]> {
    const dataset = await this.datasetRepository.findById(datasetId);
    if (!dataset) throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);

    const uploadDir = DatasetPaths.getUploadsFolder(dataset.geojsonFile);
    try {
      await stat(uploadDir);
      const files = await readdir(uploadDir);
      return files.filter(file => file.toLowerCase().endsWith(".pdf"));
    } catch (error: unknown) {
      return [];
    }
  }

  /*
  Carica documenti PDF nel dataset
  - Valida presenza file
  - Verifica esistenza dataset
  - Crea cartella uploads se necessario
  - Salva solo PDF validi
  - Registra modifica con elenco file caricati
  */
  async uploadDocumentsToDataset(datasetId: number, files: File[], userId: number, comment: string): Promise<void> {
    if (!files || files.length === 0) throw new AppError("Nessun file fornito.", 422);

    const dataset = await this.datasetRepository.findById(datasetId);
    if (!dataset) throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);

    const uploadDir = DatasetPaths.getUploadsFolder(dataset.geojsonFile);
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles: string[] = [];

    for (const file of files) {
      if (file.type !== "application/pdf") {
        continue;
      }
      const filePath = path.join(uploadDir, file.name);
      await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
      uploadedFiles.push(file.name);
    }

    if (uploadedFiles.length === 0) {
      throw new AppError("Nessun file PDF valido fornito.", 422);
    }

    const uploadedFileNames = uploadedFiles.join(", ");

    await this.modificationRepository.create({
      userId,
      datasetId,
      actionType: "updated",
      versionBefore: dataset.version,
      versionAfter: dataset.version,
      comment: comment || `Caricati ${uploadedFiles.length} documenti: ${uploadedFileNames}`,
    });
  }

  /*
  Aggiorna le features del GeoJSON
  - Carica GeoJSON corrente
  - Sostituisce l'array features mantenendo il resto
  - Scrive su disco il nuovo GeoJSON formattato
  - Incrementa versione in DB e registra modifica
  - Restituisce dataset aggiornato
  */
  async updateDatasetFeatures(datasetId: number, userId: number, newFeatures: any[], comment: string): Promise<any> {
    const dataset = await this.datasetRepository.findById(datasetId);
    if (!dataset) throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);

    const originalGeoJson = await this.loadGeoJsonFile(dataset.geojsonFile);
    // Sostituisce le features mantenendo tutto il resto del GeoJSON invariato
    const updatedGeoJson = {
      ...originalGeoJson,
      features: newFeatures,
    };

    const geojsonPath = DatasetPaths.getGeoJsonPath(dataset.geojsonFile);
    // Scrive il GeoJSON aggiornato su disco (formattato)
    await writeFile(geojsonPath, JSON.stringify(updatedGeoJson, null, 2));

    // Incrementa la versione del dataset
    const newVersion = dataset.version + 1;

    // Persiste la nuova versione nel database
    const updatedDatasetInDb = await this.datasetRepository.update(datasetId, { version: newVersion });

    await this.modificationRepository.create({
      userId,
      datasetId,
      actionType: "updated",
      versionBefore: dataset.version,
      versionAfter: newVersion,
      comment,
    });

    return updatedDatasetInDb;
  }

  /*
  Aggiorna metadati del dataset
  - Verifica esistenza dataset
  - Valida nome se presente
  - Verifica categoria se passata
  - Applica update e registra modifica
  */
  async updateDataset(datasetId: number, dto: UpdateGeoDatasetDTO, userId: number): Promise<any> {
    const dataset = await this.datasetRepository.findById(datasetId);
    if (!dataset) {
      throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);
    }

    if (dto.name) {
      this.validateDatasetName(dto.name);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findById(dto.categoryId);
      if (!category) {
        throw new AppError(`Categoria ${dto.categoryId} non trovata`, 404);
      }
    }

    const updatedDataset = await this.datasetRepository.update(datasetId, dto);

    await this.modificationRepository.create({
      userId,
      datasetId,
      actionType: "updated",
      versionBefore: dataset.version,
      versionAfter: dataset.version,
      comment: `Aggiornati metadati del dataset.`
    });

    return updatedDataset;
  }

  /*
  Archiviazione/eliminazione del dataset (hard delete)
  - Verifica esistenza dataset
  - Elimina record dal DB
  - Registra modifica di tipo archived
  */
  async deleteDataset(datasetId: number, userId: number): Promise<void> {
    const dataset = await this.datasetRepository.findById(datasetId);
    if (!dataset) {
      throw new AppError(`Dataset con ID ${datasetId} non trovato`, 404);
    }

    await this.datasetRepository.delete(datasetId);

    await this.modificationRepository.create({
      userId,
      datasetId,
      actionType: "archived",
      versionBefore: dataset.version,
      versionAfter: dataset.version,
      comment: "Dataset archiviato."
    });
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  // Mappa dataset a DTO con statistiche (senza GeoJSON)
  private async mapToStatsDTO(dataset: any): Promise<GeoDatasetStatsDTO> {
    const stats = await this.calculateDatasetStats(dataset.geojsonFile);

    return {
      id: dataset.datasetId,
      name: dataset.name,
      description: dataset.description,
      location: dataset.location,
      version: dataset.version,
      category: {
        id: dataset.category.categoryId,
        name: dataset.category.name,
      },
      isActive: dataset.isActive,
      isArchived: dataset.isArchived,
      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt,
      markerCount: stats.markerCount,
      fileSize: stats.fileSize,
    };
  }

  // Mappa dataset a DTO completo con GeoJSON
  private mapToFullDTO(dataset: any, geojson: any, icon: string): GeoDatasetResponseDTO {
    return {
      id: dataset.datasetId,
      name: dataset.name,
      description: dataset.description,
      location: dataset.location,
      version: dataset.version,
      category: {
        id: dataset.category.categoryId,
        name: dataset.category.name,
        description: dataset.category.description,
      },
      geojson,
      icon,
      createdAt: dataset.createdAt,
      updatedAt: dataset.updatedAt,
    };
  }

  // Arricchisce dataset con dati dai file
  private async enrichDatasetWithFiles(dataset: any): Promise<GeoDatasetResponseDTO | null> {
    try {
      const [geojson, icon] = await Promise.all([
        this.loadGeoJsonFile(dataset.geojsonFile),
        this.loadIconFile(dataset.geojsonFile, dataset.iconFile),
      ]);

      return this.mapToFullDTO(dataset, geojson, icon);
    } catch (error: unknown) {
      return null;
    }
  }

  // Carica GeoJSON
  private async loadGeoJsonFile(geojsonFile: string): Promise<any> {
    const fullPath = DatasetPaths.getGeoJsonPath(geojsonFile);

    try {
      const content = await readFile(fullPath, "utf-8");
      return JSON.parse(content);
    } catch (error: unknown) {
      throw new AppError(`File GeoJSON non trovato: ${geojsonFile}`, 404);
    }
  }

  // Carica icona
  private async loadIconFile(geojsonFile: string, iconFile: string): Promise<string> {
    const fullPath = DatasetPaths.getIconPath(geojsonFile, iconFile);

    try {
      const buffer = await readFile(fullPath);
      return `data:image/png;base64,${buffer.toString("base64")}`;
    } catch (error: unknown) {
      return "";
    }
  }

  // Calcola statistiche dataset
  private async calculateDatasetStats(geojsonFile: string): Promise<{ markerCount: number; fileSize: number }> {
    const filePath = DatasetPaths.getGeoJsonPath(geojsonFile);

    let markerCount = 0;
    let fileSize = 0;

    try {
      const fileStats = await stat(filePath);
      fileSize = fileStats.size;

      const content = await readFile(filePath, "utf-8");
      const geojson = JSON.parse(content);

      if (geojson.type === "FeatureCollection") {
        markerCount = geojson.features?.length || 0;
      } else if (geojson.type === "Feature") {
        markerCount = 1;
      }
    } catch (error: unknown) {
      throw new AppError("Errore calcolo statistiche", 500);
    }

    return { markerCount, fileSize };
  }

  // Validazione nome dataset
  private validateDatasetName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new AppError("Nome dataset obbligatorio", 422);
    }

    if (name.length > 255) {
      throw new AppError("Nome dataset troppo lungo (max 255 caratteri)", 422);
    }
  }
}
