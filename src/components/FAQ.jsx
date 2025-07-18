import React, { useState } from 'react';

const FAQ = () => {
  // FAQ data with question and answer pairs
  const faqItems = [
    {
      id: 1,
      question: "How does Herma keep my data private while using cloud AI?",
      answer: "Herma acts as a local data governor that intelligently filters your queries before they reach cloud services. When you ask a question or request a task, Herma first identifies and redacts all private and proprietary information locally on your device. Only the sanitized, non-sensitive portion of your query is sent to cloud AI models for processing. The private data is then seamlessly reinserted into the response on your local device, giving you the power of cloud AI without compromising your sensitive information."
    },
    {
      id: 2,
      question: "What makes Herma different from other AI assistants?",
      answer: "Herma uniquely combines the best of both worlds: the power of large cloud AI models with the security of local processing. Unlike purely cloud-based assistants that see all your data, or purely local models with limited capabilities, Herma's hybrid approach provides enterprise-grade privacy protection while maintaining access to cutting-edge AI capabilities. It's your personal data firewall for the AI age."
    },
    {
      id: 3,
      question: "How does the agentic system work?",
      answer: "Herma features a fully agentic system that can interact with a variety of applications through a single chat interface. When you request a task, Herma's local data governor first filters out sensitive information, then uses cloud AI models to understand and execute complex multi-step workflows. Whether you need to analyze documents, generate content, or automate tasks across different apps, Herma handles it all while keeping your private data secure."
    },
    {
      id: 4,
      question: "What types of private information does Herma filter?",
      answer: "Herma's local data governor automatically identifies and protects various types of sensitive information including personal identifiers (names, emails, phone numbers), financial data, proprietary business information, confidential documents, and any custom data patterns you specify. This filtering happens entirely on your device before any data reaches external cloud services."
    },
    {
      id: 5,
      question: "Does Herma work offline?",
      answer: "Yes, Herma has robust offline capabilities for basic AI tasks and document analysis using local models. However, its true power shines when connected to the internet, where it can leverage powerful cloud AI models while maintaining privacy through local data filtering. You get the best of both worlds: offline functionality when needed, and enhanced capabilities when online."
    },
    {
      id: 6,
      question: "Is Herma suitable for businesses and enterprises?",
      answer: "Absolutely. Herma's local data governor makes it ideal for organizations concerned about data leakage while still wanting to leverage advanced AI capabilities. Companies can confidently use Herma for sensitive tasks like analyzing proprietary documents, handling customer data, or processing confidential information, knowing that their private data never leaves their control while still accessing the latest AI innovations."
    },
    {
      id: 7,
      question: "How does Herma solve the AI data leakage problem?",
      answer: "Herma directly addresses the growing concern about data leakage in AI systems by creating a secure bridge between local and cloud AI. Traditional cloud AI services require sending all your data externally, while local-only solutions lack power. Herma's innovative approach filters sensitive information locally, sends only non-sensitive context to cloud models, and reconstructs complete responses locally. This eliminates data leakage risks while maintaining AI effectiveness."
    },
    {
      id: 8,
      question: "Can I control what information gets filtered?",
      answer: "Yes, Herma provides granular control over its data filtering system. You can customize which types of information should be considered sensitive, add specific patterns or terms to protect, and adjust the filtering sensitivity based on your needs. The local data governor learns from your preferences to provide increasingly accurate protection while maintaining the functionality you need."
    }
  ];

  // State to track which FAQ item is expanded
  const [expandedId, setExpandedId] = useState(null);

  // Toggle expansion state
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white" id="faq">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-blue-600 max-w-3xl mx-auto">
            Find answers to common questions about Herma and how it can enhance your productivity while preserving your privacy.
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 mx-auto mt-6"></div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 bg-white rounded-2xl p-8 shadow-xl border border-blue-100">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-blue-100 hover:border-blue-300"
            >
              <button 
                className={`w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 flex justify-between items-center transition-colors ${
                  expandedId === item.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-white'
                }`}
                onClick={() => toggleExpand(item.id)}
                aria-expanded={expandedId === item.id}
              >
                <h3 className="text-lg font-semibold text-blue-900">{item.question}</h3>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  expandedId === item.id 
                    ? 'bg-[var(--highlight-color)] text-white rotate-180' 
                    : 'bg-blue-100 text-blue-700 rotate-0'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  expandedId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 bg-blue-50/50 border-t border-blue-100">
                  <p className="text-blue-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600 rounded-2xl p-10 shadow-xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Have more questions?</h3>
            <p className="text-white text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              We're here to help! Contact us directly for personalized assistance.
            </p>
            <a 
              href="mailto:hermalocal@gmail.com" 
              className="px-8 py-4 bg-white text-[var(--highlight-color)] font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;