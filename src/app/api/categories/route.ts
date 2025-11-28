import { NextRequest, NextResponse } from 'next/server';
import { CategoryController } from '@/backend/controllers';
import { requireAuth, requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new CategoryController();

/*
 GET /api/categories - - Richiede autenticazione
 */
export async function GET(request: NextRequest) {
  try {
    requireAuth(request);

    return controller.getAllCategories(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse();
      }
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

/*
 POST /api/categories - Richiede ruolo Admin o Super Admin
 */
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    return controller.createCategory(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) {
        return unauthorizedResponse();
      }
      if (error.message === AuthErrorType.FORBIDDEN) {
        return forbiddenResponse();
      }
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}