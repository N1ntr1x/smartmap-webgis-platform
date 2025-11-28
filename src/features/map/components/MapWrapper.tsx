"use client";

import dynamic from "next/dynamic";

import { useAuth } from "@/contexts/AuthContext";

import { MAP_CONFIG } from "@/configs";

/*
MapWrapper - Caricamento dinamico mappa con gestione posizione utente

LOGICA:
1. Caricamento dinamico (SSR=false) per evitare errore "window is not defined"
2. Attende autenticazione per determinare posizione iniziale:
   - Utente loggato: preferredLatitude/Longitude da DB
   - Guest: coordinate default da MAP_CONFIG
3. Loading states per auth asincrona e map loading
*/

// Caricamento dinamico per compatibilità SSR
const Map = dynamic(() => import("@/features/map/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-white text-cyan-700">
      <p className="font-base text-lg font-mono font-stretch-extra-expanded underline underline-offset-8">
        Caricamento mappa...
      </p>
    </div>
  ),
});

export default function MapWrapper() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Calcola posizione: utente loggato vs default
  const position: [number, number] =
    isAuthenticated && user?.preferredLatitude && user?.preferredLongitude
      ? [user.preferredLatitude, user.preferredLongitude]
      : [MAP_CONFIG.defaultLatitude, MAP_CONFIG.defaultLongitude];

  // Attendi completamento autenticazione prima di renderizzare mappa
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white text-cyan-700">
        <p className="font-base text-lg font-mono font-stretch-extra-expanded underline underline-offset-8">
          Caricamento posizione...
        </p>
      </div>
    );
  }

  return <Map position={position} />;
}
