import { NextRequest, NextResponse } from 'next/server';
import { GeoDatasetController } from '@/backend/controllers'; // Dovremo creare questo metodo
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new GeoDatasetController();

/*
 GET /api/geodatasets/:datasetId/documents - Richiede ruolo Admin o Superadmin
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ datasetId: string }> }) {
    const { datasetId } = await params;
    try {
        requireAdmin(request);
        return controller.getDatasetDocuments(request, datasetId);
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
 POST /api/geodatasets/:datasetId/documents - Richiede ruolo Admin o Superadmin
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ datasetId: string }> }) {
    const { datasetId } = await params;
    try {
        const user = requireAdmin(request);
        return controller.uploadDocumentToDataset(request, datasetId, user.userId);
    } catch (error) {
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