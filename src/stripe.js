import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const FUNCTIONS_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5001/herma-landing-b5105/us-central1/api'
  : 'https://herma-landing-b5105.web.app';
// Function to create a checkout session
// export const createCheckoutSession = async (userId) => {
//   try {
//     // Use the correct Firebase Functions URL for your project
//     const functionsUrl = 'https://us-central1-herma-landing-b5105.cloudfunctions.net';
//     console.log('Attempting to create checkout session for user:', userId);
    
//     const response = await fetch(`${functionsUrl}/createCheckoutSession`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         userId,
//       }),
//     });

//     console.log('Response status:', response.status);
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error('Error response:', errorData);
//       throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
//     }

//     const session = await response.json();
//     console.log('Checkout session created:', session);
    
//     // Redirect to Stripe Checkout
//     const stripe = await stripePromise;
//     const { error } = await stripe.redirectToCheckout({
//       sessionId: session.id,
//     });

//     if (error) {
//       console.error('Stripe redirect error:', error);
//       throw error;
//     }
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     throw error;
//   }
// };
export const createCheckoutSession = async (userId, userEmail, priceId) => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          priceId,
          successUrl: `${window.location.origin}/#/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/#/cancel`,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
  
      const { id, url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
      
      return { sessionId: id, url };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  };
  
  export const getSubscriptionStatus = async (userId) => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/subscription-status/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to get subscription status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw error;
    }
  };
  
  export const createPortalSession = async (customerId) => {
    try {
      const response = await fetch(`${FUNCTIONS_BASE_URL}/create-portal-session`, {
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
        throw new Error('Failed to create portal session');
      }
  
      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  };
export default stripePromise; 