"use client";

import { FormInput, ErrorMessage, Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faSave, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useProfileData } from "@/features/profile";

/*
ProfileTab - Form modifica dati personali (nome, cognome, email)
Usa hook dedicato useProfileData per logica isolata
*/
export default function ProfileTab() {
    const {
        formData,
        handleChange,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    } = useProfileData();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserEdit} className="text-blue-600" />
                    Dati Personali
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Modifica le tue informazioni personali
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <ErrorMessage message={error} />

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                        {successMessage}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Nome"
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Mario"
                        required
                        maxLength={50}
                        minLength={2}
                        disabled={isLoading}
                    />

                    <FormInput
                        label="Cognome"
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Rossi"
                        maxLength={50}
                        disabled={isLoading}
                    />
                </div>

                <FormInput
                    label="Email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="mario.rossi@example.com"
                    required
                    maxLength={100}
                    minLength={5}
                    disabled={isLoading}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary"
                    size="default"
                    className="w-full"
                >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    {isLoading ? "Salvataggio..." : "Salva Modifiche"}
                </Button>
            </form>
        </div>
    );
}
