import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import './Button.scss';

// Definimos las propiedades que nuestro botón aceptará
type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger'; // Estilos principales
  size?: 'small' | 'medium' | 'large'; // Tamaños
  icon?: IconDefinition; // Icono opcional
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Para clases adicionales
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
}) => {
  // Construimos la lista de clases CSS de forma dinámica
  const buttonClasses = `
    btn 
    btn--${variant} 
    btn--${size}
    ${className}
  `.trim(); // .trim() para eliminar espacios extra

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <FontAwesomeIcon icon={icon} className="btn__icon" />}
      <span className="btn__text">{children}</span>
    </button>
  );
};

export default Button;