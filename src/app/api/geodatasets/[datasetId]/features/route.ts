import { NextRequest, NextResponse } from 'next/server';
import { GeoDatasetController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new GeoDatasetController();

/**
 * PATCH /api/geodatasets/:datasetId/features - Richiede ruolo Admin o Superadmin
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ datasetId: string }> }) {
    const { datasetId } = await params;
    try {
        const user = requireAdmin(request);
        return controller.updateDatasetFeatures(request, datasetId, user.userId);
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