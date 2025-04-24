import React, { useState } from 'react';

const HowToUse = () => {
  // State for active tutorial step
  const [activeStep, setActiveStep] = useState(1);

  // Tutorial steps data
  const tutorialSteps = [
    {
      id: 1,
      title: "Getting Started",
      description: "Download and install Herma on your computer. The setup process is straightforward - For windows follow the installation wizard. Once installed, launch the application. On Mac just launch the application to begin your private AI experience!"
    },
    {
      id: 2,
      title: "Asking Questions",
      description: "Type your question or request in the input field at the bottom of the main chat window. Herma will process your query locally on your device and provide a thoughtful response. You can ask about general knowledge, request creative content, or seek help with various tasks."
    },
    {
      id: 3,
      title: "Uploading Documents",
      description: "Click the document icon in the sidebar to upload files you want Herma to analyze. Supported formats include PDFs, text files, Word documents, and spreadsheets. After uploading, you can ask questions about the document's content for instant insights."
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
    <section className="py-20 bg-gradient-to-b from-[var(--primary-bg)] to-[var(--secondary-bg)]/20" id="tutorial">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--highlight-color)] mb-4">How to Use Herma</h2>
          <p className="text-lg text-[var(--highlight-color)]/80 max-w-3xl mx-auto">
            Follow these simple steps to get the most out of Herma, your private AI assistant.
          </p>
        </div>

        {/* Tutorial Navigation */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex space-x-2 mx-auto">
            {tutorialSteps.map((step) => (
              <button
                key={step.id}
                className={`px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                  activeStep === step.id
                    ? 'bg-[var(--highlight-color)] text-white shadow-md'
                    : 'bg-[var(--secondary-bg)]/30 text-[var(--highlight-color)] hover:bg-[var(--secondary-bg)]/50'
                }`}
                onClick={() => setActiveStep(step.id)}
              >
                Step {step.id}
              </button>
            ))}
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Tutorial Image Area */}
          <div className="bg-[var(--primary-bg)] rounded-xl shadow-lg p-6 h-80 flex items-center justify-center order-2 md:order-1">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-[var(--secondary-bg)]/10 flex items-center justify-center">
              {/* Placeholder for tutorial images */}
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-[var(--highlight-color)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[var(--highlight-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {activeStep === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />}
                    {activeStep === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                    {activeStep === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                    {activeStep === 4 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
                    {activeStep === 5 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />}
                    {activeStep === 6 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <p className="text-[var(--highlight-color)]">
                  {activeStep === 1 && "Install and launch Herma on your device"}
                  {activeStep === 2 && "Ask questions in the chat interface"}
                  {activeStep === 3 && "Upload documents for analysis"}
                  {activeStep === 4 && "Generate creative content and drafts"}
                  {activeStep === 5 && "Break down complex problems"}
                  {activeStep === 6 && "Engage in contextual conversations"}
                </p>
              </div>
            </div>
          </div>

          {/* Tutorial Text Area */}
          <div className="space-y-6 order-1 md:order-2">
            <h3 className="text-2xl font-bold text-[var(--highlight-color)]">
              {tutorialSteps.find(step => step.id === activeStep)?.title}
            </h3>
            
            <p className="text-[var(--text-color)] leading-relaxed text-lg">
              {tutorialSteps.find(step => step.id === activeStep)?.description}
            </p>
            
            <div className="pt-4">
              <h4 className="font-semibold text-[var(--highlight-color)] mb-3">Pro Tips:</h4>
              <ul className="space-y-2">
                {activeStep === 1 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Ensure your computer meets the minimum system requirements for optimal performance.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Check for updates regularly to access the latest features and improvements.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 2 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Be specific with your questions to get more accurate and helpful responses.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>You can ask Herma to refine or expand on its previous answers if needed.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 3 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>For uploaded files white files means it is selected and will be used to answer your questions.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Ask specific questions about document content rather than general ones for better results.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 4 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Provide examples or context to help Herma understand your desired tone and style.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Iteratively refine generated content by asking for specific changes or improvements.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 5 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>For math or coding problems, clearly state what you're trying to achieve.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Ask Herma to explain its reasoning process to better understand complex solutions.</span>
                    </li>
                  </>
                )}
                
                {activeStep === 6 && (
                  <>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Start a new chat for entirely different topics to avoid confusion.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--highlight-color)] mr-2">•</span>
                      <span>Use references like "as I mentioned earlier" to help Herma connect related questions.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button 
                className={`px-4 py-2 rounded-lg bg-[var(--secondary-bg)]/30 text-[var(--highlight-color)] transition-all duration-300 ${
                  activeStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--secondary-bg)]/50'
                }`}
                onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                disabled={activeStep === 1}
              >
                Previous Step
              </button>
              
              <button 
                className={`px-4 py-2 rounded-lg bg-[var(--highlight-color)] text-white transition-all duration-300 ${
                  activeStep === tutorialSteps.length ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveStep(prev => Math.min(prev + 1, tutorialSteps.length))}
                disabled={activeStep === tutorialSteps.length}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional Help Section */}
        <div className="mt-20 text-center">
          <div className="bg-[var(--secondary-bg)]/20 rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[var(--highlight-color)] mb-4">Need More Help?</h3>
            <p className="text-[var(--highlight-color)]/80 mb-6">
              This basic tutorial covers the essentials, but Herma has many more capabilities to explore. 
              Try experimenting with different requests to discover all that Herma can do for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-6 py-3 bg-[var(--highlight-color)] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                View Full Documentation
              </button>
              <button className="px-6 py-3 bg-transparent border border-[var(--highlight-color)] text-[var(--highlight-color)] font-medium rounded-lg hover:bg-[var(--highlight-color)]/10 transition-all duration-300">
                Watch Tutorial Videos
              </button>
            </div>
          </div>
        </div>
      </div>
      
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