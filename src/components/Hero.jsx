// Hero.jsx
import React, {useRef} from 'react';
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
          <h1>The Future is Private</h1>
        <p>
          Herma is your new private AI assistant to analyze your documents, answer questions, and solve your problems. All without leaving your device. 
        </p>

        <div className="cta-container" id="download">
          <div className="cta-button-container">
              <button onClick={handleDownload} className="cta-button">
                Download Herma for Windows!
              </button>
              <button onClick={handleDownload} className="cta-button">
                Download Herma for Mac!
              </button>
          </div>
          <p className="platform-note">
            Available for Windows and macOS
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