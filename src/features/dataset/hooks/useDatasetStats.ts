"use client";

import { useMemo } from "react";
import { DatasetData, DatasetStats } from "@/features/dataset";

/*
useDatasetStats - Hook calcolo statistiche aggregate dataset
Usa useMemo per evitare ricalcoli inutili
*/
export function useDatasetStats(layers: DatasetData[]): DatasetStats {
  return useMemo(() => {
    if (layers.length === 0) {
      return {
        totalFiles: 0,
        totalSize: 0,
        totalMarkers: 0,
        averageMarkers: 0,
        largestFile: { name: "-", size: 0 },
      };
    }

    let totalSize = 0;
    let totalMarkers = 0;
    let largestSize = 0;
    let largestFileName = "";

    // Aggrega dati da tutti i layer
    layers.forEach(layer => {
      totalSize += layer.fileSize;
      totalMarkers += layer.markerCount;

      if (layer.fileSize > largestSize) {
        largestSize = layer.fileSize;
        largestFileName = layer.name;
      }
    });

    return {
      totalFiles: layers.length,
      totalSize,
      totalMarkers,
      averageMarkers: Math.round(totalMarkers / layers.length),
      largestFile: {
        name: largestFileName,
        size: largestSize,
      },
    };
  }, [layers]);
}
