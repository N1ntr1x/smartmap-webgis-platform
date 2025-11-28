"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useChatbotFeatures } from "@/features/chatbot";

import { Button } from "@/components/ui"

/*
SpatialSearchToggle - Pulsante attivazione/disattivazione ricerca spaziale
Mostra stato attivo con indicatore visivo
*/
export default function SpatialSearchToggle() {
  const { spatialSearch, startSpatialSelection, clearSpatialSearch } = useChatbotFeatures();

  const handleToggle = () => {
    if (spatialSearch.isActive) {
      clearSpatialSearch();
    } else {
      startSpatialSelection();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={handleToggle}
        title="Ricerca spaziale"
        className={`border-2 gap-2 ${spatialSearch.isActive || spatialSearch.isSelecting
            ? "border-blue-600 bg-blue-50 hover:bg-blue-50 text-blue-700"
            : "border-gray-300 bg-white hover:bg-white text-gray-600 hover:border-blue-400"
          }`}
      >
        <FontAwesomeIcon icon={faMapMarkerAlt} />
        <span className="text-xs font-medium">Ricerca per Raggio</span>
      </Button>

      {/* Indicatore stato attivo */}
      {spatialSearch.isActive && (
        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
          <FontAwesomeIcon icon={faCheck} className="text-green-600 text-sm" />
          <span className="text-xs text-green-700 font-medium">Attivo</span>
          <Button variant="button" size="icon" onClick={clearSpatialSearch} title="Rimuovi">
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </Button>
        </div>
      )}
    </div>
  );
}
