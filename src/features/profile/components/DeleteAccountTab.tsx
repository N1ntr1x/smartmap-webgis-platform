"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, ErrorMessage } from "@/components/ui";
import { useAccountDeletion } from "@/features/profile";

interface DeleteAccountTabProps {
    onCancel: () => void;
}

/*
DeleteAccountTab - Form conferma eliminazione account
Usa hook dedicato useAccountDeletion per logica isolata
*/
export default function DeleteAccountTab({ onCancel }: DeleteAccountTabProps) {
    const {
        deleteConfirm,
        setDeleteConfirm,
        acceptTerms,
        setAcceptTerms,
        handleDelete,
        isLoading,
        error,
    } = useAccountDeletion();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
                    Elimina Account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Questa azione è permanente e irreversibile
                </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl mt-1" />
                    <div>
                        <h3 className="text-red-900 font-bold mb-2">⚠️ ATTENZIONE</h3>
                        <p className="text-sm text-red-800 mb-3">
                            L'eliminazione del tuo account comporterà:
                        </p>
                        <ul className="text-sm text-red-800 space-y-2 list-disc list-inside">
                            <li>Cancellazione permanente di tutti i tuoi dati personali</li>
                            <li>Perdita immediata dell'accesso all'account</li>
                            <li>Impossibilità di recuperare qualsiasi informazione</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <ErrorMessage message={error} />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Per confermare, digita <span className="font-bold text-red-600">ELIMINA</span>
                    </label>
                    <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="Digita ELIMINA"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                        type="checkbox"
                        id="acceptDelete"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="acceptDelete" className="text-sm text-gray-700">
                        Confermo di aver compreso che questa azione è <strong>irreversibile</strong> e
                        che tutti i miei dati verranno <strong>cancellati permanentemente</strong>.
                    </label>
                </div>

                <Button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading || deleteConfirm !== "ELIMINA" || !acceptTerms}
                    variant="destructive"
                    size="default"
                    className="w-full font-bold"
                >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    {isLoading ? "Eliminazione in corso..." : "Elimina Account Definitivamente"}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                    Cambiato idea?
                    <Button onClick={onCancel} variant="link" size="sm">
                        Torna al profilo
                    </Button>
                </p>
            </div>
        </div>
    );
}
