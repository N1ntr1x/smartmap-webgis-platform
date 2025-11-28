import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

// Interface route con flag permessi per controllo accesso
export interface RoutePermissions {
  name: string;
  path: string;
  icon?: IconDefinition;
  public?: boolean;
  protected?: boolean;
  adminOnly?: boolean;
}