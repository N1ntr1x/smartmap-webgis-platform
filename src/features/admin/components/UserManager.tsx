// src/features/admin/components/UserManager.tsx
"use client";

import { useState } from "react";
import { useAdminUsers } from "@/features/admin";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/UserRole";
import { AdminUser } from "@/features/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faSpinner, faExclamationTriangle, faToggleOn, faToggleOff, faTrash, faPlus, faKey } from "@fortawesome/free-solid-svg-icons";
import { ToggleButton, Button } from "@/components/ui";
import { CreateAdminModal, ResetPasswordModal } from "@/features/admin";
import "@/styles/scrollbar.css";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

/*
UserManager - Componente per la gestione completa degli utenti della piattaforma
Permette di:
 - Visualizzare tutti gli utenti registrati
 - Attivare/disattivare account utente
 - Creare nuovi amministratori (solo SuperAdmin)
 - Resettare password utenti
 - Eliminare utenti dal sistema
Gestisce i permessi in base al ruolo dell'admin corrente.
*/
export default function UserManager() {
    // Hook custom per operazioni CRUD sugli utenti
    const { users, isLoading, error, handleUpdateStatus, handleDeleteUser, handleCreateUser, handleResetPassword } = useAdminUsers();

    // Informazioni sull'admin corrente e verifica permessi SuperAdmin
    const { user: currentAdmin, isSuperAdmin } = useAuth();

    // Stato per controllare apertura modale creazione admin
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Utente selezionato per reset password (null quando modale chiuso)
    const [userToReset, setUserToReset] = useState<AdminUser | null>(null);

    // Hook per gestire modale di conferma eliminazione utente
    // Centralizza logica stato modale, processing e callback
    const deleteModal = useConfirmationModal<AdminUser>(async (user) => {
        // Callback eseguita quando si conferma eliminazione
        await handleDeleteUser(user.id);
    });

    // Loading state - mostra spinner durante caricamento dati
    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-10">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-blue-600" />
            </div>
        );
    }

    // Error state - mostra messaggio errore se fetch fallisce
    if (error) {
        return (
            <div className="p-6 text-center text-red-600">
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Modale per creare nuovo amministratore (solo SuperAdmin) */}
            <CreateAdminModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateUser={handleCreateUser}
            />

            {/* Modale per resettare password utente selezionato */}
            <ResetPasswordModal
                isOpen={!!userToReset}
                onClose={() => setUserToReset(null)}
                user={userToReset}
                onConfirm={handleResetPassword}
            />

            {/* Modale conferma eliminazione con gestione stato centralizzata */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                isProcessing={deleteModal.isProcessing}
                title="Conferma Eliminazione Utente"
                message={
                    <>
                        Sei sicuro di voler eliminare definitivamente l&apos;utente{" "}
                        <strong>{deleteModal.item?.firstName} {deleteModal.item?.lastName}</strong>?
                        <br />
                        L&apos;azione è permanente e irreversibile.
                    </>
                }
                onConfirm={deleteModal.confirm}
                onCancel={deleteModal.cancel}
                confirmText="Elimina Definitivamente"
            />

            {/* Header sezione con titolo e bottone creazione admin */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} /> Gestione Utenti
                    </h3>
                    <p className="text-sm text-gray-500">
                        Attiva, disattiva o elimina gli account utente della piattaforma.
                    </p>
                </div>
                {isSuperAdmin && (
                    <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <FontAwesomeIcon icon={faPlus} />
                        Nuovo Admin
                    </Button>
                )}
            </div>

            {/* Tabella utenti con scroll orizzontale su mobile */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 custom-scrollbar-general select-none">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Utente
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ruolo
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Stato
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Azioni
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => {
                            // Verifica permessi per modificare questo specifico utente
                            // SuperAdmin può modificare tutti tranne altri SuperAdmin
                            // Admin può modificare solo USER normali
                            const canModify = (isSuperAdmin && user.role !== UserRole.SUPER_ADMIN) ||
                                (currentAdmin?.role === UserRole.ADMIN && user.role === UserRole.USER);

                            // Previene auto-modifica password
                            const isSelf = currentAdmin?.id === user.id;

                            return (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    {/* Colonna info utente */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">{user.email}</div>
                                    </td>

                                    {/* Colonna ruolo */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 capitalize">
                                        {user.role}
                                    </td>

                                    {/* Colonna stato attivo/disattivo */}
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${user.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {user.isActive ? "Attivo" : "Disattivo"}
                                        </span>
                                    </td>

                                    {/* Colonna azioni (toggle, reset password, elimina) */}
                                    <td className="flex px-4 py-3 justify-center items-center space-x-3">
                                        {/* Toggle attiva/disattiva utente */}
                                        <ToggleButton
                                            initialState={user.isActive}
                                            onToggle={(isActive) => handleUpdateStatus(user.id, isActive)}
                                            label={user.isActive ? "Disattiva utente" : "Attiva utente"}
                                            disabled={!canModify}
                                            activeColor="text-green-600"
                                            inactiveColor="text-gray-400"
                                            activeIcon={faToggleOn}
                                            inactiveIcon={faToggleOff}
                                            sizeIcon="lg"
                                        />

                                        {/* Bottone reset password (disabilitato se è se stesso) */}
                                        <Button
                                            variant="button"
                                            size="icon"
                                            onClick={() => setUserToReset(user)}
                                            disabled={!canModify || isSelf}
                                            title={canModify && !isSelf ? "Resetta password" : "Azione non permessa"}
                                        >
                                            <FontAwesomeIcon icon={faKey} />
                                        </Button>

                                        {/* Bottone elimina utente */}
                                        <Button
                                            variant="button"
                                            size="icon"
                                            onClick={() => deleteModal.show(user)}
                                            disabled={!canModify}
                                            title={canModify ? "Elimina utente" : "Azione non permessa"}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
