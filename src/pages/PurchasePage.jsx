import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { onAuthStateChange, logOut, getUserSubscriptionStatus } from '../firebase/auth';

const PurchasePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        const status = await getUserSubscriptionStatus(user.uid);
        setSubscriptionStatus(status);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = async (user) => {
    setUser(user);
    const status = await getUserSubscriptionStatus(user.uid);
    setSubscriptionStatus(status);
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    setSubscriptionStatus('free');
  };

  const handleGoHome = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {!user ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Upgrade to Herma Pro
              </h1>
              <p className="text-xl text-blue-700 mb-8">
                Unlock premium features and enhanced capabilities
              </p>
              
              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Models</h3>
                  <p className="text-blue-600 text-sm">Access to larger, more capable AI models</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Enhanced Processing</h3>
                  <p className="text-blue-600 text-sm">Handle larger documents and complex tasks</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Priority Support</h3>
                  <p className="text-blue-600 text-sm">Get help when you need it most</p>
                </div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="text-center mb-8">
              <div className="inline-flex bg-white p-1 rounded-lg shadow-lg border border-blue-100 mb-8">
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`px-6 py-2 rounded-md font-medium transition-all ${
                    activeTab === 'signup'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {activeTab === 'login' ? (
              <Login 
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={() => setActiveTab('signup')}
              />
            ) : (
              <Signup 
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            )}
          </>
        ) : (
          /* Authenticated User View */
          <div className="text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-blue-900 mb-2">
                  Welcome, {user.displayName || user.email}!
                </h2>
                <div className="flex items-center justify-center mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    subscriptionStatus === 'pro' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {subscriptionStatus === 'pro' ? 'Pro Member' : 'Free Plan'}
                  </span>
                </div>
              </div>

              {subscriptionStatus === 'free' ? (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">
                    Ready to upgrade to Pro?
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6">
                    <div className="text-4xl font-bold text-blue-900 mb-2">$29.99</div>
                    <div className="text-blue-600 mb-4">One-time purchase</div>
                    <div className="text-sm text-blue-700">
                      Lifetime access to all Pro features
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      🚧 <strong>Payment integration coming soon!</strong> We're working on connecting Stripe to enable secure payments. 
                      You'll be notified as soon as Pro upgrades are available.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      🎉 You're a Pro Member!
                    </h3>
                    <p className="text-green-700">
                      Enjoy all the premium features in your Herma app.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGoHome}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
                >
                  Back to Home
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg transition duration-300 hover:bg-blue-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasePage;