// Hero.jsx
import React, {useEffect, useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Hero.css';
import appPreviewImage from './app-preview.png';
import docUploadImage from './doc-upload.png';
import creativeContentImage from './creative-content.png';
import complexProblemImage from './complex-problem.png';
import handleDownload from './handleDownload'; // Import the download handler

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);

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

  const toggleRequirements = () => {
    setRequirementsOpen(!requirementsOpen);
    
    // Update spacer height when requirements are toggled
    //updateSpacerHeight();
  };
  
  const toggleTips = () => {
    setTipsOpen(!tipsOpen);
    
    // Update spacer height when tips are toggled
    //updateSpacerHeight();
  };
  
  // Function to update the content spacer height
  const updateSpacerHeight = () => {
    const spacer = document.querySelector('.content-spacer');
    const requirementsContent = document.querySelector('.requirements-content');
    const tipsContent = document.querySelector('.tips-content');
    
    if (requirementsOpen || tipsOpen) {
      spacer.style.display = 'block';
      
      // Determine the tallest content element
      let height = 0;
      if (requirementsOpen) {
        height = Math.max(height, requirementsContent.scrollHeight + 40);
      }
      if (tipsOpen) {
        height = Math.max(height, tipsContent.scrollHeight + 40);
      }
      
      spacer.style.height = height + 'px';
    } else {
      spacer.style.display = 'none';
    }
  };

    const navigate = useNavigate();
    
    // Function to handle navigation and scroll to top
    const handleNavigation = (path, e) => {
      e.preventDefault();
      
      // Navigate to the page
      navigate(path);
      
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

  return (
    <section className="hero">
      <div className="container hero-content">
          <h1>Privacy is Power</h1>
        <p>
        A local alternative to cloud-based AI
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
          <div className="download-terms">
            By downloading, you agree to our&nbsp;
            <a 
            href="/privacy-policy" 
            className="license-link" 
            onClick={(e) => handleNavigation('/privacy-policy', e)}
            >
            License 
            </a>
            &nbsp;and&nbsp;
            <a 
            href="/terms-of-service" 
            className="license-link" 
            onClick={(e) => handleNavigation('/terms-of-service', e)}
            >
            Terms of Service
            </a>.
          </div>
          <p className="platform-note">
            Available for Windows and macOS • Runs entirely locally • Completely Private
          </p>
        </div>
        
        <div className="dropdown-container">
          <div className={`system-requirements-container ${requirementsOpen ? 'requirements-open' : ''}`}>
            <h3 className="requirements-title" onClick={toggleRequirements}>
              System Requirements <span className="requirements-hint">{requirementsOpen ? '▲' : '▼'}</span>
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

          <div className={`tips-container ${tipsOpen ? 'tips-open' : ''}`}>
            <h3 className="tips-title" onClick={toggleTips}>
              Tips for Herma <span className="tips-hint">{tipsOpen ? '▲' : '▼'}</span>
            </h3>
            <div className="tips-content">
              <div className="tips-grid">
                <div className="tip-item">
                  <h4>Be Specific</h4>
                  <p>Clearly state your problem and provide necessary context for better responses.</p>
                </div>
                <div className="tip-item">
                  <h4>Break Down Complex Tasks</h4>
                  <p>Split complex requests into smaller, more manageable steps for better results.</p>
                </div>
                <div className="tip-item">
                  <h4>Iterative Refinement</h4>
                  <p>Follow up with clarifications to refine responses toward your needs.</p>
                </div>
                <div className="tip-item">
                  <h4>Memory Overflow</h4>
                  <p>Longer chats may decrease response accuracy.</p>
                </div>
              </div>
              <div className="tips-note">
                Herma's capabilities shine when your prompts are clear, specific, and provide the right context for your question.
              </div>
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