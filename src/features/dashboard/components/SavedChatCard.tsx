"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMapMarkerAlt, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { SavedChat } from "@/features/dashboard";
import { formatDate, truncateText } from "@/utils/format";
import { Button } from "@/components/ui";

import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface SavedChatCardProps {
    chat: SavedChat;
    onDelete: (chatId: number) => void;
}

/*
SavedChatCard - Card singola chat salvata con modale conferma eliminazione
Usa hook useConfirmationModal per gestire stato modale e processing
*/
export default function SavedChatCard({ chat, onDelete }: SavedChatCardProps) {
    // Hook gestione modale eliminazione con conferma
    const deleteModal = useConfirmationModal<SavedChat>(async (chatToDelete) => {
        onDelete(chatToDelete.id);
    });

    return (
        <>
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                isProcessing={deleteModal.isProcessing}
                title="Conferma Eliminazione"
                message="Sei sicuro di voler eliminare questa chat salvata? L'azione è irreversibile."
                onConfirm={deleteModal.confirm}
                onCancel={deleteModal.cancel}
                confirmText="Elimina"
            />

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 pr-4">{chat.query}</h3>
                    <Button
                        variant="button"
                        size="icon"
                        onClick={() => deleteModal.show(chat)}
                        disabled={deleteModal.isProcessing}
                        title="Elimina chat"
                    >
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                    </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2 italic truncate">
                    "{truncateText(chat.answer, 100)}"
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2" title="Data salvataggio">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
                        <span>{formatDate(chat.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Marker trovati">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500" />
                        <span>{chat.featuresCount} marker</span>
                    </div>
                </div>
            </div>
        </>
    );
}
