"use client";

import { useState } from "react";
import { Modal, FormInput, ErrorMessage, Button } from "@/components/ui";
import { CreateAdminData } from "@/features/admin";

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: (userData: CreateAdminData) => Promise<any>;
}

/*
CreateAdminModal - Modale per creare nuovo amministratore
Solo SuperAdmin può accedere a questa funzionalità
*/
export default function CreateAdminModal({
  isOpen,
  onClose,
  onCreateUser,
}: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.firstName || !formData.email || !formData.password) {
      setError("Nome, Email e Password sono obbligatori.");
      setLoading(false);
      return;
    }

    try {
      await onCreateUser(formData as CreateAdminData);
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      onClose();
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full">
        <h3 className="font-bold text-lg mb-4">Crea Nuovo Amministratore</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage message={error} />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              label="Nome"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <FormInput
              id="lastName"
              label="Cognome"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            id="password"
            label="Password Provvisoria"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Crea Utente"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
