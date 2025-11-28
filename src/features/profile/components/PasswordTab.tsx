"use client";

import { FormInput, ErrorMessage, Button } from "@/components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faKey, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { usePasswordChange } from "@/features/profile";

/*
PasswordTab - Form cambio password con validazione
Usa hook dedicato usePasswordChange per logica isolata
*/
export default function PasswordTab() {
    const {
        passwordData,
        handleChange,
        handleSubmit,
        isLoading,
        error,
        successMessage,
    } = usePasswordChange();

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faLock} className="text-blue-600" />
                    Sicurezza Account
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Cambia la tua password per proteggere l'account
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <p className="font-medium mb-2">📋 Requisiti password:</p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                        <li>Minimo 8 caratteri</li>
                        <li>Deve essere diversa dalla password attuale</li>
                    </ul>
                </div>

                <FormInput
                    label="Password Attuale"
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label="Nuova Password"
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    disabled={isLoading}
                />

                <FormInput
                    label="Conferma Nuova Password"
                    id="confirmNewPassword"
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={8}
                    required
                    disabled={isLoading}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="success"
                    size="default"
                    className="w-full"
                >
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    {isLoading ? "Aggiornamento..." : "Cambia Password"}
                </Button>
            </form>
        </div>
    );
}
