import React from 'react';
import { footerMessages } from './Footer.messages';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">{footerMessages.copyright}</p>
        <div className="footer__date">{footerMessages.lastUpdate}</div>
      </div>
    </footer>
  );
};

export default Footer;