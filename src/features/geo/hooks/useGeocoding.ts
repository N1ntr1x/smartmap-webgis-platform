"use client";

import { useState, useRef, useCallback } from "react";
import { fetchReverseGeocoding } from "@/features/geo";

interface UseGeocodingOptions {
  delay?: number;
}

/*
useGeocoding - Hook reverse geocoding con debounce
Converte coordinate in nome località, evita chiamate duplicate
*/
export default function useGeocoding(options: UseGeocodingOptions = {}) {
  const { delay = 500 } = options;

  const [locationName, setLocationName] = useState<string>("Posizione");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const fetchLocation = useCallback(
    (lat: number, lng: number) => {
      // Evita chiamate duplicate per stesse coordinate
      if (
        lastCoordsRef.current &&
        lastCoordsRef.current.lat === lat &&
        lastCoordsRef.current.lng === lng
      ) {
        return;
      }

      lastCoordsRef.current = { lat, lng };

      // Cancella timeout precedente (debounce)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsLoading(true);

      timeoutRef.current = setTimeout(async () => {
        try {
          const name = await fetchReverseGeocoding(lat, lng);
          setLocationName(name);
        } catch (err) {
          console.error("Errore geocoding:", err);
          setLocationName("Posizione");
        } finally {
          setIsLoading(false);
        }
      }, delay);
    },
    [delay]
  );

  // Cancella fetch pendenti
  const cancelFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setIsLoading(false);
      setLocationName("Posizione");
    }
  }, []);

  return {
    locationName,
    isLoading,
    fetchLocation,
    cancelFetch,
  };
}
