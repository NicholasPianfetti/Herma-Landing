import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HermaLogo from './Herma.jpeg';
import handleDownload from './handleDownload';
import MenuOverlay from './MenuOverlay'; // Import the new menu overlay component
import { useAuth } from '../context/AuthContext';
import { getSubscriptionStatus } from '../services/stripeService';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [osType, setOsType] = useState('unknown');
  const [menuOpen, setMenuOpen] = useState(false); // Menu state
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Safety check for navigate function
  const safeNavigate = (path) => {
    if (navigate) {
      navigate(path);
    } else {
      // Fallback to window.location if navigate is not available
      window.location.href = path;
    }
  };

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

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Make sure menu is closed when component mounts
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };
  
  const handleDownloadClick = () => {
    handleDownload(osType === 'mac' ? 'mac' : 'windows');
    closeMenu();
  };

  // Function to handle subscription button click
  const handleSubscriptionClick = async (e) => {
    e.preventDefault();
    
    if (!user) {
      // If not logged in, go to login page
      safeNavigate('/login');
      return;
    }

    try {
      // Check if user has a subscription
      const subscriptionData = await getSubscriptionStatus(user.uid);
      
      if (subscriptionData && subscriptionData.status === 'active') {
        // User has an active subscription, go to subscription page
        safeNavigate('/success');
      } else {
        // User doesn't have a subscription, go to purchase page
        safeNavigate('/upgrade');
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // If there's an error (like 404), assume user doesn't have subscription
      safeNavigate('/upgrade');
    }
  };

  // Function to handle navigation and scroll to top
  const handleNavigation = (path, e) => {
    e.preventDefault();
    
    // Navigate to the page
    safeNavigate(path);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm transition-all duration-300 w-full 
        ${scrolled 
          ? 'py-2 bg-[var(--primary-bg)]/95 shadow-lg' 
          : 'py-4 bg-[var(--primary-bg)]/80'
        }`}
      >
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center relative z-10">
              <Link
                to="/"
                className="flex items-center group"
                aria-label="Home"
              >
                <div className={`h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-lg mr-2 sm:mr-3 shadow-sm transition-all duration-300
                  group-hover:shadow-lg group-hover:scale-110 ${scrolled ? 'scale-90' : ''}`}>
                  <img 
                    src={HermaLogo} 
                    alt="Herma Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`font-bold tracking-wide transition-all duration-300
                    ${scrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}`}>
                    <span className="text-[var(--highlight-color)]">HΞRMΛ</span>
                  </span>
                  {!scrolled && (
                    <span className="hidden sm:inline-block text-xs text-blue-800/60 font-medium -mt-1">
                      Local Data Governor
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation and Mobile Menu Toggle */}
            <div className="flex items-center gap-2">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                <div className="px-4 py-1.5 bg-[var(--secondary-bg)]/20 rounded-full flex items-center mr-2">
                <a 
                    href="/upgrade" 
                    className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/upgrade', e);
                    }}
                  >
                    Pricing
                  </a>
                  {/* <a 
                    href="/subscription" 
                    className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                    onClick={handleSubscriptionClick}
                  >
                    Subscription
                  </a>
                  <Link 
                    to="#features" 
                    className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('features');
                    }}
                  >
                    Features
                  </Link> */}
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
                  <Link 
                    to="#contact" 
                    className="px-4 py-1 rounded-full text-[var(--text-color)] hover:text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('contact');
                    }}
                  >
                    Contact Us
                  </Link>
                </div>
              </nav>
              
              {/* Download Button */}
              <button
                onClick={handleDownloadClick}
                className="hidden sm:flex px-5 py-2 bg-blue-900 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 items-center gap-2 group"
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
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-[var(--secondary-bg)]/20 text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/40 transition-colors focus:outline-none"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay - Completely separate from the header */}
      <MenuOverlay 
        isOpen={menuOpen} 
        onClose={closeMenu} 
        osType={osType} 
      />
    </>
  );
};

export default Header;