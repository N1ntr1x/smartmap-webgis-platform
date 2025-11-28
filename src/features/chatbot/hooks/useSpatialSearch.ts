"use client";

import { useState, useEffect, useCallback } from "react";
import { useMap } from "react-leaflet";

import { useChatbotFeatures } from "@/features/chatbot";

import { useMapClick } from "@/features/geo";

/*
Hook per gestione ricerca spaziale su mappa
Permette di selezionare un punto cliccando sulla mappa e definire un raggio
*/
export default function useSpatialSearch() {
  const map = useMap();
  const { spatialSearch, setSpatialData } = useChatbotFeatures();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(1000);

  // Attiva click sulla mappa solo durante fase di selezione
  useMapClick({
    enabled: spatialSearch.isSelecting && !coordinates, // Solo se sta selezionando e non ha già coordinate
    onClick: (coords) => {
      const coordsArray: [number, number] = [coords.lat, coords.lng];
      setCoordinates(coordsArray);
      setSpatialData({ coordinates: coordsArray, radius_meters: radius });
      map.panTo([coords.lat, coords.lng]); // Centra mappa sul punto selezionato
    },
  });

  // Reset locale quando context resetta
  useEffect(() => {
    if (!spatialSearch.isSelecting && !spatialSearch.isActive) {
      setCoordinates(null);
      setRadius(1000);
    }
  }, [spatialSearch.isSelecting, spatialSearch.isActive]);

  // Aggiorna raggio e notifica context
  const handleRadiusChange = useCallback((newRadius: number) => {
    setRadius(newRadius);
    if (coordinates) {
      setSpatialData({ coordinates, radius_meters: newRadius });
    }
  }, [coordinates, setSpatialData]);

  const resetCoordinates = () => {
    setCoordinates(null);
  };

  return {
    coordinates,
    radius,
    setRadius: handleRadiusChange,
    resetCoordinates,
  };
}
