import React, { useState, useEffect, useRef } from 'react';
// Commented out - no longer using auth/payment functionality
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { createCheckoutSession } from '../services/stripeService';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Hero = () => {
  // Commented out - no longer using auth/payment functionality
  // const navigate = useNavigate();
  // const { user } = useAuth();
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Commented out - no longer using auth/payment flow
  // const handleUpgradeClick = async () => {
  //   if (!user) {
  //     navigate('/login?redirect=checkout');
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const { session, error: sessionError } = await createCheckoutSession(user);

  //     if (sessionError) {
  //       throw new Error(sessionError);
  //     }

  //     const stripe = await stripePromise;
  //     const { error } = await stripe.redirectToCheckout({
  //       sessionId: session.id,
  //     });

  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //   } catch (error) {
  //     console.error('Upgrade error:', error);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleBookDemo = () => {
    window.open('https://calendly.com/hermalocal/30min', '_blank');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[var(--highlight-color)] opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Main Headline */}
            <div className="w-full max-w-5xl mb-8">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight animate-hero"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <span className="text-[#242424]">Unify All AI Models</span>
                <br />
                <span className="text-[var(--highlight-color)]">Across Privacy Levels</span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#242424] mb-8 font-normal max-w-3xl mx-auto leading-relaxed opacity-90 px-2 sm:px-0 animate-hero-delayed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Herma intelligently routes AI requests based on data sensitivity to maximize cost savings and model access while maintaining privacy.
              </p>

              {/* CTA Button - Centered */}
              <div className="flex items-center justify-center mb-4 animate-hero-delayed-more">
                <button
                  onClick={handleBookDemo}
                  className="group relative overflow-hidden px-8 py-4 bg-[var(--highlight-color)] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:ring-offset-2 min-w-[200px]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    Book a Demo
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Commented out - See How It Works button removed */}
              {/* <button
                onClick={() => scrollToSection('how-it-works')}
                className="group px-8 py-4 bg-white text-[var(--highlight-color)] font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-[var(--highlight-color)] transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:ring-offset-2 w-full sm:w-auto sm:min-w-[200px]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                <span className="relative flex items-center justify-center gap-2">
                  See How It Works
                  <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button> */}

              {/* Commented out - error display no longer needed */}
              {/* {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                  <p className="text-red-700 text-sm" style={{ fontFamily: 'var(--font-ui)' }}>{error}</p>
                </div>
              )} */}
            </div>

            {/* Demo Video Section */}
            <div className="w-full max-w-5xl mt-8 animate-hero-delayed-more">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[var(--highlight-color)] to-indigo-700 p-1">
                {/* MacOS-style Window Chrome */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800/95 backdrop-blur-sm flex items-center justify-center px-4 z-20 rounded-t-2xl">
                  <div className="absolute left-4 flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm font-medium" style={{ fontFamily: 'var(--font-ui)' }}>Herma Platform Demo</span>
                </div>

                {/* Video Container */}
                <div className="bg-gray-900 rounded-b-2xl pt-10 overflow-hidden">
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    <video
                      ref={videoRef}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      controls
                      playsInline
                      poster="/demo-poster.jpg"
                    >
                      <source src="/demo.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>

              {/* Video Caption */}
              <p
                className="mt-6 text-sm text-gray-600 italic"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Watch how Herma's data governor filters sensitive information in real-time, routing requests to the optimal AI model based on privacy requirements.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
