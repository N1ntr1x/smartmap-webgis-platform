"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader, ProfileSidebar, ProfileTab, PasswordTab, LocationTab, DeleteAccountTab } from "@/features/profile";
import { UserRole } from "@/types/UserRole";

type TabType = "profile" | "password" | "location" | "delete";

/*
Profile - Pagina profilo utente multi-tab (orchestrator)
Compone header, sidebar e tab specifici
Ogni tab gestisce autonomamente la propria logica tramite hook dedicato
*/
export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto min-h-full bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showDeleteTab={user.role !== UserRole.ADMIN}
          />

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "password" && <PasswordTab />}
              {activeTab === "location" && <LocationTab />}
              {activeTab === "delete" && user.role !== UserRole.ADMIN && (
                <DeleteAccountTab onCancel={() => setActiveTab("profile")} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
