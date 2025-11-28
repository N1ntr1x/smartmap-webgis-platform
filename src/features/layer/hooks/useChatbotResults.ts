"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import L from "leaflet";
import { MapLayer, LayerType } from "@/features/layer";
import { truncateText } from "@/utils/format";
import { useChatbotFeatures } from "@/features/chatbot";
import { isValidMarker, renderPopupContent } from "@/features/marker";

/*
useChatbotResults - Hook gestione layer risultati chatbot su mappa

LOGICA COMPLESSA:
1. Unifica 2 fonti dati: temporaryLayers (sessione) + savedLayers (DB)
2. Auto-attivazione ultimo layer temporaneo con zoom e popup
3. Pulizia automatica vecchi layer temporanei (mantiene solo ultimo)
4. Ogni layer è un GeoJSON con marker custom chatbot

FLUSSO:
- Nuovo temp → rimuove vecchi temp → aggiunge nuovo → zoom su primo marker
- Saved layers restano persistenti, controllati manualmente dall'utente
*/
export default function useChatbotResults(map: L.Map | null) {
  const [layers, setLayers] = useState<MapLayer[]>([]);
  const { temporaryLayers, savedLayers, isLoadingSaved } = useChatbotFeatures();

  // Crea layer Leaflet GeoJSON con marker personalizzati
  const createLeafletLayer = useCallback(
    (geoJson: any) =>
      L.geoJSON(geoJson, {
        filter: (f) => isValidMarker(f.properties),
        pointToLayer: (f, latlng) =>
          L.marker(latlng, {
            icon: L.icon({
              iconUrl: "/icons/chatbot-marker.png",
              iconSize: [26, 26],
              popupAnchor: [0, -20],
            }),
          }),
        onEachFeature: (f, layer) => {
          if (f.properties) {
            layer.bindPopup(renderPopupContent(f.properties), {
              maxWidth: 350,
              className: "custom-popup",
            });
          }
        },
      }),
    []
  );

  // Trasforma dati grezzi in MapLayer standardizzato
  const createMapLayer = useCallback(
    (item: any, idx: number, isSaved: boolean): MapLayer => ({
      id: isSaved ? `saved-${item.id || idx}` : `temp-${idx}`,
      name: truncateText(item.query, 40),
      type: LayerType.Chatbot,
      description: truncateText(item.answer, 80),
      layer: createLeafletLayer(item.geoJson),
      isSaved,
      isVisibleOnMap: false,
    }),
    [createLeafletLayer]
  );

  // Unifica temporanei e salvati in un'unica lista
  const allLayers = useMemo(
    () => [
      ...temporaryLayers.map((item, idx) => createMapLayer(item, idx, false)),
      ...savedLayers.map((item, idx) => createMapLayer(item, idx, true)),
    ],
    [temporaryLayers, savedLayers, createMapLayer]
  );

  /*
  Effect principale: gestione auto mappa
  - Attende caricamento saved layers
  - Pulisce vecchi temp (mantiene solo ultimo)
  - Auto-attiva ultimo temp con zoom e apertura popup
  - Cleanup rimuove tutti i layer alla smontatura
  */
  useEffect(() => {
    if (!map || isLoadingSaved) return;

    const lastTemp = temporaryLayers[temporaryLayers.length - 1];

    // Rimuove vecchi layer temporanei dalla mappa
    temporaryLayers.slice(0, -1).forEach((_, idx) => {
      allLayers[idx]?.layer.remove();
    });

    // Attiva automaticamente ultimo layer temporaneo
    if (lastTemp) {
      const newLayer = allLayers.find((l) => l.id === `temp-${temporaryLayers.length - 1}`);
      if (newLayer) {
        newLayer.layer.addTo(map);
        newLayer.isVisibleOnMap = true;

        // Zoom sul primo marker e apri popup
        const markers = (newLayer.layer as L.GeoJSON).getLayers();
        if (markers.length > 0) {
          const marker = markers[0] as L.Marker;
          map.flyTo(marker.getLatLng(), 12);
          setTimeout(() => marker.openPopup(), 200);
        }
      }
    }

    setLayers(allLayers);

    // Cleanup: rimuove tutti i layer alla smontatura
    return () => allLayers.forEach((l) => l.layer.remove());
  }, [temporaryLayers, savedLayers, map, isLoadingSaved, allLayers]);

  // Toggle manuale visibilità layer
  const toggleLayer = useCallback(
    (id: string) => {
      if (!map) return;
      setLayers((curr) =>
        curr.map((l) => {
          if (l.id === id) {
            const newVis = !l.isVisibleOnMap;
            newVis ? l.layer.addTo(map) : l.layer.remove();
            return { ...l, isVisibleOnMap: newVis };
          }
          return l;
        })
      );
    },
    [map]
  );

  return { layers, toggleLayer };
}
