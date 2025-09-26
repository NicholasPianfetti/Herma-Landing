import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import appPreviewImage from './app-preview.png';
import docUploadImage from './doc-upload.png';
import creativeContentImage from './creative-content.png';
import complexProblemImage from './complex-problem.png';
import handleDownload from './handleDownload';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from '../services/stripeService';
import { loadStripe } from '@stripe/stripe-js';
import StarBorder from './StarBorder';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [osType, setOsType] = useState('unknown');
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Scroll animation hooks
  const titleAnimation = useScrollAnimation();
  const subtitleAnimation = useScrollAnimation();
  const buttonAnimation = useScrollAnimation();
  const demoAnimation = useScrollAnimation();

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

  const handleUpgradeClick = async () => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { session, error: sessionError } = await createCheckoutSession(user);

      if (sessionError) {
        throw new Error(sessionError);
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-28 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[var(--highlight-color)] opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-30 pointer-events-none"
               style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')"}}></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Main Text Section */}
            <div className="w-full max-w-4xl mb-4">
              <h1
                ref={titleAnimation.ref}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 leading-tight ${titleAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              >
                AI That Protects Your Data
              </h1>

              <p
                ref={subtitleAnimation.ref}
                className={`text-xl md:text-2xl text-blue-800 mb-8 font-light max-w-3xl mx-auto ${subtitleAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: subtitleAnimation.isVisible ? '0.2s' : '0s' }}
              >
                {/* Unify cloud and local models with complete data security */}
                Leverage the power of cloud AI with the security of local models
              </p>

              {/* <p className="text-lg text-blue-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Herma is a data governor that extracts sensitive information locally before sending sanitized prompts to powerful cloud models, then restores your data on return. Get the computational power of cloud AI with the security of local processing.
              </p> */}

              <div
                ref={buttonAnimation.ref}
                className={`flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 ${buttonAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ animationDelay: buttonAnimation.isVisible ? '0.4s' : '0s' }}
              >
                <button
                  onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')}
                  className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--highlight-color)]/30 focus:ring-offset-2 w-full sm:w-auto sm:min-w-[200px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {osType === 'mac' ? (
                      <>
                        <span className="text-lg">⌘</span>
                        <span>Download for Free</span>
                      </>
                    ) : osType === 'windows' ? (
                      <>
                        <span className="text-lg">⊞</span>
                        <span>Download for Free</span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">↓</span>
                        <span>Download Herma</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Agreeing to privacy policy and terms of service*/}
              {/* <p className="text-[0.75rem] text-blue-800/70">
                By downloading, you agree to our <a href="/privacy-policy" onClick={(e) => handleNavigation('/privacy-policy', e)} className="underline hover:text-blue-800">License</a> and <a href="/terms-of-service" onClick={(e) => handleNavigation('/terms-of-service', e)} className="underline hover:text-blue-800">Terms of Service</a>.
              </p> */}
            </div>

            {/* Demo Section */}
            <div
              ref={demoAnimation.ref}
              className={`w-full max-w-4xl relative ${demoAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: demoAnimation.isVisible ? '0.6s' : '0s' }}
            >
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[var(--highlight-color)] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                  {/* App Preview Frame */}
                  <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 rounded-t-2xl flex items-center px-4 z-20">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-b-xl pt-7 overflow-hidden">
                      {/* Fixed image container with original aspect ratio */}
                      <div className="relative" style={{ paddingBottom: "56.25%" }}>
                        {gallerySlides.map((slide, index) => (
                          <div 
                            key={index} 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: index === activeSlide ? 1 : 0, zIndex: index === activeSlide ? 10 : 0, transition: 'opacity 500ms ease-in-out' }}
                          >
                            <img 
                              src={slide.image} 
                              alt={slide.alt} 
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => handleImageClick(slide)}
                            />
                          </div>
                        ))}
                      </div>
                      
                      {/* Info section with original styling */}
                      <div className="py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                        {gallerySlides.map((slide, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              position: index === activeSlide ? 'relative' : 'absolute', 
                              top: 0, 
                              left: 0, 
                              width: '100%', 
                              opacity: index === activeSlide ? 1 : 0, 
                              transition: 'opacity 500ms ease-in-out',
                              pointerEvents: index === activeSlide ? 'auto' : 'none'
                            }}
                          >
                            <h3 className="text-lg font-bold text-blue-900">{slide.title}</h3>
                            <p className="text-sm text-blue-700">{slide.description}</p>
                          </div>
                        ))}
                        
                        {/* Carousel Navigation - original position */}
                        <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2 p-2 z-20">
                          {gallerySlides.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2.5 h-2.5 rounded-full transition-all ${
                                index === activeSlide 
                                  ? "bg-[var(--highlight-color)] w-8" 
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
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-24 bg-white" id="features">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
          {/* <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Get started with Herma and experience private AI on your device
            </p>
          </div> */}

           {/* <div className="grid md:grid-cols-2 gap-8">  */}
            {/* System Requirements Card */}
             {/* <div className={`bg-white rounded-xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300 ${requirementsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 px-6 py-5 cursor-pointer flex justify-between items-center"
                onClick={toggleRequirements}
                style={{ borderRadius: requirementsOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
              >
                <h3 className="text-xl font-semibold text-white">System Suggestions</h3>
                <span className="text-white text-xl bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                  {requirementsOpen ? "−" : "+"}
                </span>
              </div> */}
              
              {/* <div className={`transition-all duration-300 ${requirementsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
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
            </div>  */}

            {/* Tips Card */}
             {/*<div className={`bg-white rounded-xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300 ${tipsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 px-6 py-5 cursor-pointer flex justify-between items-center"
                onClick={toggleTips}
                style={{ borderRadius: tipsOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
              >
                <h3 className="text-xl font-semibold text-white">Helpful Tips</h3>
                <span className="text-white text-xl bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                  {tipsOpen ? "−" : "+"}
                </span>
              </div>
              
              <div className={`transition-all duration-300 ${tipsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Be Specific</h4>
                      <p className="text-sm text-indigo-700">Clearly state your problem and provide extra context for better responses.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Break Down Tasks</h4>
                      <p className="text-sm text-indigo-700">Split complex requests into smaller, more manageable steps for better results.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Follow-up Questions</h4>
                      <p className="text-sm text-indigo-700">Follow up with clarifications to guide responses toward your needs.</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2">Short Memory</h4>
                      <p className="text-sm text-indigo-700">Longer chats may decrease response accuracy.</p>
                    </div>
                  </div>
                  <div className="text-sm text-center text-indigo-600 italic">
                    Herma shines when you are clear, specific, and provide the right context for your question.
                  </div>
                </div>
              </div>
            </div>*/}
          {/* </div>  */}

          {/* Key Benefits Section */}
          {/* <div className="mt-0">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Key Benefits</h2>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                Why choose Herma for your AI needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--highlight-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Local Filter</h3>
                <p className="text-blue-700">Your private data gets redacted so only you see it not big cloud companies.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--highlight-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Fast Response</h3>
                <p className="text-blue-700">Get instant results with no internet latency. Local processing means quicker AI interactions.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--highlight-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Always Available</h3>
                <p className="text-blue-700">Works offline, access powerful AI capabilities anytime, anywhere.</p>
              </div>
            </div>
          </div> */}

          {/* CTA Section */}
          {/* <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold text-blue-900 mb-6">Ready to unlock AI?</h3>
              <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
                Download Herma today and take control of your AI experience
              </p>
              <button 
                onClick={handleDownloadClick(osType === 'mac' ? 'mac' : 'windows')} 
                className="px-10 py-5 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white text-xl font-medium rounded-lg shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Download Herma Today
              </button>
              <p className="mt-4 text-sm text-blue-600">
                {osType === 'mac' ? 'Available for Mac' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • No Payment Required
              </p>
            </div>
          </div> */}
        {/* </div>
      </section> */}

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;