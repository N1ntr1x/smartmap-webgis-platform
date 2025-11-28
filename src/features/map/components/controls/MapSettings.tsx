"use client";

import { useMap } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faXmark, faPlus, faMinus, faCrosshairs } from "@fortawesome/free-solid-svg-icons";

interface MapSettingsProps {
    position: LatLngExpression | LatLngTuple;
    isOpen: boolean;
    onToggle: () => void;
}

/*
MapSettings - Controlli base mappa (zoom, centro)
Espone funzioni Leaflet comuni con UI custom
*/
export default function MapSettings({ position, isOpen, onToggle }: MapSettingsProps) {
    const map = useMap();

    const zoomIn = () => map.setZoom(map.getZoom() + 1);
    const zoomOut = () => map.setZoom(map.getZoom() - 1);
    const centerMap = () => map.setView(position, map.getZoom());

    return (
        <div className="relative text-blue-600 w-48">
            {!isOpen && (
                <Button
                    variant="map-button"
                    size="icon-md"
                    onClick={onToggle}
                    className="rounded-full"
                >
                    <FontAwesomeIcon icon={faGear} size="xl" />
                </Button>
            )}

            {isOpen && (
                <div className="w-full text-gray-700 bg-white border border-gray-200 rounded-lg shadow py-2 px-3 select-none">
                    <div className="flex justify-between items-center text-blue-800 mb-2">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faGear} className="mr-2 text-sm" />
                            <span className="font-semibold text-sm">Controlli Mappa</span>
                        </div>
                        <Button variant="ghost" onClick={onToggle} size="icon">
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                    </div>

                    <hr className="my-2 text-gray-300" />

                    <div className="flex flex-col space-y-2">
                        <Button variant="normal" onClick={zoomIn} className="justify-start hover:bg-blue-50 rounded p-2 text-sm">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Zoom Avanti
                        </Button>
                        <Button variant="normal" onClick={zoomOut} className="justify-start hover:bg-blue-50 rounded p-2 text-sm">
                            <FontAwesomeIcon icon={faMinus} className="mr-2" /> Zoom Indietro
                        </Button>

                        <hr className="text-gray-300" />

                        <Button variant="normal" onClick={centerMap} className="justify-start hover:bg-orange-50 rounded p-2 text-sm">
                            <FontAwesomeIcon icon={faCrosshairs} className="mr-2" /> Centra
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
