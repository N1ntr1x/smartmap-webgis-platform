import { AppError } from "@/backend/errors";

export const PLATFORM_REQUIRED_FIELDS = {
    name: true,
    description: true,
    category: true,
    city: true,
} as const;



// Type guard: verifica se value è un oggetto non-null
function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}


// Type guard: verifica se value è un array
function isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}


// Type guard: verifica se value è una stringa non vuota
function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim() !== "";
}

/*
MARKERVALIDATOR CLASS
Validatore server-side per file GeoJSON.
Implementa Defense in Depth (primo livello di validazione).

RESPONSABILITÀ:
1. Validazione strutturale GeoJSON (conformità RFC 7946)
2. Validazione semantica (standard piattaforma)
3. Type-safety completo usando 'unknown' invece di 'any'

ARCHITETTURA:
- validateGeoJsonForPlatform: entry point pubblico
- validateGeoJsonStructure: verifica conformità RFC 7946
- validatePlatformCompliance: verifica campi obbligatori piattaforma
- validateSingleFeature: utility per validazione singola feature

DESIGN PATTERN: Validation Funnel
Input 'unknown' → progressive narrowing via type guards → output type-safe
*/
export class MarkerValidator {

    /*
     Valida un GeoJSON con type safety completo
     Usa 'unknown' invece di 'any' per forzare validazione esplicita
    */
    static validateGeoJsonForPlatform(geojson: unknown): void {
        this.validateGeoJsonStructure(geojson);
        this.validatePlatformCompliance(geojson);
    }

    /*
     Validazione strutturale con type guards
    */
    private static validateGeoJsonStructure(geojson: unknown): asserts geojson is {
        type: string;
        features: unknown[]
    } {
        // Type guard: deve essere un oggetto
        if (!isObject(geojson)) {
            throw new AppError("Il file non è un JSON valido", 422);
        }

        // Type guard: deve avere type
        if (!("type" in geojson) || typeof geojson.type !== "string") {
            throw new AppError("Il GeoJSON deve avere la proprietà 'type'", 422);
        }

        // Type guard: type deve essere FeatureCollection
        if (geojson.type !== "FeatureCollection") {
            throw new AppError(
                `Il GeoJSON deve essere di tipo 'FeatureCollection'. Tipo trovato: ${geojson.type}`,
                422
            );
        }

        // Type guard: deve avere features array
        if (!("features" in geojson) || !isArray(geojson.features)) {
            throw new AppError("Il GeoJSON deve contenere un array 'features'", 422);
        }

        // Type guard: features non vuoto
        if (geojson.features.length === 0) {
            throw new AppError("Il GeoJSON deve contenere almeno una feature", 422);
        }
    }

    /*
     Validazione conformità standard piattaforma con type safety
    */
    private static validatePlatformCompliance(
        geojson: { type: string; features: unknown[] }
    ): void {
        const requiredFields = Object.entries(PLATFORM_REQUIRED_FIELDS)
            .filter(([_, required]) => required)
            .map(([field]) => field);

        const errors: string[] = [];
        const maxErrorsToShow = 5;

        geojson.features.forEach((feature: unknown, index: number) => {
            // Type guard: feature deve essere oggetto
            if (!isObject(feature)) {
                errors.push(`Feature ${index}: non è un oggetto valido`);
                return;
            }

            // Type guard: verifica type
            if (!("type" in feature) || feature.type !== "Feature") {
                errors.push(`Feature ${index}: deve avere type='Feature'`);
                return;
            }

            // Type guard: verifica geometry
            if (!("geometry" in feature) || !isObject(feature.geometry)) {
                errors.push(`Feature ${index}: manca geometry valida`);
                return;
            }

            const geometry = feature.geometry;
            if (!("type" in geometry) || typeof geometry.type !== "string") {
                errors.push(`Feature ${index}: geometry deve avere un 'type'`);
                return;
            }

            // Type guard: verifica properties
            if (!("properties" in feature) || !isObject(feature.properties)) {
                errors.push(`Feature ${index}: manca oggetto 'properties'`);
                return;
            }

            const properties = feature.properties;

            // Ottieni nome per errori leggibili
            const featureName = "name" in properties && typeof properties.name === "string"
                ? properties.name
                : "senza nome";

            // Verifica campi obbligatori
            const missingFields: string[] = [];
            for (const field of requiredFields) {
                if (!(field in properties) || !isNonEmptyString(properties[field])) {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                errors.push(
                    `Feature ${index} (${featureName}): ` +
                    `campi obbligatori mancanti: ${missingFields.join(", ")}`
                );
            }

            if (errors.length >= maxErrorsToShow) {
                return;
            }
        });

        if (errors.length > 0) {
            const errorMessage = errors.slice(0, maxErrorsToShow).join("\n");
            const additionalErrors = errors.length > maxErrorsToShow
                ? `\n... e altri ${errors.length - maxErrorsToShow} errori`
                : "";

            throw new AppError(
                `Il GeoJSON non rispetta lo standard della piattaforma:\n\n${errorMessage}${additionalErrors}\n\n` +
                `Ogni feature deve contenere i campi obbligatori: ${requiredFields.join(", ")}`,
                422
            );
        }
    }

    /*
     Validazione singola feature con type safety
    */
    static validateSingleFeature(feature: unknown, index: number = 0): void {
        if (!isObject(feature)) {
            throw new AppError(`Feature ${index}: deve essere un oggetto`, 422);
        }

        if (!("type" in feature) || feature.type !== "Feature") {
            throw new AppError(`Feature ${index}: deve essere di tipo 'Feature'`, 422);
        }

        if (!("geometry" in feature) || !isObject(feature.geometry)) {
            throw new AppError(`Feature ${index}: manca geometry`, 422);
        }

        if (!("properties" in feature) || !isObject(feature.properties)) {
            throw new AppError(`Feature ${index}: manca properties`, 422);
        }

        const properties = feature.properties;
        const requiredFields = Object.entries(PLATFORM_REQUIRED_FIELDS)
            .filter(([_, required]) => required)
            .map(([field]) => field);

        const missingFields = requiredFields.filter(field => {
            return !(field in properties) || !isNonEmptyString(properties[field]);
        });

        if (missingFields.length > 0) {
            throw new AppError(
                `Feature ${index}: campi obbligatori mancanti: ${missingFields.join(", ")}`,
                422
            );
        }
    }
}
