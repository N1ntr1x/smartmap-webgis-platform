"use client";

import { ReactNode } from "react";
import { ChatbotFeaturesProvider } from "@/features/chatbot";
import { MapPopupProvider } from "./MapPopupContext";

interface MapProvidersComposerProps {
    children: ReactNode;
}

/*
MapProvidersComposer - Composer centralizzato provider mappa
Mantiene Map.tsx pulito e facilita aggiunta futuri provider

Pattern Composer:
- Nesting provider in ordine gerarchico
- Commento placeholder per futuri provider
- Singolo punto modifica per context mappa
*/
export function MapProvidersComposer({ children }: MapProvidersComposerProps) {
    return (
        <ChatbotFeaturesProvider>
            <MapPopupProvider>
                {children}
            </MapPopupProvider>
        </ChatbotFeaturesProvider>
    );
}
