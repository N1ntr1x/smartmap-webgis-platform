import { NextRequest, NextResponse } from 'next/server';
import { UserController } from '@/backend/controllers/UserController';
import { requireAuth, unauthorizedResponse } from '@/backend/middleware/auth';
import { AuthError } from '@/backend/errors';

const controller = new UserController();

/*
 PATCH /api/users/me/password - Richiede autenticazione
 */
export async function PATCH(request: NextRequest) {
    try {
        const currentUser = requireAuth(request);
        return controller.changeUserPassword(request, currentUser.userId);
    } catch (error: unknown) {
        if (error instanceof AuthError) return unauthorizedResponse();
        return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
    }
}