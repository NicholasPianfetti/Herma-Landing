import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserSubscriptionStatus } from '../firebase/auth';
import { getSubscriptionStatus } from '../services/stripeService';

const PaywallContext = createContext();

export const usePaywall = () => {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error('usePaywall must be used within a PaywallProvider');
  }
  return context;
};

export const PaywallProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        await refreshSubscriptionStatus(user);
      } else {
        setSubscriptionStatus('free');
        setSubscriptionDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshSubscriptionStatus = async (currentUser = user) => {
    if (!currentUser) return;

    try {
      // Get status from Stripe backend (most up-to-date)
      const { data: stripeData } = await getSubscriptionStatus(currentUser.uid);
      
      if (stripeData) {
        setSubscriptionStatus(stripeData.status);
        setSubscriptionDetails(stripeData);
      } else {
        // Fallback to Firebase status
        const firebaseStatus = await getUserSubscriptionStatus(currentUser.uid);
        setSubscriptionStatus(firebaseStatus);
      }
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      // Fallback to Firebase status on error
      const firebaseStatus = await getUserSubscriptionStatus(currentUser.uid);
      setSubscriptionStatus(firebaseStatus);
    }
  };

  // Helper functions for feature access
  const hasAccess = (feature = 'basic') => {
    if (!user) return false;
    
    switch (feature) {
      case 'basic':
        return true; // Everyone has basic access
      case 'pro':
        return subscriptionStatus === 'active';
      case 'advanced_models':
        return subscriptionStatus === 'active';
      case 'unlimited_processing':
        return subscriptionStatus === 'active';
      case 'priority_support':
        return subscriptionStatus === 'active';
      default:
        return subscriptionStatus === 'active';
    }
  };

  const isPro = () => subscriptionStatus === 'active';
  const isFree = () => subscriptionStatus === 'free' || !subscriptionStatus;
  const isPaymentFailed = () => subscriptionStatus === 'payment_failed';

  const getFeatureLimit = (feature) => {
    if (!user) return 0;
    
    const limits = {
      free: {
        daily_messages: 50,
        document_size_mb: 10,
        monthly_processing_hours: 2
      },
      active: {
        daily_messages: -1, // unlimited
        document_size_mb: 100,
        monthly_processing_hours: -1 // unlimited
      }
    };

    return limits[subscriptionStatus] || limits.free;
  };

  const value = {
    // User and subscription state
    user,
    subscriptionStatus,
    subscriptionDetails,
    loading,
    
    // Helper functions
    hasAccess,
    isPro,
    isFree,
    isPaymentFailed,
    getFeatureLimit,
    refreshSubscriptionStatus,
    
    // Status checks
    isAuthenticated: !!user,
    canUseAdvancedModels: hasAccess('advanced_models'),
    canProcessUnlimitedDocuments: hasAccess('unlimited_processing'),
    hasPrioritySupport: hasAccess('priority_support')
  };

  return (
    <PaywallContext.Provider value={value}>
      {children}
    </PaywallContext.Provider>
  );
};

// HOC for protecting routes/components
export const withPaywall = (WrappedComponent, requiredFeature = 'pro') => {
  return function PaywallProtectedComponent(props) {
    const { hasAccess, loading } = usePaywall();

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!hasAccess(requiredFeature)) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Pro Feature Required</h3>
              <p className="text-yellow-700">This feature requires a Herma Pro subscription.</p>
              <button
                onClick={() => window.location.href = '/upgrade'}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};