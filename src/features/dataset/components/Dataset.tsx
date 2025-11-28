"use client";

import { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faLayerGroup, faMapMarkerAlt, faHardDrive, faChartLine, faWeightHanging, faToggleOn, faToggleOff, faCircleXmark, faCircleCheck, faCog } from "@fortawesome/free-solid-svg-icons";
import { useDatasetLayers, useDatasetStats } from "@/features/dataset";
import { useAuth } from "@/contexts/AuthContext";
import { formatFileSize } from "@/utils/format";
import { AdminDatasetPanel } from "@/features/admin";
import { SearchBar, DataCard, ToggleButton, StatsCard, Button } from "@/components/ui";

/*
DatasetPage - Pagina gestione dataset GeoJSON
Visualizza lista dataset con statistiche, ricerca e pannello admin
Implementa aggiornamento ottimistico per toggle attivo/disattivo
*/
export default function DatasetPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { isAdmin } = useAuth();

    const { layers: datasets, loading, error, updateLayerState, refetch } = useDatasetLayers();

    // Gestione espansione pannello admin per singolo dataset
    const [expandedAdminId, setExpandedAdminId] = useState<string | null>(null);

    // Filtra dataset visibili: admin vede tutti, utenti solo attivi e non archiviati
    const visibleDatasets = useMemo(() => {
        return isAdmin ? datasets : datasets.filter(d => d.isActive && !d.isArchived);
    }, [datasets, isAdmin]);

    const stats = useDatasetStats(visibleDatasets);

    // Ricerca full-text su tutti i campi del dataset
    const filteredLayers = useMemo(() => {
        if (!searchTerm) return visibleDatasets;
        return visibleDatasets.filter(dataset =>
            Object.values(dataset).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [visibleDatasets, searchTerm]);

    const handleToggleAdminPanel = (datasetId: string) => {
        setExpandedAdminId(prevId => (prevId === datasetId ? null : datasetId));
    };

    /*
    Toggle attivo/disattivo con aggiornamento ottimistico:
    1. Aggiorna UI immediatamente
    2. Invia richiesta al server in background
    3. In caso di errore, ripristina stato precedente
    */
    const handleToggleActive = async (datasetId: string, newIsActive: boolean) => {
        updateLayerState(datasetId, { isActive: newIsActive });

        try {
            const res = await fetch(`/api/geodatasets/${datasetId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: newIsActive }),
            });

            if (!res.ok) throw new Error("Aggiornamento fallito sul server");

        } catch (error) {
            console.error("Errore toggle dataset:", error);
            alert("Errore: impossibile aggiornare il dataset. Ripristino lo stato precedente.");
            updateLayerState(datasetId, { isActive: !newIsActive });
        }
    };

    if (error) return <div className="p-6 text-red-500">Errore: {error}</div>;

    const statConfig = [
        { icon: faLayerGroup, value: stats.totalFiles, label: isAdmin ? "File totali" : "File attivi", color: "text-blue-600" },
        { icon: faMapMarkerAlt, value: stats.totalMarkers.toLocaleString("it-IT"), label: "Marker totali", color: "text-green-600" },
        { icon: faHardDrive, value: formatFileSize(stats.totalSize), label: "Spazio totale", color: "text-purple-600" },
        { icon: faChartLine, value: stats.averageMarkers, label: "Media marker/file", color: "text-orange-600" },
    ];

    return (
        <div className="w-full min-h-full py-6 px-2 bg-gray-50">
            <div className="max-w-7xl mx-auto space-y-6">
                <header className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={faFile} size="lg" className="text-blue-600" />
                    <h1 className="text-2xl font-semibold text-gray-800">Esplora Dataset</h1>
                </header>

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Cerca per nome, categoria, luogo..."
                />

                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statConfig.map(({ icon, value, label, color }) => (
                            <StatsCard
                                key={label}
                                variant="centered"
                                icon={icon}
                                value={value}
                                label={label}
                                iconColor={color}
                            />
                        ))}
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">File GeoJSON</h2>
                        <span className="text-sm text-gray-500">{filteredLayers.length} di {visibleDatasets.length} file</span>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Caricamento...</p>
                    ) : (
                        <div className="flex flex-col space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar-general">
                            {filteredLayers.length === 0
                                ? <p className="text-center text-gray-500 py-8">{searchTerm ? "Nessun dataset trovato." : "Nessun dataset disponibile."}</p>
                                : filteredLayers.map(dataset => (
                                    <div key={dataset.id}>
                                        <DataCard
                                            data={dataset}
                                            actions={
                                                <div className="flex items-center gap-3">
                                                    {isAdmin && (
                                                        <>
                                                            <ToggleButton
                                                                activeIcon={faToggleOn}
                                                                inactiveIcon={faToggleOff}
                                                                initialState={dataset.isActive}
                                                                sizeIcon="lg"
                                                                onToggle={(isActive) => handleToggleActive(dataset.id, isActive)}
                                                                activeColor="text-green-600"
                                                                inactiveColor="text-red-600"
                                                                label={dataset.isActive ? "Disattiva dataset" : "Attiva dataset"}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleToggleAdminPanel(dataset.id)}
                                                                title="Gestisci Dataset"
                                                                className={expandedAdminId === dataset.id ? "text-blue-600" : ""}
                                                            >
                                                                <FontAwesomeIcon icon={faCog} />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            }
                                            badges={
                                                <>
                                                    <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${dataset.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                        <FontAwesomeIcon icon={dataset.isActive ? faCircleCheck : faCircleXmark} /> {dataset.isActive ? "Attivo" : "Disattivo"}
                                                    </span>
                                                    {dataset.isArchived && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">🗄️ Archiviato</span>}
                                                </>
                                            }
                                            stats={
                                                <>
                                                    <div className="flex items-center gap-1"><FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" /><span>{dataset.markerCount.toLocaleString("it-IT")} marker</span></div>
                                                    <div className="flex items-center gap-1"><FontAwesomeIcon icon={faWeightHanging} className="text-green-500" /><span>{formatFileSize(dataset.fileSize)}</span></div>
                                                </>
                                            }
                                        />
                                        {isAdmin && expandedAdminId === dataset.id && (
                                            <AdminDatasetPanel
                                                dataset={dataset}
                                                onModificationSuccess={() => refetch()}
                                            />
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
