import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to allow webhook processing
    const timer = setTimeout(() => {
      if (user) {
        checkSubscriptionStatus();
      }
    }, 2000);

    return () => clearTimeout(timer);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-green-700 mb-6">
          Thank you for subscribing to Herma Pro. Your payment has been processed successfully.
        </p>

        {loading ? (
          <div className="text-gray-600">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
            Updating your subscription status...
          </div>
        ) : (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Subscription Details:</h3>
            <div className="text-left space-y-1">
              <p><strong>Status:</strong> {subscriptionStatus?.status || 'Processing...'}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              {subscriptionStatus?.nextBillingDate && (
                <p><strong>Next Billing:</strong> {subscriptionStatus.nextBillingDate}</p>
              )}
              {subscriptionStatus?.amount && (
                <p><strong>Amount:</strong> ${(subscriptionStatus.amount / 100).toFixed(2)}/month</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/upgrade')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">What's Next?</h2>
        <div className="text-blue-700 space-y-2">
          <p>✅ Your pro features are now active</p>
          <p>✅ You can access advanced AI models</p>
          <p>✅ Unlimited usage is now available</p>
          <p>✅ You'll receive an email receipt shortly</p>
        </div>
      </div>

      {/* Troubleshooting */}
      {subscriptionStatus?.status !== 'active' && !loading && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Status Still Updating?</h3>
          <p className="text-yellow-700 text-sm mb-3">
            Sometimes it takes a few moments for the subscription to activate. 
            Stripe webhooks may need time to process.
          </p>
          <button
            onClick={checkSubscriptionStatus}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;