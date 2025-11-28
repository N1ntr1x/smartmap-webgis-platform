"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchCategories, uploadDataset } from "../services/adminService";

const ICON_MIN_DIM = 32; // Dimensione minima icona in pixel
const ICON_MAX_DIM = 128; // Dimensione massima icona in pixel

/*
Sanitizza nome file per filesystem
Rimuove caratteri speciali, converte in lowercase, sostituisce spazi con trattini
*/
const sanitizeFileName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_\.]/g, "-") // Sostituisci caratteri non validi con -
    .replace(/-+/g, "-") // Rimuovi trattini multipli
    .replace(/^-|-$/g, ""); // Rimuovi trattini all'inizio/fine
};

/*
useUploadDataset - Hook per gestire upload nuovo dataset GeoJSON
Gestisce validazione file, auto-generazione nome file, e submit multipart form
Supporta precaricamento file da drag & drop esterno
*/
export default function useUploadDataset(onSuccess: () => void, preloadedFile?: File | null) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    comment: "",
    fileName: "", // Nome file univoco generato automaticamente
  });
  const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carica categorie disponibili all'avvio
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Impossibile caricare le categorie."));
  }, []);

  // Pre-compila campi quando file è precaricato (es. da drag & drop)
  useEffect(() => {
    if (preloadedFile) {
      setGeojsonFile(preloadedFile);
      const baseName = preloadedFile.name.replace(/\.geojson$/i, "");
      const sanitized = sanitizeFileName(baseName) + ".geojson";
      setFormData(prev => ({ ...prev, name: baseName, fileName: sanitized }));
    }
  }, [preloadedFile]);

  // Auto-genera nome file sanitizzato quando utente digita nome dataset
  useEffect(() => {
    if (formData.name && !preloadedFile) {
      const sanitized = sanitizeFileName(formData.name) + ".geojson";
      setFormData(p => ({ ...p, fileName: sanitized }));
    }
  }, [formData.name, preloadedFile]);

  /*
  Valida dimensioni icona marker
  Deve essere tra 32x32 e 128x128 pixel
  */
  const validateIcon = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target?.result as string;
        image.onload = () => {
          if (image.width < ICON_MIN_DIM || image.height < ICON_MIN_DIM) {
            return reject(new Error(`L'icona deve essere almeno ${ICON_MIN_DIM}x${ICON_MIN_DIM}px.`));
          }
          if (image.width > ICON_MAX_DIM || image.height > ICON_MAX_DIM) {
            return reject(new Error(`L'icona non può superare ${ICON_MAX_DIM}x${ICON_MAX_DIM}px.`));
          }
          resolve();
        };
      };
    });
  };

  // Gestisce selezione file (GeoJSON o icona) con validazione
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "geojson" | "icon") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (type === "icon") {
      try {
        await validateIcon(file);
        setIconFile(file);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Errore sconosciuto durante la validazione dell'icona");
        }
        e.target.value = "";
      }
      return;
    }

    // Controlla se il file caricato sia effetivamente un GeoJson
    if (type === "geojson") {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowed = ["geojson"];

      if (!ext || !allowed.includes(ext)) {
        setError("Il file deve essere un GeoJSON (.geojson)");
        e.target.value = "";
        return;
      }

      setGeojsonFile(file);
    }

  };

  // Submit upload dataset tramite FormData multipart
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!geojsonFile || !formData.name || !formData.category || !formData.fileName) {
      setError("Tutti i campi, incluso il nome del file, sono obbligatori.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("category", formData.category);
    data.append("comment", formData.comment);
    data.append("fileName", formData.fileName);
    data.append("geojsonFile", geojsonFile);
    if (iconFile) {
      data.append("iconFile", iconFile);
    }

    try {
      await uploadDataset(data);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, geojsonFile, iconFile, onSuccess]);

  return {
    formData,
    setFormData,
    geojsonFile,
    categories,
    isLoading,
    error,
    handleSubmit,
    handleFileChange,
  };
}
