import React from 'react';
import './FormSection.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export type FormSectionProps = {
  title: string;
  icon?: IconDefinition;
  children: React.ReactNode;
  className?: string;
  hideHeader?: boolean;
  dense?: boolean;
  width?: 'full' | 'content';
  useGrid?: boolean;
};

export default function FormSection({
  title,
  icon,
  children,
  className = '',
  hideHeader = false,
  dense = false,
  width = 'full',
  useGrid = true,
}: FormSectionProps) {
  return (
    <section
      className={`fs-section ${dense ? 'fs-section--dense' : ''} ${width === 'content' ? 'fs-section--content' : ''} ${className}`.trim()}
    >
      {!hideHeader && (
        <>
          <header className="fs-section__header">
            {icon && (
              <span className="fs-section__icon" aria-hidden>
                <FontAwesomeIcon icon={icon} />
              </span>
            )}
            <h3 className="fs-section__title">{title}</h3>
          </header>
          <div className="fs-section__divider" />
        </>
      )}
      <div className={`fs-section__body ${!useGrid ? 'fs-section__body--free' : ''}`.trim()}>{children}</div>
    </section>
  );
}
