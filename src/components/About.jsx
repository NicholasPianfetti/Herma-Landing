// About.jsx
import React from 'react';
import './About.css';
import FeatureCard from './FeatureCard';

const About = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="60" height="60">
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
        </svg>
      ),
      title: "Clear Analysis",
      description: "Retrieval augmented generated context from documents, chat history, and more allows Herma to provide accurate and efficient responses."
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
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
        </svg>
      ),
      title: "Private & Secure",
      description: "Your conversations and documents stay on your device. No information leaves your control. Your privacy is our priority."
    }
  ];

  return (
    <section className="about" id="about">
      <div className="container">
        <h2>About HΞRMΛ</h2>
        <p className="about-description">
          Herma is an intelligent assistant that helps you find answers, analyze documents, and get things done privately. 
          Currently, you have two choices when using private data with LLMs: 
          either expose private information to the cloud or use custom locally run LLMs that are expensive, complex, and lack the capabilities of cloud-based models. 
          By creating a federated data ecosystem for local AI, we aim to lower costs, expand accessibility, and bring the capabilities of cloud-based AI to a local system.
        </p>
        
        <div className="features" id="features">
          {features.map(feature => (
            <FeatureCard 
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;