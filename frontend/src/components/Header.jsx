// src/components/Header.jsx - Updated with authentication based on existing header
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { currentUser, logout, getUserSubscriptionTier, userHasActiveSubscription } = useAuth();
  const navigate = useNavigate();

  const userTier = getUserSubscriptionTier();
  const hasActiveSub = userHasActiveSubscription();

  const handleNavigation = (path, e) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleAuthClick = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-40 border-b border-blue-100">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3"
              onClick={(e) => handleNavigation('/', e)}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-blue-900">Herma</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                Pricing
              </button>
              <Link
                to="/privacy-policy"
                onClick={(e) => handleNavigation('/privacy-policy', e)}
                className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
              >
                Privacy
              </Link>
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">
                        {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block">
                      {currentUser.displayName || 'Account'}
                    </span>
                    {hasActiveSub && (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        PRO
                      </span>
                    )}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            hasActiveSub 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hasActiveSub ? '✓ Pro Member' : 'Free Plan'}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={(e) => {
                          handleNavigation('/dashboard', e);
                          setIsUserMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      
                      {!hasActiveSub && (
                        <button
                          onClick={() => {
                            scrollToSection('pricing');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Upgrade to Pro
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleAuthClick('login')}
                    className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuthClick('signup')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-blue-700 hover:text-blue-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-blue-700 hover:text-blue-900 font-medium text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-blue-700 hover:text-blue-900 font-medium text-left"
                >
                  Pricing
                </button>
                <Link
                  to="/privacy-policy"
                  onClick={(e) => handleNavigation('/privacy-policy', e)}
                  className="text-blue-700 hover:text-blue-900 font-medium"
                >
                  Privacy
                </Link>

                {currentUser ? (
                  <div className="pt-4 border-t border-blue-100">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {hasActiveSub ? 'Pro Member' : 'Free Plan'}
                        </p>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={(e) => handleNavigation('/dashboard', e)}
                      className="block text-blue-700 hover:text-blue-900 font-medium mb-2"
                    >
                      Dashboard
                    </Link>
                    
                    {!hasActiveSub && (
                      <button
                        onClick={() => scrollToSection('pricing')}
                        className="block text-blue-600 hover:text-blue-800 font-medium mb-2"
                      >
                        Upgrade to Pro
                      </button>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-blue-100 flex flex-col space-y-3">
                    <button
                      onClick={() => handleAuthClick('login')}
                      className="text-blue-700 hover:text-blue-900 font-medium text-left"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleAuthClick('signup')}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Close dropdowns when clicking outside */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </>
  );
};

export default Header;