"use client";

import L, { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapSettings, MapCoordinates, MapChatbot, MapLayerManager, MapSearch, TypeControls } from "@/features/map";

import { useMobile } from "@/contexts/MobileContext";
import { useMapPopup } from "@/features/map";

import { useChatbotFeatures, SpatialSearchSelector } from "@/features/chatbot";

interface ContainerMapControlsProps {
  position: LatLngExpression;
}

/*
ContainerMapControls - Orchestrator centrale controlli mappa

LOGICA:
1. Un solo pannello aperto alla volta (activePanel state)
2. Mobile: nasconde altri pannelli quando uno aperto
3. Desktop: mostra sempre pulsanti, solo pannello attivo espanso
4. Disabilita TUTTI i controlli quando:
   - Ricerca spaziale attiva (spatialSearch.isSelecting)
   - Mobile con popup marker aperto (focus su contenuto)
5. Disabilita propagazione eventi Leaflet per evitare conflitti

LAYOUT:
- Top-Left: Settings + Search
- Top-Right: Layer Manager
- Bottom-Left: Coordinates
- Bottom-Right: Chatbot

Visibilità condizionale per mobile e popup
*/
export default function ContainerMapControls({ position }: ContainerMapControlsProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { isMobile } = useMobile();
  const { spatialSearch } = useChatbotFeatures();
  const { isPopupOpen } = useMapPopup();

  // Disabilita propagazione eventi Leaflet per contenitore controlli
  useEffect(() => {
    const controlsDiv = document.getElementById("custom-map-controls");
    if (controlsDiv) {
      L.DomEvent.disableClickPropagation(controlsDiv);
      L.DomEvent.disableScrollPropagation(controlsDiv);
    }
  }, []);

  const handlePanelToggle = (panelName: string) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  // Mobile: mostra solo pannello attivo o tutti se nessuno aperto
  const getPanelVisibility = (panelType: string) => {
    if (!isMobile) return true;
    if (!activePanel) return true;
    return activePanel === panelType;
  };

  // Helper classi transizione visibilità
  const getControlClasses = (isVisible: boolean) => {
    return `absolute z-401 transition-opacity duration-200 ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`;
  };

  // Nasconde TUTTI i controlli se ricerca spaziale attiva o mobile con popup
  const shouldHideAllControls = spatialSearch.isSelecting || (isMobile && isPopupOpen);

  return (
    <>
      <div id="custom-map-controls">
        <SpatialSearchSelector />

        <div className="cursor-default">
          {/* Top-Left: Settings + Search */}
          <div
            className={getControlClasses(
              (getPanelVisibility(TypeControls.SETTINGS) ||
                getPanelVisibility(TypeControls.SEARCH)) &&
              !shouldHideAllControls
            )}
            style={{ top: "1.25rem", left: "1.25rem" }}
          >
            <div className="flex flex-col space-y-2 items-start">
              <MapSettings
                position={position}
                isOpen={activePanel === TypeControls.SETTINGS}
                onToggle={() => handlePanelToggle(TypeControls.SETTINGS)}
              />
              <MapSearch
                isOpen={activePanel === TypeControls.SEARCH}
                onToggle={() => handlePanelToggle(TypeControls.SEARCH)}
              />
            </div>
          </div>

          {/* Top-Right: Layer Manager */}
          <div
            className={getControlClasses(
              getPanelVisibility(TypeControls.LAYER_MANAGER) &&
              !shouldHideAllControls
            )}
            style={{ top: "1.25rem", right: "1.25rem" }}
          >
            <MapLayerManager
              isOpen={activePanel === TypeControls.LAYER_MANAGER}
              onToggle={() => handlePanelToggle(TypeControls.LAYER_MANAGER)}
            />
          </div>

          {/* Bottom-Left: Coordinates */}
          <div
            className={getControlClasses(
              getPanelVisibility(TypeControls.COORDINATES) &&
              !shouldHideAllControls
            )}
            style={{ bottom: "1.25rem", left: "1.25rem" }}
          >
            <MapCoordinates
              isOpen={activePanel === TypeControls.COORDINATES}
              onToggle={() => handlePanelToggle(TypeControls.COORDINATES)}
            />
          </div>

          {/* Bottom-Right: Chatbot */}
          <div
            className={getControlClasses(
              getPanelVisibility(TypeControls.CHATBOT) &&
              !shouldHideAllControls
            )}
            style={{ bottom: "1.25rem", right: "1.25rem" }}
          >
            <MapChatbot
              isOpen={activePanel === TypeControls.CHATBOT}
              onToggle={() => handlePanelToggle(TypeControls.CHATBOT)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
