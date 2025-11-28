import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/backend/controllers/UserController';
import { requireSuperAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new UserController();

/*
 POST /api/users/admin - Richiede ruolo Superadmin
 */
export async function POST(request: NextRequest) {
  try {
    requireSuperAdmin(request);
    return controller.createAdmin(request);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) return unauthorizedResponse();
      if (error.message === AuthErrorType.FORBIDDEN) return forbiddenResponse();
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}