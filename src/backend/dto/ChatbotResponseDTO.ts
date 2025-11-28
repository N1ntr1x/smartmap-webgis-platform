// DTO per creazione risposta chatbot
export interface CreateChatbotResponseDTO {
  userId: number;
  query: string;
  answer: string;
  geojsonData: any;
}

// DTO per risposta chatbot
export interface ChatbotResponseDTO {
  id: number;
  query: string;
  answer: string;
  geojsonData: any;
  user?: {
    id: number;
    email: string;
    firstName: string;
  };
  createdAt: Date;
}

// DTO per lista risposte chatbot (solo metadata)
export interface ChatbotResponseListItemDTO {
  id: number;
  query: string;
  answer: string;
  featuresCount: number;
  createdAt: Date;
}
