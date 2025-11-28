import { MarkerProperties, REQUIRED_MARKER_FIELDS } from "@/features/marker";
import { TransformationConfig } from "@/features/tool";

/*
transformToStandardGeoJSON - Trasforma dati sorgente in GeoJSON standard piattaforma

Converte file parsati (CSV, JSON, GeoJSON) nel formato unificato della piattaforma.

LOGICA:
Questa funzione ora agisce come un filtro di qualita'. Tenta di costruire ogni
feature secondo le regole. Se una riga non ha coordinate valide O se manca
uno dei campi obbligatori definiti in 'marker.ts', viene scartata.
L'output e' un GeoJSON garantito per essere pulito e valido.
*/
export default function transformToStandardGeoJSON(
  rows: any[],
  headers: string[],
  isGeoJSON: boolean,
  config: TransformationConfig
): any {
  const { standardMappings, latLonMapping, multiMappings, ignoredFields } = config;

  const requiredFields = Object.keys(REQUIRED_MARKER_FIELDS) as (keyof typeof REQUIRED_MARKER_FIELDS)[];

  const usedSourceFields = new Set<string>([
    ...Object.values(standardMappings),
    ...multiMappings.web,
    ...multiMappings.documents,
    ...ignoredFields,
    ...(latLonMapping ? [latLonMapping.lat, latLonMapping.lon] : []),
    "sources",
    "customData"
  ]);

  const newFeatures = rows.map((row, index) => {
    const sourceProps = isGeoJSON ? (row.properties || {}) : row;
    const newProperties: Partial<MarkerProperties> = {};

    // 1. Mapping campi standard 1-a-1
    for (const [standardField, sourceField] of Object.entries(standardMappings)) {
      if (sourceField && sourceProps[sourceField] !== undefined) {
        (newProperties as any)[standardField] = sourceProps[sourceField];
      }
    }

    // 2. Aggregazione sources (filtra valori vuoti)
    newProperties.sources = {
      web: multiMappings.web
        .map(field => sourceProps[field])
        .filter(val => typeof val === "string" && val.trim() !== ""),
      documents: multiMappings.documents
        .map(field => sourceProps[field])
        .filter(val => typeof val === "string" && val.trim() !== "")
    };

    // 3. Raccolta customData (campi non usati)
    const customData: Record<string, any> = {};
    for (const header of headers) {
      if (!usedSourceFields.has(header) && sourceProps[header] !== undefined) {
        customData[header] = sourceProps[header];
      }
    }
    if (Object.keys(customData).length > 0) {
      newProperties.customData = customData;
    }

    // 4. VALIDAZIONE GEOMETRIA
    type PointGeometry = {
      type: "Point";
      coordinates: [number, number];
    };

    let geometry: PointGeometry | null = null;

    if (isGeoJSON) {
      geometry = row.geometry;
    } else if (latLonMapping && latLonMapping.lat && latLonMapping.lon) {
      const latRaw = sourceProps[latLonMapping.lat];
      const lonRaw = sourceProps[latLonMapping.lon];
      const latIsValid = !(latRaw === undefined || latRaw === null || String(latRaw).trim() === "");
      const lonIsValid = !(lonRaw === undefined || lonRaw === null || String(lonRaw).trim() === "");

      if (latIsValid && lonIsValid) {
        const lat = parseFloat(String(latRaw).replace(",", "."));
        const lon = parseFloat(String(lonRaw).replace(",", "."));
        if (!isNaN(lat) && !isNaN(lon)) {
          geometry = { type: "Point", coordinates: [lon, lat] };
        }
      }
    }

    // SE LA GEOMETRIA NON È VALIDA, SCARTA LA FEATURE
    if (!geometry) {
      return null;
    }

    // 5. VALIDAZIONE CAMPI OBBLIGATORI
    for (const field of requiredFields) {
      const value = newProperties[field];
      // Se il campo e' mancante, nullo o una stringa vuota, scarta la feature
      if (value === null || value === undefined || String(value).trim() === "") {
        return null;
      }
    }

    // Se tutti i controlli passano, restituisci la feature valida
    return {
      type: "Feature",
      id: index,
      geometry: geometry,
      properties: newProperties
    };
  })
    // Filtra via tutte le righe che sono state scartate (marcate come 'null')
    .filter(Boolean);

  return {
    type: "FeatureCollection",
    features: newFeatures,
  };
}
