import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import { useGeocoding, useMapClick } from "@/features/geo";
import type { Coordinates } from "@/features/geo";

/*
useCoordinates - Hook gestione coordinate e località mappa
Traccia movimento mouse, gestisce click per cattura coordinate e geocoding
*/
export default function useCoordinates(isOpen: boolean) {
  // Coordinate correnti del mouse sulla mappa
  const [mouseCoords, setMouseCoords] = useState<Coordinates>({ lat: 0, lng: 0 });

  // Coordinate cliccate (catturate per clipboard)
  const { coordinates: clickedCoords, resetCoordinates } = useMapClick({
    enabled: isOpen,
  });

  const map = useMap();
  const zoomLevel = map.getZoom();

  // Hook condiviso per geocoding con debounce
  const { locationName, fetchLocation, cancelFetch } = useGeocoding({ delay: 1000 });

  // Traccia movimento mouse sulla mappa
  useEffect(() => {
    const handleMouseMove = (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setMouseCoords({ lat, lng });

      // Geocoding segue il mouse quando pannello è aperto
      if (isOpen) {
        fetchLocation(lat, lng);
      }
    };

    map.on("mousemove", handleMouseMove);
    return () => {
      map.off("mousemove", handleMouseMove);
    };
  }, [map, isOpen]);

  // Reset coordinate cliccate quando pannello si chiude
  useEffect(() => {
    if (!isOpen) {
      resetCoordinates();
      cancelFetch(); // Cancella eventuali fetch pendenti
    }
  }, [isOpen]);

  // Copia automatica coordinate in clipboard al click
  useEffect(() => {
    if (clickedCoords) {
      const copyToClipboard = async () => {
        const { copyCoordinatesToClipboard } = await import("@/features/geo");
        await copyCoordinatesToClipboard(clickedCoords);
      };

      copyToClipboard();
    }
  }, [clickedCoords]);

  /*
  Import dinamico per lazy loading e compatibilità SSR:
  - Carica funzione solo quando serve (al click utente)
  - Evita errori SSR con navigator.clipboard (disponibile solo client-side)
  - In app client-only potrebbe essere importato staticamente
  */

  return {
    mouseCoords,
    clickedCoords,
    zoomLevel,
    locationName,
    resetCoordinates,
  };
}
