"use client";

import { useState } from "react";
import { TabButton } from "@/components/ui";

type Format = "geojson" | "json" | "csv";

/*
SupportedFormatsGuide - Guida formati supportati con esempi
Tab per GeoJSON, JSON array, CSV
*/
export default function SupportedFormatsGuide() {
  const [activeTab, setActiveTab] = useState<Format>("geojson");

  const renderContent = () => {
    switch (activeTab) {
      case "geojson":
        return (
          <div>
            <p className="mb-4 text-gray-600">
              GeoJSON è un formato standard per la codifica di strutture di dati geografici. Il tool accetta file <strong>FeatureCollection</strong>, dove ogni <strong>Feature</strong> deve contenere un oggetto <code>properties</code>.
            </p>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto">
              {`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [15.55, 38.18]
      },
      "properties": {
        "name": "Duomo di Messina",
        "category": "Luogo Storico"
      }
    }
  ]
}`}
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              Le chiavi dentro l'oggetto <code>properties</code> (es. "name", "category") saranno i campi che potrai mappare nello step successivo.
              <br />
              <a href="https://datatracker.ietf.org/doc/html/rfc7946" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 inline-block">
                Leggi la specifica GeoJSON (RFC 7946)
              </a>
            </p>
          </div>
        );
      case "json":
        return (
          <div>
            <p className="mb-4 text-gray-600">
              Per i file JSON, il tool supporta un <strong>array di oggetti</strong>. Ogni oggetto nell'array rappresenta una riga di dati, e le sue chiavi saranno i campi disponibili per la mappatura.
            </p>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto">
              {`[
  {
    "nome_luogo": "Colosseo",
    "citta": "Roma",
    "descrizione": "Antico anfiteatro romano.",
    "lat": 41.8902,
    "lon": 12.4922
  },
  {
    "nome_luogo": "Torre di Pisa",
    "citta": "Pisa",
    "descrizione": "Famosa torre pendente.",
    "lat": 43.7229,
    "lon": 10.3966
  }
]`}
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              Per la geolocalizzazione, assicurati di avere colonne separate per la latitudine (es. "lat", "latitude") e la longitudine (es. "lon", "longitude").
            </p>
          </div>
        );
      case "csv":
        return (
          <div>
            <p className="mb-4 text-gray-600">
              Per i file CSV, la <strong>prima riga deve contenere le intestazioni (header)</strong> delle colonne. Queste intestazioni diventeranno i campi disponibili per la mappatura.
            </p>
            <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs overflow-x-auto">
              {`"name","city","description","latitude","longitude"
"Duomo di Milano","Milano","Cattedrale gotica, simbolo della città.",45.4642,9.1900
"Ponte di Rialto","Venezia","Il più antico ponte sul Canal Grande.",45.4380,12.3358`}
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              Il delimitatore standard è la virgola (`,`). Se i tuoi valori contengono virgole, assicurati che siano racchiusi tra virgolette doppie (`"`).
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full mt-12 sm:p-6 rounded-lg bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Formati File Supportati
      </h3>

      <div className="flex justify-center items-center gap-2 space-x-2">
        <TabButton
          value="geojson"
          label="GeoJSON"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          value="json"
          label="JSON"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          value="csv"
          label="CSV"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
      </div>

      <div className="p-4">{renderContent()}</div>
    </div>
  );
}
