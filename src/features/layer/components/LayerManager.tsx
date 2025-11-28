"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faLayerGroup, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "@/styles/scrollbar.css";
import { SearchBar, DataCard, ToggleButton, Button, TabButton } from "@/components/ui";
import { LayerGroup, LayerType } from "@/features/layer";

interface LayerManagerProps {
  groups: LayerGroup[];
  onClose: () => void;
  map: L.Map;
}

/*
LayerManager - Pannello gestione layer mappa con tab e ricerca
Gestisce 3 tipi di layer:
- Tile: mappe base (OSM, Satellite, etc.)
- GeoJSON: dataset da database
- Chatbot: risultati query AI (salvati e temporanei)

Logica speciale per Chatbot:
- Divide layer in "salvati" (persistiti DB) e "temporanei" (sessione corrente)
- Mostra sezioni separate per migliore UX
*/
export default function LayerManager({ groups, onClose, map }: LayerManagerProps) {
  const [activeTab, setActiveTab] = useState(groups[0]?.id || "");
  const [search, setSearch] = useState("");

  const activeGroup = groups.find((group) => group.id === activeTab);
  const isChatbot = activeGroup?.id === LayerType.Chatbot;

  // Filtra layer per termine ricerca (cerca in tutti i campi)
  const filtered = useMemo(
    () =>
      activeGroup?.layers.filter((l) =>
        [l.name, l.description, l.category, l.location]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ) || [],
    [activeGroup?.layers, search]
  );

  // Separa layer chatbot in salvati e temporanei
  const { saved, temp } = useMemo(
    () => ({
      saved: filtered.filter((l) => l.isSaved),
      temp: filtered.filter((l) => !l.isSaved),
    }),
    [filtered]
  );

  // Helper per renderizzare sezione con conteggio
  const renderSection = (title: string, icon: string, count: number, items: typeof filtered) =>
    items.length > 0 && (
      <>
        <div className="text-xs font-semibold text-gray-600 mt-2">
          {icon} {title} ({count})
        </div>
        {items.map((l) => (
          <DataCard
            key={l.id}
            data={l}
            actions={
              <ToggleButton
                activeIcon={faEye}
                inactiveIcon={faEyeSlash}
                initialState={l.isVisibleOnMap}
                onToggle={() => activeGroup?.toggleLayer(l.id, map)}
                label="Toggle"
                sizeIcon="1x"
              />
            }
          />
        ))}
      </>
    );

  return (
    <div className="relative w-80 select-none">
      <div className="absolute top-0 right-0 w-full text-gray-700 bg-white border border-gray-200 rounded-lg shadow py-2 px-3">
        <div className="flex justify-between items-center mx-2 my-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faLayerGroup} className="text-lg" />
            <span className="text-lg font-base text-gray-800">Layer Manager</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>

        {/* Tab per switch tra gruppi layer */}
        <div className="flex space-x-2 my-4">
          {groups.map((g) => (
            <TabButton
              key={g.id}
              value={g.id}
              label={g.label}
              activeTab={activeTab}
              onClick={(id) => {
                setActiveTab(id);
                setSearch(""); // Reset ricerca al cambio tab
              }}
            />
          ))}
        </div>

        <div className="my-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Cerca layer..."
            className="max-w-sm mx-auto"
          />
        </div>

        {/* Lista layer con logica differenziata per Chatbot */}
        <div className="flex flex-col space-y-4 max-h-60 overflow-y-auto custom-scrollbar-general pr-2">
          {isChatbot ? (
            <>
              {/* Per Chatbot: sezioni separate salvati/temporanei */}
              {renderSection("Layer salvati", "📌", saved.length, saved)}
              {renderSection("Ricerche recenti", "🆕", temp.length, temp)}
              {saved.length === 0 && temp.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  {search ? "Nessun layer trovato." : "Nessun layer disponibile."}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Per Tile/GeoJSON: lista unica */}
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {search ? "Nessun layer trovato." : "Nessun layer disponibile."}
                </p>
              ) : (
                filtered.map((l) => (
                  <DataCard
                    key={l.id}
                    data={l}
                    actions={
                      <ToggleButton
                        activeIcon={faEye}
                        inactiveIcon={faEyeSlash}
                        initialState={l.isVisibleOnMap}
                        onToggle={() => activeGroup?.toggleLayer(l.id, map)}
                        label="Toggle"
                        sizeIcon="1x"
                      />
                    }
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
