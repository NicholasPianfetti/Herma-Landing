import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HermaLogo from './Herma.jpeg';
import handleDownload from './handleDownload';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [osType, setOsType] = useState('unknown');
  
  // Detect OS on component mount
  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent;
      const platform = window.navigator.platform;
      
      if (platform.indexOf('Mac') !== -1 || 
          userAgent.indexOf('Macintosh') !== -1 || 
          userAgent.indexOf('MacIntel') !== -1) {
        return 'mac';
      }
      
      if (platform.indexOf('Win') !== -1 || 
          userAgent.indexOf('Windows') !== -1) {
        return 'windows';
      }
      
      if (platform.indexOf('Linux') !== -1 || 
          userAgent.indexOf('Linux') !== -1) {
        return 'linux';
      }
      
      return 'unknown';
    };
    
    setOsType(detectOS());
  }, []);

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };
  
  const handleDownloadClick = () => {
    handleDownload(osType === 'mac' ? 'mac' : 'windows');
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-300 w-full 
        ${scrolled 
          ? 'py-2 bg-[var(--primary-bg)]/95 shadow-lg' 
          : 'py-4 bg-[var(--primary-bg)]/80'
        }`}
      >
        <div className="w-full px-6 lg:px-8 mx-auto max-w-[1400px]">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center relative z-10">
              <Link 
                to="/" 
                className="flex items-center group"
                aria-label="Home"
              >
                <div className={`h-10 w-10 overflow-hidden rounded-lg mr-3 shadow-sm transition-all duration-300 
                  group-hover:shadow-lg ${scrolled ? 'scale-90' : ''}`}>
                  <img 
                    src={HermaLogo} 
                    alt="Herma Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-bold tracking-wide transition-all duration-300
                    ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                    <span className="text-[var(--highlight-color)]">HΞRMΛ</span>
                  </span>
                  {!scrolled && (
                    <span className="text-xs text-blue-800/60 font-medium -mt-1">
                      Local AI Assistant
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <div className="px-4 py-1.5 bg-[var(--secondary-bg)]/20 rounded-full flex items-center mr-2">
                <Link 
                  to="#features" 
                  className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('features');
                  }}
                >
                  Features
                </Link>
                <Link 
                  to="#about" 
                  className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                >
                  About
                </Link>
              </div>
              
              {/* Download Button with OS Detection */}
              <button 
                onClick={handleDownloadClick}
                className="px-5 py-2 bg-blue-900 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                  Download
                </span>
                <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm group-hover:bg-white/30 transition-colors">
                  {osType === 'mac' 
                    ? '⌘' 
                    : osType === 'windows' 
                      ? '⊞' 
                      : '↓'}
                </span>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden relative z-10">
              <button
                onClick={toggleMenu}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--secondary-bg)]/20 text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors focus:outline-none"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">
                  {menuOpen ? 'Close menu' : 'Open menu'}
                </span>
                {!menuOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden
        ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile menu panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-64 bg-[var(--primary-bg)] shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-[var(--highlight-color)]">Menu</span>
            <button
              onClick={toggleMenu}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--secondary-bg)]/20 text-[var(--highlight-color)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-3">
            <Link 
              to="#features" 
              className="px-4 py-2 rounded-lg bg-[var(--secondary-bg)]/10 hover:bg-[var(--secondary-bg)]/30 text-[var(--text-color)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Features
            </Link>
            <Link 
              to="#about" 
              className="px-4 py-2 rounded-lg bg-[var(--secondary-bg)]/10 hover:bg-[var(--secondary-bg)]/30 text-[var(--text-color)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              About
            </Link>
          </nav>

          <div className="mt-auto pt-4 border-t border-[var(--highlight-color)]/10">
            <button 
              onClick={handleDownloadClick}
              className="w-full py-3 bg-[var(--highlight-color)] text-white font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <span>Download {osType === 'mac' ? 'for Mac' : osType === 'windows' ? 'for Windows' : 'Herma'}</span>
              <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {osType === 'mac' ? '⌘' : osType === 'windows' ? '⊞' : '↓'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;