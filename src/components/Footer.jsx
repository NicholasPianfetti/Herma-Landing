import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <footer className="bg-[var(--highlight-color)] text-[var(--selected-color)] p-[var(--margin-s)] shadow-[0px_-1px_4px_rgba(0,0,0,0.1)] min-h-[75px]">
      <div className="flex flex-col text-center m-0 max-w-7xl mx-auto px-4">
        <div className="flex justify-center gap-[var(--margin-l)] md:flex-col md:gap-[var(--margin-s)]">
          <a 
            href="/privacy-policy" 
            className="text-[var(--selected-color)] hover:text-[var(--button-hover)] no-underline transition-colors duration-200" 
            onClick={(e) => handleNavigation('/privacy-policy', e)}
          >
            License
          </a>
          <a 
            href="/terms-of-service" 
            className="text-[var(--selected-color)] hover:text-[var(--button-hover)] no-underline transition-colors duration-200" 
            onClick={(e) => handleNavigation('/terms-of-service', e)}
          >
            Terms of Service
          </a>
          <a 
            href="/attributions" 
            className="text-[var(--selected-color)] hover:text-[var(--button-hover)] no-underline transition-colors duration-200" 
            onClick={(e) => handleNavigation('/attributions', e)}
          >
            Attributions
          </a>
        </div>
        <div className="text-[var(--selected-color)]/80 text-[0.9rem] w-full flex justify-between mt-[var(--margin-s)] md:flex-col md:items-center md:mt-[var(--margin-m)]">
          <span className="mr-10 md:mr-0 md:mb-[var(--margin-xs)]">Contact Us: <a href="mailto:hermalocal@gmail.com" className="text-[var(--secondary-bg)] hover:text-[var(--button-hover)] transition-colors duration-200">hermalocal@gmail.com</a></span>
          <span>&copy; {currentYear} Herma. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;