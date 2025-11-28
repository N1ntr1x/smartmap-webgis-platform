import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sidebarRoutes, sidebarFooterRoutes } from "@/features/routes";

/*
useFilteredRoutes - Hook filtro route sidebar basato su permessi

LOGICA FILTRO:
1. public: sempre visibile
2. protected: solo se autenticato
3. adminOnly: solo se admin

Usa useMemo per evitare ricalcoli inutili al re-render
*/
export default function useFilteredRoutes() {
  const { isAuthenticated, user, isAdmin } = useAuth();

  // Filtra route principali
  const mainRoutes = useMemo(() => {
    return sidebarRoutes.filter(route => {
      if (route.public) return true;
      if (route.adminOnly) return isAdmin;
      if (route.protected) return isAuthenticated;
      return true;
    });
  }, [isAuthenticated, user, isAdmin]);

  // Filtra route footer
  const footerRoutes = useMemo(() => {
    return sidebarFooterRoutes.filter(route => {
      if (route.public) return true;
      if (route.protected) return isAuthenticated;
      if (route.adminOnly) return isAdmin;
      return true;
    });
  }, [isAuthenticated, user, isAdmin]);

  return {
    mainRoutes,
    footerRoutes,
  };
}
