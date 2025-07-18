// Subscription service for checking user subscription status
const FUNCTIONS_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/herma-landing-b5105/us-central1/api'
    : 'https://api-opcyvaprha-uc.a.run.app');

export interface SubscriptionData {
  status: 'active' | 'canceled' | 'payment_failed' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  customerId: string;
  subscriptionId: string;
  amount: number;
  nextBillingDate: string;
  currentPeriodEnd: string;
}

export const getSubscriptionStatus = async (userId: string): Promise<SubscriptionData | null> => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/subscription-status/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // User doesn't have a subscription
        return null;
      }
      throw new Error(`Failed to get subscription status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting subscription status:', error);
    // If there's an error, assume user doesn't have subscription
    return null;
  }
};

export const isProUser = async (userId: string): Promise<boolean> => {
  try {
    const subscriptionData = await getSubscriptionStatus(userId);
    return subscriptionData?.status === 'active';
  } catch (error) {
    console.error('Error checking if user is pro:', error);
    return false;
  }
};

export const createPortalSession = async (customerId: string): Promise<string> => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: 'herma://app', // Custom protocol for Electron app
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create portal session: ${response.status}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}; 