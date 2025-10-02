import React from 'react';
import ResponsiveAppBar from '../ResponsiveAppBar';
import './Header.scss';

const Header: React.FC = () => {
  return (
    // La etiqueta <header> tiene la clase 'header' que controla su tamaño
    <header className="header">
      {/* ResponsiveAppBar es ahora el hijo que se adapta al tamaño del padre */}
      <ResponsiveAppBar />
    </header>
  );
};

export default Header;
