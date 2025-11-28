import { NextRequest, NextResponse } from "next/server";
import { DatasetModificationService } from "@/backend/services";
import { CreateDatasetModificationDTO, UpdateDatasetModificationDTO } from "@/backend/dto";
import { asyncHandler } from "@/backend/utils";

export class DatasetModificationController {
  private modificationService: DatasetModificationService;

  constructor() {
    this.modificationService = new DatasetModificationService();
  }

  async getAllModifications(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const modifications = await this.modificationService.getAllModifications();
      return NextResponse.json(
        { modifications },
        { status: 200 }
      );
    });
  }

  async updateModification(request: NextRequest, modificationId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const modificationIdNum = parseInt(modificationId);
      const body: UpdateDatasetModificationDTO = await request.json();
      const modification = await this.modificationService.updateModification(modificationIdNum, body);
      return NextResponse.json(
        { message: "Modifica aggiornata con successo", modification },
        { status: 200 }
      );
    });
  }

  async deleteModification(request: NextRequest, modificationId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const modificationIdNum = parseInt(modificationId);
      await this.modificationService.deleteModification(modificationIdNum);
      return NextResponse.json(
        { message: "Modifica eliminata con successo" },
        { status: 200 }
      );
    });
  }

  async createModification(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: CreateDatasetModificationDTO = await request.json();

      const requiredFields = ["userId", "datasetId", "actionType"];
      const missingFields = requiredFields.filter(
        (field) => !body[field as keyof CreateDatasetModificationDTO]
      );

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: "Campi obbligatori mancanti", missingFields },
          { status: 400 }
        );
      }

      const modification = await this.modificationService.createModification(body);

      return NextResponse.json(
        { message: "Modifica registrata con successo", modification },
        { status: 201 }
      );
    });
  }
}
