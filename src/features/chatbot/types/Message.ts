// Struttura messaggio chat tra user e bot
export interface Message {
  sender: "user" | "bot";
  text: string;
  time: string;
  answer?: string;
  geojsonData?: any;
  userQuery?: string;
}
