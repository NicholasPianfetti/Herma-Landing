import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { onAuthStateChange, logOut, getUserSubscriptionStatus } from '../firebase/auth';
import { loadStripe } from '@stripe/stripe-js';

const PurchasePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('login');
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [error, setError] = useState(null);
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

  const handleSubscribe = async () => {
    if (!user) {
      setError('Please sign in first to start your free trial');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      console.log('Creating checkout session...');
      console.log('API URL:', apiUrl);
      
      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/upgrade`,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Checkout session created:', data);
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }
  
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });
  
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setLoading(false);
    }
  };

  // Feature comparison data
  const features = [
    {
      name: 'AI Model Access',
      free: 'Basic Llama 3.2:1B',
      pro: 'Advanced models + optimizations',
      highlight: true
    },
    {
      name: 'Document Processing',
      free: 'Small files (< 5MB)',
      pro: 'Large files + batch processing',
      highlight: true
    },
    {
      name: 'Response Length',
      free: 'Standard responses',
      pro: 'Extended detailed responses',
      highlight: false
    },
    {
      name: 'Memory Context',
      free: 'Limited conversation memory',
      pro: 'Enhanced long-term context',
      highlight: true
    },
    {
      name: 'Custom Models',
      free: 'Not available',
      pro: 'Import custom models',
      highlight: true
    },
    {
      name: 'Priority Support',
      free: 'Community support',
      pro: 'Direct email support',
      highlight: false
    },
    {
      name: 'Updates',
      free: 'Basic updates',
      pro: 'Early access + beta features',
      highlight: false
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 opacity-5 rounded-bl-full transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500 opacity-5 rounded-tr-full transform translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
  {/* Header */}
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
      Choose Your Plan
    </h1>
    <p className="text-xl text-blue-700 mb-8">
      Unlock the full potential of private AI
    </p>
  </div>

  {/* Pricing Comparison - Always Visible */}
  <div className="grid md:grid-cols-2 gap-8 mb-12">
    {/* Free Plan */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
      {user && subscriptionStatus === 'free' && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
        <div className="text-4xl font-bold text-gray-900 mb-4 pb-8">$0</div>
      </div>
      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">AI Model Access</div>
            <div className="text-sm text-gray-600">Basic Llama 3.2:1B</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">Document Processing</div>
            <div className="text-sm text-gray-600">Small files (5MB)</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">Response Length</div>
            <div className="text-sm text-gray-600">Standard responses</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">Memory Context</div>
            <div className="text-sm text-gray-600">Limited conversation memory</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium text-gray-900">Support</div>
            <div className="text-sm text-gray-600">Community support</div>
          </div>
        </div>
      </div>
      <button className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition duration-300 hover:border-gray-400 hover:bg-gray-50">
        {user && subscriptionStatus === 'free' ? 'Current Plan' : 'Free Forever'}
      </button>
    </div>

    {/* Pro Plan */}
    <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-2xl shadow-xl border border-blue-500 p-8 relative text-white">
      {user && subscriptionStatus === 'active' ? (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Current Plan
          </span>
        </div>
      ) : (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-amber-500 text-amber-900 px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Pro</h3>
        <div className="text-4xl font-bold mb-2 pb-8">$15 <span className="text-lg font-normal opacity-80">/month</span></div>
      </div>
      <div className="space-y-4 mb-8">
        <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 -mx-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">AI Model Access</div>
            <div className="text-sm text-blue-100">Advanced models + optimizations</div>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 -mx-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Document Processing</div>
            <div className="text-sm text-blue-100">Large files + batch processing</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Response Length</div>
            <div className="text-sm text-blue-100">Extended detailed responses</div>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 -mx-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Memory Context</div>
            <div className="text-sm text-blue-100">Enhanced long-term context</div>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-white/10 rounded-lg p-3 -mx-3">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Priority Support</div>
            <div className="text-sm text-blue-100">Direct email support</div>
          </div>
        </div>
      </div>
      
      {user && subscriptionStatus === 'active' ? (
        <button className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg">
          Current Plan
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Upgrade Today'}
        </button>
      )}
    </div>
  </div>

  {/* Trust Indicators */}
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
    <div className="grid md:grid-cols-3 gap-6 text-center">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-900">100% Private</div>
          <div className="text-sm text-gray-600">Data never leaves your device</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Secure Payment</div>
          <div className="text-sm text-gray-600">Protected by Stripe</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-900">Cancel Anytime</div>
          <div className="text-sm text-gray-600">No long-term commitment</div>
        </div>
      </div>
    </div>
  </div>

  {/* Auth Section - Only show if user is not logged in */}
  {!user && (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h2>
        <p className="text-gray-600 mb-6">Sign in to continue with your Pro upgrade</p>
        
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
  )}

  {/* User Status - Only show if user is logged in */}
  {user && (
    <div className="text-center">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto pb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">
            Welcome, {user.displayName || user.email}!
          </h2>
          <div className="flex items-center justify-center mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscriptionStatus === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {subscriptionStatus === 'active' ? 'Pro Member' : 'Free Plan'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
          >
            Back to Home
          </button>
          {subscriptionStatus === 'active' && (
            <button
              onClick={() => navigate('/success')}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105"
            >
              Manage Subscription
            </button>
          )}
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