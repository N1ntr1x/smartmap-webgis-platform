"use client";

import { useRef, useEffect } from "react";
import { Circle } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSpatialSearch } from "@/features/chatbot";
import { useChatbotFeatures } from "@/features/chatbot";

import { Button } from "@/components/ui"
import { useGeocoding, formatCoordinates } from "@/features/geo";

/*
SpatialSearchSelector - Pannello controllo ricerca spaziale su mappa
Permette selezione coordinate, regolazione raggio e conferma ricerca
*/
export default function SpatialSearchSelector() {
  const { spatialSearch, confirmSpatialSelection, clearSpatialSearch } = useChatbotFeatures();
  const { coordinates, radius, setRadius: handleRadiusChange, resetCoordinates } = useSpatialSearch();
  const panelRef = useRef<HTMLDivElement>(null);

  const { locationName, fetchLocation } = useGeocoding({ delay: 0 });

  // Geocoding inverso per nome località
  useEffect(() => {
    if (coordinates) {
      fetchLocation(coordinates[0], coordinates[1]);
    }
  }, [coordinates, fetchLocation]);

  const handleCancel = () => {
    clearSpatialSearch();
  };

  if (!spatialSearch.isSelecting) return null;

  return (
    <>
      {/* Cerchio raggio sulla mappa */}
      {coordinates && (
        <Circle
          center={coordinates}
          radius={radius}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.2,
            weight: 2
          }}
        />
      )}

      {/* Pannello controllo floating */}
      <div
        ref={panelRef}
        className="absolute top-5 left-1/2 transform -translate-x-1/2 z-[500] pointer-events-auto cursor-default"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-xl p-4 w-xs md:w-md">
          {/* Header con chiusura */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">
              Seleziona Coordinate e Raggio
            </h3>
            <Button variant="ghost" size="icon" onClick={clearSpatialSearch} title="Annulla ricerca">
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </Button>
          </div>

          {/* Istruzioni iniziali */}
          {!coordinates && (
            <p className="text-xs text-gray-500 text-center mb-3">
              Clicca sulla mappa per selezionare il centro della ricerca
            </p>
          )}

          {/* Coordinate selezionate con geocoding */}
          {coordinates && (
            <div className="mb-3 bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Coordinate Centro:</p>
                  <p className="text-sm font-mono text-gray-800">
                    {formatCoordinates({ lat: coordinates[0], lng: coordinates[1] }, 5).splice(0, 2).join(", ")}
                  </p>
                  {locationName && (
                    <p className="text-xs text-gray-500 mt-1">
                      {locationName}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={resetCoordinates} title="Reimposta coordinate" className="">
                  <FontAwesomeIcon icon={faRotateLeft} />
                </Button>
              </div>
            </div>
          )}

          {/* Slider regolazione raggio */}
          <div className="mb-4">
            <label className="text-sm text-gray-700 font-medium mb-1 block">
              Raggio: <span className="text-blue-600">{radius}m</span>
              {radius >= 1000 && (
                <span className="text-blue-600"> ({(radius / 1000).toFixed(1)}km)</span>
              )}
            </label>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={radius}
              onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50m</span>
              <span>10km</span>
            </div>
          </div>

          {/* Bottoni azione */}
          <div className="flex gap-2 justify-center items-center">
            <Button variant="secondary" onClick={clearSpatialSearch} className="gap-2">
              <FontAwesomeIcon icon={faXmark} />
              Annulla
            </Button>
            {coordinates && (
              <Button onClick={confirmSpatialSelection} className="gap-2">
                <FontAwesomeIcon icon={faCheck} />
                Conferma
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
