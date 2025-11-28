import { NextRequest, NextResponse } from 'next/server';
import { DatasetModificationController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new DatasetModificationController();

/*
 PATCH /api/modifications/:modificationId - Richiede ruolo Admin o Superadmin
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ modificationId: string }> }) {
  try {
    requireAdmin(request);
    const { modificationId } = await params;
    return controller.updateModification(request, modificationId);
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

/*
 DELETE /api/modifications/:modificationId - Richiede ruolo Admin o Superadmin
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ modificationId: string }> }) {
  try {
    requireAdmin(request);
    const { modificationId } = await params;
    return controller.deleteModification(request, modificationId);
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