// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-links">
          <Link to="/privacy-policy" className="footer-link">License</Link>
          <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
          <Link to="/attributions" className="footer-link">Attributions</Link>
          <a href="#" className="footer-link">Contact</a>
        </div>
        <div className="copyright">
          &copy; {currentYear} Herma. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;