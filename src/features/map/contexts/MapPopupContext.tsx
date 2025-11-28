"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MapPopupContextType {
  isPopupOpen: boolean;
  setPopupOpen: (open: boolean) => void;
}

const MapPopupContext = createContext<MapPopupContextType | undefined>(undefined);

/*
MapPopupProvider - Context stato popup mappa
Permette a ContainerMapControls di reagire a popup aperti
(nasconde controlli mobile per focus su contenuto popup)
*/
export function MapPopupProvider({ children }: { children: ReactNode }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const setPopupOpen = (open: boolean) => {
    setIsPopupOpen(open);
  };

  return (
    <MapPopupContext.Provider value={{ isPopupOpen, setPopupOpen }}>
      {children}
    </MapPopupContext.Provider>
  );
}

export function useMapPopup() {
  const context = useContext(MapPopupContext);
  if (!context) {
    throw new Error("useMapPopup deve essere usato dentro MapPopupProvider");
  }
  return context;
}
