import { NextRequest } from 'next/server';
import { ChatbotResponseController } from '@/backend/controllers';
import { requireAuth, unauthorizedResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';
import { Role } from '@prisma/client';

const controller = new ChatbotResponseController();

/*
 GET /api/chatbot/responses?userId=X - Richiede autenticazione
 */
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    if (requestedUserId) {
      const userId = parseInt(requestedUserId);

      if (user.role !== Role.admin && user.userId !== userId) {
        return unauthorizedResponse('Puoi vedere solo le tue risposte');
      }
    }

    return controller.getChatbotResponses(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse('Devi effettuare il login');
      }
    }
    throw error;
  }
}

/*
 POST /api/chatbot/responses - Richiede autenticazione
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const body = await request.json();

    if (body.userId && body.userId !== user.userId) {
      return unauthorizedResponse('Puoi creare risposte solo per te stesso');
    }

    body.userId = user.userId;

    // Ricrea request con body modificato
    const modifiedRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    });

    return controller.createChatbotResponse(modifiedRequest as NextRequest);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse('Devi effettuare il login');
      }
    }

    throw error;
  }
}
