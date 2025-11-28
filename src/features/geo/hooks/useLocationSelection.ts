"use client";

import { useState, useCallback } from "react";

interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
}

/*
useLocationSelection - Hook gestione selezione località
Mantiene stato coordinate e indirizzo selezionato
*/
export default function useLocationSelection() {
  const [location, setLocation] = useState<LocationData>({});

  const handleSelect = useCallback((lat: number, lon: number, address: string) => {
    if (address) {
      setLocation({ latitude: lat, longitude: lon, address });
    } else {
      setLocation({});
    }
  }, []);

  const clear = useCallback(() => {
    setLocation({});
  }, []);

  return {
    location,
    handleSelect,
    clear,
    selectedAddress: location.address,
  };
}
