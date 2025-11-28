import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/backend/controllers';
import { requireAuth, unauthorizedResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new AuthController();

/*
 GET /api/auth/me - Richiede autenticazione
 */
export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
    return controller.getMe(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse();
      }
    }
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
