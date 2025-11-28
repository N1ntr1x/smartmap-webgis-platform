// Statistiche aggregate dashboard
export interface DashboardStats {
  savedChatsCount: number;
  totalMarkers: number;
  lastSaveDate: string | null;
}

// Singola chat salvata da chatbot
export interface SavedChat {
  id: number;
  query: string;
  answer: string;
  featuresCount: number;
  createdAt: Date;
  geojsonData: any; // Dati grezzi per future funzionalità
}
