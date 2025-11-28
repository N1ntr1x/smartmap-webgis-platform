"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { DatasetData } from "@/features/dataset";
import { DocumentManager, MarkerEditor } from "@/features/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface AdminDatasetPanelProps {
    dataset: DatasetData;
    onModificationSuccess: () => void;
}

/*
AdminDatasetPanel - Pannello espandibile per gestire documenti e marker di un dataset
Carica in parallelo i dati GeoJSON e la lista documenti disponibili
*/
export default function AdminDatasetPanel({ dataset, onModificationSuccess }: AdminDatasetPanelProps) {
    const [geojsonData, setGeojsonData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Stato sollevato: gestisce lista documenti condivisa tra componenti figli
    const [availableDocs, setAvailableDocs] = useState<string[]>([]);

    // Memo per options del select documenti
    const documentOptions = useMemo(() => {
        return availableDocs.map(doc => ({ value: doc, label: doc }));
    }, [availableDocs]);

    /*
    Carica dati dataset e lista documenti in parallelo
    Ottimizza performance ed evita waterfall requests
    */
    const fetchDatasetDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [geoJsonRes, docsRes] = await Promise.all([
                fetch(`/api/geodatasets/${dataset.id}`),
                fetch(`/api/geodatasets/${dataset.id}/documents`)
            ]);

            if (!geoJsonRes.ok) throw new Error("Impossibile caricare i dati dei marker.");
            if (!docsRes.ok) throw new Error("Impossibile caricare la lista dei documenti.");

            const geoJsonData = await geoJsonRes.json();
            const docsData = await docsRes.json();

            setGeojsonData(geoJsonData.dataset.geojson);
            setAvailableDocs(docsData.documents || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [dataset.id]);

    useEffect(() => {
        fetchDatasetDetails();
    }, [fetchDatasetDetails]);

    // Callback per ricarica dopo upload documenti
    const handleDocumentsChanged = useCallback(() => {
        fetchDatasetDetails();
    }, [fetchDatasetDetails]);

    return (
        <div className="border-t-2 border-blue-500 bg-gray-50 p-4 mt-1 rounded-b-lg shadow-inner animate-fadeIn">
            {loading && (
                <div className="text-center p-6 text-gray-600">
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin text-blue-600 mr-2" />
                    Caricamento pannello di gestione...
                </div>
            )}
            {error && <div className="text-red-600 p-4">{error}</div>}

            {!loading && !error && geojsonData && (
                <div className="space-y-6">
                    <DocumentManager
                        datasetId={dataset.id}
                        initialDocuments={availableDocs}
                        onUploadSuccess={handleDocumentsChanged}
                    />
                    <MarkerEditor
                        datasetId={dataset.id}
                        initialFeatures={geojsonData.features}
                        documentOptions={documentOptions}
                        onSaveSuccess={onModificationSuccess}
                    />
                </div>
            )}
        </div>
    );
}
