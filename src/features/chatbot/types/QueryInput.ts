// Payload inviato al backend chatbot per query con/senza ricerca spaziale
export interface QueryInput {
  query: string;
  coordinates: [number, number] | null;
  radius_meters: number | null;
  session_id: string | null;
}
