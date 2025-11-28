/*
Sistema di validazione marker configurabile (Defense in Depth - Livello 2)

In combinazione con il backend questa è il secondo livello di sicurezza per la validazione dei Marker
Se i marker presenti nel backend non sono validi la piattaforma non collassa

PATTERN:
1. Definisci campi obbligatori in REQUIRED_MARKER_FIELDS (true = obbligatorio)
2. Type system TypeScript deriva automaticamente tipi da config
3. Validazione runtime usa stessa config per coerenza

VANTAGGI:
- Singola fonte verità per campi obbligatori
- Cambio config aggiorna automaticamente tipi e validazione
- Type-safe: impossibile validare campi non dichiarati
*/

// Config campi marker: true = obbligatorio, false = opzionale
export const REQUIRED_MARKER_FIELDS = {
  name: true,
  description: true,
  category: true,
  city: true,
} as const;

// Utility type: filtra solo chiavi con valore true
type FilterByValue<Obj, ValueType> = {
  [K in keyof Obj]: Obj[K] extends ValueType ? K : never;
}[keyof Obj];

// Type derivato: solo campi obbligatori (con true)
export type RequiredMarkerKeys = FilterByValue<typeof REQUIRED_MARKER_FIELDS, true>;

// Interface campi obbligatori (derivata da config)
export type RequiredMarkerProperties = {
  [K in RequiredMarkerKeys]: string;
};

// Interface completa marker con campi opzionali
export interface MarkerProperties extends RequiredMarkerProperties {
  icon?: string | null;
  color?: string | null;
  sources?: {
    web?: string[];
    documents?: string[];
  };
  customData?: Record<string, any>;
}
