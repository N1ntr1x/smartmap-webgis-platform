"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { Coordinates } from "@/features/coordinates";
import { useCoordinates } from "@/features/coordinates";
import { Button } from "@/components/ui";
import { formatCoordinates } from "@/features/geo";

interface MapCoordinatesProps {
  isOpen: boolean;
  onToggle: () => void;
}

/*
MapCoordinates - Pannello coordinate mappa con preview compatto
Mostra sempre coordinate mouse in preview, espande dettagli completi al click
*/
export default function MapCoordinates({ isOpen, onToggle }: MapCoordinatesProps) {
  const {
    mouseCoords,
    clickedCoords,
    zoomLevel,
    locationName,
  } = useCoordinates(isOpen);

  return (
    <div className="relative flex-col items-start select-none">
      {/* Preview compatto con coordinate correnti */}
      <Button
        variant="map-button"
        size="auto"
        onClick={onToggle}
        className="shadow p-1.5 text-xl rounded-lg"
      >
        <FontAwesomeIcon icon={faCrosshairs} className="text-blue-700" />
        <div className="flex flex-col items-center px-3">
          <span className="w-full text-xs text-left font-medium text-gray-500">
            Coordinate
          </span>
          <span className="text-xs text-gray-800 font-mono">
            {formatCoordinates(mouseCoords, 5).splice(0, 2).join(", ")}
          </span>
        </div>
        <FontAwesomeIcon
          icon={faChevronUp}
          className={`text-gray-300 text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </Button>

      {/* Pannello dettagli completo */}
      {isOpen && (
        <Coordinates
          coords={mouseCoords}
          clickedCoords={clickedCoords}
          zoomLevel={zoomLevel}
          locationName={locationName}
        />
      )}
    </div>
  );
}
