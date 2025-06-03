import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handleDownload from './handleDownload';

// Mock images - replace with your actual imports
const appPreviewImage = '/api/placeholder/800/600';
const docUploadImage = '/api/placeholder/800/600';
const creativeContentImage = '/api/placeholder/800/600';
const complexProblemImage = '/api/placeholder/800/600';

const Hero = () => {
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [osType, setOsType] = useState('unknown');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showVersionSelect, setShowVersionSelect] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('free');

  const navigate = useNavigate();

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
  const handleDownloadClick = (version) => {
    const platform = osType === 'mac' ? 'mac' : 'windows';
    handleDownload(platform, version, navigate);
    setShowVersionSelect(false);
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
      <section className="relative w-full min-h-screen flex items-center justify-center pt-16 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-30 pointer-events-none"
               style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjMDAwIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')"}}></div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Text Column */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                Privacy is Power
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-800 mb-6 font-light max-w-xl mx-auto lg:mx-0">
                A local alternative to cloud-based AI
              </p>
              
              <p className="text-lg text-blue-700 mb-8 max-w-lg mx-auto lg:mx-0">
                Take the short way. All your data stays on your device.
              </p>

              {/* Version Selection Modal */}
              {showVersionSelect && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                    <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Choose Your Version</h3>
                    
                    <div className="grid gap-6 mb-8">
                      {/* Free Version */}
                      <div 
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedVersion === 'free' 
                            ? 'border-blue-600 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedVersion('free')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-semibold text-blue-900">Herma Free</h4>
                          <span className="text-2xl font-bold text-green-600">$0</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-2">
                          <li>✓ Basic AI capabilities</li>
                          <li>✓ Complete privacy</li>
                          <li>✓ Offline functionality</li>
                          <li>✓ Limited daily usage</li>
                        </ul>
                      </div>

                      {/* Paid Version */}
                      <div 
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all relative ${
                          selectedVersion === 'paid' 
                            ? 'border-blue-600 bg-blue-50 shadow-lg' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedVersion('paid')}
                      >
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          POPULAR
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xl font-semibold text-blue-900">Herma Pro</h4>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-blue-600">$9.99</span>
                            <span className="text-sm text-gray-600">/month</span>
                          </div>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-2">
                          <li>✓ Advanced AI capabilities</li>
                          <li>✓ Unlimited usage</li>
                          <li>✓ Priority support</li>
                          <li>✓ Advanced features</li>
                          <li>✓ Regular updates</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowVersionSelect(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDownloadClick(selectedVersion)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform transition-all hover:scale-105"
                      >
                        {selectedVersion === 'free' ? 'Download Free' : 'Continue to Payment'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <button 
                  onClick={() => setShowVersionSelect(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  {osType === 'mac' ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2 text-xl">⌘</span> Download for Mac
                    </span>
                  ) : osType === 'windows' ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2 text-xl">⊞</span> Download for Windows
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2 text-xl">↓</span> Download Herma
                    </span>
                  )}
                </button>
                
                <Link 
                  to="#tutorial" 
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg transition duration-300 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('features');
                  }}
                >
                  Learn More
                </Link>
              </div>
              
              <p className="text-sm text-blue-800/70 mb-2">
                {osType === 'mac' ? 'Available for Mac' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • Free & Pro versions • No internet needed
              </p>

              <p className="text-[0.75rem] text-blue-800/70">
                By downloading, you agree to our <a href="/privacy-policy" onClick={(e) => handleNavigation('/privacy-policy', e)} className="underline hover:text-blue-800">License</a> and <a href="/terms-of-service" onClick={(e) => handleNavigation('/terms-of-service', e)} className="underline hover:text-blue-800">Terms of Service</a>.
              </p>
            </div>

            {/* Image Column */}
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
              
              {/* App Preview Frame */}
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl">
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
                        style={{ 
                          position: 'absolute', 
                          top: 0, 
                          left: 0, 
                          width: '100%', 
                          height: '100%', 
                          opacity: index === activeSlide ? 1 : 0, 
                          zIndex: index === activeSlide ? 10 : 0, 
                          transition: 'opacity 500ms ease-in-out' 
                        }}
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
                  
                  {/* Info section */}
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
                    
                    {/* Carousel Navigation */}
                    <div className="absolute bottom-14 left-0 right-0 flex justify-center gap-2 p-2 z-20">
                      {gallerySlides.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === activeSlide 
                              ? "bg-blue-600 w-8" 
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
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Everything You Need to Know</h2>
            <p className="text-lg text-blue-600 max-w-2xl mx-auto">
              Get started with Herma and experience private AI on your device
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* System Requirements Card */}
            <div className={`bg-white rounded-xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300 ${requirementsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 cursor-pointer flex justify-between items-center"
                onClick={toggleRequirements}
                style={{ borderRadius: requirementsOpen ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
              >
                <h3 className="text-xl font-semibold text-white">System Suggestions</h3>
                <span className="text-white text-xl bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
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
            <div className={`bg-white rounded-xl overflow-hidden shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300 ${tipsOpen ? 'h-auto' : 'h-[4.5rem]'}`}>
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 cursor-pointer flex justify-between items-center"
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
            </div>
          </div>

          {/* Key Benefits Section */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Key Benefits</h2>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                Why choose Herma for your AI needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">100% Private</h3>
                <p className="text-blue-700">Your data never leaves your device. No cloud processing means total privacy protection.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Fast Response</h3>
                <p className="text-blue-700">Get instant results with no internet latency. Local processing means quicker AI interactions.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">Always Available</h3>
                <p className="text-blue-700">Works offline with no subscription required for free version. Access powerful AI capabilities anytime, anywhere.</p>
              </div>
            </div>
          </div>

          {/* Pricing Comparison */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Choose Your Plan</h2>
              <p className="text-lg text-blue-600 max-w-2xl mx-auto">
                Start free and upgrade when you need more power
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">Herma Free</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">$0</div>
                  <p className="text-blue-600">Perfect for getting started</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Basic AI capabilities
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Complete privacy
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Offline functionality
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    Limited daily usage
                  </li>
                </ul>
                <button 
                  onClick={() => handleDownloadClick('free')}
                  className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Download Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-xl text-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">RECOMMENDED</span>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Herma Pro</h3>
                  <div className="text-4xl font-bold mb-2">$9.99<span className="text-lg">/month</span></div>
                  <p className="text-blue-100">For power users and professionals</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Advanced AI capabilities
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Unlimited usage
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Regular updates & new features
                  </li>
                </ul>
                <button 
                  onClick={() => handleDownloadClick('paid')}
                  className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Start Pro Trial
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-12 rounded-2xl shadow-lg">
              <h3 className="text-3xl font-bold text-blue-900 mb-6">Ready to experience private AI?</h3>
              <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto">
                Start with our free version or unlock the full potential with Herma Pro
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <button 
                  onClick={() => handleDownloadClick('free')}
                  className="flex-1 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Try Free
                </button>
                <button 
                  onClick={() => handleDownloadClick('paid')}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transform transition-all hover:scale-105 font-semibold"
                >
                  Go Pro
                </button>
              </div>
              <p className="mt-4 text-sm text-blue-600">
                {osType === 'mac' ? 'Available for Mac' : osType === 'windows' ? 'Available for Windows' : 'Available for Windows and macOS'} • No Internet Required
              </p>
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