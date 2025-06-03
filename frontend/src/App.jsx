// App.jsx - Main Application Component
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Attributions from './pages/Attributions';
import ReactGA from 'react-ga4';
import FAQ from './components/FAQ';
import HowToUse from './components/HowToUse';
import Contact from './components/Contact';
import CheckoutPage from './components/CheckoutPage';
import DownloadSuccessPage from './components/DownloadSuccessPage';
import { initializeAnalytics, trackAppUsers } from './utils/analytics';

// Initialize Analytics
initializeAnalytics();
ReactGA.initialize('G-FSS7V9WPY5', {
  debug: process.env.NODE_ENV === 'development',
  testMode: false,
  gaOptions: {
    siteSpeedSampleRate: 100,
    cookieFlags: 'SameSite=None;Secure'
  },
  gtagOptions: {
    send_page_view: false,
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
  }
});

// Enhanced RouteTracker with additional data
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track app users on each page change
    trackAppUsers();
    
    // Enhanced page view tracking
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      title: document.title,
      location: window.location.href,
      dimension1: window.innerWidth <= 768 ? 'mobile' : 'desktop'
    });
    
    ReactGA.event({
      category: 'Navigation',
      action: 'PageView',
      label: location.pathname,
      value: 1
    });
  }, [location]);
  
  // Enhanced user timing information
  useEffect(() => {
    const startTime = performance.now();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round(performance.now() - startTime);
        ReactGA.event({
          category: 'Engagement',
          action: 'TimeOnPage',
          label: location.pathname,
          value: Math.round(timeSpent / 1000) // Convert to seconds
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location]);
  
  return null;
};

// Home component that renders all main page sections
const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <HowToUse />
      <Contact />
      <FAQ />
    </>
  );
};

function App() {
  // Track app load performance
  useEffect(() => {
    const handleLoad = () => {
      if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        ReactGA.event({
          category: 'Performance',
          action: 'PageLoad',
          value: Math.round(pageLoadTime),
          nonInteraction: true
        });
      }
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <RouteTracker />
        <Header />
        <main>
          <Routes>
            {/* Main home page with all sections */}
            <Route path="/" element={<Home />} />
            
            {/* Payment and download pages */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/download-success" element={<DownloadSuccessPage />} />
            
            {/* Legal and info pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/attributions" element={<Attributions />} />
            
            {/* Individual component pages (if you want them accessible separately) */}
            <Route path="/about" element={<About />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Simple 404 component
const NotFound = () => {
  useEffect(() => {
    ReactGA.event({
      category: 'Error',
      action: '404',
      label: window.location.pathname,
      nonInteraction: true
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a 
          href="#/" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;