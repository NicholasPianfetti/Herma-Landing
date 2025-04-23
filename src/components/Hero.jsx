// // Hero.jsx
// import React, {useEffect, useRef, useState} from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Hero.css';
// import appPreviewImage from './app-preview.png';
// import docUploadImage from './doc-upload.png';
// import creativeContentImage from './creative-content.png';
// import complexProblemImage from './complex-problem.png';
// import handleDownload from './handleDownload'; // Import the download handler

// const Hero = () => {
//   const [requirementsOpen, setRequirementsOpen] = useState(false);
//   const [tipsOpen, setTipsOpen] = useState(false);

//   const scrollGallery = (direction) => {
//     const track = document.getElementById('gallery-track');
//     if (!track) return;

//     const slideWidth = track.querySelector('.gallery-slide').offsetWidth;
//     const currentPosition = Math.round(track.scrollLeft / slideWidth);
//     const totalSlides = track.querySelectorAll('.gallery-slide').length;

//     let newPosition = currentPosition + direction;

//     if (newPosition < 0) newPosition = totalSlides - 1;
//     if (newPosition >= totalSlides) newPosition = 0;

//     track.scrollTo({
//       left: newPosition * slideWidth,
//       behavior: 'smooth'
//     });

//     updateDotIndicators(newPosition);
//   }

//   const scrollToSlide = (slideIndex) => {
//     const track = document.getElementById('gallery-track');
//     if (!track) return;
    
//     const slideWidth = track.querySelector('.gallery-slide').offsetWidth;
    
//     track.scrollTo({
//       left: slideIndex * slideWidth,
//       behavior: 'smooth'
//     });
    
//     updateDotIndicators(slideIndex);
//   };
  
//   const updateDotIndicators = (activeIndex) => {
//     const dots = document.querySelectorAll('.gallery-dots .dot');
//     dots.forEach((dot, index) => {
//       if (index === activeIndex) {
//         dot.classList.add('active');
//       } else {
//         dot.classList.remove('active');
//       }
//     });
//   };
  
//   // Listen for scroll events to update the dots
//   useEffect(() => {
//     const track = document.getElementById('gallery-track');
//     if (!track) return;
    
//     const handleScroll = () => {
//       const slideWidth = track.querySelector('.gallery-slide').offsetWidth;
//       const currentPosition = Math.round(track.scrollLeft / slideWidth);
//       updateDotIndicators(currentPosition);
//     };
    
//     track.addEventListener('scroll', handleScroll);
    
//     return () => {
//       track.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   // Track window width for responsive behavior
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
//   // Update window width when resized
//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const toggleRequirements = () => {
//     setRequirementsOpen(!requirementsOpen);
//     // Close tips when requirements is opened, but only on mobile
//     // if (!requirementsOpen && tipsOpen && windowWidth <= 768) {
//     //   setTipsOpen(false);
//     // }
//   };
  
//   const toggleTips = () => {
//     setTipsOpen(!tipsOpen);
//     // Close requirements when tips is opened, but only on mobile
//     // if (!tipsOpen && requirementsOpen && windowWidth <= 768) {
//     //   setRequirementsOpen(false);
//     // }
//   };

//   const navigate = useNavigate();
    
//   // Function to handle navigation and scroll to top
//   const handleNavigation = (path, e) => {
//     e.preventDefault();
    
//     // Navigate to the page
//     navigate(path);
    
//     // Scroll to top
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth'
//     });
//   };

//   return (
//     <section className="hero">
//       <div className="container hero-content">
//         <h1>Privacy is Power</h1>
//         <p>
//           A local alternative to cloud-based AI
//         </p>

//         <div className="cta-container" id="download">
//           <div className="cta-button-container">
//             { <button onClick={() => handleDownload('windows')} className="cta-button windows-button">
//               <span className="button-icon">⊞ </span>
//               Download for Windows
//             </button> }
//             <button onClick={() => handleDownload('mac')} className="cta-button mac-button">
//               <span className="button-icon">⌘ </span>
//               Download for Mac
//             </button>
//           </div>
//           <div className="download-terms">
//             By downloading, you agree to our&nbsp;
//             <a 
//             href="/privacy-policy" 
//             className="license-link" 
//             onClick={(e) => handleNavigation('/privacy-policy', e)}
//             >
//             License 
//             </a>
//             &nbsp;and&nbsp;
//             <a 
//             href="/terms-of-service" 
//             className="license-link" 
//             onClick={(e) => handleNavigation('/terms-of-service', e)}
//             >
//             Terms of Service
//             </a>.
//           </div>
//           <p className="platform-note">
//             Available for MacOS • Runs entirely locally • Completely Private
//           </p>
//         </div>
        
//         <div className="dropdown-container">
//           <div className={`system-requirements-container ${requirementsOpen ? 'requirements-open' : ''}`}>
//             <h3 className="requirements-title" onClick={toggleRequirements}>
//               System Requirements <span className="requirements-hint">{requirementsOpen ? '▲' : '▼'}</span>
//             </h3>
//             <div className="requirements-content">
//               <div className="requirements-grid">
//                 <div className="requirement-item">
//                   <h4>Processor</h4>
//                   <p>Modern CPU (Intel i5/AMD Ryzen 5 or higher)</p>
//                 </div>
//                 <div className="requirement-item">
//                   <h4>Memory</h4>
//                   <p>16GB RAM minimum, 32GB recommended for complex tasks</p>
//                 </div>
//                 <div className="requirement-item">
//                   <h4>Graphics</h4>
//                   <p>GPU with CUDA support recommended for best performance</p>
//                 </div>
//                 <div className="requirement-item">
//                   <h4>Storage</h4>
//                   <p>20GB available disk space for model and dependencies</p>
//                 </div>
//               </div>
//               <div className="requirements-note">
//                 Herma uses Llama 3.2:1B technology to deliver AI capabilities directly on your device without sending your data to the cloud.
//               </div>
//             </div>
//           </div>

//           <div className={`tips-container ${tipsOpen ? 'tips-open' : ''}`}>
//             <h3 className="tips-title" onClick={toggleTips}>
//               Tips for Herma <span className="tips-hint">{tipsOpen ? '▲' : '▼'}</span>
//             </h3>
//             <div className="tips-content">
//               <div className="tips-grid">
//                 <div className="tip-item">
//                   <h4>Be Specific</h4>
//                   <p>Clearly state your problem and provide necessary context for better responses.</p>
//                 </div>
//                 <div className="tip-item">
//                   <h4>Break Down Complex Tasks</h4>
//                   <p>Split complex requests into smaller, more manageable steps for better results.</p>
//                 </div>
//                 <div className="tip-item">
//                   <h4>Iterative Refinement</h4>
//                   <p>Follow up with clarifications to refine responses toward your needs.</p>
//                 </div>
//                 <div className="tip-item">
//                   <h4>Memory Overflow</h4>
//                   <p>Longer chats may decrease response accuracy.</p>
//                 </div>
//               </div>
//               <div className="tips-note">
//                 Herma's capabilities shine when your prompts are clear, specific, and provide the right context for your question.
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="app-preview-container">
//           <div className="app-gallery-wrapper">
//             <div className="gallery-controls">
//               <button className="gallery-arrow gallery-prev" onClick={() => scrollGallery(-1)}>❮</button>
//               <button className="gallery-arrow gallery-next" onClick={() => scrollGallery(1)}>❯</button>
//             </div>
            
//             <div className="gallery-track" id="gallery-track">
//             <div className="gallery-slide">
//                 <img 
//                   src={appPreviewImage} 
//                   alt="Herma App Preview - Private AI" 
//                   className="app-preview"
//                 />
//                 <div className="slide-caption">
//                   <h3>Private AI</h3>
//                   <p>All data stays on your device</p>
//                 </div>
//               </div>

//               <div className="gallery-slide">
//                 <img 
//                   src={docUploadImage} 
//                   alt="Herma App Preview - Document Analysis" 
//                   className="app-preview"
//                 />
//                 <div className="slide-caption">
//                   <h3>Analyze Documents</h3>
//                   <p>Power Herma with your personal documents</p>
//                 </div>
//               </div>
              
//               <div className="gallery-slide">
//                 <img 
//                   src={creativeContentImage} 
//                   alt="Herma App Preview - Content Generation" 
//                   className="app-preview"
//                 />
//                 <div className="slide-caption">
//                   <h3>Generate Creative Content</h3>
//                   <p>Create drafts, outlines, and fresh ideas</p>
//                 </div>
//               </div>
              
//               <div className="gallery-slide">
//                 <img 
//                   src={complexProblemImage} 
//                   alt="Herma App Preview - Problem Solving" 
//                   className="app-preview"
//                 />
//                 <div className="slide-caption">
//                   <h3>Solve Complex Problems</h3>
//                   <p>Get step-by-step guidance for any challenge</p>
//                 </div>
//               </div>
//             </div>

//             <div className="gallery-dots">
//               <span className="dot active" onClick={() => scrollToSlide(0)}></span>
//               <span className="dot" onClick={() => scrollToSlide(1)}></span>
//               <span className="dot" onClick={() => scrollToSlide(2)}></span>
//               <span className="dot" onClick={() => scrollToSlide(3)}></span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appPreviewImage from './app-preview.png';
import docUploadImage from './doc-upload.png';
import creativeContentImage from './creative-content.png';
import complexProblemImage from './complex-problem.png';
import handleDownload from './handleDownload'; // Import the updated download handler

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [osType, setOsType] = useState('unknown');
  const carouselRef = useRef(null);
  
  // Detect OS on component mount
  useEffect(() => {
    const detectOS = () => {
      const userAgent = window.navigator.userAgent;
      const platform = window.navigator.platform;
      
      // Check for macOS
      if (platform.indexOf('Mac') !== -1 || 
          userAgent.indexOf('Macintosh') !== -1 || 
          userAgent.indexOf('MacIntel') !== -1) {
        return 'mac';
      }
      
      // Check for Windows
      if (platform.indexOf('Win') !== -1 || 
          userAgent.indexOf('Windows') !== -1) {
        return 'windows';
      }
      
      // Check for Linux
      if (platform.indexOf('Linux') !== -1 || 
          userAgent.indexOf('Linux') !== -1) {
        return 'linux';
      }
      
      // If OS cannot be determined
      return 'unknown';
    };
    
    setOsType(detectOS());
  }, []);
  
  // Get the appropriate download button text based on detected OS
  const getDownloadButtonText = () => {
    switch(osType) {
      case 'windows':
        return (
          <>
            <span className="mr-2 font-normal text-[1.1em]">⊞ </span>
            Download for Windows
          </>
        );
      case 'mac':
        return (
          <>
            <span className="mr-2 font-normal text-[1.1em]">⌘ </span>
            Download for Mac
          </>
        );
      case 'linux':
        return (
          <>
            <span className="mr-2 font-normal text-[1.1em]">🐧 </span>
            Download for Linux
          </>
        );
      default:
        return (
          <>
            <span className="mr-2 font-normal text-[1.1em]">↓ </span>
            Download Herma
          </>
        );
    }
  };
  
  // Gallery data
  const gallerySlides = [
    {
      image: appPreviewImage,
      alt: "Herma App Preview - Private AI",
      title: "Private AI",
      description: "All data stays on your device"
    },
    {
      image: docUploadImage,
      alt: "Herma App Preview - Document Analysis",
      title: "Analyze Documents",
      description: "Power Herma with your personal documents"
    },
    {
      image: creativeContentImage,
      alt: "Herma App Preview - Content Generation",
      title: "Generate Creative Content",
      description: "Create drafts, outlines, and fresh ideas"
    },
    {
      image: complexProblemImage,
      alt: "Herma App Preview - Problem Solving",
      title: "Solve Complex Problems",
      description: "Get step-by-step guidance for any challenge"
    }
  ];

  // Function to enlarge image
  const handleImageClick = (slide) => {
    setEnlargedImage(slide);
  };

  // Function to close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  const toggleRequirements = () => {
    setRequirementsOpen(!requirementsOpen);
  };
  
  const toggleTips = () => {
    setTipsOpen(!tipsOpen);
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
    <section className="mt-20 py-[var(--margin-xl)] text-center bg-[var(--primary-bg)] relative overflow-hidden shadow-[0_10px_10px_rgba(45,61,120,0.25)] md:mt-16 md:py-[var(--margin-l)]">
      <div className="container max-w-[800px] mx-auto relative z-[1] px-4">
        <h1 className="text-[var(--h1-size)] mb-[var(--margin-m)] text-[var(--highlight-color)] animate-[fadeInDown_0.6s_ease-out] md:mb-[var(--margin-s)] md:text-[calc(var(--h1-size)*0.9)] sm:text-[calc(var(--h1-size)*0.8)]">
          Privacy is Power
        </h1>
        <p className="text-[var(--h4-size)] mb-[var(--margin-l)] text-[var(--highlight-color)] opacity-90 animate-[fadeInUp_0.6s_ease-out_0.2s_both] md:text-[calc(var(--h4-size)*0.8)] md:mb-[var(--margin-s)] sm:text-[calc(var(--h4-size)*0.7)]">
          A local alternative to cloud-based AI
        </p>

        <div className="my-[var(--margin-xl)] animate-[fadeInUp_0.6s_ease-out_0.4s_both] md:my-[var(--margin-l)]" id="download">
          <div className="flex justify-center mb-4">
            <button 
              onClick={handleDownload('windows')} 
              className="inline-flex items-center justify-center min-w-[250px] bg-[var(--highlight-color)] text-white text-[calc(var(--h4-size)*0.8)] font-bold py-[var(--margin-m)] px-[var(--margin-xl)] rounded-[var(--radius-lg)] no-underline transition-all duration-300 shadow-[var(--shadow-lg)] border-none cursor-pointer hover:translate-y-[-3px] hover:scale-105 hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:scale-[0.98] md:w-full md:max-w-[280px] md:py-[var(--margin-s)] md:px-[var(--margin-l)] md:text-[calc(var(--h4-size)*0.7)] sm:py-[var(--margin-s)] sm:px-[var(--margin-m)]"
            >
              {getDownloadButtonText()}
            </button>
          </div>
          <div className="text-[14px] italic opacity-70">
            By downloading, you agree to our&nbsp;
            <a 
              href="/privacy-policy" 
              className="text-purple no-underline" 
              onClick={(e) => handleNavigation('/privacy-policy', e)}
            >
              License 
            </a>
            &nbsp;and&nbsp;
            <a 
              href="/terms-of-service" 
              className="text-purple no-underline" 
              onClick={(e) => handleNavigation('/terms-of-service', e)}
            >
              Terms of Service
            </a>.
          </div>
          <p className="mt-[var(--margin-s)] text-[0.8rem] italic opacity-70">
            {osType === 'mac' ? 'Available for macOS' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • Runs entirely locally • Completely Private
          </p>
        </div>
        
        <div className="flex flex-row justify-center items-start gap-[var(--margin-m)] mt-[var(--margin-s)] w-full md:flex-col md:gap-[var(--margin-s)]">
          <div className={`mt-[var(--margin-l)] text-center relative w-full md:mt-[var(--margin-s)]`}>
            <h3 
              className={`text-[var(--h4-size)] text-[var(--highlight-color)] inline-block py-[var(--margin-s)] px-[var(--margin-m)] rounded-[var(--radius-md)] cursor-pointer transition-all duration-300 mb-0 relative z-[2] hover:bg-black/5 md:w-full md:py-[var(--margin-s)] md:text-[calc(var(--h4-size)*0.9)] sm:text-[calc(var(--h4-size)*0.8)]`} 
              onClick={toggleRequirements}
            >
              System Requirements <span className="ml-[5px] text-[0.7rem] transition-transform duration-300">{requirementsOpen ? '▲' : '▼'}</span>
            </h3>
            <div 
              className={`overflow-hidden transition-all duration-500 opacity-0 -translate-y-[10px] mt-0 px-[var(--margin-m)] bg-black/[0.03] rounded-[var(--radius-lg)] text-left ${
                requirementsOpen ? 'max-h-[800px] opacity-100 translate-y-0 mt-[var(--margin-s)] p-[var(--margin-m)] sm:p-[var(--margin-s)]' : 'max-h-0 p-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-[var(--margin-m)] md:grid-cols-1 md:gap-[var(--margin-s)]">
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Processor</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">Modern CPU (Intel i5/AMD Ryzen 5 or higher)</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Memory</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">16GB RAM minimum, 32GB recommended for complex tasks</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Graphics</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">GPU with CUDA support recommended for best performance</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Storage</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">20GB available disk space for model and dependencies</p>
                </div>
              </div>
              <div className="text-[0.85rem] text-center mt-[var(--margin-m)] opacity-80 italic md:text-[0.8rem] md:mt-[var(--margin-s)] md:px-[var(--margin-s)]">
                Herma uses Llama 3.2:1B technology to deliver AI capabilities directly on your device without sending your data to the cloud.
              </div>
            </div>
          </div>

          <div className={`mt-[var(--margin-l)] text-center relative w-full md:mt-[var(--margin-s)]`}>
            <h3 
              className={`text-[var(--h4-size)] text-[var(--highlight-color)] inline-block py-[var(--margin-s)] px-[var(--margin-m)] rounded-[var(--radius-md)] cursor-pointer transition-all duration-300 mb-0 relative z-[2] hover:bg-black/5 md:w-full md:py-[var(--margin-s)] md:text-[calc(var(--h4-size)*0.9)] sm:text-[calc(var(--h4-size)*0.8)]`} 
              onClick={toggleTips}
            >
              Tips for Herma <span className="ml-[5px] text-[0.7rem] transition-transform duration-300">{tipsOpen ? '▲' : '▼'}</span>
            </h3>
            <div 
              className={`overflow-hidden transition-all duration-500 opacity-0 -translate-y-[10px] mt-0 px-[var(--margin-m)] bg-black/[0.03] rounded-[var(--radius-lg)] text-left ${
                tipsOpen ? 'max-h-[800px] opacity-100 translate-y-0 mt-[var(--margin-s)] p-[var(--margin-m)] sm:p-[var(--margin-s)]' : 'max-h-0 p-0'
              }`}
            >
              <div className="grid grid-cols-2 gap-[var(--margin-m)] md:grid-cols-1 md:gap-[var(--margin-s)]">
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Be Specific</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">Clearly state your problem and provide necessary context for better responses.</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Break Down Complex Tasks</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">Split complex requests into smaller, more manageable steps for better results.</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Iterative Refinement</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">Follow up with clarifications to refine responses toward your needs.</p>
                </div>
                <div className="p-[var(--margin-s)] bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                  <h4 className="text-[calc(var(--h4-size)*0.65)] mb-2 text-[var(--highlight-color)]">Memory Overflow</h4>
                  <p className="text-[0.75rem] m-0 leading-[1.4]">Longer chats may decrease response accuracy.</p>
                </div>
              </div>
              <div className="text-[0.85rem] text-center mt-[var(--margin-m)] opacity-80 italic md:text-[0.8rem] md:mt-[var(--margin-s)] md:px-[var(--margin-s)]">
                Herma's capabilities shine when your prompts are clear, specific, and provide the right context for your question.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gallery Section with Distinct Background */}
      <div className="w-full mt-16 py-12 px-4 bg-[#f5f7fa] border-t-2 border-b-2 border-[var(--highlight-color)]/20">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-[var(--h3-size)] mb-8 text-[var(--highlight-color)]">Explore Herma</h2>
          {/* Simple Scrollable Gallery */}
          <div className="overflow-x-auto overflow-y-hidden pb-6 hide-scrollbar">
            <div className="flex gap-6 min-w-max" ref={carouselRef}>
              {gallerySlides.map((slide, index) => (
                <div
                  key={index}
                  className="w-[480px] bg-white rounded-xl shadow-lg cursor-pointer transition-transform duration-300 overflow-hidden hover:shadow-xl hover:scale-[1.02]"
                  onClick={() => handleImageClick(slide)}
                >
                  <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
                    <img 
                      src={slide.image} 
                      alt={slide.alt} 
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="text-lg font-bold text-[var(--highlight-color)] mb-1">{slide.title}</h3>
                    <p className="text-sm text-gray-700">{slide.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enlarged Image Modal - Image Only */}
      {enlargedImage && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeEnlargedImage}
        >
          <div 
            className="relative max-w-[95%] max-h-[95%] overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the content
          >
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 text-xl hover:bg-black/80"
              onClick={closeEnlargedImage}
            >
              ✕
            </button>
            <img 
              src={enlargedImage.image} 
              alt={enlargedImage.alt} 
              className="w-full h-auto max-h-[95vh] object-contain"
            />
          </div>
        </div>
      )}
      
      {/* Add the CSS animations and hide scrollbar styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Hero;