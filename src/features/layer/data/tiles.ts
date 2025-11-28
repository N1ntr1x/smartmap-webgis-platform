import L from "leaflet";

// Tile Layer per la mappa
export const TILE_LAYERS = [
    {
        id: "osm",
        name: "OpenStreetMap",
        type: 'tile',
        description: "Mappa stradale standard di OpenStreetMap, dettagliata e aggiornata.",
        layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }),
        default: true,
    },
    {
        id: "osm-hot",
        name: "OSM HOT",
        type: 'tile',
        description: "Layer OpenStreetMap Humanitarian, utile per emergenze e mappature umanitarie.",
        layer: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        }),
        default: false,
    },
    {
        id: "opentopomap",
        name: "OpenTopoMap",
        type: 'tile',
        description: "Mappa topografica con rilievi, altitudine e dettagli naturali del territorio.",
        layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17,
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }),
        default: false,
    },
    {
        id: "openseamap",
        name: "OpenSeaMap",
        type: 'tile',
        description: "Carta nautica con segnali marittimi, porti e profondità dei mari.",
        layer: L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
        }),
        default: false,
    },
    {
        id: "esri",
        name: "Esri World Imagery",
        type: 'tile',
        description: "Immagini satellitari ad alta risoluzione, per visualizzare il territorio reale.",
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
        default: false,
    },
    {
        id: "esri-street",
        name: "Esri World Street Map",
        type: 'tile',
        description: "Mappa stradale dettagliata a livello mondiale, con strade e infrastrutture.",
        layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
        }),
        default: false,
    },
];
