import { useState, useEffect, useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import { TILE_LAYERS } from "@/features/layer";
import { MapLayer, LayerType } from "@/features/layer";

/*
useTileLayers - Hook gestione layer base mappa (OSM, Satellite, etc.)

LOGICA SPECIALE:
- Solo UN tile layer attivo alla volta (mutually exclusive)
- Inizializzazione: rileva layer già presente su mappa o usa default
- Cambio layer: rimuove tutti gli altri prima di attivare nuovo
- useRef per evitare doppia inizializzazione

DIFFERENZA DA ALTRI LAYER:
- Non usa LayerLimitContext (tiles sono base mappa, sempre 1)
- Toggle esclusivo invece di additivo
*/
export default function useTileLayers() {
  const map = useMap();

  const isInitializedRef = useRef(false);

  // Rileva layer attivo iniziale dalla mappa o usa default
  const [activeLayerId, setActiveLayerId] = useState<string | null>(() => {
    const currentLayers = TILE_LAYERS.filter(l => map.hasLayer(l.layer));

    if (currentLayers.length > 0) {
      return currentLayers[0].id;
    }

    return TILE_LAYERS.find(l => l.default)?.id || null;
  });

  /*
  Effect gestione switch tile layer:
  1. Skip se già inizializzato e layer corretto già attivo
  2. Rimuove TUTTI i tile layer dalla mappa
  3. Aggiunge solo quello selezionato
  */
  useEffect(() => {
    if (isInitializedRef.current) {
      const activeLayer = TILE_LAYERS.find(l => l.id === activeLayerId);
      if (activeLayer && map.hasLayer(activeLayer.layer)) {
        return; // Layer già corretto, skip
      }
    }

    // Rimuovi tutti i tile layer
    TILE_LAYERS.forEach(l => {
      if (map.hasLayer(l.layer)) {
        map.removeLayer(l.layer);
      }
    });

    // Aggiungi solo quello attivo
    const activeLayer = TILE_LAYERS.find(l => l.id === activeLayerId);
    if (activeLayer) {
      activeLayer.layer.addTo(map);
      isInitializedRef.current = true;
    }
  }, [activeLayerId, map]);

  // Toggle esclusivo: attiva/disattiva singolo layer
  const toggleLayer = useCallback((layerId: string) => {
    setActiveLayerId(prevId => (prevId === layerId ? null : layerId));
  }, []);

  // Mappa layer con stato visibilità
  const tileLayers: MapLayer[] = TILE_LAYERS.map(l => ({
    ...l,
    isVisibleOnMap: l.id === activeLayerId,
    type: LayerType.Tile,
    description: l.description || "",
  }));

  return { layers: tileLayers, toggleLayer };
}
