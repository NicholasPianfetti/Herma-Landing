import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

// Use environment variable for Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const TestUpgradePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [error, setError] = useState(null);

  // Check current subscription status
  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/subscription-status/${user.uid}`
      );
      const data = await response.json();
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      setError('Please sign in first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-checkout-session`, {
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

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscriptionStatus?.customerId) {
      setError('No customer ID found');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: subscriptionStatus.customerId,
          returnUrl: window.location.origin,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create portal session');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p>You need to be signed in to test the payment flow.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Test Payment Workflow</h1>
      
      {/* Current Status */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="space-y-2">
          <p><strong>User:</strong> {user.email}</p>
          <p><strong>Subscription:</strong> {subscriptionStatus?.status || 'Loading...'}</p>
          {subscriptionStatus?.nextBillingDate && (
            <p><strong>Next Billing:</strong> {subscriptionStatus.nextBillingDate}</p>
          )}
          {subscriptionStatus?.amount && (
            <p><strong>Amount:</strong> ${(subscriptionStatus.amount / 100).toFixed(2)}/month</p>
          )}
        </div>
        <button 
          onClick={checkSubscriptionStatus}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Status
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Subscription Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Subscribe Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-2xl font-bold mb-4">Herma Pro</h3>
          <div className="text-3xl font-bold mb-4">$29.99<span className="text-lg font-normal">/month</span></div>
          <ul className="space-y-2 mb-6">
            <li>✅ Advanced AI Models</li>
            <li>✅ Unlimited Usage</li>
            <li>✅ Priority Support</li>
            <li>✅ Custom Features</li>
          </ul>
          
          {subscriptionStatus?.status === 'active' ? (
            <div className="text-green-600 font-semibold text-center py-4">
              ✅ Already Subscribed!
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Start Monthly Subscription'}
            </button>
          )}
        </div>

        {/* Manage Subscription Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-2xl font-bold mb-4">Manage Subscription</h3>
          <p className="text-gray-600 mb-6">
            Update payment method, view invoices, or cancel subscription.
          </p>
          
          {subscriptionStatus?.customerId ? (
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? 'Opening...' : 'Customer Portal'}
            </button>
          ) : (
            <div className="text-gray-500 text-center py-4">
              Subscribe first to manage your subscription
            </div>
          )}
        </div>
      </div>

      {/* Test Information */}
      <div className="mt-8 bg-yellow-100 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🧪 Test Mode Information</h3>
        <p className="mb-2">Use these test card numbers in Stripe Checkout:</p>
        <div className="font-mono text-sm space-y-1">
          <div><strong>Success:</strong> 4242 4242 4242 4242</div>
          <div><strong>Decline:</strong> 4000 0000 0000 0002</div>
          <div><strong>Any future date for expiry, any 3-digit CVC</strong></div>
        </div>
      </div>

      {/* API Health Check */}
      <div className="mt-6 text-center">
        <a 
          href={`${process.env.REACT_APP_API_URL}/health`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          🔍 Check API Health Status
        </a>
      </div>
    </div>
  );
};

export default TestUpgradePage;