// src/services/stripeService.js

const FUNCTIONS_URL = process.env.REACT_APP_FUNCTIONS_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5001/herma-landing-b5105/us-central1/api'
    : 'https://api-opcyvaprha-uc.a.run.app');

const STRIPE_PRICE_ID = 'price_1Ra4P4Pq3xOWKbiJbjwxqQ8G'; // Replace with your actual price ID from Step 3

export const createCheckoutSession = async (user) => {
  try {
    console.log('Creating checkout session for user:', user.uid);
    console.log('Using functions URL:', FUNCTIONS_URL);
    
    const requestBody = {
      userId: user.uid,
      userEmail: user.email,
      priceId: STRIPE_PRICE_ID,
      successUrl: `${window.location.origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${window.location.origin}/#/cancel`,
    };
    
    console.log('Request body:', requestBody);

    const response = await fetch(`${FUNCTIONS_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response text:', errorText);
      throw new Error(`Failed to create checkout session: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Checkout session response:', data);

    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      return data;
    } else {
      throw new Error('No checkout URL returned from server');
    }
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/subscription-status/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get subscription status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
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

// Test function to verify API connectivity
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', `${FUNCTIONS_URL}/health`);
    const response = await fetch(`${FUNCTIONS_URL}/health`);
    const data = await response.json();
    console.log('Connection test result:', data);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};