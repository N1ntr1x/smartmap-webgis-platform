import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "@prisma/client";

// Validazione variabili d'ambiente all'avvio
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET non configurato. Aggiungi JWT_SECRET nel file .env.local"
  );
}

/* 
Struttura del payload JWT usata nell'app:
- userId: identificativo numerico dell'utente
- email: email dell'utente
- role: ruolo (presa dall'enum Role di Prisma)

Questo tipo viene usato per tipizzare il payload sia alla generazione che alla verifica.
*/
export interface JWTPayload {
  userId: number;
  email: string;
  role: Role;
}

// Type guard per validare il payload decodificato
function isJWTPayload(decoded: unknown): decoded is JWTPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    "userId" in decoded &&
    typeof (decoded as any).userId === "number" &&
    "email" in decoded &&
    typeof (decoded as any).email === "string" &&
    "role" in decoded &&
    typeof (decoded as any).role === "string"
  );
}

/* 
Genera un token JWT firmato con la secret configurata.
- payload: oggetto conforme a JWTPayload
- utilizza JWT_EXPIRES_IN per impostare la scadenza se presente
Ritorna la stringa del token firmato.
*/
export function generateToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  } as SignOptions;

  return jwt.sign(payload, JWT_SECRET, options);
}

/* 
Verifica e decodifica un token JWT.
- Se il token è valido e il payload contiene i campi attesi, ritorna JWTPayload.
- In caso di token mancante, invalido o con formato non atteso, ritorna null.

Nota:
- jwt.verify può ritornare string | object; per sicurezza applichiamo un type guard
  che controlla la presenza dei campi necessari prima di fare il cast a JWTPayload.
*/
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    return isJWTPayload(decoded) ? decoded : null;
  } catch (error) {
    return null;
  }
}
