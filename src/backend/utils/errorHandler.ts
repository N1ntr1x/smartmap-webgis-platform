import { NextResponse } from 'next/server';
import { AppError } from '@/backend/errors';

/*
Helper per gestire gli errori nei controller
Restituisce una NextResponse con il codice di stato appropriato
*/
export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  // Errore generico non previsto
  return NextResponse.json(
    { error: 'Errore interno del server' },
    { status: 500 }
  );
}

/* 
Wrapper per eseguire funzioni async nei controller con gestione errori automatica

Esempio di uso:

async login(request: NextRequest): Promise<NextResponse> {
  return asyncHandler(async () => {
    const body = await request.json();
    const result = await this.authService.login(body);
    return NextResponse.json({ user: result.user });
  });
}
*/
export async function asyncHandler(
  fn: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error: unknown) {
    return handleError(error);
  }
}
