import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/configs";

/* 
Genera il file manifest.json per l'app PWA.
Questo file descrive come l'app viene installata e visualizzata come applicazione standalone.
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_CONFIG.name,
    short_name: APP_CONFIG.name,
    description: APP_CONFIG.description,

    /* Colori principali dell'app */
    theme_color: "#2563eb",
    background_color: "#ffffff",

    /* Modalità di visualizzazione */
    display: "standalone",
    orientation: "portrait",

    /* URL e ambito della PWA */
    scope: "/",
    start_url: "/",

    /* Icone per diverse dimensioni e dispositivi */
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ],

    /* Opzionale ma utile: preferenze per la lingua e categorie */
    lang: "it-IT",
    categories: ["productivity", "utilities", "tools"]
  };
}
