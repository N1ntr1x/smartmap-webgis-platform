"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapPopup } from "@/features/map";

/*
PopupListener - Listener globale eventi popup mappa
Aggiorna context quando QUALSIASI popup si apre/chiude
Usato per nascondere controlli mobile quando popup attivo
*/
export default function PopupListener() {
  const map = useMap();
  const { setPopupOpen } = useMapPopup();

  useEffect(() => {
    const handlePopupOpen = () => {
      setPopupOpen(true);
    };

    const handlePopupClose = () => {
      setPopupOpen(false);
    };

    // Listener globali catturano popup da layer, chatbot, dataset, etc
    map.on("popupopen", handlePopupOpen);
    map.on("popupclose", handlePopupClose);

    return () => {
      map.off("popupopen", handlePopupOpen);
      map.off("popupclose", handlePopupClose);
    };
  }, [map, setPopupOpen]);

  return null; // Non renderizza nulla
}
