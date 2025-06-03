import React, { useEffect, useState } from 'react';

const DownloadSuccessPage = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    // Get subscription data from localStorage
    const data = localStorage.getItem('hermaSubscription');
    if (data) {
      setSubscriptionData(JSON.parse(data));
      setDownloadStarted(true);
    }
  }, []);

  const handleDownloadAgain = () => {
    if (subscriptionData) {
      const { handlePaidDownload } = require('./handleDownload');
      handlePaidDownload(subscriptionData.platform, subscriptionData.userId);
    }
  };

  if (!subscriptionData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Herma Pro!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your payment was successful and your download should start automatically.
          </p>

          {/* Download Status */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              {downloadStarted ? (
                <>
                  <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-blue-800 font-semibold">Download Started</span>
                </>
              ) : (
                <>
                  <svg className="animate-spin w-6 h-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-800 font-semibold">Preparing Download...</span>
                </>
              )}
            </div>
            
            <p className="text-blue-700 text-sm">
              Platform: {subscriptionData.platform === 'mac' ? 'macOS' : 'Windows'}
            </p>
            
            {downloadStarted && (
              <button
                onClick={handleDownloadAgain}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Download Again
              </button>
            )}
          </div>

          {/* Subscription Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Subscription Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">Herma Pro</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{subscriptionData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="font-medium">
                  {new Date(subscriptionData.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Billing:</span>
                <span className="font-medium">
                  {new Date(new Date(subscriptionData.startDate).setMonth(new Date(subscriptionData.startDate).getMonth() + 1)).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Install Herma Pro</p>
                  <p className="text-gray-600 text-sm">Run the downloaded installer and follow the setup instructions.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Activate Your License</p>
                  <p className="text-gray-600 text-sm">Use your email address to activate the Pro features.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Start Using Herma Pro</p>
                  <p className="text-gray-600 text-sm">Enjoy unlimited AI capabilities with complete privacy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support and Contact */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm mb-4">
              Need help? Contact our support team or visit our documentation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('mailto:support@herma.app', '_blank')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={() => window.location.href = '/docs'}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Documentation
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadSuccessPage;