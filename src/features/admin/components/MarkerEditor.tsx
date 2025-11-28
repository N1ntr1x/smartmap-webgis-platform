"use client";

import { useState, useCallback, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Button } from "@/components/ui";
import Select from "react-select";

interface Option {
    value: string;
    label: string;
}

/*
MarkerTable - Tabella memoizzata tramite React.memo per performance
Visualizza marker e permette associazione documenti tramite select multiplo
Memo evita ri-render inutili quando il componente padre (MarkerEditor)
cambia stato, ma le props di MarkerTable (features, documentOptions, onDocumentsChange)
restano le stesse. Migliora le performance soprattutto con molte righe o selezioni.
*/
const MarkerTable = memo(function MarkerTable({
    features,
    documentOptions,
    onDocumentsChange
}: {
    features: any[];
    documentOptions: Option[];
    onDocumentsChange: (featureId: string, values: string[]) => void;
}) {
    return (
        <div className="max-h-96 overflow-auto custom-scrollbar-general border rounded-lg">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">Nome Marker</th>
                        <th className="px-4 py-2 text-left font-medium text-gray-600">Documenti Associati</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {features.map(feature => (
                        <tr key={feature.id}>
                            <td className="px-2 py-2 font-medium text-gray-800 truncate" title={feature.properties.name}>
                                {feature.properties.name}
                            </td>
                            <td className="px-4 py-2">
                                <Select
                                    isMulti
                                    options={documentOptions}
                                    className="text-xs"
                                    placeholder="Seleziona..."
                                    value={documentOptions.filter(doc => (feature.properties.sources?.documents || []).includes(doc.value))}
                                    onChange={(selectedOptions) => onDocumentsChange(feature.id, selectedOptions.map(opt => opt.value))}
                                    styles={{ menu: (provided) => ({ ...provided, zIndex: 9999 }) }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

interface MarkerEditorProps {
    datasetId: string;
    initialFeatures: any[];
    documentOptions: Option[];
    onSaveSuccess: () => void;
}

/*
MarkerEditor - Editor per associare documenti ai marker
Richiede commento obbligatorio per tracciare modifiche (versioning)
*/
export default function MarkerEditor({ datasetId, initialFeatures, documentOptions, onSaveSuccess }: MarkerEditorProps) {
    const [features, setFeatures] = useState(initialFeatures);
    const [comment, setComment] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Aggiorna documenti associati a specifico marker
    const handleDocumentsChange = useCallback((featureId: string, values: string[]) => {
        setFeatures(prevFeatures =>
            prevFeatures.map(f => {
                if (f.id === featureId) {
                    const sources = f.properties.sources || { web: [], documents: [] };
                    return { ...f, properties: { ...f.properties, sources: { ...sources, documents: values } } };
                }
                return f;
            })
        );
    }, []);

    const handleSave = async () => {
        if (!comment.trim()) {
            setError("Il commento alla modifica è obbligatorio per tracciare le modifiche.");
            return;
        }
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/geodatasets/${datasetId}/features`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment: comment,
                    features: features,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Il salvataggio è fallito.");
            }
            onSaveSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg border flex flex-col gap-4">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                Modifica Documenti Marker
            </h4>

            <MarkerTable
                features={features}
                documentOptions={documentOptions}
                onDocumentsChange={handleDocumentsChange}
            />

            <div className="mt-auto">
                <div className="space-y-2">
                    <label htmlFor="mod-comment" className="text-sm font-medium text-gray-700 block">
                        Commento alla modifica (obbligatorio)
                    </label>
                    <textarea
                        id="mod-comment"
                        rows={2}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Es: Aggiornati i documenti per i marker X e Y."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>
                {error && <ErrorMessage message={error} />}

                <div className="mt-4 text-right">
                    <Button onClick={handleSave} variant="success" disabled={saving} className="gap-2">
                        {saving ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : <FontAwesomeIcon icon={faSave} />}
                        {saving ? "Salvataggio..." : "Salva Modifiche"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
