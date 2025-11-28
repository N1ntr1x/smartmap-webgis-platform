import {
  MarkerProperties,
  REQUIRED_MARKER_FIELDS,
  RequiredMarkerKeys
} from "@/features/marker";

/*
Utility validazione marker con logica configurabile

PATTERN VALIDAZIONE:
1. isValidValue: check singolo valore (null, vuoto, array/object vuoti)
2. cleanObject: rimuove proprietà invalide da oggetto
3. isValidMarker: valida marker completo contro REQUIRED_MARKER_FIELDS

CONFIGURABILITÀ:
- Modifica REQUIRED_MARKER_FIELDS per cambiare validazione
- Type guard TypeScript + runtime check coerenti
*/

// Verifica se valore è considerato valido (non vuoto)
export function isValidValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return false;

  return true;
}

// Pulisce oggetto rimuovendo proprietà con valori invalidi
export function cleanObject(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isValidValue(value)) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/*
Validazione marker con type guard TypeScript

LOGICA:
1. Filtra REQUIRED_MARKER_FIELDS per ottenere solo campi obbligatori (true)
2. Verifica che tutti i campi obbligatori siano presenti e validi
3. Type guard assicura che properties sia MarkerProperties se validazione passa

MANUTENIBILITÀ:
- Cambio REQUIRED_MARKER_FIELDS aggiorna automaticamente validazione
- Nessuna hardcoded list di campi
*/
export function isValidMarker(properties: any): properties is MarkerProperties {
  if (!properties || typeof properties !== "object") return false;

  // Estrai solo chiavi obbligatorie (valore true nella config)
  const requiredKeys = Object.entries(REQUIRED_MARKER_FIELDS)
    .filter(([_, isRequired]) => isRequired === true)
    .map(([key]) => key) as RequiredMarkerKeys[];

  // Verifica tutti i campi obbligatori
  return requiredKeys.every(key => {
    const value = properties[key];
    return value && typeof value === "string" && value.trim() !== "";
  });
}
