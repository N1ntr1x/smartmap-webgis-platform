"use client";

import { useState } from "react";
import Papa from "papaparse";
import { ParsedData } from "@/features/tool";

/*
useFileParser - Hook parsing file con validazione STRICT

SCOPO:
Parsare e validare file CSV, JSON, GeoJSON prima della conversione.
Blocca file non conformi al formato richiesto.

VALIDAZIONI:
- Solo geometry tipo Point per GeoJSON
- Valori primitivi (string/number/boolean) - no oggetti/array nested
- Presenza obbligatoria campi coordinate per JSON/CSV
- No file già in formato piattaforma (con sources/customData nested)
- No JSON embedded in celle CSV
- No sintassi malformata

OUTPUT:
- Errore generico per qualsiasi violazione formato
*/
export default function useFileParser() {
  // State errore per UI
  const [error, setError] = useState<string | null>(null);

  // Messaggio errore unico per tutti i casi
  const GENERIC_ERROR = "❌ Il file non rispetta il formato richiesto.";

  /*
  isPrimitiveValue - Verifica se valore è tipo primitivo
  
  ACCETTATI: null, undefined, string, number, boolean
  RIFIUTATI: oggetti, array, funzioni
  */
  const isPrimitiveValue = (value: any): boolean => {
    return value === null ||
      value === undefined ||
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean";
  };

  /*
  hasOnlyPrimitiveValues - Verifica oggetto contiene solo valori primitivi
  
  Controlla TUTTI i valori dell'oggetto siano primitivi.
  Usato per validare properties GeoJSON e righe JSON/CSV.
  */
  const hasOnlyPrimitiveValues = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(val => isPrimitiveValue(val));
  };

  /*
  isAlreadyPlatformFormat - Rileva file già in formato piattaforma
  
  BLOCCA file con:
  - sources: { web: [], documents: [] }
  - customData: { ... }
  
  Questi file sono già convertiti e non devono ripassare dal tool.
  */
  const isAlreadyPlatformFormat = (data: any): boolean => {
    if (data.type !== "FeatureCollection" || !Array.isArray(data.features)) {
      return false;
    }

    const firstFeature = data.features[0];
    if (!firstFeature?.properties) return false;

    const props = firstFeature.properties;
    return (
      (props.sources && typeof props.sources === "object") ||
      (props.customData && typeof props.customData === "object")
    );
  };

  /*
  validateGeoJSON - Valida features GeoJSON
  
  CONTROLLI:
  1. Array non vuoto
  2. Ogni feature ha geometry tipo Point
  3. Ogni feature ha properties flat (no nested objects/arrays)
  
  THROWS: Error generico se validazione fallisce
  */
  const validateGeoJSON = (features: any[]): void => {
    if (!features || features.length === 0) {
      throw new Error(GENERIC_ERROR);
    }

    for (const feature of features) {
      // Geometry deve esistere ed essere Point
      if (!feature.geometry || feature.geometry.type !== "Point") {
        throw new Error(GENERIC_ERROR);
      }

      // Properties devono esistere e contenere solo valori primitivi
      if (!feature.properties || !hasOnlyPrimitiveValues(feature.properties)) {
        throw new Error(GENERIC_ERROR);
      }
    }
  };

  /*
  validateJSON - Valida array JSON
  
  CONTROLLI:
  1. Array non vuoto
  2. Presenza campi coordinate (lat/latitude/y E lon/lng/longitude/x)
  3. Ogni riga contiene solo valori primitivi (no nested)
  
  THROWS: Error generico se validazione fallisce
  */
  const validateJSON = (data: any[]): void => {
    if (!data || data.length === 0) {
      throw new Error(GENERIC_ERROR);
    }

    const firstRow = data[0];
    const headers = Object.keys(firstRow);

    // Verifica presenza campo latitudine
    const hasLat = headers.some(h =>
      ["lat", "latitude", "y", "latitudine"].includes(h.toLowerCase())
    );
    // Verifica presenza campo longitudine
    const hasLon = headers.some(h =>
      ["lon", "lng", "longitude", "x", "longitudine"].includes(h.toLowerCase())
    );

    if (!hasLat || !hasLon) {
      throw new Error(GENERIC_ERROR);
    }

    // Verifica tutte le righe abbiano struttura flat
    for (const row of data) {
      if (!row || typeof row !== "object" || !hasOnlyPrimitiveValues(row)) {
        throw new Error(GENERIC_ERROR);
      }
    }
  };

  /*
  validateCSV - Valida dati CSV parsati
  
  CONTROLLI:
  1. Header e righe non vuoti
  2. Presenza colonne coordinate (lat/latitude/y E lon/lng/longitude/x)
  3. Nessun JSON embedded in celle (es. {"key":"value"})
  
  THROWS: Error generico se validazione fallisce
  */
  const validateCSV = (headers: string[], rows: any[]): void => {
    if (!headers.length || !rows.length) {
      throw new Error(GENERIC_ERROR);
    }

    // Verifica presenza colonna latitudine
    const hasLat = headers.some(h =>
      ["lat", "latitude", "y", "latitudine"].includes(h.toLowerCase())
    );
    // Verifica presenza colonna longitudine
    const hasLon = headers.some(h =>
      ["lon", "lng", "longitude", "x", "longitudine"].includes(h.toLowerCase())
    );

    if (!hasLat || !hasLon) {
      throw new Error(GENERIC_ERROR);
    }

    // Blocca JSON embedded nelle celle CSV
    for (const row of rows) {
      for (const value of Object.values(row)) {
        // Se valore è stringa che inizia con {, potrebbe essere JSON
        if (typeof value === "string" && value.trim().startsWith("{")) {
          try {
            const parsed = JSON.parse(value);
            // Se parsing riesce ed è oggetto → JSON embedded (NON valido)
            if (typeof parsed === "object") {
              throw new Error(GENERIC_ERROR);
            }
          } catch (e) {
            // Se parsing fallisce (SyntaxError) → è stringa normale (OK)
            // Se è altro errore → rilancia
            if (!(e instanceof SyntaxError)) {
              throw new Error(GENERIC_ERROR);
            }
          }
        }
      }
    }
  };

  /*
  parseFile - Funzione principale parsing file
  
  FLUSSO:
  1. Legge file con FileReader
  2. Determina estensione (csv/json/geojson)
  3. Parsing specifico per formato:
     - CSV: usa PapaParse
     - JSON/GeoJSON: usa JSON.parse + validazioni
  4. Valida formato con funzioni specifiche
  5. Ritorna ParsedData o rigetta con errore
  
  IMPORTANTE:
  - setError() chiamato PRIMA di reject() per aggiornare UI
  - Callback PapaParse sono asincroni → setError dentro callback
  
  RETURNS: Promise<ParsedData>
  */
  const parseFile = (file: File): Promise<ParsedData> => {
    setError(null); // Reset errore precedente
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          if (!content) {
            throw new Error(GENERIC_ERROR);
          }

          // Estrai estensione file
          const fileExtension = file.name.split(".").pop()?.toLowerCase();

          // === PARSING CSV ===
          if (fileExtension === "csv") {
            Papa.parse(content, {
              header: true, // Prima riga come header
              skipEmptyLines: true, // Ignora righe vuote
              complete: function (results) {
                // Gestione errori PapaParse (sintassi CSV malformata)
                if (results.errors.length > 0) {
                  setError(GENERIC_ERROR); // ✅ setError QUI (callback asincrono)
                  return reject(new Error(GENERIC_ERROR));
                }

                try {
                  const headers = results.meta.fields || [];
                  const rows = results.data;

                  // Valida struttura CSV
                  validateCSV(headers, rows);

                  // Parsing OK
                  resolve({ headers, rows, isGeoJSON: false });
                } catch (err) {
                  setError(GENERIC_ERROR);
                  reject(new Error(GENERIC_ERROR));
                }
              },
              error: function () {
                setError(GENERIC_ERROR);
                reject(new Error(GENERIC_ERROR));
              },
            });
          }
          // === PARSING JSON/GEOJSON ===
          else if (fileExtension === "json" || fileExtension === "geojson") {
            const data = JSON.parse(content);

            // Blocca file già in formato piattaforma
            if (isAlreadyPlatformFormat(data)) {
              throw new Error(GENERIC_ERROR);
            }

            let headers: string[] = [], rows: any[] = [], isGeoJSON = false;

            // === GEOJSON FeatureCollection ===
            if (data.type === "FeatureCollection" && Array.isArray(data.features)) {
              isGeoJSON = true;
              validateGeoJSON(data.features);

              rows = data.features;
              // Estrai headers da primo feature con properties
              if (rows.length > 0) {
                const sample = rows.find(f => f.properties);
                if (sample) headers = Object.keys(sample.properties);
              }
            }
            // === JSON Array ===
            else if (Array.isArray(data)) {
              validateJSON(data); // Valida array
              headers = Object.keys(data[0]);
              rows = data;
            }
            // === Formato non supportato ===
            else {
              throw new Error(GENERIC_ERROR);
            }

            // Parsing OK
            resolve({ headers, rows, isGeoJSON });
          }
          // === Estensione non supportata ===
          else {
            throw new Error(GENERIC_ERROR);
          }
        } catch (err: any) {
          // Catch per JSON/GeoJSON (parsing sincrono)
          setError(GENERIC_ERROR);
          reject(new Error(GENERIC_ERROR));
        }
      };

      // Errore lettura file
      reader.onerror = () => {
        setError(GENERIC_ERROR);
        reject(new Error(GENERIC_ERROR));
      };

      // Avvia lettura file come testo
      reader.readAsText(file);
    });
  };

  return { parseFile, error, setError };
}
