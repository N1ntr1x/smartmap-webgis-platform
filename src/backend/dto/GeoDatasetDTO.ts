// DTO interno per passare tutti i dati necessari dal Controller al Service (include i File)
export interface ServiceCreateGeoDatasetDTO {
  name: string;
  fileName: string;
  description?: string;
  location?: string;
  category: string;
  comment?: string | null;
  geojsonFile: File;
  iconFile: File | null;
  userId: number;
}

// DTO per la creazione del record nel database (categoryId numerico, iconFile obbligatorio)
export interface CreateGeoDatasetDTO {
  name: string;
  description?: string;
  geojsonFile: string;
  iconFile: string;
  location?: string;
  categoryId: number;
}

// DTO per aggiornamento metadata dataset
export interface UpdateGeoDatasetDTO {
  name?: string;
  description?: string;
  location?: string;
  categoryId?: number;
}

// DTO per risposta dataset completo
export interface GeoDatasetResponseDTO {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  version: number;
  category: {
    id: number;
    name: string;
    description: string | null;
  };
  geojson: any;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO per statistiche dataset (senza GeoJSON)
export interface GeoDatasetStatsDTO {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  version: number;
  category: {
    id: number;
    name: string;
  };
  isActive: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  markerCount: number;
  fileSize: number;
}