// Regole validazione centralizzate per form autenticazione
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 50,
  LASTNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
} as const;

// Messaggi errore validazione
export const VALIDATION_MESSAGES = {
  PASSWORD_MISMATCH: "Le password non coincidono",
  PASSWORD_TOO_SHORT: `La password deve essere di almeno ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caratteri`,

  NAME_TOO_LONG: "Il nome non può superare 50 caratteri",
  NAME_TOO_SHORT: "Il nome deve contenere almeno 2 caratteri",

  LASTNAME_TOO_LONG: "Il cognome non può superare 50 caratteri",
  LASTNAME_TOO_SHORT: "Il cognome deve contenere almeno 2 caratteri",

  EMAIL_TOO_LONG: "L'email non può superare 100 caratteri",
  EMAIL_TOO_SHORT: "L'email deve contenere almeno 5 caratteri",
} as const;
