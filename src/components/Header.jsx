// Header.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import HermaLogo from './Herma.jpeg';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Close the mobile menu after clicking
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <div className="logo-container">
          <Link to="/" className='logo-container'>
            <img src={HermaLogo} alt="Herma Logo" className="logo"/>
            <div className="logo-text">HΞRMΛ</div>
          </Link>
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
          <a href="#" className="nav-link">Download</a>
          <a 
            href="#about-description" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
            >  
              About
            </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;