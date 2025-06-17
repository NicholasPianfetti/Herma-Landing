// Stripe service for handling API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const createCheckoutSession = async (userId, userEmail, priceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userEmail,
        priceId,
        successUrl: `${window.location.origin}/upgrade?success=true`,
        cancelUrl: `${window.location.origin}/upgrade?canceled=true`
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const session = await response.json();
    return { session, error: null };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { session: null, error: error.message };
  }
};

export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/upgrade`
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const session = await response.json();
    return { session, error: null };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { session: null, error: error.message };
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscription-status/${userId}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return { data: null, error: error.message };
  }
};