import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/backend/controllers/UserController';
import { requireAdmin, requireAuth, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new UserController();

/*
 PATCH /api/users/:userId - Richiede ruolo Admin o Superadmin
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const currentUser = requireAdmin(request);
    const { userId } = await params;
    return controller.updateUser(request, userId, currentUser);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) return unauthorizedResponse();
      if (error.message === AuthErrorType.FORBIDDEN) return forbiddenResponse();
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

/*
 DELETE /api/users/:userId - Richiede ruolo Admin o Superadmin
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const currentUser = requireAdmin(request);
    const { userId } = await params;
    return controller.deleteUser(request, userId, currentUser);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) return unauthorizedResponse();
      if (error.message === AuthErrorType.FORBIDDEN) return forbiddenResponse();
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}