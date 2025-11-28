/*
Definisce i messaggi di errore standard per il middleware di autenticazione.
L'uso di un enum centralizza i messaggi.
*/
export enum AuthErrorType {
  UNAUTHENTICATED = "Non autenticato",
  FORBIDDEN = "Accesso negato",
}

/*
Una classe di errore personalizzata per gestire gli errori di autenticazione in modo strutturato.
Estende la classe Error nativa.
*/
export class AuthError extends Error {
  constructor(message: AuthErrorType) {
    super(message); // Passa il messaggio alla classe Error genitore
    this.name = "AuthError";
  }
}