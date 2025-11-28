import { NextRequest, NextResponse } from "next/server";
import { LoginDTO, RegisterDTO } from "@/backend/dto";
import { AuthService } from "@/backend/services"
import { getUserFromRequest, COOKIE_NAME } from "@/backend/middleware/auth";
import { asyncHandler } from "@/backend/utils";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      // Legge email e password dal body della richiesta
      const body: LoginDTO = await request.json();

      // Controlla campi obbligatori
      if (!body.email || !body.password) {
        return NextResponse.json(
          { error: "Email e password obbligatori" },
          { status: 400 }
        );
      }

      // Delega l'autenticazione al servizio
      const result = await this.authService.login(body);

      const response = NextResponse.json(
        {
          message: "Login effettuato con successo",
          user: result.user,
        },
        { status: 200 }
      );

      // Salva il token in cookie httpOnly
      response.cookies.set(COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    });
  }

  async register(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      const body: RegisterDTO = await request.json();

      if (!body.email || !body.password || !body.firstName) {
        return NextResponse.json(
          { error: "Email, password e nome obbligatori" },
          { status: 400 }
        );
      }

      const result = await this.authService.register(body);

      const response = NextResponse.json(
        {
          message: "Registrazione completata con successo",
          user: result.user,
        },
        { status: 201 }
      );

      response.cookies.set(COOKIE_NAME, result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    });
  }

  async logout(request: NextRequest): Promise<NextResponse> {
    const response = NextResponse.json(
      { message: "Logout effettuato con successo" },
      { status: 200 }
    );

    // Rimuove il cookie di sessione
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  async getMe(request: NextRequest): Promise<NextResponse> {
    return asyncHandler(async () => {
      // Verifica il Token ed estrae le info utente
      const currentUser = getUserFromRequest(request);

      if (!currentUser) {
        return NextResponse.json(
          { error: "Non autenticato" },
          { status: 401 }
        );
      }

      const user = await this.authService.getMe(currentUser.userId);
      return NextResponse.json({ user }, { status: 200 });
    });
  }
}
