"use client";

import { useState } from "react";
import { Modal, FormInput, ErrorMessage, Button } from "@/components/ui";
import { AdminUser } from "@/features/admin";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onConfirm: (userId: number, newPassword: string) => Promise<void>;
}

/*
ResetPasswordModal - Modale per reset password utente
Permette admin di impostare password provvisoria per utenti
*/
export default function ResetPasswordModal({ isOpen, onClose, user, onConfirm }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPassword) return;

    setError(null);
    setLoading(true);

    try {
      await onConfirm(user.id, newPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || "Si è verificato un errore.");
    } finally {
      setLoading(false);
      setNewPassword("");
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full">
        <h3 className="font-bold text-lg mb-2">Resetta Password</h3>
        <p className="text-sm text-gray-600 mb-4">
          Stai per resettare la password per l&apos;utente: <strong>{user.firstName} {user.lastName}</strong> ({user.email}).
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ErrorMessage message={error} />
          <FormInput
            id="newPassword"
            label="Nuova Password Provvisoria"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Annulla</Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Reset in corso..." : "Conferma Reset"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
