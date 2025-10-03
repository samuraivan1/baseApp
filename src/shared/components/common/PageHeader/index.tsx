import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import './PageHeader.scss';

interface Props {
  title: string;
  titleSize?: string;
  // ✅ 1. Reintroducimos la prop 'dividerColor', haciéndola opcional.
  dividerColor?: string;
  // Icono opcional al estilo FormSection
  icon?: IconDefinition;
}

const PageHeader: React.FC<Props> = ({
  title,
  titleSize = '2rem',
  dividerColor, // La recibimos aquí
  icon = faLayerGroup,
}) => {
  const titleStyle = {
    fontSize: titleSize,
  };

  const dividerStyle = {
    backgroundColor: dividerColor,
  };

  return (
    <div className="page-header">
      <div className="page-header__header">
        {icon && (
          <span className="page-header__icon" aria-hidden>
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <h2 className="page-header__title" style={titleStyle}>
          {title}
        </h2>
      </div>
      {/* Fondo gris + barra naranja delante */}
      <hr className="page-header__divider-bg" />
      <hr className="page-header__divider" style={dividerStyle} />
    </div>
  );
};

export default PageHeader;
