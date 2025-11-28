// DTO per creazione modifica dataset
export interface CreateDatasetModificationDTO {
  userId: number;
  datasetId: number;
  actionType: string; // 'created', 'updated', 'file_replaced', 'archived', 'restored'
  versionBefore?: number;
  versionAfter?: number;
  comment?: string;
}

// DTO per aggiornare una modifica (es. solo il commento)
export interface UpdateDatasetModificationDTO {
  comment: string;
}

// DTO per la risposta (lettura singola o lista)
export interface DatasetModificationResponseDTO {
  id: number;
  actionType: string;
  versionBefore: number | null;
  versionAfter: number | null;
  comment: string | null;
  createdAt: Date;
  user: {
    id: number;
    firstName: string;
    lastName: string | null;
  };
  dataset: {
    id: number;
    name: string;
  };
}