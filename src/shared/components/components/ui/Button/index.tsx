import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import './Button.scss';

// Definimos las propiedades que nuestro botón aceptará
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'link' | 'outline' | 'ghost' | 'subtle'; // Estilos principales
  size?: 'small' | 'medium' | 'large'; // Tamaños
  icon?: IconDefinition; // Icono opcional
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Para clases adicionales
  tone?: 'default' | 'danger'; // Afinación adicional para variantes (ej. link)
  isLoading?: boolean; // Estado de carga que deshabilita y muestra spinner
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  type = 'button',
  className = '',
  tone = 'default',
  isLoading = false,
}) => {
  // Construimos la lista de clases CSS de forma dinámica
  const extraTone = variant === 'link' && tone === 'danger' ? 'btn--link-danger' : '';
  const buttonClasses = `btn btn--${variant} btn--${size} ${extraTone} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="btn__spinner" aria-hidden="true" />
      ) : (
        icon && <FontAwesomeIcon icon={icon} className="btn__icon" />
      )}
      <span className="btn__text">{children}</span>
    </button>
  );
};

export default Button;
