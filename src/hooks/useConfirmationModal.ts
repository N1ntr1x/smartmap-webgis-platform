import { useState, useCallback } from "react";

// Hook generico per gestire modali di conferma con async actions
export function useConfirmationModal<T>(onConfirmAction: (item: T) => Promise<void>) {
  // Stato dell'elemento da confermare (null se il modale è chiuso)
  const [itemToConfirm, setItemToConfirm] = useState<T | null>(null);
  // Stato di elaborazione della conferma (true se la callback è in esecuzione)
  const [isProcessing, setIsProcessing] = useState(false);

  // Mostra il modale con l'elemento specifico
  const show = useCallback((item: T) => {
    setItemToConfirm(item);
  }, []);

  // Esegue l'azione di conferma collegata al pulsante Conferma del modale
  const confirm = useCallback(async () => {
    if (!itemToConfirm) return;

    setIsProcessing(true);
    try {
      await onConfirmAction(itemToConfirm);
      setItemToConfirm(null);
    } catch (error) {
      console.error("Errore durante la conferma:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [itemToConfirm, onConfirmAction]);

  // Chiude il modale se non è in elaborazione
  const cancel = useCallback(() => {
    if (!isProcessing) {
      setItemToConfirm(null);
    }
  }, [isProcessing]);

  return {
    isOpen: !!itemToConfirm,
    isProcessing,
    item: itemToConfirm,
    show,
    confirm,
    cancel,
  };
}
