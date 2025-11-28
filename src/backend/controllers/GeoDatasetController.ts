import { NextRequest, NextResponse } from "next/server";
import { GeoDatasetService } from "@/backend/services";
import { UpdateGeoDatasetDTO, ServiceCreateGeoDatasetDTO } from "@/backend/dto";
import { isAdmin } from "@/backend/middleware/auth";
import { asyncHandler } from "@/backend/utils";

export class GeoDatasetController {
  private datasetService: GeoDatasetService;

  constructor() {
    this.datasetService = new GeoDatasetService();
  }

  async getAllDatasets(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasets = await this.datasetService.getAllDatasets();
      return NextResponse.json(
        { datasets },
        { status: 200 }
      );
    });
  }

  async getDatasetsStats(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const includeInactive = isAdmin(request);
      const datasets = await this.datasetService.getDatasetsStats(includeInactive);
      return NextResponse.json(
        { datasets },
        { status: 200 }
      );
    });
  }

  async getDatasetById(request: NextRequest, datasetId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);

      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "Dataset ID deve essere un numero" },
          { status: 400 }
        );
      }

      const dataset = await this.datasetService.getDatasetById(datasetIdNum);
      return NextResponse.json(
        { dataset },
        { status: 200 }
      );
    });
  }

  async createDataset(request: NextRequest, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const formData = await request.formData();
      const geojsonFile = formData.get("geojsonFile") as File | null;
      const iconFile = formData.get("iconFile") as File | null;
      const name = formData.get("name") as string;
      const category = formData.get("category") as string;
      const fileName = formData.get("fileName") as string;

      if (!name || !category || !geojsonFile || !fileName) {
        return NextResponse.json(
          { error: "Campi obbligatori mancanti" },
          { status: 400 }
        );
      }

      const serviceDto: ServiceCreateGeoDatasetDTO = {
        name,
        fileName,
        description: formData.get("description") as string | undefined,
        location: formData.get("location") as string | undefined,
        category,
        comment: formData.get("comment") as string | null,
        geojsonFile,
        iconFile,
        userId,
      };

      const dataset = await this.datasetService.createDataset(serviceDto);
      return NextResponse.json(
        { message: "Dataset creato con successo", dataset },
        { status: 201 }
      );
    });
  }

  async updateDataset(request: NextRequest, datasetId: string, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);
      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "Dataset ID deve essere un numero" },
          { status: 400 }
        );
      }

      const body: UpdateGeoDatasetDTO = await request.json();
      if (Object.keys(body).length === 0) {
        return NextResponse.json(
          { error: "Nessun campo da aggiornare" },
          { status: 400 }
        );
      }

      const dataset = await this.datasetService.updateDataset(datasetIdNum, body, userId);
      return NextResponse.json(
        { message: "Dataset aggiornato con successo", dataset },
        { status: 200 }
      );
    });
  }

  async deleteDataset(request: NextRequest, datasetId: string, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);

      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "Dataset ID deve essere un numero" },
          { status: 400 }
        );
      }

      await this.datasetService.deleteDataset(datasetIdNum, userId);

      return NextResponse.json(
        { message: "Dataset archiviato con successo" },
        { status: 200 }
      );
    });
  }

  async getDatasetDocuments(request: NextRequest, datasetId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);
      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "ID non valido" },
          { status: 400 }
        );
      }

      const documents = await this.datasetService.getDatasetDocuments(datasetIdNum);
      return NextResponse.json({ documents });
    });
  }

  async uploadDocumentToDataset(request: NextRequest, datasetId: string, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);
      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "ID non valido" },
          { status: 400 }
        );
      }

      const formData = await request.formData();
      const files = formData.getAll("documents") as File[];
      const comment = formData.get("comment") as string | "";

      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: "Nessun file trovato nel form." },
          { status: 400 }
        );
      }

      await this.datasetService.uploadDocumentsToDataset(datasetIdNum, files, userId, comment);
      return NextResponse.json({ message: `${files.length} documento/i caricato/i con successo.` });
    });
  }

  async updateDatasetFeatures(request: NextRequest, datasetId: string, userId: number): Promise<NextResponse> {
    return asyncHandler(async () => {
      const datasetIdNum = parseInt(datasetId);
      if (isNaN(datasetIdNum)) {
        return NextResponse.json(
          { error: "ID dataset non valido" },
          { status: 400 }
        );
      }

      const body = await request.json();
      const { features, comment } = body;

      if (!features || !Array.isArray(features) || !comment || comment.trim() === "") {
        return NextResponse.json(
          { error: 'Dati incompleti. Sono richieste le "features" e un "comment" non vuoto.' },
          { status: 400 }
        );
      }

      const updatedDataset = await this.datasetService.updateDatasetFeatures(datasetIdNum, userId, features, comment);

      return NextResponse.json({ message: "Dataset aggiornato con successo", dataset: updatedDataset });
    });
  }
}
