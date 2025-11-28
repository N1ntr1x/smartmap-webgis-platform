"use client";

import { useState, DragEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faUpload, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Button } from "@/components/ui";

interface DocumentManagerProps {
    datasetId: string;
    initialDocuments: string[];
    onUploadSuccess: () => void;
}

/*
DocumentManager - Gestione documenti PDF associati a dataset
Supporta drag & drop e upload multiplo di file PDF
*/
export default function DocumentManager({ datasetId, initialDocuments, onUploadSuccess }: DocumentManagerProps) {
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addFiles = (newFiles: FileList) => {
        const pdfFiles = Array.from(newFiles).filter(file => file.type === "application/pdf");
        setFilesToUpload(prev => [...prev, ...pdfFiles]);
    };

    const removeFile = (fileName: string) => {
        setFilesToUpload(prev => prev.filter(f => f.name !== fileName));
    };

    const handleDragEvents = (e: DragEvent<HTMLDivElement>, isOver: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(isOver);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvents(e, false);
        addFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        if (filesToUpload.length === 0) return;

        setUploading(true);
        setError(null);
        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append("documents", file);
        });

        try {
            const res = await fetch(`/api/geodatasets/${datasetId}/documents`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Upload fallito.");
            }
            setFilesToUpload([]);
            onUploadSuccess(); // Notifica componente parent per aggiornare lista
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                Gestione Documenti (PDF)
            </h4>

            {error && <ErrorMessage message={error} />}

            {/* Area drag & drop per upload file */}
            <div
                className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDrop={handleDrop}
            >
                <p className="text-sm text-gray-600">Trascina i file PDF qui, o</p>
                <label className="cursor-pointer text-blue-600 hover:underline font-medium">
                    selezionali dal tuo computer
                    <input type="file" accept=".pdf" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} className="hidden" />
                </label>
            </div>

            {/* Lista file pronti per caricamento */}
            {filesToUpload.length > 0 && (
                <div className="mt-3">
                    <h5 className="text-sm font-medium mb-2">File pronti per il caricamento:</h5>
                    <ul className="space-y-1">
                        {filesToUpload.map(file => (
                            <li key={file.name} className="text-xs flex justify-between items-center bg-gray-100 p-2 rounded">
                                <span>{file.name}</span>
                                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700">
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={handleUpload} disabled={uploading} className="w-full mt-2 gap-2">
                        {uploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faUpload} />}
                        {uploading ? "Caricamento..." : `Carica ${filesToUpload.length} file`}
                    </Button>
                </div>
            )}

            {/* Lista documenti già presenti nel dataset */}
            <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Documenti disponibili nel dataset:</h5>
                {initialDocuments.length > 0 ? (
                    <ul className="max-h-24 overflow-y-auto space-y-1 text-sm list-disc list-inside pl-2 custom-scrollbar-general">
                        {initialDocuments.map(doc => <li key={doc} className="text-gray-700 truncate">{doc}</li>)}
                    </ul>
                ) : (
                    <p className="text-xs text-gray-500 italic">Nessun documento presente.</p>
                )}
            </div>
        </div>
    );
}
