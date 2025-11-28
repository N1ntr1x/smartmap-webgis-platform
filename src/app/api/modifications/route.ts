// src/app/api/modifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DatasetModificationController } from '@/backend/controllers';
import { requireAdmin, unauthorizedResponse, forbiddenResponse } from '@/backend/middleware/auth';
import { AuthError, AuthErrorType } from '@/backend/errors';

const controller = new DatasetModificationController();

/*
 GET /api/modifications - Richiede ruolo Admin o Superadmin
 */
export async function GET(request: NextRequest) {
    try {
        requireAdmin(request);
        return controller.getAllModifications(request);
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
 POST /api/modifications - Richiede ruolo Admin o Superadmin
 */
export async function POST(request: NextRequest) {
    try {
        requireAdmin(request);
        return controller.createModification(request);
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