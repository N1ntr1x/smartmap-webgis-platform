"use client";

import { Modal, FormInput, ErrorMessage, Button } from "@/components/ui";
import { CreatableSelect } from "@/features/admin";
import { useUploadDataset } from "@/features/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface UploadDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preloadedFile?: File | null;
}

/*
UploadDatasetModal - Modale per upload nuovo dataset GeoJSON
Permette configurazione completa: nome, categoria, località, file GeoJSON e icona custom
*/
export default function UploadDatasetModal({ isOpen, onClose, onSuccess, preloadedFile }: UploadDatasetModalProps) {
  const { formData, setFormData, geojsonFile, categories, isLoading, error, handleSubmit, handleFileChange } = useUploadDataset(onSuccess, preloadedFile);

  const categoryOptions = categories.map(c => (
    { value: String(c.id), label: c.name }
  ));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-1">Carica Nuovo Dataset</h3>
        <p className="text-sm text-gray-500 mb-4">Compila i dettagli e carica i file necessari.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage message={error} />

          <FormInput id="name" label="Nome Dataset" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required placeholder="Es. Fontane di Messina" />

          {/* Input per nome file univoco, si auto-compila da nome dataset */}
          <FormInput
            id="fileName"
            label="Nome File (univoco)"
            value={formData.fileName}
            onChange={(e) => setFormData(p => ({ ...p, fileName: e.target.value }))}
            required
            placeholder="es. fontane-di-messina.geojson"
          />

          <FormInput
            id="description"
            label="Descrizione (Opzionale)"
            value={formData.description}
            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
          />

          <FormInput
            id="location"
            label="Località (es. Messina, Sicilia, Italia)"
            value={formData.location}
            onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
          />

          <FormInput
            id="comment"
            label="Commento alla Creazione (Opzionale)"
            value={formData.comment}
            onChange={(e) => setFormData(p => ({ ...p, comment: e.target.value }))}
            placeholder="Es: Primo caricamento del dataset degli enti"
          />

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Categoria</label>
            <CreatableSelect
              options={categoryOptions}
              value={formData.category}
              onValueChange={(value) => setFormData(p => ({ ...p, category: value }))}
              placeholder="Scegli o crea una categoria..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">File GeoJSON (.geojson)</label>
            {preloadedFile && geojsonFile ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileCircleCheck} />
                <span>File <strong>{preloadedFile.name}</strong> pronto per il caricamento.</span>
              </div>
            ) : (
              <input type="file" accept=".geojson" required onChange={(e) => handleFileChange(e, "geojson")} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">Icona Marker (Opzionale, max 128x128)</label>
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e, "icon")} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Annulla</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Caricamento..." : "Carica Dataset"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
