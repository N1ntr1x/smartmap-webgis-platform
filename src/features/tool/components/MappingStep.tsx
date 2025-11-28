"use client";

import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faLink, faFilePdf, faStar, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { TransformationConfig } from "@/features/tool";
import { CollapsibleSection, Button } from "@/components/ui";
import { MappingConfig } from "@/features/tool";

interface MappingStepProps {
  headers: string[];
  sampleRows: any[];
  isGeoJSON: boolean;
  onSubmit: (config: TransformationConfig) => void;
  onBack: () => void;
}

/*
FieldChecklist - Componente checklist per selezione multipla campi
Usa per ignored fields e multi-mappings (web/documents)
*/
const FieldChecklist = ({ headers, selected, onToggle }: {
  headers: string[],
  selected: string[],
  onToggle: (field: string) => void
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
    {headers.map(header => (
      <label
        key={header}
        className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer border transition-all ${selected.includes(header)
            ? "bg-gray-200 border-gray-300 text-gray-500"
            : "bg-white hover:bg-gray-50 border-gray-200"
          }`}
      >
        <input
          type="checkbox"
          checked={selected.includes(header)}
          onChange={() => onToggle(header)}
          className="rounded text-gray-500 focus:ring-gray-400"
        />
        <span className="text-sm truncate" title={header}>{header}</span>
      </label>
    ))}
  </div>
);

/*
MappingStep - Step mapping campi file sorgente → standard piattaforma

FASI MAPPING:
1. Ignored fields: escludi campi inutili
2. Required fields: mappa campi obbligatori (name, description, etc.)
3. Optional fields: mappa campi opzionali (icon, color)
4. Multi-mappings: seleziona campi per array (web links, documents)

LOGICA AUTO-DETECT:
- Coordinate: cerca alias comuni (lat/latitude, lon/longitude)
- Standard fields: cerca match esatti case-insensitive

VALIDAZIONE:
- Required fields devono essere tutti mappati
- Per CSV/JSON serve lat+lon, per GeoJSON no (geometry già presente)
*/
export default function MappingStep({ headers, sampleRows, isGeoJSON, onSubmit, onBack }: MappingStepProps) {

  // Stati mapping
  const [standardMappings, setStandardMappings] = useState<Record<string, string>>({});
  const [latLonMapping, setLatLonMapping] = useState({ lat: "", lon: "" });
  const [multiMappings, setMultiMappings] = useState<{ web: string[], documents: string[] }>({
    web: [],
    documents: []
  });
  const [ignoredFields, setIgnoredFields] = useState<string[]>([]);

  // Header disponibili (esclusi ignored)
  const availableHeaders = useMemo(
    () => headers.filter(h => !ignoredFields.includes(h)),
    [headers, ignoredFields]
  );

  // Auto-detect iniziale coordinate e campi standard
  useEffect(() => {
    // Auto-detect coordinate per CSV/JSON
    if (!isGeoJSON) {
      const detectedLat = headers.find(h => MappingConfig.LAT_ALIASES.includes(h.toLowerCase())) || "";
      const detectedLon = headers.find(h => MappingConfig.LON_ALIASES.includes(h.toLowerCase())) || "";
      setLatLonMapping({ lat: detectedLat, lon: detectedLon });
    }

    // Auto-detect campi standard (match case-insensitive)
    const autoMappings: Record<string, string> = {};
    [...MappingConfig.REQUIRED_FIELDS, ...MappingConfig.OPTIONAL_FIELDS].forEach(field => {
      const match = headers.find(h => h.toLowerCase() === field.toLowerCase());
      if (match) autoMappings[field] = match;
    });
    setStandardMappings(autoMappings);
  }, [isGeoJSON, headers]);

  // Validazione completezza mapping
  const isMappingComplete = useMemo(() => {
    const requiredFieldsMapped = MappingConfig.REQUIRED_FIELDS.every(field => standardMappings[field]);
    const coordinatesMapped = isGeoJSON || (latLonMapping.lat && latLonMapping.lon);
    return requiredFieldsMapped && coordinatesMapped;
  }, [standardMappings, latLonMapping, isGeoJSON]);

  /*
  toggleArrayItem - Helper generico per toggle item in array state
  Aggiunge se assente, rimuove se presente
  */
  const toggleArrayItem = (
    setState: React.Dispatch<React.SetStateAction<string[]>>,
    field: string
  ) => {
    setState(currentItems => {
      if (currentItems.includes(field)) {
        return currentItems.filter(item => item !== field);
      } else {
        return [...currentItems, field];
      }
    });
  };

  /*
  toggleMultiMappingItem - Helper toggle per multi-mappings (web/documents)
  Aggiorna solo la chiave specifica dell'oggetto
  */
  const toggleMultiMappingItem = (type: "web" | "documents", field: string) => {
    setMultiMappings(currentMappings => {
      const currentTypeArray = currentMappings[type];
      const updatedTypeArray = currentTypeArray.includes(field)
        ? currentTypeArray.filter(item => item !== field)
        : [...currentTypeArray, field];

      return {
        ...currentMappings,
        [type]: updatedTypeArray
      };
    });
  };

  // Helper render dropdown selezione campo
  const renderDropdown = (value: string, onChange: (val: string) => void) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">-- Seleziona --</option>
      {availableHeaders.map(h => <option key={h} value={h}>{h}</option>)}
    </select>
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800">Mappatura Dati</h3>
        <p className="text-sm text-gray-500">Associa le colonne del tuo file ai campi standard della piattaforma.</p>
      </div>

      {/* PASSO 1: Ignored fields */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3 text-gray-800">
          <FontAwesomeIcon icon={faEyeSlash} />
          <h4 className="font-semibold">Passo 1: Seleziona campi da ignorare (Opzionale)</h4>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          I campi selezionati qui verranno esclusi dalle opzioni di mapping e non finiranno in `customData`.
        </p>
        <FieldChecklist
          headers={headers}
          selected={ignoredFields}
          onToggle={(field) => toggleArrayItem(setIgnoredFields, field)}
        />
      </div>

      {/* PASSO 2: Required fields */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-3 text-red-800">
          <FontAwesomeIcon icon={faStar} />
          <h4 className="font-semibold">Passo 2: Mappa i campi obbligatori</h4>
        </div>

        {/* Coordinate (solo per CSV/JSON) */}
        {!isGeoJSON && (
          <div className="mb-4 p-3 bg-white border border-gray-200 rounded-md">
            <h5 className="font-medium text-sm mb-2 text-gray-700">Coordinate</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Latitudine</label>
                {renderDropdown(latLonMapping.lat, (val) => setLatLonMapping(prev => ({ ...prev, lat: val })))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Longitudine</label>
                {renderDropdown(latLonMapping.lon, (val) => setLatLonMapping(prev => ({ ...prev, lon: val })))}
              </div>
            </div>
          </div>
        )}

        {/* Required standard fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
          {MappingConfig.REQUIRED_FIELDS.map(field => (
            <div key={field} className="grid grid-cols-3 items-center gap-2">
              <label className="text-sm font-medium text-gray-700 capitalize col-span-1 truncate">
                {field}
              </label>
              <div className="col-span-2">
                {renderDropdown(
                  standardMappings[field] || "",
                  (val) => setStandardMappings(prev => ({ ...prev, [field]: val }))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PASSO 3: Optional fields + Multi-mappings */}
      <CollapsibleSection title="Passo 3: Mappa campi opzionali e avanzati" className="text-sm p-2 sm:text-base sm:p-4">
        <div className="pt-4 space-y-4">
          {/* Optional standard fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MappingConfig.OPTIONAL_FIELDS.map(field => (
              <div key={field}>
                <label className="block text-xs font-medium mb-1 capitalize">{field}</label>
                {renderDropdown(
                  standardMappings[field] || "",
                  (val) => setStandardMappings(prev => ({ ...prev, [field]: val }))
                )}
              </div>
            ))}
          </div>

          {/* Multi-mappings per sources */}
          <div className="pt-4 border-t">
            <h5 className="font-semibold text-gray-700 mb-3 text-sm">Campi Multipli (per `sources`)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Web links */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <FontAwesomeIcon icon={faLink} /> Links Web
                </div>
                <FieldChecklist
                  headers={availableHeaders}
                  selected={multiMappings.web}
                  onToggle={(field) => toggleMultiMappingItem("web", field)}
                />
              </div>

              {/* Documents */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <FontAwesomeIcon icon={faFilePdf} /> Documenti
                </div>
                <FieldChecklist
                  headers={availableHeaders}
                  selected={multiMappings.documents}
                  onToggle={(field) => toggleMultiMappingItem("documents", field)}
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Preview dati sorgente */}
      <div className="pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Anteprima Dati Sorgente (prime 5 righe)</h4>
        <div className="max-h-60 overflow-auto rounded-lg custom-scrollbar-general bg-white">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
              <tr>
                {headers.map(h => (
                  <th key={h} className="px-4 py-2 bg-gray-100 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRows.slice(0, 5).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-b-0 hover:bg-gray-50">
                  {headers.map(header => {
                    const cellValue = (isGeoJSON ? row.properties : row)?.[header];
                    const displayValue = (typeof cellValue === "object" && cellValue !== null)
                      ? JSON.stringify(cellValue)
                      : String(cellValue ?? "");
                    return (
                      <td key={header} className="px-4 py-2 truncate max-w-xs" title={displayValue}>
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Azioni navigazione */}
      <div className="flex justify-between items-center pt-6 mt-4 border-t">
        <Button onClick={onBack} variant="ghost" size="default">
          Indietro
        </Button>

        <Button
          onClick={() => onSubmit({
            standardMappings,
            latLonMapping: isGeoJSON ? undefined : latLonMapping,
            multiMappings,
            ignoredFields
          })}
          disabled={!isMappingComplete}
          variant={isMappingComplete ? "primary" : "secondary"}
          size="default"
          className="shadow-md"
        >
          {!isMappingComplete && <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />}
          <span>{isMappingComplete ? "Avvia Conversione" : "Completa i campi obbligatori"}</span>
        </Button>
      </div>
    </div>
  );
}
