"use client";

import { TabButton } from "@/components/ui";
import { faUserEdit, faKey, faMapMarkerAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

type TabType = "profile" | "password" | "location" | "delete";

interface ProfileSidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    showDeleteTab: boolean;
}

/*
ProfileSidebar - Navigazione sidebar tab profilo
Condizionalmente mostra tab eliminazione (solo non-admin)
*/
export default function ProfileSidebar({ activeTab, onTabChange, showDeleteTab }: ProfileSidebarProps) {
    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-6">
                <nav className="space-y-2">
                    <TabButton
                        value="profile"
                        label="Dati Personali"
                        activeTab={activeTab}
                        onClick={onTabChange}
                        icon={faUserEdit}
                        activeClass="bg-blue-50 text-blue-700"
                        inactiveClass="text-gray-700 hover:bg-gray-50"
                        className="w-full justify-start gap-3 rounded-xl"
                    />

                    <TabButton
                        value="password"
                        label="Sicurezza"
                        activeTab={activeTab}
                        onClick={onTabChange}
                        icon={faKey}
                        activeClass="bg-blue-50 text-blue-700"
                        inactiveClass="text-gray-700 hover:bg-gray-50"
                        className="w-full justify-start gap-3 rounded-xl"
                    />

                    <TabButton
                        value="location"
                        label="Posizione"
                        activeTab={activeTab}
                        onClick={onTabChange}
                        icon={faMapMarkerAlt}
                        activeClass="bg-blue-50 text-blue-700"
                        inactiveClass="text-gray-700 hover:bg-gray-50"
                        className="w-full justify-start gap-3 rounded-xl"
                    />

                    {showDeleteTab && (
                        <TabButton
                            value="delete"
                            label="Elimina Account"
                            activeTab={activeTab}
                            onClick={onTabChange}
                            icon={faTrash}
                            activeClass="bg-red-50 text-red-700"
                            inactiveClass="text-red-600 hover:bg-red-50"
                            className="w-full justify-start gap-3 rounded-xl"
                        />
                    )}
                </nav>
            </div>
        </div>
    );
}
