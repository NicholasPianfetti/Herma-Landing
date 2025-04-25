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
    <section className="py-20 bg-[var(--primary-bg)]" id="faq">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[var(--highlight-color)] mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-[var(--highlight-color)]/80 max-w-3xl mx-auto">
            Find answers to common questions about Herma and how it can enhance your productivity while preserving your privacy.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 bg-[var(--secondary-bg)] p-6 rounded-lg shadow-lg">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-[var(--primary-bg)] rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            >
              <button 
                className={`w-full text-left p-5 focus:outline-none flex justify-between items-center ${
                  expandedId === item.id ? 'bg-[var(--secondary-bg)]/30' : 'bg-[var(--primary-bg)]'
                }`}
                onClick={() => toggleExpand(item.id)}
                aria-expanded={expandedId === item.id}
              >
                <h3 className="text-lg font-medium text-[var(--highlight-color)]">{item.question}</h3>
                <span className={`transform transition-transform duration-300 text-[var(--highlight-color)] ${
                  expandedId === item.id ? 'rotate-180' : 'rotate-0'
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
                <div className="p-5 bg-[var(--secondary-bg)]/10 border-t border-[var(--highlight-color)]/10">
                  <p className="text-[var(--text-color)] leading-relaxed">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[var(--secondary-bg)] p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-[var(--highlight-color)] mb-3">Have more questions?</h3>
            <p className="text-[var(--highlight-color)]/80 mb-5">
              We're here to help! Contact us directly for personalized assistance.
            </p>
            <a 
              href="mailto:hermalocal@gmail.com" 
              className="px-6 py-3 bg-[var(--highlight-color)] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;