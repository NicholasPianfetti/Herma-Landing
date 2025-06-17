import React, { useState, useEffect } from 'react';
import stripePromise from '../stripe/config';
import { createCheckoutSession, createPortalSession, getSubscriptionStatus } from '../services/stripeService';

const SubscriptionManager = ({ user, subscriptionStatus, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  // Monthly subscription price - replace with your actual Stripe Price ID
  const MONTHLY_PRICE_ID = process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID;

  useEffect(() => {
    if (user && subscriptionStatus === 'active') {
      fetchSubscriptionDetails();
    }
  }, [user, subscriptionStatus]);

  const fetchSubscriptionDetails = async () => {
    const { data } = await getSubscriptionStatus(user.uid);
    if (data) {
      setSubscriptionDetails(data);
    }
  };

  const handleSubscribe = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // Create Stripe checkout session
      const { session, error: sessionError } = await createCheckoutSession(
        user.uid,
        user.email,
        MONTHLY_PRICE_ID
      );

      if (sessionError) {
        setError(sessionError);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  const handleManageSubscription = async () => {
    if (!subscriptionDetails?.customerId) return;

    setLoading(true);
    setError('');

    try {
      const { session, error: portalError } = await createPortalSession(
        subscriptionDetails.customerId
      );

      if (portalError) {
        setError(portalError);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Customer Portal
      window.location.href = session.url;
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (subscriptionStatus === 'active') {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border border-green-200 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">
            🎉 You're subscribed to Herma Pro!
          </h3>
          <div className="flex items-center justify-center mb-4">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Active Subscription
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-green-900 mb-3">Pro Features Unlocked:</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Advanced AI Models
            </div>
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited Processing Power
            </div>
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Priority Support
            </div>
            <div className="flex items-center text-green-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Enhanced Document Analysis
            </div>
          </div>
        </div>

        {subscriptionDetails && (
          <div className="text-center text-sm text-gray-600 mb-6">
            <p>Next billing date: {subscriptionDetails.nextBillingDate}</p>
            <p>Amount: ${subscriptionDetails.amount / 100}/month</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleManageSubscription}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-blue-900 mb-4">
          Upgrade to Herma Pro
        </h3>
        <p className="text-lg text-blue-600 mb-6">
          Unlock the full potential of your private AI assistant
        </p>
      </div>

      {/* Pricing Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-blue-900 mb-2">$29.99</div>
          <div className="text-blue-600 mb-4">per month</div>
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <span className="mr-1">🔥</span> Most Popular
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Advanced AI models (GPT-4 level performance)
          </div>
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Unlimited conversations and document processing
          </div>
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Enhanced document analysis and summarization
          </div>
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Priority customer support
          </div>
          <div className="flex items-center text-blue-700">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Cancel anytime, no commitments
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading || !MONTHLY_PRICE_ID}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Processing...' : 'Start Monthly Subscription'}
        </button>

        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Secure payment powered by Stripe. Your data stays private and on your device.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-blue-600">
          Questions? <a href="mailto:support@herma.ai" className="underline hover:text-blue-800">Contact our support team</a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionManager;