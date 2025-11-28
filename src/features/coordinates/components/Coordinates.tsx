import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMousePointer } from "@fortawesome/free-solid-svg-icons";

import { formatCoordinates } from "@/features/geo";

interface CoordinatesProps {
  coords: { lat: number; lng: number }; // Coordinate mouse (display)
  clickedCoords: { lat: number; lng: number } | null; // Coordinate cliccate (clipboard)
  zoomLevel: number;
  locationName: string;
}

/*
Coordinates - Pannello informazioni posizione mappa
Mostra coordinate mouse, zoom, località e coordinate cliccate per clipboard
*/
export default function Coordinates({
  coords,
  clickedCoords,
  zoomLevel,
  locationName,
}: CoordinatesProps) {

  const hasClickedCoords = clickedCoords !== null;

  const [lat, long] = formatCoordinates(coords, 5);

  return (
    <div className="absolute mb-2 bottom-full w-full text-gray-700 bg-white border border-gray-200 rounded-lg shadow p-4 text-sm z-10">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm font-bold">Dettagli Posizione</div>
      </div>

      {/* Coordinate mouse (aggiornamento in tempo reale) */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-gray-400">
        <div>
          <span>Latitudine:</span>
          <div className="text-gray-600 bg-gray-100 rounded-sm pl-1 text-xs/6 font-mono">
            {lat}°
          </div>
        </div>
        <div>
          <span>Longitudine:</span>
          <div className="text-gray-600 bg-gray-100 rounded-sm pl-1 text-xs/6 font-mono">
            {long}°
          </div>
        </div>
      </div>

      {/* Livello zoom corrente */}
      <div className="flex justify-between items-center mb-3 text-sm text-gray-400">
        <span>Zoom:</span>
        <div className="font-medium text-gray-600">{zoomLevel}</div>
      </div>

      {/* Nome località da geocoding inverso */}
      <div className="flex items-center w-full bg-blue-50 text-blue-700 rounded-md px-3 py-1 text-xs mb-3">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
        {locationName}
      </div>

      {/* Sezione coordinate cliccate (copiate in clipboard) */}
      <div className="border-t border-gray-200 pt-3">
        {!hasClickedCoords ? (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-700 flex items-center">
            <FontAwesomeIcon icon={faMousePointer} className="mr-2" />
            Clicca sulla mappa per catturare coordinate
          </div>
        ) : (
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-2">
              Coordinate Catturate:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-100 rounded-sm pl-1 text-xs/6 font-mono text-gray-700">
                {clickedCoords.lat.toFixed(5)}°
              </div>
              <div className="bg-green-100 rounded-sm pl-1 text-xs/6 font-mono text-gray-700">
                {clickedCoords.lng.toFixed(5)}°
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
