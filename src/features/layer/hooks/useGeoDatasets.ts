"use client";

import { useState, useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { MapLayer, LayerType } from "@/features/layer";
import { isValidMarker, renderPopupContent } from "@/features/marker";

/*
useGeoDatasets - Hook caricamento dataset GeoJSON da database

LOGICA OTTIMIZZATA (Lazy Loading):
1. Fetch una sola volta all'avvio da API /api/geodatasets/stats (solo metadati, no GeoJSON)
2. Mostra tutti i layer disponibili nel LayerManager ma senza dati in memoria.
3. Carica il GeoJSON completo di un layer SOLO quando l'utente lo abilita per la prima volta.
4. Una volta caricato, il layer viene tenuto in memoria per switch veloci.

VANTAGGI:
- Avvio dell'app quasi istantaneo, consumo di memoria iniziale bassissimo.
- I dati vengono scaricati solo se e quando servono.
*/
export default function useGeoDatasets() {
  const [layers, setLayers] = useState<MapLayer[]>([]);

  // Carica solo i metadati all'avvio dell'applicazione
  useEffect(() => {
    (async () => {
      try {
        // NUOVO: Chiama l'endpoint 'stats' che non restituisce il pesante campo geojson
        const res = await fetch("/api/geodatasets/stats");
        if (!res.ok) return setLayers([]);

        const { datasets = [] } = await res.json();

        // NUOVO: Mappa i metadati per creare lo stato iniziale dei layer.
        // Il campo 'layer' è null e 'isLoaded' è false perché non abbiamo ancora i dati.
        setLayers(
          datasets.map((dataset: any) => ({
            id: dataset.id,
            name: dataset.name,
            type: LayerType.Geojson,
            description: dataset.description,
            layer: null, // Il layer Leaflet verrà creato solo al primo click
            location: dataset.location,
            category: dataset.category.name,
            updatedAt: dataset.updatedAt,
            isVisibleOnMap: false,
            isLoaded: false, // Nuovo stato per tracciare se il GeoJSON è stato caricato
            iconUrl: dataset.icon, // Salviamo l'URL dell'icona per usarlo dopo
          }))
        );
      } catch (err) {
        console.error("Errore caricando i metadati dei dataset:", err);
        setLayers([]);
      }
    })();
  }, []);

  const toggleLayer = useCallback((id: string, map: L.Map) => {
    setLayers((prevLayers) => {
      const targetLayer = prevLayers.find((l) => l.id === id);
      if (!targetLayer) return prevLayers;

      const newVisibility = !targetLayer.isVisibleOnMap;

      // CASO 1: Il layer viene attivato per la prima volta e non è ancora stato caricato.
      if (newVisibility && !targetLayer.isLoaded) {
        // Mostra un feedback di caricamento (opzionale) e avvia il fetch
        // Aggiorniamo subito lo stato per riflettere l'intenzione dell'utente
        const optimisticLayers = prevLayers.map(l => l.id === id ? { ...l, isVisibleOnMap: true } : l);
        setLayers(optimisticLayers);

        (async () => {
          try {
            // NUOVO: Fetch del singolo dataset usando la rotta che già avevi
            const res = await fetch(`/api/geodatasets/${id}`);
            const { dataset } = await res.json();

            // Crea il MarkerClusterGroup (la stessa logica di prima)
            const clusterGroup = L.markerClusterGroup({
              chunkedLoading: true,
              chunkInterval: 200,
              chunkDelay: 50,
              maxClusterRadius: 50,
              spiderfyOnMaxZoom: true,
              showCoverageOnHover: false,
              zoomToBoundsOnClick: true,
              removeOutsideVisibleBounds: true,
            });

            // Popola il cluster con i marker
            dataset.geojson.features.forEach((feature: any) => {
              if (feature.geometry?.type === "Point" && isValidMarker(feature.properties)) {
                const [lng, lat] = feature.geometry.coordinates;

                const icon = dataset.icon
                  ? L.icon({
                    iconUrl: dataset.icon,
                    iconSize: [26, 26],
                    popupAnchor: [0, -20],
                  })
                  : new L.Icon.Default();

                const marker = L.marker([lat, lng], { icon });

                marker.bindPopup(renderPopupContent(feature.properties), { maxWidth: 350 });
                clusterGroup.addLayer(marker);
              }
            });


            // NUOVO: Aggiorna lo stato del layer specifico con i dati caricati
            setLayers((currentLayers) =>
              currentLayers.map((l) => {
                if (l.id === id) {
                  // Associa il layer Leaflet e imposta i flag
                  l.layer = clusterGroup;
                  l.isLoaded = true;
                  l.isVisibleOnMap = true; // Assicurati che sia visibile
                  clusterGroup.addTo(map); // Aggiungi il layer alla mappa
                }
                return l;
              })
            );

          } catch (err) {
            console.error(`Errore caricando il dataset ${id}:`, err);
            // In caso di errore, reimposta la visibilità a false
            setLayers(currentLayers => currentLayers.map(l => l.id === id ? { ...l, isVisibleOnMap: false } : l));
          }
        })();

        // Ritorna lo stato ottimistico
        return optimisticLayers;

      } else {
        // CASO 2: Il layer è già stato caricato, quindi lo mostriamo o nascondiamo.
        return prevLayers.map((l) => {
          if (l.id === id) {
            if (l.layer) { // Controllo di sicurezza
              newVisibility ? l.layer.addTo(map) : l.layer.remove();
            }
            return { ...l, isVisibleOnMap: newVisibility };
          }
          return l;
        });
      }
    });
  }, []);

  return { layers, toggleLayer };
}
