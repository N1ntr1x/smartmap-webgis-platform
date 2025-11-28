"use client";

import { renderToString } from "react-dom/server";

import { MarkerPopup } from "@/features/marker";
import { MarkerProperties } from "@/features/marker";

/*
renderPopupContent - Bridge React → Leaflet per popup

PROBLEMA:
Leaflet accetta solo HTML string per popup, non componenti React

SOLUZIONE:
renderToString di React DOM converte componente in HTML statico
Questo HTML viene poi iniettato nel popup Leaflet

LIMITAZIONI:
- Nessuna interattività React (no useState, onClick, etc.)
- Solo rendering statico
- Per interattività servono event listener vanilla JS
*/
export function renderPopupContent(properties: MarkerProperties): string {
  return renderToString(<MarkerPopup properties={properties} />);
}
