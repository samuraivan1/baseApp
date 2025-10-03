import React from 'react';
import Button from '@/shared/components/ui/Button';
import './FormActions.scss';
import { formActionsMessages } from './FormActions.messages';

type FormActionsProps = {
  onCancel: () => void;
  onAccept: () => void;
  acceptText?: string;
  cancelText?: string;
  isAccepting?: boolean; // Para mostrar estado de carga
};

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onAccept,
  acceptText = formActionsMessages.save,
  cancelText = formActionsMessages.cancel,
  isAccepting = false,
}) => {
  return (
    <div className="form-actions">
      <Button variant="secondary" onClick={onCancel} disabled={isAccepting}>
        {cancelText}
      </Button>
      <Button
        type="submit" // Ojo, este es submit para que funcione con el form
        variant="primary"
        onClick={onAccept}
        disabled={isAccepting}
      >
        {isAccepting ? formActionsMessages.saving : acceptText}
      </Button>
    </div>
  );
};

export default FormActions;
