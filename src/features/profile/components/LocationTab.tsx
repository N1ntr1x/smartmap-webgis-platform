"use client";

import { ErrorMessage, Button } from "@/components/ui";
import SearchInput from "@/features/geo/components/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSave, faMapPin, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocationUpdate } from "@/features/profile";
import { useAuth } from "@/contexts/AuthContext";

/*
LocationTab - Form selezione posizione preferita con geocoding
Usa hook dedicato useLocationUpdate per logica isolata
*/
export default function LocationTab() {
    const { user } = useAuth();
    const {
        displayAddress,
        handleLocationSelect,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    } = useLocationUpdate();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                    Posizione Preferita
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Imposta il tuo indirizzo preferito per una migliore esperienza
                </p>
            </div>

            {user?.preferredAddress && !displayAddress && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
                    <p className="text-xs text-gray-500 mb-1">Indirizzo Attuale</p>
                    <p className="text-sm text-gray-800 flex items-center gap-2">
                        <FontAwesomeIcon icon={faMapPin} className="text-green-600" />
                        {user.preferredAddress}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <ErrorMessage message={error} />

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                        {successMessage}
                    </div>
                )}

                <SearchInput
                    label="Cerca Nuovo Indirizzo"
                    placeholder="Via, città, regione..."
                    applyFilter={false}
                    onSelect={handleLocationSelect}
                    selectedAddress={displayAddress}
                    showCoordinates={false}
                    showType={false}
                    feedbackMessage={
                        <>
                            <FontAwesomeIcon icon={faMapPin} className="mr-1" />
                            Indirizzo selezionato
                        </>
                    }
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    size="default"
                    className="w-full"
                >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    {isLoading ? "Salvataggio..." : "Salva Posizione"}
                </Button>
            </form>
        </div>
    );
}
