// Coordinate geografiche standard
export interface Coordinates {
  lat: number;
  lng: number;
}

// Risposta API Nominatim reverse geocoding
export interface NominatimResponse {
  address?: {
    road?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  display_name?: string;
}

// Risultato ricerca località
export interface SearchResult {
  place_id: string;
  display_name: string;
  type: string;
  lat: number;
  lon: number;
}
