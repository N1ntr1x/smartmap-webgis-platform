import { SearchResult } from "@/features/geo";

// Filtri per risultati ricerca: solo città, monumenti e luoghi amministrativi
const ALLOWED_CLASSES = ["place", "historic", "boundary"];
const ALLOWED_TYPES = [
  "city",
  "town",
  "village",
  "hamlet",
  "suburb",
  "municipality",
  "monument",
  "castle",
  "administrative",
  "townhall",
  "village_green"
];

/*
Reverse geocoding: coordinate → indirizzo leggibile
Estrae componenti rilevanti da risposta Nominatim
*/
export async function fetchReverseGeocoding(lat: number, lng: number): Promise<string> {
  const res = await fetch(`/api/nominatim/reverse?lat=${lat}&lon=${lng}`);
  const data = await res.json();

  const parts = [
    data.address?.road,
    data.address?.town || data.address?.city,
    data.address?.county,
    data.address?.state,
    data.address?.country,
  ].filter(Boolean);

  return parts.join(", ") || "Posizione";
}

/*
Forward geocoding: query testuale → luoghi
Supporta filtri opzionali per città e monumenti
*/
export async function fetchSearchLocation(
  query: string,
  applyFilter: boolean = true
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const res = await fetch(`/api/nominatim/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    // Applica filtri se richiesto
    const results = applyFilter
      ? data.filter((item: any) =>
        ALLOWED_CLASSES.includes(item.class) && ALLOWED_TYPES.includes(item.type)
      )
      : data;

    return results.map((item: any) => ({
      place_id: item.place_id,
      display_name: item.display_name,
      type: item.type,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (err) {
    console.error("Errore ricerca località:", err);
    return [];
  }
}
