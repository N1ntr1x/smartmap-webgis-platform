import { NextRequest, NextResponse } from 'next/server';
import { CategoryController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new CategoryController();

/*
 PATCH /api/categories/:categoryId - Richiede ruolo Admin o Super Admin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    requireAdmin(request);
    const { categoryId } = await params;
    return controller.updateCategory(request, categoryId);
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
 DELETE /api/categories/:categoryId - Richiede ruolo Admin o Super Admin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    requireAdmin(request);
    const { categoryId } = await params;
    return controller.deleteCategory(request, categoryId);
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