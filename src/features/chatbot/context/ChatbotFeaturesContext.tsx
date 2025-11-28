"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { LayerChatbotData } from "@/features/chatbot";
import { useAuth } from "@/contexts/AuthContext";

type SpatialSearchData = {
  coordinates: [number, number];
  radius_meters: number;
};

type ChatbotFeaturesContextType = {
  spatialSearch: { data: SpatialSearchData | null; isSelecting: boolean; isActive: boolean };
  setSpatialData: (data: SpatialSearchData) => void;
  startSpatialSelection: () => void;
  confirmSpatialSelection: () => void;
  clearSpatialSearch: () => void;
  temporaryLayers: LayerChatbotData[];
  addTemporaryLayer: (result: LayerChatbotData) => void;
  clearTemporaryLayers: () => void;
  savedLayers: LayerChatbotData[];
  isLoadingSaved: boolean;
  refreshSavedLayers: () => Promise<void>;
};

const ChatbotFeaturesContext = createContext<ChatbotFeaturesContextType | undefined>(undefined);

export const useChatbotFeatures = () => {
  const context = useContext(ChatbotFeaturesContext);
  if (!context) throw new Error("useChatbotFeatures deve essere usato dentro ChatbotFeaturesProvider");
  return context;
};

/*
Provider context per funzionalità chatbot
Gestisce stato globale di:
- Ricerca spaziale (selezione punto e raggio)
- Layer temporanei (risultati query corrente)
- Layer salvati (risultati persistiti nel DB)
*/
export function ChatbotFeaturesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Stato ricerca spaziale
  const [spatialData, setSpatialDataState] = useState<SpatialSearchData | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Layer temporanei (risultati query non salvati)
  const [temporaryLayers, setTemporaryLayers] = useState<LayerChatbotData[]>([]);

  // Layer salvati nel database utente
  const [savedLayers, setSavedLayers] = useState<LayerChatbotData[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Carica layer salvati dal DB quando utente effettua login
  useEffect(() => {
    if (isAuthenticated && user?.id) refreshSavedLayers();
    else setSavedLayers([]);
  }, [isAuthenticated, user?.id]);

  // Recupera layer salvati da API
  const refreshSavedLayers = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingSaved(true);
    try {
      const res = await fetch(`/api/chatbot/responses?userId=${user.id}`);
      const data = await res.json();
      setSavedLayers(
        (data.responses || []).map((r: any) => ({
          geoJson: r.geojsonData,
          query: r.query,
          answer: `Salvato il ${new Date(r.createdAt).toLocaleDateString()}`,
          id: r.id,
        }))
      );
    } catch (error) {
      console.error("Errore caricamento:", error);
      setSavedLayers([]);
    } finally {
      setIsLoadingSaved(false);
    }
  }, [user?.id]);

  return (
    <ChatbotFeaturesContext.Provider
      value={{
        // Ricerca spaziale
        spatialSearch: { data: spatialData, isSelecting, isActive },
        setSpatialData: (d) => setSpatialDataState(d),
        startSpatialSelection: () => { setIsSelecting(true); setIsActive(false); },
        confirmSpatialSelection: () => spatialData && (setIsActive(true), setIsSelecting(false)),
        clearSpatialSearch: () => (setSpatialDataState(null), setIsSelecting(false), setIsActive(false)),

        // Layer temporanei
        temporaryLayers,
        addTemporaryLayer: (r) => setTemporaryLayers((p) => [...p, r]),
        clearTemporaryLayers: () => setTemporaryLayers([]),

        // Layer salvati
        savedLayers,
        isLoadingSaved,
        refreshSavedLayers,
      }}
    >
      {children}
    </ChatbotFeaturesContext.Provider>
  );
}
