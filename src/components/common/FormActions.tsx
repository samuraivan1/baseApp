import React from 'react';
import Button from '@/components/ui/Button';
import './FormActions.scss';

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
  acceptText = 'Guardar',
  cancelText = 'Cancelar',
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
        {isAccepting ? 'Guardando...' : acceptText}
      </Button>
    </div>
  );
};

export default FormActions;