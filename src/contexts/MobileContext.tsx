"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

type MobileContextType = {
  isMobileMenuOpen: boolean;                  // stato menu mobile (aperto/chiuso)
  setIsMobileMenuOpen: (open: boolean) => void; // setter per aprire/chiudere il menu
  isMobile: boolean;                          // se la viewport è considerata mobile
};

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error("useMobile deve essere usato dentro MobileProvider");
  }
  return context;
};

export function MobileProvider({ children }: { children: ReactNode }) {
  // Stato che controlla se il menu mobile è aperto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Stato che indica se la viewport corrente è "mobile" (basato su media query)
  const [isMobile, setIsMobile] = useState(false);

  // Imposta e aggiorna isMobile tramite la media query.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    setIsMobile(mediaQuery.matches);

    // Handler attraverso ListEvent aggiorna lo stato quando la media query cambia
    // React rilascia una closure che salva il riferimento della callback sempre
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const value = useMemo(
    () => ({ isMobileMenuOpen, setIsMobileMenuOpen, isMobile }),
    [isMobile, isMobileMenuOpen]
  );

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  );
}