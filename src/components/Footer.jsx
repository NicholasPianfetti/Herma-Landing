import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Function to handle navigation and scroll to top
  const handleNavigation = (path, e) => {
    e.preventDefault();
    
    // Navigate to the page
    navigate(path);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-links">
          <a 
            href="/privacy-policy" 
            className="footer-link" 
            onClick={(e) => handleNavigation('/privacy-policy', e)}
          >
            License
          </a>
          <a 
            href="/terms-of-service" 
            className="footer-link" 
            onClick={(e) => handleNavigation('/terms-of-service', e)}
          >
            Terms of Service
          </a>
          <a 
            href="/attributions" 
            className="footer-link" 
            onClick={(e) => handleNavigation('/attributions', e)}
          >
            Attributions
          </a>
        </div>
        <div className="copyright">
        <span className='email'>Contact Us: hermalocal@gmail.com</span>
          &copy; {currentYear} Herma. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;