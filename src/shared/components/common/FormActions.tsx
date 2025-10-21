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
  auxAction?: { label: string; onClick: () => void };
};

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  onAccept,
  acceptText = formActionsMessages.save,
  cancelText = formActionsMessages.cancel,
  isAccepting = false,
  auxAction,
}) => {
  return (
    <div className="form-actions">
      <Button variant="secondary" onClick={onCancel} disabled={isAccepting}>
        {cancelText}
      </Button>
      {auxAction ? (
        <Button variant="ghost" onClick={auxAction.onClick} disabled={isAccepting}>
          {auxAction.label}
        </Button>
      ) : null}
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
