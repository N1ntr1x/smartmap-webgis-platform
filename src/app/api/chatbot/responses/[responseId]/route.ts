// src/app/api/chatbot/responses/[responseId]/route.ts

import { NextRequest } from 'next/server';
import { ChatbotResponseController } from '@/backend/controllers';
import { requireAuth, unauthorizedResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new ChatbotResponseController();

/*
 DELETE /api/chatbot/responses/:responseId
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ responseId: string }> }
) {
  try {
    const { responseId } = await params;

    requireAuth(request);
    return controller.deleteChatbotResponse(request, responseId);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse();
      }
    }
    throw error;
  }
}
