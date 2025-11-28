import { NextRequest, NextResponse } from "next/server";
import { ChatbotResponseService } from "@/backend/services";
import { CreateChatbotResponseDTO } from "@/backend/dto";
import { asyncHandler } from "@/backend/utils";

export class ChatbotResponseController {
  private chatbotResponseService: ChatbotResponseService;

  constructor() {
    this.chatbotResponseService = new ChatbotResponseService();
  }

  async getChatbotResponses(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");
      const listOnly = searchParams.get("list") === "true";

      if (!userId) {
        return NextResponse.json(
          { error: 'Query param "userId" obbligatorio' },
          { status: 400 }
        );
      }

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json(
          { error: "userId deve essere un numero" },
          { status: 400 }
        );
      }

      let responses;

      if (listOnly) {
        responses = await this.chatbotResponseService.getUserChatbotResponsesList(userIdNum);
      } else {
        responses = await this.chatbotResponseService.getUserChatbotResponses(userIdNum);
      }

      return NextResponse.json({ responses }, { status: 200 });
    });
  }

  async createChatbotResponse(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: CreateChatbotResponseDTO = await request.json();

      const requiredFields = ["userId", "query", "answer", "geojsonData"];
      const missingFields = requiredFields.filter(
        (field) => !body[field as keyof CreateChatbotResponseDTO]
      );

      if (missingFields.length > 0) {
        return NextResponse.json(
          { error: "Campi obbligatori mancanti", missingFields },
          { status: 400 }
        );
      }

      const response = await this.chatbotResponseService.createChatbotResponse(body);

      return NextResponse.json(
        { message: "Risposta chatbot creata con successo", response },
        { status: 201 }
      );
    });
  }

  async deleteChatbotResponse(request: NextRequest, responseId: string): Promise<NextResponse> {
    return asyncHandler(async () => {
      const responseIdNum = parseInt(responseId);
      if (isNaN(responseIdNum)) {
        return NextResponse.json(
          { error: "Response ID deve essere un numero" },
          { status: 400 }
        );
      }

      await this.chatbotResponseService.deleteChatbotResponse(responseIdNum);

      return NextResponse.json(
        { message: "Risposta chatbot eliminata con successo" },
        { status: 200 }
      );
    });
  }

  async getUserStats(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: 'Query param "userId" obbligatorio' },
          { status: 400 }
        );
      }

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        return NextResponse.json(
          { error: "userId deve essere un numero" },
          { status: 400 }
        );
      }

      const stats = await this.chatbotResponseService.getUserStats(userIdNum);

      return NextResponse.json({ stats }, { status: 200 });
    });
  }
}
