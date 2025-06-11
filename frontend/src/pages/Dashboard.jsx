// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession } from '../services/api';
import { PRICING_CONFIG } from '../services/stripe';
import handleDownload from '../utils/handleDownload';

const Dashboard = () => {
  const [osType, setOsType] = useState('unknown');
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    currentUser, 
    userProfile, 
    getUserSubscriptionTier, 
    userHasActiveSubscription,
    refreshUserProfile 
  } = useAuth();

  const userTier = getUserSubscriptionTier();
  const hasActiveSub = userHasActiveSubscription();

  // Detect OS
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
      
      return 'unknown';
    };
    
    setOsType(detectOS());
  }, []);

  // Check for successful payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Refresh user profile to get updated subscription status
      refreshUserProfile();
    }
  }, [refreshUserProfile]);

  const handleSubscription = async () => {
    if (!currentUser || hasActiveSub) return;

    setIsProcessing(true);
    try {
      await createCheckoutSession(currentUser.uid, PRICING_CONFIG.pro.priceId);
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to start subscription process. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleDownloadClick = (version = 'free') => {
    const tierForDownload = version === 'pro' && hasActiveSub ? 'pro' : 'free';
    handleDownload(osType === 'mac' ? 'mac' : 'windows', tierForDownload, currentUser?.uid);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.displayName || 'User'}!
              </h1>
              <p className="text-gray-600">
                Manage your Herma account and downloads
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                hasActiveSub 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {hasActiveSub ? '✓ Pro Member' : 'Free Plan'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.displayName || 'Not set'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt.toDate()).toLocaleDateString() : 
                    'Unknown'
                  }
                </p>
              </div>

              {hasActiveSub && userProfile?.subscription && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subscription Status</label>
                  <div className="mt-1">
                    <p className="text-sm text-green-600 font-medium">
                      Active Pro Subscription
                    </p>
                    {userProfile.subscription.currentPeriodEnd && (
                      <p className="text-xs text-gray-500">
                        Renews on {new Date(userProfile.subscription.currentPeriodEnd.toDate()).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Download Herma</h2>
            
            <div className="space-y-4">
              {/* Free Download */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Free Version</h3>
                  <span className="text-sm text-gray-500">Always available</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Basic AI functionality with local processing
                </p>
                <button
                  onClick={() => handleDownloadClick('free')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {osType === 'mac' ? 'Download for Mac' : 'Download for Windows'}
                </button>
              </div>

              {/* Pro Download */}
              <div className={`border rounded-lg p-4 ${
                hasActiveSub ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Pro Version</h3>
                  {hasActiveSub ? (
                    <span className="text-sm text-green-600 font-medium">✓ Available</span>
                  ) : (
                    <span className="text-sm text-orange-600">Requires subscription</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Advanced features, extended memory, priority support
                </p>
                
                {hasActiveSub ? (
                  <button
                    onClick={() => handleDownloadClick('pro')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download Pro Version
                  </button>
                ) : (
                  <button
                    onClick={handleSubscription}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Upgrade to Pro - ${PRICING_CONFIG.pro.price}/month`}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
              <p className="text-sm text-yellow-700">
                Both versions use the same installer. Pro features are unlocked automatically 
                when you sign in to the app with your account.
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        {hasActiveSub && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription Management</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Current Plan</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Herma Pro</span>
                    <span className="text-green-600">${PRICING_CONFIG.pro.price}/month</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    All premium features included
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Billing</h3>
                <div className="space-y-2">
                  {userProfile?.subscription?.currentPeriodEnd && (
                    <p className="text-sm text-gray-600">
                      Next billing date: {new Date(userProfile.subscription.currentPeriodEnd.toDate()).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Manage your subscription through Stripe's customer portal
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Manage Billing →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Comparison */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 px-4 text-gray-900">Basic AI chat</td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-900">Extended conversation memory</td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-900">Advanced document analysis</td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-900">Priority support</td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-900">Early access to new features</td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;