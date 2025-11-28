// src/app/api/chatbot/responses/stats/route.ts

import { NextRequest } from 'next/server';
import { ChatbotResponseController } from '@/backend/controllers';
import { requireAuth, unauthorizedResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';
import { Role } from '@prisma/client';

const controller = new ChatbotResponseController();

/*
 GET /api/chatbot/responses/stats?userId=X
 */
export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    if (requestedUserId) {
      const userId = parseInt(requestedUserId);

      // Solo owner o admin può vedere stats
      if (user.role !== Role.admin && user.userId !== userId) {
        return unauthorizedResponse('Puoi vedere solo le tue statistiche');
      }
    }

    return controller.getUserStats(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse();
      }
    }
    throw error;
  }
}
