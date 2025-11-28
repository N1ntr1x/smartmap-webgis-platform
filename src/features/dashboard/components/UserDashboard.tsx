"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMapMarkerAlt, faCalendarCheck, faFolderClosed, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useUserDashboard } from "@/features/dashboard";
import { formatDate } from "@/utils/format";
import { SearchBar } from "@/components/ui";
import { StatsCard } from "@/components/ui";
import { SavedChatCard } from "@/features/dashboard";

/*
UserDashboard - Dashboard utente con statistiche e chat salvate
Visualizza statistiche aggregate e lista ricerche chatbot salvate
*/
export default function UserDashboard() {
    const {
        user,
        stats,
        filteredChats,
        error,
        searchTerm,
        setSearchTerm,
        handleDeleteChat,
    } = useUserDashboard();

    if (error) {
        return (
            <div className="p-6 text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-3xl mb-4" />
                <h2 className="text-xl font-bold text-red-700">Oops! Qualcosa è andato storto.</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Header personalizzato */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Bentornato, {user?.firstName}!</h1>
                    <p className="text-gray-600 mt-1">Questa è la tua dashboard personale.</p>
                </div>

                {/* Statistiche aggregate */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        icon={faFloppyDisk}
                        label="Chat Salvate"
                        value={stats?.savedChatsCount ?? 0}
                        borderColor="border-blue-500"
                    />
                    <StatsCard
                        icon={faMapMarkerAlt}
                        label="Marker Totali Salvati"
                        value={stats?.totalMarkers ?? 0}
                        borderColor="border-green-500"
                    />
                    <StatsCard
                        icon={faCalendarCheck}
                        label="Ultimo Salvataggio"
                        value={stats?.lastSaveDate ? formatDate(new Date(stats.lastSaveDate)) : "N/A"}
                        borderColor="border-purple-500"
                    />
                </div>

                {/* Lista chat salvate con ricerca */}
                <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFolderClosed} className="text-gray-400" />
                                Le Tue Ricerche Salvate
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Qui trovi tutte le analisi che hai salvato tramite il chatbot.
                            </p>
                        </div>
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Cerca per query..."
                            className="w-full sm:w-64"
                        />
                    </div>

                    <div className="h-80 overflow-y-auto">
                        {filteredChats.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mx-2">
                                {filteredChats.map(chat => (
                                    <SavedChatCard
                                        key={chat.id}
                                        chat={chat}
                                        onDelete={handleDeleteChat}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">
                                    {searchTerm ? "Nessuna chat trovata per questa ricerca." : "Non hai ancora nessuna chat salvata."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
