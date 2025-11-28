"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faDownload, faSync, faUpload } from "@fortawesome/free-solid-svg-icons";
import UploadDatasetModal from "@/features/admin/components/UploadDatasetModal";
import { useDatasetLayers } from "@/features/dataset";
import { APP_CONFIG } from "@/configs";
import { Button } from "@/components/ui";

interface CompleteStepProps {
  transformedData: any;
  onReset: () => void;
}

/*
CompleteStep - Step finale conversione con preview e azioni

AZIONI DISPONIBILI:
1. Download file convertito (GeoJSON)
2. Upload diretto come dataset (apre modale con file pre-caricato)
3. Reset per nuova conversione

LOGICA UPLOAD:
- Crea File blob da transformedData
- Passa file a UploadDatasetModal come preloadedFile
- Ricarica lista dataset dopo upload successo
*/
export default function CompleteStep({ transformedData, onReset }: CompleteStepProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [preloadedFile, setPreloadedFile] = useState<File | null>(null);
  const { refetch } = useDatasetLayers();

  // Viene generata un'anteprima limitata del JSON usando React.useMemo.
  // Questo mostra solo le prime 2 "features" e un riassunto, mantenendo l'app reattiva.
  const previewData = useMemo(() => {
    if (!transformedData || !transformedData.features) {
      return "Dati non disponibili per l'anteprima.";
    }

    const totalFeatures = transformedData.features.length;
    const previewFeatures = transformedData.features.slice(0, 2);

    const previewObject = {
      ...transformedData,
      features: previewFeatures,
    };

    let previewString = JSON.stringify(previewObject, null, 2);

    if (totalFeatures > 2) {
      // Rimuovi la parentesi quadra di chiusura dell'array "features"
      previewString = previewString.replace(/\s+\]\s*\}$/, "");
      // Aggiungi il commento e chiudi gli oggetti
      previewString += `\n    // ... e altre ${totalFeatures - 2} features\n  ]\n}`;
    }

    return previewString;
  }, [transformedData]);

  // Download file convertito come GeoJSON
  const handleDownload = () => {
    const jsonString = JSON.stringify(transformedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/geo+json" });
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = "converted_data.geojson";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
    URL.revokeObjectURL(url);
  };

  // Prepara file blob e apre modale upload dataset
  const handleOpenUploadModal = () => {
    const jsonString = JSON.stringify(transformedData, null, 2);
    const blob = new Blob([jsonString], { type: "application/geo+json" });
    const file = new File([blob], "converted_data.geojson", { type: blob.type });
    setPreloadedFile(file);
    setIsUploadModalOpen(true);
  };

  // Callback successo upload: chiudi modale e ricarica dataset
  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    refetch();
  };

  return (
    <>
      {/* Modale upload dataset con file pre-caricato */}
      {preloadedFile && (
        <UploadDatasetModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
          preloadedFile={preloadedFile}
        />
      )}

      <div className="p-2 md:p-6 text-center">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
        <h3 className="text-2xl font-semibold text-gray-800">File Processato Correttamente</h3>
        <p className="text-gray-600 mt-2 mb-8">
          {`Il tuo file è stato convertito nel formato standard di ${APP_CONFIG.name}.`}
        </p>

        {/* Preview JSON convertito */}
        <div className="text-left my-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Anteprima del file convertito:</label>
          <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs max-h-60 overflow-auto">
            {previewData}
          </pre>
        </div>

        {/* Azioni principali */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            onClick={handleDownload}
            variant="primary"
            size="default"
            className="shadow-md gap-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            <span>Scarica File Convertito</span>
          </Button>

          <Button
            onClick={handleOpenUploadModal}
            variant="success"
            size="default"
            className="shadow-md gap-2"
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Carica come Nuovo Dataset</span>
          </Button>
        </div>

        {/* Reset conversione */}
        <Button
          onClick={onReset}
          variant="link"
          size="default"
          className="mt-10 mx-auto gap-2"
        >
          <FontAwesomeIcon icon={faSync} />
          <span>Esegui un'altra conversione</span>
        </Button>
      </div>
    </>
  );
}
