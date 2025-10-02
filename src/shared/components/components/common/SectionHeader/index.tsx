import React from 'react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './section-header.scss';

type Props = {
  title: string;
  subtitle?: string;
  icon?: IconDefinition;
  onBack?: () => void;
};

const SectionHeader: React.FC<Props> = ({ title, subtitle, icon, onBack }) => {
  return (
    <div className="section-header">
      <div className="section-header__left">
        {onBack && (
          <button className="section-header__back" onClick={onBack} aria-label="Volver">
            ←
          </button>
        )}
        {icon && <FontAwesomeIcon icon={icon} className="section-header__icon" />}
        <div className="section-header__titles">
          <h2 className="section-header__title">{title}</h2>
          {subtitle && <div className="section-header__subtitle">{subtitle}</div>}
        </div>
      </div>
      <div className="section-header__right" />
    </div>
  );
};

export default SectionHeader;

