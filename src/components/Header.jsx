// Header.jsx
import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <div className="logo-container">
          <img src="/Herma.jpeg" alt="Herma Logo" className="logo" />
          <div className="logo-text">Herma</div>
        </div>
        
        <div className="mobile-menu-button" onClick={toggleMenu}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            width="24" 
            height="24"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        
        <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#download" className="nav-link">Download</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;