import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';
import './ConfirmDialog.scss';
import { confirmDialogMessages } from './ConfirmDialog.messages';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean; // pinta el botón de confirmar en rojo si es true
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = confirmDialogMessages.confirm,
  cancelLabel = confirmDialogMessages.cancel,
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="confirm-dialog modal-content--confirm">
        <h3 className="confirm-dialog__title">{title}</h3>
        <div className="confirm-dialog__message">{message}</div>
        <div className="confirm-dialog__actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
