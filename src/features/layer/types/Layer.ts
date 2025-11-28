import L from "leaflet";

// Tipo base minimo per rendering
import { CardData } from "@/types/CardData";

export enum LayerType {
  Geojson = "geojson",
  Tile = "tile",
  Chatbot = "chatbot",
}

/*
MapLayer - Estende CardData con proprietà layer mappa
Unifica rappresentazione per tutti i tipi di layer nel LayerManager
*/
export interface MapLayer extends CardData {
  type: LayerType;
  layer: L.Layer;
  icon?: string;
  isSaved?: boolean;
  isVisibleOnMap: boolean;
  isLoaded?: boolean;
}

/*
LayerGroup - Gruppo layer per tab LayerManager
Ogni gruppo gestisce un tipo di layer con logica toggle propria
*/
export interface LayerGroup {
  id: LayerType;
  label: string;
  layers: MapLayer[];
  toggleLayer: (id: string, map: L.Map) => void;
}