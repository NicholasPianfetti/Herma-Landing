import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import handleDownload from './handleDownload';

const MenuOverlay = ({ isOpen, onClose, osType }) => {
  // Handle ESC key press to close the menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Close on outside click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  const handleDownloadClick = () => {
    handleDownload(osType === 'mac' ? 'mac' : 'windows');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/10 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div className="w-64 bg-white shadow-xl h-full overflow-y-auto animate-slide-in-right">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-blue-900">Menu</span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <Link 
              to="#features" 
              className="px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('features');
              }}
            >
              Features
            </Link>
            <Link 
              to="#about" 
              className="px-4 py-3 rounded-lg hover:bg-blue-50 text-blue-900 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('about');
              }}
            >
              About
            </Link>
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button 
              onClick={handleDownloadClick}
              className="w-full py-3 bg-blue-900 text-white font-medium rounded-lg flex items-center justify-center gap-2"
            >
              <span>Download for {osType === 'mac' ? 'Mac' : osType === 'windows' ? 'Windows' : 'Your Device'}</span>
              <span className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {osType === 'mac' ? '⌘' : osType === 'windows' ? '⊞' : '↓'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;

// Add this to your global CSS file:
/*
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out forwards;
}
*/