import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/backend/controllers/UserController';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new UserController();

/*
 PATCH /api/users/:userId/reset-password - Richiede ruolo Admin o Superadmin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Richiede almeno il ruolo di Admin per accedere
    const user = requireAdmin(request);
    const { userId } = await params;
    return controller.resetPasswordByAdmin(request, userId, user);
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      if (error.message === AuthErrorType.UNAUTHENTICATED) return unauthorizedResponse();
      if (error.message === AuthErrorType.FORBIDDEN) return forbiddenResponse();
    }
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}