import { prisma } from "@/backend/prisma";
import { ChatbotResponse, Prisma } from "@prisma/client";

export class ChatbotResponseRepository {
  // Trova tutte le risposte chatbot di un utente
  async findByUserId(userId: number): Promise<any[]> {
    return await prisma.chatbotResponse.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Verifica esistenza per ID
  async existsById(responseId: number): Promise<boolean> {
    const count = await prisma.chatbotResponse.count({
      where: { responseId },
    });
    return count > 0;
  }

  // Crea nuova risposta chatbot
  async create(data: {
    userId: number;
    query: string;
    answer: string;
    geojsonData: Prisma.InputJsonValue;
  }): Promise<ChatbotResponse> {
    return await prisma.chatbotResponse.create({
      data: {
        userId: data.userId,
        query: data.query,
        answer: data.answer,
        geojsonData: data.geojsonData,
      },
    });
  }

  // Elimina risposta chatbot
  async delete(responseId: number): Promise<ChatbotResponse> {
    return await prisma.chatbotResponse.delete({
      where: { responseId },
    });
  }
}
