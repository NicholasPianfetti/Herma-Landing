import React, { useState, useEffect } from 'react';
import handleDownload from './handleDownload';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

// Enhanced Feature Card component with improved styling
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col border border-blue-100">
    <div className="mb-6 text-[var(--highlight-color)] flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">{title}</h3>
    <p className="text-blue-700 flex-grow text-center">{description}</p>
  </div>
);

const About = () => {
  const [osType, setOsType] = useState('unknown');

  // Scroll animation hooks
  const headerAnimation = useScrollAnimation();
  const { containerRef, itemsVisible } = useStaggeredAnimation(3, 300);
  
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

  // Top row features
  const topRowFeatures = [
    // {
    //   id: 4,
    //   icon: (
    //     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    //         <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
    //       </svg>
    //     </div>
    //   ),
    //   title: "100% Private",
    //   description: ""
    // },
    // {
    //   id: 5,
    //   icon: (
    //     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    //         <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    //       </svg>
    //     </div>
    //   ),
    //   title: "No Internet Required",
    //   description: ""
    // },
    // {
    //   id: 1,
    //   icon: (
    //     <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
    //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
    //         <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
    //       </svg>
    //     </div>
    //   ),
    //   title: "Contextual Intelligence",
    //   description: ""
    // }
  ];

  // Bottom row features
  const bottomRowFeatures = [
    {
      id: 6,
      icon: (
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
      ),
      title: "Document Analysis",
      description: "Herma can handle large documents, making it easy to analyze and summarize complex information."
    },
    {
      id: 2,
      icon: (
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
          </svg>
        </div>
      ),
      title: "Smart Conversations",
      description: "Herma combines local LLMs with powerful cloud models to create enhanced responses."
    },
    {
      id: 3,
      icon: (
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
      ),
      title: "Fully Personalized",
      description: "Herma learns from your documents and conversations, allowing it to provide personalized responses."
    },
  ];

  // Handler for download button click
  const handleDownloadClick = (osType) => {
    return () => {
      handleDownload(osType);
    };
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 via-blue-25 to-white" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header with modern styling */}
        {/* <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 ${headerAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 font-bold">HΞRMΛ</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 mx-auto transition-all duration-500 hover:w-48"></div>
        </div> */}
        
        {/* Description Block with improved typography */}
        <div
          ref={containerRef}
          className={`max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 ${itemsVisible.includes(0) ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <p className={`text-center text-lg text-blue-800 leading-relaxed mb-6 ${itemsVisible.includes(1) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Traditional AI solutions force you to choose between power and privacy. Cloud models are powerful but expose your sensitive data.
            Local models are private but limited in capability.
          </p>
          <p className={`text-center text-lg text-blue-800 leading-relaxed mb-6 ${itemsVisible.includes(2) ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="font-semibold text-blue-900">Herma's data governance technology</span> solves this dilemma by automatically detecting and extracting sensitive information from your prompts locally,
            sending only sanitized queries to powerful cloud models, then seamlessly restoring your private data in the responses.
          </p>
          <p className={`text-center text-lg text-blue-800 leading-relaxed ${itemsVisible.includes(2) ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            Experience the computational power of GPT-4, Claude, and other advanced models while ensuring your confidential information never leaves your device.
          </p>
        </div>
        
        {/* Features Grid with Animation */}
        <div className="space-y-2" id="features">
          {/* Decorative title for Features section */}
          {/* <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">Key Features</h3>
            <p className="text-lg text-blue-600 max-w-xl mx-auto">
              Everything you need in a private AI assistant
            </p>
          </div> */}
          
          {/* First Row of Features */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRowFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className="transform opacity-0 transition-all duration-500 ease-in-out animate-fadeInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div> */}
          
          {/* Second Row of Features */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bottomRowFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className="transform opacity-0 transition-all duration-500 ease-in-out animate-fadeInUp"
                style={{ animationDelay: `${(index + 3) * 150}ms` }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div> */}
        </div>
        
        {/* Final CTA Banner */}
        {/* <div className="mt-24">
          <div className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 rounded-2xl py-12 px-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-4">Experience the Power of Secure AI</h3>
              <p className="text-white text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Join us in building a future where AI is powerful, private, and accessible to everyone.
              </p>
              <button 
                onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')} 
                className="px-10 py-4 bg-white text-[var(--highlight-color)] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Download Now
              </button>
              <p className="mt-4 text-white/80 text-sm">
                {osType === 'mac' ? 'Available for Mac' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • No Payment Required
              </p>
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

export default About;