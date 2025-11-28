"use client";

import { useMap } from "react-leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { LayerManager, useGeoDatasets, useTileLayers, useChatbotResults } from "@/features/layer";
import type { LayerGroup } from "@/features/layer";
import { LayerType } from "@/features/layer";
import { Button } from "@/components/ui";

interface MapLayerManagerProps {
  isOpen: boolean;
  onToggle: () => void;
}

/*
MapLayerManager - Orchestrator layer mappa
Unifica 3 hook layer diversi in interfaccia unica LayerManager

ARCHITETTURA:
- useTileLayers: mappe base (OSM, Satellite) - esclusivo
- useGeoDatasets: dataset DB con clustering - additivo
- useChatbotResults: risultati AI salvati/temporanei - auto-attivazione

Ogni hook gestisce logica propria (fetch, toggle, cleanup)
Questo componente li unifica in LayerGroup[] per UI consistente
*/
export default function MapLayerManager({ isOpen, onToggle }: MapLayerManagerProps) {
  const map = useMap();

  const { layers: tileLayers, toggleLayer: toggleTileLayer } = useTileLayers();
  const { layers: geojsonLayers, toggleLayer: toggleGeojsonLayer } = useGeoDatasets();
  const { layers: chatbotLayers, toggleLayer: toggleChatbotLayer } = useChatbotResults(map);

  // Unifica layer in gruppi con logica toggle specifica
  const groups: LayerGroup[] = [
    {
      id: LayerType.Tile,
      label: "Tiles",
      layers: tileLayers,
      toggleLayer: toggleTileLayer,
    },
    {
      id: LayerType.Geojson,
      label: "GeoJSON",
      layers: geojsonLayers,
      toggleLayer: toggleGeojsonLayer,
    },
    {
      id: LayerType.Chatbot,
      label: "Chatbot",
      layers: chatbotLayers,
      toggleLayer: toggleChatbotLayer,
    },
  ];

  return (
    <>
      {!isOpen && (
        <Button
          variant="map-button"
          size="icon-lg"
          onClick={onToggle}
          className="flex items-center justify-center p-1.5 text-xl text-blue-600 sm:px-2.5 sm:py-3 bg-white rounded-lg shadow hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faLayerGroup} />
        </Button>
      )}

      {isOpen && (
        <LayerManager
          groups={groups}
          onClose={onToggle}
          map={map}
        />
      )}
    </>
  );
}
