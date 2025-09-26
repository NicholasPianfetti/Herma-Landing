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
import PurchasePage from './pages/PurchasePage';
import ReactGA from 'react-ga4';
import FAQ from './components/FAQ';
import HowToUse from './components/HowToUse';
import Contact from './components/Contact';
import Workflow from './components/Workflow';
import { initializeAnalytics, trackAppUsers } from './utils/analytics';
import SuccessPage from './components/SuccessPage';
import AuthButton from './components/AuthButton';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { useScrollAnimation, useStaggeredAnimation } from './hooks/useScrollAnimation';

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

// Key Benefits component
const KeyBenefits = () => {
  // Scroll animation hooks
  const headerAnimation = useScrollAnimation();
  const { containerRef: gridRef, itemsVisible } = useStaggeredAnimation(5, 400);

  return (
    <section className="py-12 bg-gradient-to-b from-white via-blue-25 to-blue-50" id="benefits">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {/* <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 ${headerAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            Key <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600">Benefits</span>
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Why choose Herma's data governance approach
          </p>
        </div> */}
        
        {/* Benefits Grid */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-8">
          {/* Cost Savings */}
          <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center transform hover:-translate-y-2 ${itemsVisible.includes(0) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Save 60-80% on AI Costs</h3>
            <p className="text-blue-700">Use powerful cloud models only when needed, local processing handles the rest.</p>
          </div>
          
          {/* Security & Privacy */}
          <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center transform hover:-translate-y-2 ${itemsVisible.includes(1) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--highlight-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Enterprise-Grade Security</h3>
            <p className="text-blue-700">Your sensitive data never leaves your device.</p>
          </div>
          
          {/* Performance */}
          <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center transform hover:-translate-y-2 ${itemsVisible.includes(2) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">Unify LLM Models</h3>
            <p className="text-blue-700">Combine the security of local processing with the intelligence of advanced cloud models.</p>
          </div>
        </div>
        
        {/* Additional Benefits Row */}
        {/*<div className="grid md:grid-cols-2 gap-8 mt-12">
           Compliance */}
          {/* <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex items-start transform hover:-translate-y-2 ${itemsVisible.includes(3) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center   mr-6 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Compliance Ready</h3>
              <p className="text-blue-700">Meet GDPR, HIPAA, and SOC 2 requirements with data that never leaves your infrastructure.</p>
            </div>
          </div> */}
          
          {/* Productivity */}
          {/* <div className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex items-start transform hover:-translate-y-2 ${itemsVisible.includes(4) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-6 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Boost Team Productivity</h3>
              <p className="text-blue-700">Teams report 3x faster document processing and analysis. Automated data sanitization means no manual redaction required.</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

// Home component to wrap main page content
const Home = () => {
  return (
    <>
      <Hero />
      <KeyBenefits />
      <About />
      <Workflow />
      {/* <HowToUse /> */}
      <Contact />
      {/* <FAQ /> */}
    </>
  );
};

function App() {
  const { user } = useAuth();

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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/upgrade" element={<PurchasePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/attributions" element={<Attributions />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<Home />} />
        </Routes>
        <Footer />
        <AuthButton />
      </div>
    </Router>
  );
}

export default App;