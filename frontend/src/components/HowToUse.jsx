import React, { useState } from 'react';
// Import the images
import installImage from './install-image.png';
import questionImage from './question-image.png';
import uploadImage from './upload-image.png';
import creativeImage from './creative-image.png';
import problemImage from './problem-image.png';
import conversationImage from './conversation-image.png';

const HowToUse = () => {
  // State for active tutorial step
  const [activeStep, setActiveStep] = useState(1);
  // State for enlarged image
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Function to handle image click
  const handleImageClick = (image, alt) => {
    setEnlargedImage({ 
      image, 
      alt, 
      title: tutorialSteps.find(step => step.id === activeStep)?.title 
    });
  };

  // Function to close enlarged image
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // Tutorial steps data
  const tutorialSteps = [
    {
      id: 1,
      title: "Getting Started",
      description: "First, download and install Herma on your computer. For windows follow the installation wizard. Once installed, launch the application. On Mac just launch the application to begin your private AI experience!"
    },
    {
      id: 2,
      title: "Asking Questions",
      description: "Type your question into the input field at the bottom of the window. Herma will process your query locally and provide a response. You can ask about general knowledge, request creative content, or seek help with various tasks."
    },
    {
      id: 3,
      title: "Uploading Documents",
      description: "Click either document icon to upload files you want Herma to analyze. Supported formats include PDFs, text files, Word documents, and spreadsheets. After uploading, you can ask questions about the document's content for instant insights."
    },
    {
      id: 4,
      title: "Creating Content",
      description: "Ask Herma to help you draft emails, write stories, generate ideas, or create outlines. Simply specify what type of content you need, provide any relevant details or requirements, and Herma will generate a draft for you to review and refine."
    },
    {
      id: 5,
      title: "Complex Problem Solving",
      description: "For challenging problems, break them down into smaller parts. Describe the issue in detail, and Herma will work through it step by step. You can ask follow-up questions to refine solutions and explore different approaches."
    },
    {
      id: 6,
      title: "Memory & Conversations",
      description: "Herma remembers your conversation history within a session, allowing for contextual follow-ups. You can reference previous questions or answers but longer chats may lead to less accurate responses."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white" id="tutorial">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">How to Use Herma</h2>
          <p className="text-lg text-blue-600 max-w-3xl mx-auto">
            Follow these simple steps to get the most out of your private AI assistant.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 mx-auto mt-6"></div>
        </div>

        {/* Tutorial Navigation */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-3 mx-auto">
            {tutorialSteps.map((step) => (
              <button
                key={step.id}
                className={`px-5 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap flex items-center shadow-sm ${
                  activeStep === step.id
                    ? 'bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white shadow-md'
                    : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                <span className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center text-sm ${
                  activeStep === step.id ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'
                }`}>{step.id}</span>
                <span className="font-medium">Step {step.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tutorial Image Area */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-80 flex items-center justify-center order-2 lg:order-1 border border-blue-100">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-blue-50">
              {/* Tutorial images */}
              <div className="w-full h-full">
                {activeStep === 1 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={installImage} 
                      alt="Install and launch Herma" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(installImage, "Install and launch Herma")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Install and launch Herma on your device
                    </p>
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={questionImage} 
                      alt="Ask questions in the chat interface" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(questionImage, "Ask questions in the chat interface")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Ask questions in the chat interface
                    </p>
                  </div>
                )}
                {activeStep === 3 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={uploadImage} 
                      alt="Upload documents for analysis" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(uploadImage, "Upload documents for analysis")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Upload documents for analysis
                    </p>
                  </div>
                )}
                {activeStep === 4 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={creativeImage} 
                      alt="Generate creative content and drafts" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(creativeImage, "Generate creative content and drafts")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Generate creative content and drafts
                    </p>
                  </div>
                )}
                {activeStep === 5 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={problemImage} 
                      alt="Break down complex problems" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(problemImage, "Break down complex problems")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Break down complex problems
                    </p>
                  </div>
                )}
                {activeStep === 6 && (
                  <div className="w-full h-full flex flex-col items-center">
                    <img 
                      src={conversationImage} 
                      alt="Engage in contextual conversations" 
                      className="object-contain max-h-[85%] rounded-lg shadow-md my-auto cursor-pointer"
                      onClick={() => handleImageClick(conversationImage, "Engage in contextual conversations")}
                    />
                    <p className="text-blue-800 mt-4 font-medium">
                      Engage in contextual conversations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tutorial Text Area */}
          <div className="space-y-6 order-1 lg:order-2 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
            <div className="inline-block px-4 py-2 rounded-lg bg-blue-100 text-blue-800 font-semibold mb-2">
              {tutorialSteps.find(step => step.id === activeStep)?.title}
            </div>
            
            <h3 className="text-2xl font-bold text-blue-900">
              Step {activeStep}: {tutorialSteps.find(step => step.id === activeStep)?.title}
            </h3>
            
            <p className="text-blue-700 leading-relaxed text-lg">
              {tutorialSteps.find(step => step.id === activeStep)?.description}
            </p>
            
            <div className="pt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[var(--highlight-color)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Pro Tips:
              </h4>
              <ul className="space-y-3">
                {activeStep === 1 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Ensure your computer meets the minimum system requirements for optimal performance.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Check for updates regularly to access the latest features and improvements.</span>
                    </li>
                  </>
                )}
                
                <ul className="space-y-3">
                {activeStep === 1 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Ensure your computer meets the minimum system requirements for optimal performance.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Check for updates regularly to access the latest features and improvements.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 2 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Be specific with your questions to get more accurate responses.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Ask Herma to refine or expand on its previous answers if needed.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 3 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">White highlighted files mean it is selected and will be used to answer your questions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Ask specific questions about document content rather than general ones for better results.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 4 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Provide examples or context to help Herma understand your desired tone and style.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Iteratively refine generated content by asking for specific changes or improvements.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 5 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">For math or coding problems, clearly state what you're trying to achieve.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Ask Herma to explain its reasoning process to better understand complex solutions.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 6 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Start a new chat for entirely different topics to avoid confusion.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2 text-lg">•</span>
                      <span className="text-blue-800">Use references like "as I mentioned earlier" to help Herma connect related questions.</span>
                    </li>
                  </>
                )}
                </ul>
              </ul>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button 
                className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                  activeStep === 1 
                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                    : 'bg-white border border-blue-500 text-blue-700 hover:bg-blue-50'
                }`}
                onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                disabled={activeStep === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              
              <button 
                className={`px-6 py-3 rounded-lg flex items-center transition-all duration-300 ${
                  activeStep === tutorialSteps.length 
                    ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white hover:shadow-lg'
                }`}
                onClick={() => setActiveStep(prev => Math.min(prev + 1, tutorialSteps.length))}
                disabled={activeStep === tutorialSteps.length}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Help Section */}
        <div className="mt-24">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-12 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Need More Help?</h3>
              <p className="text-lg text-blue-700 mb-6 max-w-2xl mx-auto">
                This basic tutorial covers the essentials, but Herma has many more capabilities to explore. 
                Try experimenting with different requests to discover all that Herma can do for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Start Using Herma Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
              <p>{enlargedImage.alt}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for hiding scrollbar */}
      <style jsx>{`
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

export default HowToUse;