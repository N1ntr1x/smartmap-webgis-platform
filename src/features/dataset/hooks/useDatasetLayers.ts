"use client";

import { useState, useEffect, useCallback } from "react";
import { DatasetData } from "@/features/dataset";

/*
useDatasetLayers - Hook gestione dataset con aggiornamento ottimistico
Fetch, stato locale e funzione per update immediato UI (senza refetch)
*/
export function useDatasetLayers() {
  const [layers, setLayers] = useState<DatasetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLayers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/geodatasets/stats");
      if (!res.ok) throw new Error(`Errore nella richiesta dei dataset`);

      const data = await res.json();
      if (data.datasets && Array.isArray(data.datasets)) {
        const mappedLayers: DatasetData[] = data.datasets.map((dataset: any) => ({
          id: dataset.id.toString(),
          name: dataset.name,
          description: dataset.description,
          category: dataset.category.name,
          location: dataset.location,
          updatedAt: new Date(dataset.updatedAt),
          isActive: dataset.isActive,
          isArchived: dataset.isArchived,
          markerCount: dataset.markerCount,
          fileSize: dataset.fileSize,
          version: dataset.version,
        }));
        setLayers(mappedLayers);
      } else {
        setLayers([]);
      }
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto");
      setLayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLayers();
  }, [fetchLayers]);

  /*
  Aggiorna singolo layer nello stato locale (aggiornamento ottimistico)
  Permette UI reattiva senza attendere risposta server
  */
  const updateLayerState = useCallback((layerId: string, updates: Partial<DatasetData>) => {
    setLayers(currentLayers =>
      currentLayers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    );
  }, []);

  return {
    layers,
    loading,
    error,
    refetch: fetchLayers,
    updateLayerState
  };
}
