"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faShieldHalved,
    faEnvelope,
    faMapMarkerAlt,
    faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { LogoutButton } from "@/features/auth";
import { UserRole } from "@/types/UserRole";

interface ProfileHeaderProps {
    user: any;
}

/*
ProfileHeader - Header profilo con avatar, info e statistiche
Visualizza badge admin se applicabile
*/
export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
                        </div>
                        {user.role === "admin" && (
                            <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 border-2 border-white">
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                    className="text-white text-xs"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                            {user.email}
                        </p>
                        {user.preferredAddress && (
                            <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="text-gray-400"
                                />
                                {user.preferredAddress}
                            </p>
                        )}
                    </div>
                </div>

                <LogoutButton />
            </div>

            {/* Statistiche utente */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        ID Utente
                    </p>
                    <p className="text-sm font-mono font-semibold text-gray-800">
                        {user.id}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Ruolo
                    </p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                        {user.role === UserRole.USER ? "Utente" : "Admin"}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Account
                    </p>
                    <p className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                        Attivo
                    </p>
                </div>
            </div>
        </div>
    );
}
