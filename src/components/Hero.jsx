// Hero.jsx
import React from 'react';
import './Hero.css';

const Hero = () => {
  const handleDownload = () => {
    // In a real implementation, this would trigger the download
    // based on platform detection or offer platform options
    alert('Download functionality would be implemented here!');
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <h1>Your Smart Assistant for Everything</h1>
        <p>
          Herma helps you get answers to all your questions, analyze documents, 
          and more — all in a beautiful, intuitive interface.
        </p>
        
        <div className="cta-container" id="download">
          <button onClick={handleDownload} className="cta-button">
            Download Herma
          </button>
          <p className="platform-note">
            Available for Windows, macOS, and Linux
          </p>
        </div>
        
        <div className="app-preview-container">
          <img 
            src="/app-preview.png" 
            alt="Herma App Preview" 
            className="app-preview"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/800x500?text=Herma+App+Preview";
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;