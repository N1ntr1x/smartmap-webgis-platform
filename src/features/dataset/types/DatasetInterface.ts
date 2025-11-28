import { CardData } from "@/types/CardData";

// Estende CardData con metadati specifici dataset GeoJSON
export interface DatasetData extends CardData {
  markerCount: number;
  fileSize: number;
  version: number;
  isActive: boolean;
  isArchived: boolean;
}

// Statistiche aggregate calcolate da lista dataset
export interface DatasetStats {
  totalFiles: number;
  totalSize: number;
  totalMarkers: number;
  averageMarkers: number;
  largestFile: {
    name: string;
    size: number;
  };
}
