"use client";

import { useState, useCallback } from "react";
import { Message, SpatialSearchData, fetchChatbotData, fetchChatbotResetSession } from "@/features/chatbot";
import { useChatbotFeatures } from "@/features/chatbot";
import { APP_CONFIG } from "@/configs";

const INITIAL_MESSAGE: Message = {
  sender: "bot",
  text: `Ciao! Sono l'assistente ${APP_CONFIG.name}. Fai una domanda per iniziare.`,
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

/*
Hook principale gestione conversazione chatbot
Gestisce invio query, ricezione risposte, sessione e layer temporanei
*/
export default function useChatbot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { addTemporaryLayer } = useChatbotFeatures();

  const sendMessage = useCallback(
    async (text: string, spatialData?: SpatialSearchData) => {
      if (!text.trim() || isWaiting) return;

      // Aggiungi messaggio utente alla chat
      setMessages((p) => [
        ...p,
        {
          sender: "user",
          text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsWaiting(true);

      try {
        // Invia query al backend con eventuale ricerca spaziale
        const data = await fetchChatbotData({
          query: text,
          coordinates: spatialData?.coordinates ?? null,
          radius_meters: spatialData?.radius_meters ?? null,
          session_id: sessionId,
        });

        // Salva session_id per continuità conversazione
        if (data.session_id) setSessionId(data.session_id);

        // Se risposta contiene GeoJSON, aggiungi layer temporaneo
        if (data.geojson?.type === "FeatureCollection") {
          addTemporaryLayer({
            geoJson: data.geojson,
            query: text,
            answer: data.answer || "Risultati trovati"
          });
        }

        // Aggiungi risposta bot e mantieni max 11 messaggi (primo + ultimi 10)
        setMessages((p) => {
          const updated = [
            ...p,
            {
              sender: "bot" as const,
              text: data.answer || `Ho trovato ${data.geojson?.features?.length ?? 0} risultati.`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              answer: data.answer,
              geojsonData: data.geojson,
              userQuery: text,
            },
          ];
          return updated.length > 10 ? [updated[0], ...updated.slice(-9)] : updated;
        });
      } catch (error) {
        console.error("Errore:", error);
        const errorTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((p) => [...p, { sender: "bot", text: "Errore. Riprova.", time: errorTime }]);
      } finally {
        setIsWaiting(false);
      }
    },
    [isWaiting, sessionId, addTemporaryLayer]
  );

  // Reset completo conversazione
  const startNewChat = useCallback(async () => {
    setMessages([INITIAL_MESSAGE]);
    if (sessionId) {
      try {
        await fetchChatbotResetSession(sessionId);
      } catch (error) {
        console.error("Reset fallito:", error);
      }
    }
    setSessionId(null);
  }, [sessionId]);

  return { messages, sendMessage, isWaiting, startNewChat };
}
