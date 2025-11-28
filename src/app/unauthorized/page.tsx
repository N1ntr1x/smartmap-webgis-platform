"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldAlt, faHome, faUser } from "@fortawesome/free-solid-svg-icons";

export default function UnauthorizedPage() {

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
            <FontAwesomeIcon icon={faShieldAlt} className="text-red-600 text-5xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Accesso Negato
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Non hai i permessi necessari per accedere a questa pagina.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
