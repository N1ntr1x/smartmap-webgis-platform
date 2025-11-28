import { NextRequest, NextResponse } from 'next/server';
import { GeoDatasetController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new GeoDatasetController();

/*
 GET /api/geodatasets/:datasetId
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;
    return controller.getDatasetById(request, datasetId);
  } catch (error) {
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

/*
 PATCH /api/geodatasets/:datasetId - Richiede ruolo Admin o Superadmin
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const user = requireAdmin(request);

    const { datasetId } = await params;
    return controller.updateDataset(request, datasetId, user.userId);
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
 DELETE /api/geodatasets/:datasetId - Richiede ruolo Admin o Superadmin
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const user = requireAdmin(request);

    const { datasetId } = await params;
    return controller.deleteDataset(request, datasetId, user.userId);
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