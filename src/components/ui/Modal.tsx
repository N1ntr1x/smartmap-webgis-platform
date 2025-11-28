"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import "@/styles/scrollbar.css"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    // Gestisce la chiusura con ESC e disabilitare lo scroll della pagina
    useEffect(() => {
        if (!isOpen) return;

        // Funzione per gestire ESC
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        // Aggiunge listener e blocca lo scroll della pagina
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        // Cleanup: rimuove listener e riabilita scroll
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // createPortal renderizza il modale fuori dal flusso normale del DOM
    return createPortal(
        <div
            // Overlay che copre l"intera pagina
            className="fixed inset-0 z-[500] flex items-center justify-center backdrop-blur-sm p-4 transition-opacity duration-300 animate-fadeIn"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            {/* Contenitore del contenuto del modale */}
            <div className="w-full max-w-lg py-5 px-2 max-h-[90vh] bg-white rounded-lg shadow-xl">
                <div
                    onClick={(e) => e.stopPropagation()} // Impedisce la chiusura cliccando sul contenuto
                    className="overflow-y-auto max-h-[85vh] custom-scrollbar-general"
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body // L"elemento del DOM in cui il modale sara figlio di body
    );
}