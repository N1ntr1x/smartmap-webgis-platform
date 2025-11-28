import { REQUIRED_MARKER_FIELDS } from "@/features/marker";

/*
MappingConfig - Configurazione campi mappatura tool conversione

REQUIRED_FIELDS: derivati da REQUIRED_MARKER_FIELDS (name, description, etc.)
OPTIONAL_FIELDS: icon, color
LAT_ALIASES/LON_ALIASES: varianti comuni nomi coordinate per auto-detect
*/
export const MappingConfig = {
    REQUIRED_FIELDS: Object.keys(REQUIRED_MARKER_FIELDS),
    OPTIONAL_FIELDS: ["icon", "color"],
    LAT_ALIASES: ["lat", "latitude", "y", "latitudine"],
    LON_ALIASES: ["lon", "lng", "longitude", "x", "longitudine"]
};
