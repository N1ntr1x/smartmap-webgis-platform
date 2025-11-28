import { faHouse, faMap, faUser, faFile, faScrewdriverWrench, faGear, faCircleQuestion, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { RoutePermissions } from "@/features/routes";

// Route principali sidebar
export const sidebarRoutes: RoutePermissions[] = [
  // Route protette (autenticazione richiesta)
  {
    name: "Profilo",
    path: "/profile",
    icon: faUser,
    protected: true,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: faHouse,
    protected: true,
  },

  // Route pubbliche (accessibili a tutti)
  {
    name: "Mappa",
    path: "/map",
    icon: faMap,
    public: true,
  },
  {
    name: "Dataset",
    path: "/dataset",
    icon: faFile,
    public: true,
  },

  // Route admin (solo amministratori)
  {
    name: "Admin Dashboard",
    path: "/admin/dashboard",
    icon: faChartLine,
    adminOnly: true,
  },
  {
    name: "Tool",
    path: "/admin/tool",
    icon: faScrewdriverWrench,
    adminOnly: true,
  },
];

// Route footer sidebar (sempre visibili)
export const sidebarFooterRoutes: RoutePermissions[] = [
  {
    name: "Impostazioni",
    path: "#",
    icon: faGear,
    public: true,
  },
  {
    name: "Help",
    path: "#",
    icon: faCircleQuestion,
    public: true,
  },
];
