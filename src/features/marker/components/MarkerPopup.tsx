import { MarkerProperties } from "@/features/marker";
import { cleanObject, isValidValue } from "@/features/marker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

import "@/styles/scrollbar.css";

interface MarkerPopupProps {
  properties: MarkerProperties;
}

/*
MarkerPopup - Componente popup marker mappa
Visualizza informazioni marker con sezioni condizionali:
- Header: categoria, nome, città (sempre visibili)
- Descrizione: testo principale (sempre visibile)
- Dettagli aggiuntivi: customData (solo se presente)
- Collegamenti: sources.web (solo se presenti)

PULIZIA DATI:
- cleanObject rimuove campi vuoti/null da customData
- Filtra link web invalidi prima del render
*/
export default function MarkerPopup({ properties }: MarkerPopupProps) {
  const { name, city, description, category, customData, sources } = properties;

  // Pulisci customData rimuovendo valori vuoti/null
  const cleanedCustomData = customData ? cleanObject(customData) : {};
  const hasCustomData = Object.keys(cleanedCustomData).length > 0;

  // Filtra link web validi
  const validWebLinks = sources?.web?.filter(link => isValidValue(link)) || [];

  // Funzione helper per rendere un link cliccabile
  const makeClickable = (url: string) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Altrimenti, aggiungi https:// per renderlo un link funzionante
    return `https://${url}`;
  };

  return (
    <div className="w-[320px] lg:w-auto font-sans rounded-lg bg-white shadow-lg">
      {/* Header con gradient */}
      <div className="p-4 space-y-2 border-b border-gray-200 bg-linear-to-r from-cyan-500 to-blue-600 rounded-t-lg">
        <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
          {category}
        </div>
        <h3 className="text-white text-lg font-bold mb-2">
          {name}
        </h3>
        <div className="py-1 space-x-2 text-sm font-normal text-gray-200">
          <FontAwesomeIcon icon={faLocationDot} />
          {city}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Descrizione principale */}
        <div className="overflow-y-auto custom-scrollbar-marker max-h-40 h-auto">
          <p className="pb-4 text-sm text-gray-600 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Dettagli aggiuntivi - render condizionale */}
        {hasCustomData && (
          <div className="pb-4 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Dettagli aggiuntivi
            </h4>
            <div className="space-y-2 overflow-y-auto custom-scrollbar-marker max-h-40 pr-1">
              {Object.entries(cleanedCustomData).map(([key, value], index) => (
                <div
                  key={index}
                  className="flex justify-between gap-3 p-2 bg-gray-50 rounded border-l-2 border-gray-300"
                >
                  <span className="text-xs font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span className="text-xs text-gray-600 text-right break-words break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collegamenti web - render condizionale */}
        {validWebLinks.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
              Collegamenti
            </h4>
            <div className="space-y-2">
              {validWebLinks.map((link, index) => (
                <a
                  key={index}
                  href={makeClickable(link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs font-medium text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all hover:-translate-y-0.5"
                >
                  <span>🌐</span>
                  <span className="flex-1 truncate">
                    {link}
                  </span>
                  <span className="text-gray-400">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
