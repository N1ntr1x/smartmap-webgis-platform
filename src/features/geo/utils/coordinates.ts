import { Coordinates } from "@/features/geo"
/*
Formatta coordinate per visualizzazione con decimali specificati
*/
export function formatCoordinates(coords: Coordinates, decimals: number = 5): string[] {
  return [coords.lat.toFixed(decimals), coords.lng.toFixed(decimals)];
}

/*
Copia coordinate formattate negli appunti utente
*/
export async function copyCoordinatesToClipboard(coords: Coordinates): Promise<boolean> {
  try {
    const [lat, lng] = formatCoordinates(coords);
    await navigator.clipboard.writeText(`${lat}, ${lng}`);
    return true;
  } catch {
    return false;
  }
}
