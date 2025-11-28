"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassLocation, faMapPin, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSearch } from "@/features/geo";
import { ReactNode } from "react";
import { Button } from "@/components/ui"

interface SearchInputProps {
  placeholder?: string;
  label?: string;
  applyFilter?: boolean;
  onSelect: (lat: number, lon: number, address: string) => void;
  onClose?: () => void;
  selectedAddress?: string;
  showCoordinates?: boolean;
  showType?: boolean;
  className?: string;
  feedbackMessage?: ReactNode;
}

/*
SearchInput - Componente ricerca località con autocomplete
Supporta filtri risultati, feedback visivo e personalizzazione layout
*/
export default function SearchInput({
  placeholder = "Cerca luoghi, città, regioni...",
  label,
  applyFilter = true,
  onSelect,
  onClose,
  selectedAddress,
  showCoordinates = true,
  showType = true,
  className = "w-full",
  feedbackMessage,
}: SearchInputProps) {
  const { query, setQuery, results, isLoading } = useSearch({
    debounceTime: 600,
    applyFilter
  });

  const handleClear = () => {
    setQuery("");
    onSelect(0, 0, "");
  };

  const handleResultClick = (lat: number, lon: number, displayName: string) => {
    onSelect(lat, lon, displayName);
    setQuery("");
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Input ricerca con icona */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-600">
          <FontAwesomeIcon icon={faMagnifyingGlassLocation} className="text-sm" />
        </div>

        <input
          id="search-input"
          type="text"
          placeholder={placeholder}
          value={selectedAddress || query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 px-10 py-1.5 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Pulsante clear o close */}
        {(query || selectedAddress || onClose) && (
          <Button
            variant="ghost"
            size="auto"
            onClick={onClose || handleClear}
            className="absolute inset-y-0 right-3"
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="mt-2 text-xs text-gray-500">Ricerca in corso...</div>
      )}

      {/* Lista risultati con dettagli */}
      {results.length > 0 && query && !selectedAddress && (
        <div className="my-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-sm space-y-2">
          {results.map((r) => (
            <Button
              key={r.place_id}
              variant="normal"
              className="w-full flex items-center text-left hover:bg-blue-50 my-2"
              onClick={() => handleResultClick(r.lat, r.lon, r.display_name)}
            >
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <FontAwesomeIcon icon={faMapPin} className="text-sm text-red-600" />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-medium text-sm text-gray-800 truncate">
                  {r.display_name}
                </span>
                <span className="text-xs text-gray-500 flex items-center space-x-2">
                  {showType && (
                    <>
                      <span>{r.type.charAt(0).toUpperCase() + r.type.slice(1)}</span>
                      {showCoordinates && <span>•</span>}
                    </>
                  )}
                  {showCoordinates && (
                    <span>
                      {r.lat.toFixed(4)}, {r.lon.toFixed(4)}
                    </span>
                  )}
                </span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Feedback selezione */}
      {selectedAddress && feedbackMessage && (
        <div className="mt-2 text-xs text-green-600 flex items-center">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
