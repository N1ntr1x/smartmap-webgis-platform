// Dati parsati da file sorgente
export interface ParsedData {
  headers: string[];        // Nomi colonne/campi
  rows: any[];              // Array oggetti dati
  isGeoJSON: boolean;       // Flag formato GeoJSON
}

// Configurazione mappatura campi per trasformazione
export interface TransformationConfig {
  standardMappings: Record<string, string>;  // Campo standard → campo sorgente
  latLonMapping?: { lat: string; lon: string }; // Mapping coordinate (solo CSV/JSON)
  multiMappings: {
    web: string[];          // Campi sorgente per array web links
    documents: string[];    // Campi sorgente per array documents
  };
  ignoredFields: string[];  // Campi da escludere da customData
}
