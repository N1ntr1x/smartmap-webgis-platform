"use client";

import { useAuth } from "@/contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui"

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button
      onClick={logout}
      variant="destructive"
      className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 h-auto"
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <span>Logout</span>
    </Button>
  );
}
