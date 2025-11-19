// App.jsx - Main Application Component
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import HowItWorksSection from './components/HowItWorksSection';
import ComplianceSection from './components/ComplianceSection';
import About from './components/About';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Attributions from './pages/Attributions';
import PurchasePage from './pages/PurchasePage';
import ReactGA from 'react-ga4';
import FAQ from './components/FAQ';
import HowToUse from './components/HowToUse';
import Contact from './components/Contact';
import { initializeAnalytics, trackAppUsers } from './utils/analytics';
import SuccessPage from './components/SuccessPage';
// Commented out - authentication functionality disabled
// import AuthButton from './components/AuthButton';
// import Login from './pages/Login';
// import { useAuth } from './context/AuthContext';

initializeAnalytics();
// Initialize with enhanced configuration options
ReactGA.initialize('G-FSS7V9WPY5', {
  debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
  testMode: false,
  gaOptions: {
    siteSpeedSampleRate: 100, // Collect site speed data for all users
    cookieFlags: 'SameSite=None;Secure' // Enhanced cookie settings
  },
  // Track more user dimensions automatically
  gtagOptions: {
    send_page_view: false, // We'll handle this manually for better control
    allow_google_signals: true, // Enable demographics and interests reports
    allow_ad_personalization_signals: true, // Enable advertising features
  }
});

// Enhanced RouteTracker with additional data
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track app users on each page change
    trackAppUsers();
    
    // Rest of your existing tracking code...
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
    // Track time on page when user leaves
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const timeSpent = Math.round(performance.now());
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

// Home component to wrap main page content
const Home = () => {
  return (
    <>
      <Hero />
      <ValueProposition />
      <HowItWorksSection />
      <ComplianceSection />
    </>
  );
};

function App() {
  // Commented out - authentication functionality disabled
  // const { user } = useAuth();

  // Track app load performance
  useEffect(() => {
    // Report initial page load performance
    window.addEventListener('load', () => {
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
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <RouteTracker />
        <Header />
        <Routes>
          {/* Commented out - authentication functionality disabled */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/upgrade" element={<PurchasePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/attributions" element={<Attributions />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<Home />} />
        </Routes>
        <Footer />
        {/* Commented out - authentication functionality disabled */}
        {/* <AuthButton /> */}
      </div>
    </Router>
  );
}

export default App;