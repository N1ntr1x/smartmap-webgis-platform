// DTO per creazione e aggiornamento categoria
export interface CategoryDTO {
  name: string;
  description?: string;
}

// DTO per risposta categoria
export interface CategoryResponseDTO {
  id: number;
  name: string;
  description: string | null;
  layersCount?: number;
  createdAt: Date;
  updatedAt: Date;
}