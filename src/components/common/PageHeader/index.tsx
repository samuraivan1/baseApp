import React from 'react';
import './PageHeader.scss';

interface Props {
  title: string;
  titleSize?: string;
  // ✅ 1. Reintroducimos la prop 'dividerColor', haciéndola opcional.
  dividerColor?: string;
}

const PageHeader: React.FC<Props> = ({
  title,
  titleSize = '2rem',
  dividerColor, // La recibimos aquí
}) => {
  const titleStyle = {
    fontSize: titleSize,
  };

  const dividerStyle = {
    backgroundColor: dividerColor,
  };

  return (
    <div className="page-header">
      <h2 className="page-header__title" style={titleStyle}>
        {title}
      </h2>
      <hr className="page-header__divider" style={dividerStyle} />
    </div>
  );
};

export default PageHeader;