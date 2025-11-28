"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

import { Dataset } from "@/features/dataset"
import { Button } from "@/components/ui"
import { UploadDatasetModal } from "@/features/admin";

import { useDatasetLayers } from "@/features/dataset";

/*
DatasetManager - Gestione completa dei dataset GIS
Permette upload nuovi dataset e visualizza lista esistenti
*/
export default function DatasetManager() {
    const { refetch } = useDatasetLayers();
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadSuccess = () => {
        setShowUploadModal(false);
        refetch(); // Ricarica lista dataset dopo upload
    };

    return (
        <div className="space-y-4">
            <UploadDatasetModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSuccess={handleUploadSuccess}
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:p-4">
                <Button onClick={() => setShowUploadModal(true)} className="gap-2 shadow-sm whitespace-nowrap">
                    <FontAwesomeIcon icon={faUpload} />
                    Carica GeoJSON
                </Button>
            </div>

            <Dataset></Dataset>
        </div>
    );
}
