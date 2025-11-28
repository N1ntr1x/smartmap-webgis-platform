import { ChatbotResponseRepository } from "@/backend/repositories";
import {
  CreateChatbotResponseDTO,
  ChatbotResponseDTO,
  ChatbotResponseListItemDTO,
} from "@/backend/dto";
import { AppError } from "@/backend/errors"
import { MAX_SIZE_GEOJSON_CHATBOT } from "@/backend/config";

export class ChatbotResponseService {
  private chatbotResponseRepository: ChatbotResponseRepository;

  constructor() {
    this.chatbotResponseRepository = new ChatbotResponseRepository();
  }

  // Ottieni tutte le risposte chatbot di un utente
  async getUserChatbotResponses(userId: number): Promise<ChatbotResponseDTO[]> {
    const responses = await this.chatbotResponseRepository.findByUserId(userId);
    return responses.map(response => this.mapToFullResponse(response));
  }

  // Ottieni lista risposte chatbot (solo metadata)
  async getUserChatbotResponsesList(userId: number): Promise<ChatbotResponseListItemDTO[]> {
    const responses = await this.chatbotResponseRepository.findByUserId(userId);
    return responses.map(response => this.mapToListItem(response));
  }

  // Crea nuova risposta chatbot
  async createChatbotResponse(dto: CreateChatbotResponseDTO): Promise<any> {
    this.validateQuery(dto.query);
    this.validateGeoJson(dto.geojsonData);

    return await this.chatbotResponseRepository.create({
      userId: dto.userId,
      query: dto.query,
      answer: dto.answer,
      geojsonData: dto.geojsonData,
    });
  }

  // Elimina risposta chatbot
  async deleteChatbotResponse(responseId: number): Promise<void> {
    const exists = await this.chatbotResponseRepository.existsById(responseId);
    if (!exists) {
      throw new AppError(`Risposta chatbot con ID ${responseId} non trovata`, 404);
    }

    await this.chatbotResponseRepository.delete(responseId);
  }

  // Statistiche utente
  async getUserStats(userId: number): Promise<{
    totalResponses: number;
    totalMarkers: number;
    lastResponseDate: Date | null;
  }> {
    const responses = await this.chatbotResponseRepository.findByUserId(userId);

    const totalResponses = responses.length;

    // Conta il numero totale di features presenti nei GeoJSON delle risposte
    const totalMarkers = responses.reduce((sum, response) => {
      const geojson = response.geojsonData as any;
      return sum + (geojson?.features?.length || 0);
    }, 0);

    // Data dell'ultima risposta (lista ordinata per createdAt desc nel repository)
    const lastResponseDate = totalResponses > 0 ? responses[0].createdAt : null;

    return {
      totalResponses,
      totalMarkers,
      lastResponseDate,
    };
  }

  ////////////// MAPPER E METODI PRIVATI //////////////

  private mapToFullResponse(response: any): ChatbotResponseDTO {
    return {
      id: response.responseId,
      query: response.query,
      answer: response.answer,
      geojsonData: response.geojsonData,
      createdAt: response.createdAt,
    };
  }

  private mapToListItem(response: any): ChatbotResponseListItemDTO {
    const geojson = response.geojsonData as any;
    const featuresCount = geojson?.features?.length || 0;

    return {
      id: response.responseId,
      query: response.query,
      answer: response.answer,
      featuresCount,
      createdAt: response.createdAt,
    };
  }

  // Validazione query utente
  private validateQuery(query: string): void {
    if (!query || query.trim().length === 0) {
      throw new AppError("Query obbligatoria", 422);
    }

    if (query.length < 3) {
      throw new AppError("Query troppo corta (minimo 3 caratteri)", 422);
    }

    if (query.length > 500) {
      throw new AppError("Query troppo lunga (massimo 500 caratteri)", 422);
    }
  }

  // Validazione GeoJSON
  private validateGeoJson(geojson: any): void {
    if (!geojson) {
      throw new AppError("GeoJSON obbligatorio", 422);
    }

    if (typeof geojson !== "object") {
      throw new AppError("GeoJSON deve essere un oggetto", 422);
    }

    if (geojson.type !== "FeatureCollection" && geojson.type !== "Feature") {
      throw new AppError("GeoJSON type deve essere FeatureCollection o Feature", 422);
    }

    // Calcola la dimensione del GeoJSON per rispettare il limite configurato
    const jsonString = JSON.stringify(geojson);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > MAX_SIZE_GEOJSON_CHATBOT) {
      throw new AppError(
        `GeoJSON troppo grande (${sizeInMB.toFixed(2)}MB, massimo ${MAX_SIZE_GEOJSON_CHATBOT}MB)`,
        413
      );
    }
  }
}
