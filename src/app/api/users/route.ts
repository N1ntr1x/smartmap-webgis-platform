import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/backend/controllers/UserController';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new UserController();

/*
 GET /api/users - Richiede ruolo Admin o Superadmin
 */
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);
    return controller.getAllUsers(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) return unauthorizedResponse();
      if (error.message === AuthErrorType.FORBIDDEN) return forbiddenResponse();
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}