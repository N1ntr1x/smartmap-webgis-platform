"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { PopupListener } from "@/features/map";

import { MapContainer, TileLayer } from "react-leaflet";

import "@/features/map/styles/customLeaflet.css";

import { ContainerMapControls } from "@/features/map";
import { MapProvidersComposer } from "@/features/map";
import { MAP_CONFIG } from "@/configs";

/*
Map - Componente mappa Leaflet principale
Setup MapContainer con tile layer default e sistema controlli custom
*/
export default function Map({ position }: { position: [number, number] }) {

  return (
    <MapContainer
      center={position}
      zoom={MAP_CONFIG.defaultZoom}
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapProvidersComposer>
        <PopupListener />
        <ContainerMapControls position={position} />
      </MapProvidersComposer>
    </MapContainer>
  );
}
