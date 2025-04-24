import React, { useState } from 'react';
import handleDownload from './handleDownload';

// Feature Card component with custom styling using your color variables
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[var(--primary-bg)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
    <div className="mb-4 text-[var(--highlight-color)]">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-[var(--highlight-color)] mb-3">{title}</h3>
    <p className="text-[var(--text-color)] flex-grow">{description}</p>
  </div>
);

const About = () => {
  // Top row features
  const [osType, setOsType] = useState('unknown');
  const topRowFeatures = [
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
        </svg>
      ),
      title: "Private",
      description: "Your conversations and documents stay on your device. No information leaves your control. Your privacy is our priority."
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
        </svg>
      ),
      title: "Low Latency",
      description: "Herma runs locally, so you can get fast responses without the need for an internet connection. No more waiting for cloud processing."
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      title: "Large Context",
      description: "Herma can handle large documents and conversations, making it easy to analyze and summarize complex information."
    }
  ];

  // Bottom row features
  const bottomRowFeatures = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
        </svg>
      ),
      title: "Clear Analysis",
      description: "Retrieval augmented generated context from documents, memory, and more allows Herma to provide accurate and efficient responses."
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
        </svg>
      ),
      title: "Smart Conversations",
      description: "Herma combines local LLMs with powerful memory to have helpful conversations about complex topics."
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      title: "Fully Personalized",
      description: "Herma learns from your documents and conversations, allowing it to provide personalized responses and suggestions."
    },
  ];

  // Handler for download button click
  const handleDownloadClick = (osType) => {
    return () => {
      handleDownload(osType);
    };
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[var(--secondary-bg)] to-[var(--primary-bg)]" id="about">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header with Decorative Elements */}
        <div className="relative mb-16 text-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[var(--highlight-color)]/20 -z-10"></div>
          <h2 className="inline-block bg-gradient-to-r from-[var(--primary-bg)] to-[var(--primary-bg)] px-8 text-4xl font-bold relative z-10">
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-[var(--highlight-color)] font-bold">HΞRMΛ</span>
          </h2>
        </div>
        
        {/* Description Block */}
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-center text-lg text-[var(--text-color)] leading-relaxed">
            Herma is an intelligent assistant that helps you find answers, analyze documents, and get things done privately. 
            Currently, you have two choices when using private data with LLMs: 
            either expose private information to the cloud or use custom locally run LLMs that are expensive, complex, and lack the capabilities of cloud-based models. 
          </p>
          <p className="text-center text-lg text-[var(--text-color)] leading-relaxed mt-4">
            By creating a federated data ecosystem for local AI, we aim to lower costs, expand accessibility, and bring the capabilities of cloud-based AI to a local system.
          </p>
        </div>
        
        {/* Features Grid with Animation */}
        <div className="space-y-12" id="features">
          {/* Decorative title for Features section */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-[var(--highlight-color)] inline-block border-b-2 border-[var(--highlight-color)]/30 pb-2">Key Features</h3>
          </div>
          
          {/* First Row of Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topRowFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className="transform transition-all duration-500 ease-in-out"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
          
          {/* Second Row of Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bottomRowFeatures.map((feature, index) => (
              <div 
                key={feature.id} 
                className="transform transition-all duration-500 ease-in-out"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <FeatureCard 
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Final CTA Banner */}
        <div className="mt-24 text-center">
          <div className="bg-[var(--highlight-color)] rounded-xl py-10 px-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Experience the Power of Local AI</h3>
            <p className="text-[var(--secondary-bg)]/90 mb-8 max-w-2xl mx-auto">
              Join us in building a future where powerful AI is available to everyone, without compromising on privacy or performance.
            </p>
            <button onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')}  className="px-8 py-3 bg-[var(--button-hover)] text-[var(--highlight-color)] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Download Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .transform {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default About;