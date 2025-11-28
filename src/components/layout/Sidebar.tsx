"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";

import { ButtonSidebar, Logo } from "@/components/layout"
import { UserAuthButton, LogoutButton } from "@/features/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useFilteredRoutes } from "@/features/routes";
import { useMobile } from "@/contexts/MobileContext";
import { APP_CONFIG } from "@/configs";
import { Button } from "@/components/ui"

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useMobile();
  const { isAuthenticated } = useAuth();

  const pathname = usePathname();
  const { mainRoutes, footerRoutes } = useFilteredRoutes();

  const showMenu = expanded || isMobileMenuOpen;
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, setIsMobileMenuOpen]);

  return (
    <nav
      className={` fixed md:relative top-0 left-0 h-[100dvh] md:h-auto w-full flex-none bg-white md:border-r border-gray-200 md:shadow-sm z-9999 md:z-auto transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${expanded ? "w-screen md:w-xs" : "w-auto md:w-auto"}
        flex flex-col
      `}
    >
      <div className="md:hidden flex items-center justify-between py-2 px-4 border-b border-gray-200 shadow">
        <Logo />
        <Button
          variant="normal"
          size="sm"
          onClick={() => setIsMobileMenuOpen(false)}
          className="shadow md:hidden rounded-lg"
          aria-label="Toggle mobile menu"
        >
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 py-4 px-4 md:px-2">
        <div className="flex-1 overflow-y-auto space-y-4">
          {mainRoutes.map((route) => (
            <ButtonSidebar
              key={route.name}
              icon={route.icon}
              text={route.name}
              href={route.path}
              isExpanded={showMenu}
              isActive={pathname === route.path}
            />
          ))}
        </div>

        <div className="flex-shrink-0 space-y-4 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="secondary"
            size="icon-md"
            onClick={() => setExpanded(!expanded)}
            className="hidden md:block w-full px-2 py-1 rounded-lg border border-gray-300 bg-white"
          >
            <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
          </Button>

          <div className="md:hidden flex justify-center">
            {isAuthenticated ? <LogoutButton /> : <UserAuthButton />}
          </div>

          {/* Gestione Rotte */}
          <div className="space-y-2">
            {footerRoutes.map((route) => (
              <ButtonSidebar
                key={route.name}
                icon={route.icon}
                text={route.name}
                href={route.path}
                isExpanded={showMenu}
                isActive={pathname === route.path}
              />
            ))}
          </div>

          {showMenu && (
            <>
              <hr className="border-gray-200" />
              <p className="text-gray-400 text-xs text-center">
                {APP_CONFIG.name} {APP_CONFIG.version}
              </p>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
