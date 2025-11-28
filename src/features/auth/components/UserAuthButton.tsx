"use client";

import { useRef } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/AuthContext";

export default function UserAuthButton() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-1.5 text-center"
      >
        Accedi
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-700 transition-colors"
      >
        <div className="rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-white flex items-center justify-center w-8 h-8">
          <span>
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>
        <span className="text-sm font-medium">{user?.firstName}</span>
        {isAdmin && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            Admin
          </span>
        )}
      </Link>
    </div>
  );
}
