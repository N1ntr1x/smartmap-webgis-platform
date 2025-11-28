"use client";
import { useState } from "react";
import { Logo } from "@/components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faBars, faHandPointUp } from "@fortawesome/free-solid-svg-icons";
import { UserAuthButton } from "@/features/auth";
import { useMobile } from "@/contexts/MobileContext";
import { Button } from "@/components/ui"
import { usePathname } from "next/navigation";

export default function Navbar() {
  // Stato per mostrare/nascondere la NavBar
  const [visible, setVisible] = useState(true);
  // Contesto per gestione menu mobile (apri/chiudi)
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobile();

  // Preleva la rotta
  const pathname = usePathname();
  const route = "/map";

  return (
    <>
      {visible && (
        <nav className="flex-none bg-white border-b border-gray-200 shadow-md w-full z-500 relative">
          <div className="mx-auto px-4 py-1 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10">
              <div className="text-gray-800">
                <Logo />
              </div>

              <div className="flex items-center space-x-1">
                <div className="hidden md:inline-block">
                  <UserAuthButton />
                </div>

                <Button
                  variant="normal"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="shadow md:hidden rounded-lg"
                  aria-label="Toggle mobile menu"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                </Button>

                {/* Se il pathname è uguale alla rota specificata fa visualizzare il bottone */}
                {pathname === route && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVisible(!visible)}
                    className="md:block hidden"
                    aria-label="Collapse navigation"
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {!visible && (
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-99999">
          <Button
            variant="map-button"
            size="xs"
            onClick={() => setVisible(!visible)}
            className="rounded-xl text-blue-700"
          >
            <FontAwesomeIcon icon={faHandPointUp} size="lg" />
          </Button>
        </div>
      )}
    </>
  );
}
