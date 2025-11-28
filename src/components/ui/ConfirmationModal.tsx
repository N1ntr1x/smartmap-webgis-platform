import { Modal, Button} from '@/components/ui';

interface ConfirmationModalProps {
  isOpen: boolean;
  isProcessing: boolean;
  title: string;
  message: React.ReactNode; // Messaggio (può essere testo o JSX)
  onConfirm: () => void; // Callback da eseguire se Conferma
  onCancel: () => void; // Callback da eseguire se Cancella
  confirmText?: string;
}

export default function ConfirmationModal({
  isOpen,
  isProcessing,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Conferma'
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <div className="bg-white p-6 rounded-lg w-auto mx-4">
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm text-gray-600 my-4">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={isProcessing}>
            Annulla
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? 'Elaborazione...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}