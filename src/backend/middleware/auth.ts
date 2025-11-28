import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JWTPayload } from "@/backend/utils/jwt";
import { Role } from "@prisma/client";
import { AuthError, AuthErrorType } from "@/backend/errors";

export const COOKIE_NAME = "auth_token";

/*
Estrae l'utente dal cookie JWT presente nella request.
Restituisce il payload decodificato o null se non esiste/è invalido.
*/
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

/*
Middleware helper che richiede autenticazione.
Lancia AuthError(UNAUTHENTICATED) se non è presente un utente valido.
Ritorna il payload JWT dell'utente autenticato.
*/
export function requireAuth(request: NextRequest): JWTPayload {
  const user = getUserFromRequest(request);

  if (!user) {
    throw new AuthError(AuthErrorType.UNAUTHENTICATED);
  }

  return user;
}

/*
Middleware helper che richiede ruolo admin.
Lancia AuthError(FORBIDDEN) se l'utente non ha ruolo admin o super_admin.
*/
export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (user.role !== Role.admin && user.role !== Role.super_admin) {
    throw new AuthError(AuthErrorType.FORBIDDEN);
  }
  return user;
}

/*
Middleware helper che richiede ruolo super_admin.
Lancia AuthError(FORBIDDEN) se l'utente non è super_admin.
*/
export function requireSuperAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (user.role !== Role.super_admin) {
    throw new AuthError(AuthErrorType.FORBIDDEN);
  }
  return user;
}

///////////// HELPER FUNCTIONS /////////////

/*
Verifica se l'utente è autenticato
*/
export function isAuthenticated(request: NextRequest): boolean {
  return getUserFromRequest(request) !== null;
}

/*
Verifica e ritorna true se l'utente è admin (admin o super_admin)
*/
export function isAdmin(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  return user !== null && (user.role === Role.admin || user.role === Role.super_admin);
}

/*
Verifica e ritorna true se l'utente è super admin
*/
export function isSuperAdmin(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  return user !== null && user.role === Role.super_admin;
}

/*
Verifica e ritorna true se l'utente è un user normale
*/
export function isRegularUser(request: NextRequest): boolean {
  const user = getUserFromRequest(request);
  return user !== null && user.role === Role.user;
}

/*
Response helper: costruisce una NextResponse JSON 401 Unauthorized.
*/
export function unauthorizedResponse(message: string = AuthErrorType.UNAUTHENTICATED): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}

/*
Response helper: costruisce una NextResponse JSON 401 Unauthorized.
*/
export function forbiddenResponse(message: string = AuthErrorType.FORBIDDEN): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  );
}
