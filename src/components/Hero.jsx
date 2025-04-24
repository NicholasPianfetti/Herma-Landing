import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appPreviewImage from './app-preview.png';
import docUploadImage from './doc-upload.png';
import creativeContentImage from './creative-content.png';
import complexProblemImage from './complex-problem.png';
import handleDownload from './handleDownload';

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [osType, setOsType] = useState('unknown');
  const [activeSlide, setActiveSlide] = useState(0);
  
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

  // Auto rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % gallerySlides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  // Handler for download button click
  const handleDownloadClick = (osType) => {
    return () => {
      handleDownload(osType);
    };
  };

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
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="w-full pt-24 pb-12 overflow-hidden relative">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-30" 
               style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')"}}></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Content Column */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-blue-900 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600">
                  Privacy is Power
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[var(--highlight-color)] mb-8 font-light">
                A local alternative to cloud-based AI
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <button 
                  onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')} 
                  className="px-6 py-3 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-medium rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
                >
                  {osType === 'mac' ? (
                    <><span className="mr-2 text-xl">⌘</span> Download for Mac</>
                  ) : osType === 'windows' ? (
                    <><span className="mr-2 text-xl">⊞</span> Download for Windows</>
                  ) : (
                    <><span className="mr-2 text-xl">↓</span> Download Herma</>
                  )}
                </button>
                
                <Link 
                  to="#tutorial" 
                  className="px-6 py-3 bg-transparent border border-blue-600 text-blue-600 font-medium rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('tutorial');
                  }}
                >
                  Learn More
                </Link>
              </div>

              <p className="text-sm text-blue-800/70 mb-2">
                By downloading, you agree to our <a href="/privacy-policy" onClick={(e) => handleNavigation('/privacy-policy', e)} className="underline hover:text-blue-800">License</a> and <a href="/terms-of-service" onClick={(e) => handleNavigation('/terms-of-service', e)} className="underline hover:text-blue-800">Terms of Service</a>.
              </p>
              
              <p className="text-sm text-blue-800/70">
                {osType === 'mac' ? 'Available for macOS' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • Runs entirely locally • Completely Private
              </p>
            </div>

            {/* Image Column with Carousel */}
            <div className="w-full lg:w-1/2 relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-[var(--highlight-color)] rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[var(--secondary-bg)] rounded-full opacity-40 animate-pulse" style={{animationDelay: "1s"}}></div>
              <div className="relative overflow-hidden rounded-xl shadow-2xl bg-white p-2">
                <div className="relative">
                  {gallerySlides.map((slide, index) => (
                    <div 
                      key={index} 
                      className={`transition-all duration-500 ease-in-out ${index === activeSlide ? "opacity-100" : "opacity-0 absolute top-0 left-0"}`}
                    >
                      <div className="relative pt-[56.25%]">
                        <img 
                          src={slide.image} 
                          alt={slide.alt} 
                          className="absolute top-0 left-0 w-full h-full object-cover rounded"
                          onClick={() => handleImageClick(slide)}
                        />
                      </div>
                      <div className="py-3 px-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b">
                        <h3 className="text-lg font-bold text-blue-900">{slide.title}</h3>
                        <p className="text-sm text-blue-700">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carousel Navigation */}
                <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2 p-2">
                  {gallerySlides.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        index === activeSlide 
                          ? "bg-blue-600 w-6" 
                          : "bg-blue-300 hover:bg-blue-400"
                      }`}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="py-16 bg-white" id="features">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Get started with Herma and experience private AI on your device
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* System Requirements Card */}
            <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${requirementsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-[var(--secondary-bg)] px-6 py-4 cursor-pointer flex justify-between items-center"
                onClick={toggleRequirements}
                style={{ borderRadius: requirementsOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
              >
                <h3 className="text-xl font-semibold text-white">System Requirements</h3>
                <span className="text-white text-sm bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                  {requirementsOpen ? "−" : "+"}
                </span>
              </div>
              
              <div className={`transition-all duration-300 ${requirementsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Processor</h4>
                      <p className="text-sm text-blue-700">Modern CPU (Intel i5/AMD Ryzen 5 or higher)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Memory</h4>
                      <p className="text-sm text-blue-700">16GB RAM minimum, 32GB recommended for complex tasks</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Graphics</h4>
                      <p className="text-sm text-blue-700">GPU with CUDA support recommended for best performance</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Storage</h4>
                      <p className="text-sm text-blue-700">20GB available disk space for model and dependencies</p>
                    </div>
                  </div>
                  <div className="text-sm text-center text-blue-600 italic">
                    Herma uses Llama 3.2:1B technology to deliver AI capabilities directly on your device without sending your data to the cloud.
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${tipsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-[var(--secondary-bg)] px-6 py-4 cursor-pointer flex justify-between items-center"
                onClick={toggleTips}
                style={{ borderRadius: tipsOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
              >
                <h3 className="text-xl font-semibold text-white">Tips for Herma</h3>
                <span className="text-white text-sm bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                  {tipsOpen ? "−" : "+"}
                </span>
              </div>
              
              <div className={`transition-all duration-300 ${tipsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Be Specific</h4>
                      <p className="text-sm text-indigo-700">Clearly state your problem and provide necessary context for better responses.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Break Down Complex Tasks</h4>
                      <p className="text-sm text-indigo-700">Split complex requests into smaller, more manageable steps for better results.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Iterative Refinement</h4>
                      <p className="text-sm text-indigo-700">Follow up with clarifications to refine responses toward your needs.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Memory Overflow</h4>
                      <p className="text-sm text-indigo-700">Longer chats may decrease response accuracy.</p>
                    </div>
                  </div>
                  <div className="text-sm text-center text-indigo-600 italic">
                    Herma's capabilities shine when your prompts are clear, specific, and provide the right context for your question.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Ready to experience AI with privacy?</h3>
              <button 
                onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')} 
                className="px-8 py-4 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-medium rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Download Herma Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={closeEnlargedImage}
        >
          <div 
            className="relative max-w-4xl w-full rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 hover:bg-black/80 transition-colors"
              onClick={closeEnlargedImage}
            >
              ✕
            </button>
            <img 
              src={enlargedImage.image} 
              alt={enlargedImage.alt} 
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <h3 className="text-xl font-bold">{enlargedImage.title}</h3>
              <p>{enlargedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;