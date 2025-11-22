import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ValueProposition = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.1);
  const [cardsRef, cardsVisible] = useScrollAnimation(0.1);

  return (
    <section className="pt-24 pb-12 sm:pb-16 bg-gradient-to-b from-white to-white" id="value-proposition">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#242424] mb-4 tracking-tight px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Massive Cost Savings Without Compromising Privacy
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Herma's intelligent routing delivers enterprise-grade cost optimization while maintaining airtight data security
          </p>
        </div>

        {/* Cost Savings Stats */}
        <div
          ref={cardsRef}
          className={`grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 md:mb-20 animate-on-scroll animate-fade-left ${cardsVisible ? 'is-visible' : ''}`}
        >
          {/* Cloud Routing Savings */}
          <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[var(--highlight-color)] opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--highlight-color)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--highlight-color)] tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  20-40<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[#242424] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Model Routing Savings
              </h3>
              <p
                className="text-sm sm:text-base text-gray-700 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Unified routing across all cloud AI providers optimizes model selection, reducing costs while expanding model access.
              </p>
            </div>
          </div>

          {/* Privacy Routing Savings */}
          <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-purple-600 opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-purple-600 tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  50<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[#242424] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Privacy Routing Savings
              </h3>
              <p
                className="text-sm sm:text-base text-gray-700 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Smart filtering routes only truly sensitive data to premium private infrastructure, processing safe requests through cost-effective public models.
              </p>
            </div>
          </div>

          {/* Total Savings */}
          <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-300 group">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-green-600 opacity-5 rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 tracking-tight whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  60-70<span className="text-xl sm:text-2xl md:text-3xl">%</span>
                </div>
              </div>
              <h3
                className="text-lg sm:text-xl font-semibold text-[#242424] mb-2 sm:mb-3"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Total Combined Savings
              </h3>
              <p
                className="text-sm sm:text-base text-gray-700 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Stack both optimizations to achieve industry-leading cost efficiency without sacrificing privacy, compliance, or model capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Comparison */}
        {/* <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 shadow-xl border border-gray-200">
          <h3
            className="text-3xl font-bold text-center text-[#242424] mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Replace Expensive Enterprise Plans
          </h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"> */}
            {/* Traditional Cost */}
            {/* <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200">
              <div className="text-center mb-6">
                <span
                  className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Traditional Enterprise LLM
                </span>
                <div
                  className="text-5xl font-bold text-red-600 mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  $25-60
                </div>
                <p className="text-gray-600" style={{ fontFamily: 'var(--font-ui)' }}>per user/month</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: 'var(--font-body)' }}>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Limited model selection</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Single vendor lock-in</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">No intelligent routing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Slow new model adoption</span>
                </li>
              </ul>
            </div> */}

            {/* Herma Cost */}
            {/* <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-400 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold" style={{ fontFamily: 'var(--font-ui)' }}>
                  BEST VALUE
                </span>
              </div>
              <div className="text-center mb-6">
                <span
                  className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Herma Enterprise Plan
                </span>
                <div
                  className="text-5xl font-bold text-green-600 mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  $9-18
                </div>
                <p className="text-gray-600" style={{ fontFamily: 'var(--font-ui)' }}>per user/month</p>
              </div>
              <ul className="space-y-3" style={{ fontFamily: 'var(--font-body)' }}>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Access to all cloud AI models</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Privacy-first intelligent routing</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Automatic cost optimization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Instant access to new models</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p
              className="text-lg text-gray-700 italic"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Save <span className="font-bold text-green-600">$16-42 per user monthly</span> while expanding capabilities and maintaining complete privacy control
            </p>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default ValueProposition;
