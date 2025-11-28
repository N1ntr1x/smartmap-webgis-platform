"use client";

import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import type { Coordinates } from "@/features/geo";

interface UseMapClickOptions {
  enabled?: boolean;
  onClick?: (coords: Coordinates) => void;
  initialCoordinates?: Coordinates | null;
}

/*
useMapClick - Hook gestione click su mappa Leaflet
Cattura coordinate click e notifica callback opzionale
*/
export default function useMapClick(options: UseMapClickOptions = {}) {
  const { enabled = true, onClick, initialCoordinates = null } = options;
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    initialCoordinates
  );

  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (!enabled) return;

      const { lat, lng } = e.latlng;
      const newCoords = { lat, lng };

      setCoordinates(newCoords);
      onClick?.(newCoords);
    },
  });

  const resetCoordinates = () => {
    setCoordinates(null);
  };

  return {
    coordinates,
    setCoordinates,
    resetCoordinates,
  };
}
