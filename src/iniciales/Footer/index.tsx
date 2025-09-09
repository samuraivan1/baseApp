import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">ejemplo</p>
        <div className="footer__date">June 2022</div>
      </div>
    </footer>
  );
};

export default Footer;
