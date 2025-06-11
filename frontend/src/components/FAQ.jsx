import React, { useState } from 'react';

const FAQ = () => {
  // FAQ data with question and answer pairs
  const faqItems = [
    {
      id: 1,
      question: "How does Herma keep my data private?",
      answer: "Herma runs entirely on your local device, which means your data never leaves your computer. Unlike cloud-based AI services, we don't send your conversations, documents, or queries to external servers. All processing happens directly on your machine, ensuring complete privacy and data security."
    },
    {
      id: 2,
      question: "Do I need internet to use Herma?",
      answer: "No, Herma works completely offline. Once installed, you can use all of Herma's features without an internet connection. This makes it perfect for working with sensitive data or in environments where connectivity is limited or unavailable."
    },
    {
      id: 3,
      question: "How does Herma compare to cloud-based AI assistants?",
      answer: "While cloud-based AI assistants may offer access to larger models, Herma provides comparable functionality with the added benefit of complete privacy. Herma is optimized to run efficiently on consumer hardware while still delivering high-quality responses, document analysis, and creative content generation."
    },
    {
      id: 4,
      question: "What types of files can Herma analyze?",
      answer: "Herma can analyze various document types including text files, PDFs, Word documents, spreadsheets, and more. You can use Herma to summarize documents, extract key information, answer questions about the content, and generate insights based on your files."
    },
    {
      id: 5,
      question: "Will my computer be powerful enough to run Herma?",
      answer: "Herma is designed to run efficiently on modern computers. For optimal performance, we recommend at least an Intel i5/AMD Ryzen 5 processor (or equivalent), 16GB RAM, and 20GB of available storage. For more complex tasks, having a GPU with CUDA support will improve performance, but it's not strictly required for basic functionality."
    },
    {
      id: 6,
      question: "How often is Herma updated?",
      answer: "We regularly release updates to improve performance, add new features, and enhance the underlying AI models. Updates are designed to be lightweight and non-intrusive, and you'll be notified when new versions are available. Since Herma runs locally, you have complete control over when to update."
    },
    {
      id: 7,
      question: "Can I customize Herma for specific use cases?",
      answer: "Yes, Herma learns from your interactions and the documents you provide, allowing it to better understand your specific needs and preferences over time. This makes Herma increasingly valuable for specialized tasks like research, content creation, or information analysis in your particular domain."
    },
    {
      id: 8,
      question: "Is Herma good for work use?",
      answer: "Absolutely. Herma's privacy-first approach makes it ideal for businesses handling sensitive information. With no data leaving your devices, you can confidently use Herma for proprietary research, financial analysis, customer data processing, and other sensitive tasks without privacy concerns."
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