"use client";

import { SearchInput } from "@/features/geo";

interface SearchProps {
  onSelect: (lat: number, lon: number) => void;
  onClose: () => void;
}

/*
Search - Wrapper per SearchInput configurato per ricerca mappa
Usa filtri per mostrare solo città e monumenti rilevanti
*/
export default function Search({ onSelect, onClose }: SearchProps) {
  const handleSelect = (lat: number, lon: number, _address: string) => {
    onSelect(lat, lon); // Address non necessario per mappa
  };

  return (
    <div className="w-80 bg-white rounded-2xl p-2 text-gray-900 flex flex-col select-none">
      <SearchInput
        placeholder="Cerca luoghi, città, monumenti..."
        applyFilter={true}
        onSelect={handleSelect}
        onClose={onClose}
        showCoordinates={true}
        showType={true}
        className="w-full"
      />
    </div>
  );
}
