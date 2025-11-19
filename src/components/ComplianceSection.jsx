import React from 'react';

const ComplianceSection = () => {
  return (
    <section className="py-24 bg-white" id="compliance">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#242424] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Enterprise-Grade Security & Compliance
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Airtight privacy guarantees backed by industry-leading security standards
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Zero Data Retention */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <svg className="w-10 h-10 text-[var(--highlight-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3
              className="text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Zero Data Retention
            </h3>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our private cloud API providers guarantee zero storage of your request data — nothing is logged or retained.
            </p>
          </div>

          {/* SOC Compliance */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3
              className="text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              SOC Compliant
            </h3>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              All private cloud API endpoints meet SOC 2 Type II compliance standards for secure data handling.
            </p>
          </div>

          {/* Encryption at Rest */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3
              className="text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Encryption at Rest
            </h3>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              All stored data in private cloud APIs is encrypted with AES-256 encryption when at rest in our systems.
            </p>
          </div>

          {/* Encryption in Transit */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3
              className="text-lg font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Encryption in Transit
            </h3>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              TLS 1.3 encryption protects all data in transit between your systems and our APIs.
            </p>
          </div>
        </div>

        {/* Compliance Standards */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 shadow-xl border border-gray-200 mb-16">
          <h3
            className="text-3xl font-bold text-center text-[#242424] mb-12"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Regulatory Compliance
          </h3>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* GDPR */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--highlight-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    GDPR Ready
                  </h4>
                  <p
                    className="text-gray-600 leading-relaxed mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Our architecture supports GDPR compliance with data residency controls, right to deletion, and processing transparency.
                  </p>
                  <a
                    href="mailto:contact@hermaai.com?subject=GDPR%20Compliance%20Information"
                    className="text-[var(--highlight-color)] font-semibold hover:underline inline-flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Contact for details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* HIPAA */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4
                    className="text-xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    HIPAA Compatible
                  </h4>
                  <p
                    className="text-gray-600 leading-relaxed mb-4"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Healthcare organizations can use Herma with appropriate Business Associate Agreements and technical safeguards in place.
                  </p>
                  <a
                    href="mailto:contact@hermaai.com?subject=HIPAA%20Compliance%20Information"
                    className="text-purple-600 font-semibold hover:underline inline-flex items-center gap-2"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    Contact for details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
