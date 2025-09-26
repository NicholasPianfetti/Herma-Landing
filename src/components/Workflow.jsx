import React from 'react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const Workflow = () => {
  // Scroll animation hooks
  const headerAnimation = useScrollAnimation();
  const { containerRef, itemsVisible } = useStaggeredAnimation(4, 300);

  const steps = [
    {
      title: "User Prompt",
      description: "The user sends a prompt into the system.",
      icon: "💬",
    },
    {
      title: "Local Model Redaction",
      description: "Sensitive data is redacted locally and stored securely on-prem.",
      icon: "🔒",
    },
    {
      title: "Cloud Model Processing",
      description: "A modified prompt (without sensitive data) is sent to a cloud model for enhanced processing.",
      icon: "☁️",
    },
    {
      title: "Unified Response",
      description: "The local model merges the cloud's response with on-prem data to deliver a complete, secure answer.",
      icon: "🤝",
    },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white via-blue-25 to-blue-50" id="workflow">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 ${headerAnimation.isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          <h2 className="text-3xl font-bold text-blue-900 mb-4">
            How the AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--highlight-color)] to-indigo-600">Data Governor</span> Works
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Understanding Herma's data governance workflow
          </p>
        </div>

        {/* Workflow Steps */}
        <div
          ref={containerRef}
          className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Step Card */}
              <div className={`w-64 shadow-lg rounded-2xl bg-white border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${itemsVisible.includes(index) ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-blue-700">{step.description}</p>
                </div>
              </div>

              {/* Arrow (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block mx-4 text-blue-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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

        .animate-fadeInUp {
          animation: fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Workflow;