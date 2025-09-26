import React from 'react';
import HermaLogo from './Herma.jpeg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Function to scroll to sections
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <footer className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white py-12 shadow-lg">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="w-full flex flex-col md:flex-row flex-wrap items-center justify-center gap-8 text-center">
            {/* Logo and Herma Text */}
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={HermaLogo}
                  alt="Herma Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="text-3xl font-bold">HΞRMΛ</h3>
            </div>

            {/* Quick Links to Sections */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <button
                onClick={() => scrollToSection('about')}
                className="text-white/80 hover:text-white transition-colors duration-200 text-lg"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('benefits')}
                className="text-white/80 hover:text-white transition-colors duration-200 text-lg"
              >
                Benefits
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-white/80 hover:text-white transition-colors duration-200 text-lg"
              >
                Home
              </button>
            </div>

            {/* Email Contact */}
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a
                href="mailto:hermalocal@gmail.com"
                className="text-white hover:text-blue-200 transition-colors duration-200 text-lg"
              >
                hermalocal@gmail.com
              </a>
            </div>

            {/* Copyright */}
            <div className="text-white/80 text-center text-sm md:text-base">
              <p>&copy; {currentYear} Herma. All rights reserved.</p>
            </div>
          </div>

          {/* Divider */}
          {/* <div className="w-full h-px bg-white/20"></div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;