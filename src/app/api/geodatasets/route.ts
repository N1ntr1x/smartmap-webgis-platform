import { NextRequest, NextResponse } from 'next/server';
import { GeoDatasetController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new GeoDatasetController();

/**
 GET /api/geodatasets
 */
export async function GET(request: NextRequest) {
  return controller.getAllDatasets(request);
}

/*
 POST /api/geodatasets - Richiede ruolo Admin o Superadmin
 */
export async function POST(request: NextRequest) {
  try {
    const user = requireAdmin(request);
    return controller.createDataset(request, user.userId);
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