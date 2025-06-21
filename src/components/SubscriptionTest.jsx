import React, { useState, useEffect } from 'react';
import { auth, checkProSubscription } from '../firebase';
import { createCheckoutSession } from '../stripe';

const SubscriptionTest = () => {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const proStatus = await checkProSubscription(user.uid);
          setIsPro(proStatus);
        } catch (err) {
          setError(err.message);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpgrade = async () => {
    try {
      await createCheckoutSession(user.uid);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Subscription Test</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {!user ? (
        <div className="text-center">
          <p className="mb-4">Please sign in to test subscription features</p>
        </div>
      ) : (
        <div>
          <p className="mb-2">Logged in as: {user.email}</p>
          <p className="mb-4">
            Subscription Status: 
            <span className={`ml-2 font-bold ${isPro ? 'text-green-600' : 'text-red-600'}`}>
              {isPro ? 'Pro' : 'Free'}
            </span>
          </p>
          
          {!isPro && (
            <button
              onClick={handleUpgrade}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionTest; 