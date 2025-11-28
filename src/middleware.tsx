import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware globale:
 * - Intercetta tutte le richieste (esclusi asset _next, immagini e favicon, vedi config.matcher).
 * - Se la richiesta è verso /api e sembra provenire da un browser (Accept include 'text/html')
 *   viene eseguito un redirect a /unauthorized.
 * - Le chiamate API "normali" (fetch che non richiedono HTML) continuano normalmente.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  if (pathname.startsWith('/api')) {
    const acceptHeader = request.headers.get('accept') || '';
    const isBrowser = acceptHeader.includes('text/html');

    if (isBrowser) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Configurazione del middleware:
 * - matcher esclude le risorse statiche e le immagini generate da Next.js e la favicon
 *   in modo che il middleware non venga eseguito per quei percorsi.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
