"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup, faUsers, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { DatasetManager, UserManager } from "@/features/admin";
import { useAuth } from "@/contexts/AuthContext";
import { TabButton } from "@/components/ui"

type AdminTab = "datasets" | "users";

/*
AdminDashboard - Pannello principale di amministrazione
Permette di navigare tra gestione dataset e gestione utenti tramite tab
*/
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("datasets");
    const { user } = useAuth();

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header con informazioni admin e badge SuperAdmin */}
                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Amministratore</h1>
                        <p className="text-sm text-gray-500">Benvenuto, {user?.firstName}!</p>
                    </div>
                    {user?.role === "super_admin" && (
                        <span className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            Super Admin
                        </span>
                    )}
                </header>

                {/* Navigazione tab tra Dataset e Utenti */}
                <nav className="flex gap-2">
                    <TabButton
                        value="datasets"
                        label="Gestione Dataset"
                        activeTab={activeTab}
                        onClick={setActiveTab}
                        icon={faLayerGroup}
                    />

                    <TabButton
                        value="users"
                        label="Gestione Utenti"
                        activeTab={activeTab}
                        onClick={setActiveTab}
                        icon={faUsers}
                    />
                </nav>

                {/* Contenuto dinamico basato su tab attivo */}
                <main className="sm:bg-white sm:p-6 sm:rounded-2xl sm:shadow-sm sm:border border-gray-200">
                    {activeTab === "datasets" && <DatasetManager />}
                    {activeTab === "users" && <UserManager />}
                </main>
            </div>
        </div>
    );
}
