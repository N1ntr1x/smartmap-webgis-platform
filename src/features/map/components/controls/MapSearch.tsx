"use client";

import { useMap } from "react-leaflet";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassLocation } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui";
import { Search } from "@/features/geo";

interface MapSearchProps {
  isOpen: boolean;
  onToggle: () => void;
}

/*
MapSearch - Wrapper ricerca località per mappa
Centra mappa sul risultato selezionato
*/
export default function MapSearch({ isOpen, onToggle }: MapSearchProps) {
  const map = useMap();

  const handleSelect = (lat: number, lon: number) => {
    map.setView([lat, lon], 13);
  };

  return (
    <>
      {!isOpen && (
        <Button
          variant="map-button"
          size="icon-md"
          onClick={onToggle}
          className="text-blue-600 rounded-full"
        >
          <FontAwesomeIcon icon={faMagnifyingGlassLocation} size="xl" />
        </Button>
      )}
      {isOpen && (
        <Search onSelect={handleSelect} onClose={onToggle} />
      )}
    </>
  );
}
