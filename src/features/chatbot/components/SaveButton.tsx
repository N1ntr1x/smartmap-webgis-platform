"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/AuthContext";
import { useChatbotFeatures } from "@/features/chatbot";
import { Button } from "@/components/ui"

interface SaveButtonProps {
  query: string;
  answer: string;
  geojsonData: any;
  messageIndex: number;
}

export default function SaveButton({ query, answer, geojsonData, messageIndex }: SaveButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const { user, isAuthenticated } = useAuth();
  const { refreshSavedLayers } = useChatbotFeatures();

  if (!isAuthenticated) return null;
  if (state === "saved") {
    return (
      <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
        <FontAwesomeIcon icon={faCheck} />
        Salvato
      </div>
    )
  };

  return (
    <Button
      variant="link"
      onClick={async () => {
        if (!user || state !== "idle") return;
        setState("saving");
        try {
          const res = await fetch("/api/chatbot/responses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              query,
              answer,
              geojsonData
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Errore salvataggio");
          }

          setState("saved");
          await refreshSavedLayers();
        } catch (error: any) {
          setState("idle");
          alert(error.message || "Errore sconosciuto");
        }
      }}
      disabled={state !== "idle"}
      className="gap-1 p-0"
    >
      <FontAwesomeIcon icon={state === "saving" ? faSpinner : faFloppyDisk} className={state === "saving" ? "animate-spin" : ""} />
      <span>{state === "saving" ? "Salvataggio..." : "Salva risposta"}</span>
    </Button>
  );
}
