// Hero.jsx
import React, {useEffect, useRef, useState} from 'react';
import './Hero.css';
import appPreviewImage from './app-preview.png';
import docUploadImage from './doc-upload.png';
import creativeContentImage from './creative-content.png';
import complexProblemImage from './complex-problem.png';

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);

  const toggleRequirements = () => {
    setRequirementsOpen(!requirementsOpen);
  };

  const scrollGallery = (direction) => {
    const track = document.getElementById('gallery-track');
    if (!track) return;

    const slideWidth = track.querySelector('.gallery-slide').offsetWidth;

    const currentPosition = Math.round(track.scrollLeft / slideWidth);
    const totalSlides = track.querySelectorAll('.gallery-slide').length;

    let newPosition = currentPosition + direction;

    if (newPosition < 0) newPosition = totalSlides - 1;
    if (newPosition >= totalSlides) newPosition = 0;

    track.scrollTo({
      left: newPosition * slideWidth,
      behavior: 'smooth'
    });

    updateDotIndicators(newPosition);
  }

  const scrollToSlide = (slideIndex) => {
    const track = document.getElementById('gallery-track');
    if (!track) return;
    
    const slideWidth = track.querySelector('.gallery-slide').offsetWidth;
    
    track.scrollTo({
      left: slideIndex * slideWidth,
      behavior: 'smooth'
    });
    
    updateDotIndicators(slideIndex);
  };
  
  const updateDotIndicators = (activeIndex) => {
    const dots = document.querySelectorAll('.gallery-dots .dot');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };
  
  // Listen for scroll events to update the dots
  useEffect(() => {
    const track = document.getElementById('gallery-track');
    if (!track) return;
    
    const handleScroll = () => {
      const slideWidth = track.querySelector('.gallery-slide').offsetWidth;
      const currentPosition = Math.round(track.scrollLeft / slideWidth);
      updateDotIndicators(currentPosition);
    };
    
    track.addEventListener('scroll', handleScroll);
    
    return () => {
      track.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleDownload = (platform) => {
    // In a real implementation, this would trigger the download
    // based on platform detection or offer platform options
    const platformName = platform === 'windows' ? 'Windows' : 'Mac';
    alert(`Starting download for ${platformName}...`);

    // Example of what the real implementation might look like:
    // const downloadUrls = {
    //   windows: 'https://download.herma.ai/latest/windows',
    //   mac: 'https://download.herma.ai/latest/mac'
    // };
    // window.location.href = downloadUrls[platform];
  };

  return (
    <section className="hero">
      <div className="container hero-content">
          <h1>The Future is Local</h1>
        <p>
          Herma is your personal private AI assistant. Herma can analyze your documents, answer your questions, and solve your problems. All without leaving your device. 
        </p>

        <div className="cta-container" id="download">
          <div className="cta-button-container">
            <button onClick={() => handleDownload('windows')} className="cta-button windows-button">
              <span className="button-icon">⊞ </span>
              Download for Windows
            </button>
            <button onClick={() => handleDownload('mac')} className="cta-button mac-button">
              <span className="button-icon">⌘ </span>
              Download for Mac
            </button>
          </div>
          <p className="platform-note">
            Available for Windows and macOS • Runs entirely locally • Completely Private
          </p>
        </div>
        
        <div className={`system-requirements-container ${requirementsOpen ? 'requirements-open' : ''}`}>
            <h3 className="requirements-title" onClick={toggleRequirements}>
              System Suggestions <span className="requirements-hint">{requirementsOpen ? '▲' : '▼'}</span>
            </h3>
            <div className="requirements-content">
              <div className="requirements-grid">
                <div className="requirement-item">
                  <h4>Processor</h4>
                  <p>Modern CPU (Intel i5/AMD Ryzen 5 or higher)</p>
                </div>
                <div className="requirement-item">
                  <h4>Memory</h4>
                  <p>16GB RAM minimum, 32GB recommended for complex tasks</p>
                </div>
                <div className="requirement-item">
                  <h4>Graphics</h4>
                  <p>GPU with CUDA support recommended for best performance</p>
                </div>
                <div className="requirement-item">
                  <h4>Storage</h4>
                  <p>20GB available disk space for model and dependencies</p>
                </div>
              </div>
              <div className="requirements-note">
                Herma uses Llama 3.2:1B technology to deliver AI capabilities directly on your device without sending your data to the cloud.
              </div>
            </div>
        </div>

        <div className="app-preview-container">
          <div className="app-gallery-wrapper">
            <div className="gallery-controls">
              <button className="gallery-arrow gallery-prev" onClick={() => scrollGallery(-1)}>❮</button>
              <button className="gallery-arrow gallery-next" onClick={() => scrollGallery(1)}>❯</button>
            </div>
            
            <div className="gallery-track" id="gallery-track">
            <div className="gallery-slide">
                <img 
                  src={appPreviewImage} 
                  alt="Herma App Preview - Private AI" 
                  className="app-preview"
                />
                <div className="slide-caption">
                  <h3>Private AI</h3>
                  <p>All data stays on your device</p>
                </div>
              </div>

              <div className="gallery-slide">
                <img 
                  src={docUploadImage} 
                  alt="Herma App Preview - Document Analysis" 
                  className="app-preview"
                />
                <div className="slide-caption">
                  <h3>Analyze Documents</h3>
                  <p>Power Herma with your personal documents</p>
                </div>
              </div>
              
              <div className="gallery-slide">
                <img 
                  src={creativeContentImage} 
                  alt="Herma App Preview - Content Generation" 
                  className="app-preview"
                />
                <div className="slide-caption">
                  <h3>Generate Creative Content</h3>
                  <p>Create drafts, outlines, and fresh ideas</p>
                </div>
              </div>
              
              <div className="gallery-slide">
                <img 
                  src={complexProblemImage} 
                  alt="Herma App Preview - Problem Solving" 
                  className="app-preview"
                />
                <div className="slide-caption">
                  <h3>Solve Complex Problems</h3>
                  <p>Get step-by-step guidance for any challenge</p>
                </div>
              </div>
            </div>

            <div className="gallery-dots">
              <span className="dot active" onClick={() => scrollToSlide(0)}></span>
              <span className="dot" onClick={() => scrollToSlide(1)}></span>
              <span className="dot" onClick={() => scrollToSlide(2)}></span>
              <span className="dot" onClick={() => scrollToSlide(3)}></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;