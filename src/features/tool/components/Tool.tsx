"use client";

import { useState } from "react";
import Stepper from "./Stepper";
import { UploadStep } from "@/features/tool";
import { MappingStep } from "@/features/tool";
import { CompleteStep } from "@/features/tool";
import { useFileParser, ParsedData } from "@/features/tool";
import { ErrorMessage } from "@/components/ui";
import { transformToStandardGeoJSON, TransformationConfig } from "@/features/tool";
import { APP_CONFIG } from "@/configs";

type Step = "upload" | "mapping" | "complete";

/*
Tool - Orchestrator conversione dati geospaziali

FLUSSO:
1. Upload: parsing file (CSV/JSON/GeoJSON)
2. Mapping: configurazione mappatura campi
3. Complete: trasformazione + download/upload

LOGICA:
- useFileParser gestisce parsing con error handling
- Stato parsedData passato da upload → mapping
- transformToStandardGeoJSON esegue conversione finale
*/
export default function Tool() {
  const [step, setStep] = useState<Step>("upload");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [transformedGeoJson, setTransformedGeoJson] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { parseFile, error, setError } = useFileParser();

  // Callback upload: parsing file e transizione a mapping
  const handleFileAccept = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await parseFile(file);
      setParsedData(data);
      setStep("mapping");
    } catch (err) {
      console.error(err);
      // Errore già gestito da useFileParser
    } finally {
      setIsLoading(false);
    }
  };

  // Callback mapping: trasformazione dati e transizione a complete
  const handleMappingSubmit = (config: TransformationConfig) => {
    if (!parsedData) return;

    try {
      setIsLoading(true);

      // Simulazione delay per UX con file grandi
      setTimeout(() => {
        const standardGeoJSON = transformToStandardGeoJSON(
          parsedData.rows,
          parsedData.headers,
          parsedData.isGeoJSON,
          config
        );
        setTransformedGeoJson(standardGeoJSON);
        setStep("complete");
        setIsLoading(false);
      }, 500);
    } catch (e: any) {
      setError("Errore durante la trasformazione: " + e.message);
      setIsLoading(false);
    }
  };

  // Reset completo per nuova conversione
  const handleReset = () => {
    setStep("upload");
    setParsedData(null);
    setTransformedGeoJson(null);
    setError(null);
  };

  // Render step corrente
  const renderStep = () => {
    // Loading generico (solo per mapping/complete)
    if (isLoading && step !== "upload") {
      return (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Elaborazione in corso...</p>
        </div>
      );
    }

    switch (step) {
      case "mapping":
        return parsedData && (
          <MappingStep
            headers={parsedData.headers}
            sampleRows={parsedData.rows}
            isGeoJSON={parsedData.isGeoJSON}
            onSubmit={handleMappingSubmit}
            onBack={handleReset}
          />
        );
      case "complete":
        return transformedGeoJson && (
          <CompleteStep transformedData={transformedGeoJson} onReset={handleReset} />
        );
      case "upload":
      default:
        return <UploadStep onFileAccept={handleFileAccept} isLoading={isLoading} />;
    }
  };

  return (
    <>
      <div className="w-full sm:bg-white sm:p-6 md:p-10 rounded-2xl sm:shadow-lg sm:border sm:border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tool Conversione Dati</h1>
          <p className="text-gray-600 mt-2">
            {`Normalizza i tuoi dati geospaziali nel formato standard ${APP_CONFIG.name}`}
          </p>
        </div>

        <Stepper
          currentStep={step === "upload" ? 1 : step === "mapping" ? 2 : 3}
          steps={["Upload", "Mapping", "Completato"]}
        />

        {error && <div className="my-4"><ErrorMessage message={error} /></div>}

        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </>
  );
}
