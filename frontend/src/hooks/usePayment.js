// frontend/src/hooks/usePayment.js
import { useState, useCallback } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../services/paymentService';
import ReactGA from 'react-ga4';

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  /**
   * Process subscription payment
   * @param {Object} paymentData - Payment form data
   * @returns {Promise<Object>} Payment result
   */
  const processSubscription = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe has not loaded yet');
      }

      // Track payment attempt
      ReactGA.event({
        category: 'Payment',
        action: 'ProcessSubscription',
        label: paymentData.platform,
        value: 999 // $9.99 in cents
      });

      // Step 1: Create payment intent
      const { subscriptionId, clientSecret, userId } = await paymentService.createPaymentIntent(paymentData);

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement('card');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: paymentData.name,
            email: paymentData.email,
            address: {
              country: paymentData.country,
              postal_code: paymentData.postal_code
            }
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment was not successful');
      }

      // Step 3: Confirm subscription on our backend
      const confirmationResult = await paymentService.confirmSubscription(subscriptionId, userId);

      // Track successful payment
      ReactGA.event({
        category: 'Payment',
        action: 'PaymentSuccess',
        label: paymentData.platform,
        value: 999
      });

      // Track conversion
      ReactGA.event({
        category: 'Conversion',
        action: 'Purchase',
        label: 'Herma Pro',
        value: 999
      });

      setSuccess(true);
      setLoading(false);

      return {
        success: true,
        userId,
        subscriptionId,
        downloadToken: confirmationResult.downloadToken,
        paymentIntent
      };

    } catch (err) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      setLoading(false);

      // Track payment failure
      ReactGA.event({
        category: 'Payment',
        action: 'PaymentFailed',
        label: paymentData?.platform || 'unknown',
        value: 999
      });

      return { success: false, error: errorMessage };
    }
  }, [stripe, elements]);

  /**
   * Update payment method for existing subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Update result
   */
  const updatePaymentMethod = useCallback(async (subscriptionId, userId) => {
    setLoading(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe has not loaded yet');
      }

      // Create payment method
      const cardElement = elements.getElement('card');
      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if (createError) {
        throw new Error(createError.message);
      }

      // Update subscription with new payment method
      await paymentService.updatePaymentMethod(subscriptionId, paymentMethod.id, userId);

      // Track successful update
      ReactGA.event({
        category: 'Account',
        action: 'UpdatePaymentMethod',
        label: 'Success'
      });

      setSuccess(true);
      setLoading(false);

      return { success: true };

    } catch (err) {
      const errorMessage = err.message || 'Failed to update payment method';
      setError(errorMessage);
      setLoading(false);

      // Track update failure
      ReactGA.event({
        category: 'Account',
        action: 'UpdatePaymentMethod',
        label: 'Failed'
      });

      return { success: false, error: errorMessage };
    }
  }, [stripe, elements]);

  /**
   * Retry failed payment
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Retry result
   */
  const retryPayment = useCallback(async (subscriptionId) => {
    setLoading(true);
    setError(null);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe has not loaded yet');
      }

      // Get payment intent for retry
      const { clientSecret } = await paymentService.retryPayment(subscriptionId);

      // Confirm payment
      const cardElement = elements.getElement('card');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment retry was not successful');
      }

      // Track successful retry
      ReactGA.event({
        category: 'Payment',
        action: 'RetrySuccess',
        label: subscriptionId
      });

      setSuccess(true);
      setLoading(false);

      return { success: true, paymentIntent };

    } catch (err) {
      const errorMessage = err.message || 'Payment retry failed';
      setError(errorMessage);
      setLoading(false);

      // Track retry failure
      ReactGA.event({
        category: 'Payment',
        action: 'RetryFailed',
        label: subscriptionId
      });

      return { success: false, error: errorMessage };
    }
  }, [stripe, elements]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear success state
   */
  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  /**
   * Reset all states
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    // State
    loading,
    error,
    success,
    
    // Actions
    processSubscription,
    updatePaymentMethod,
    retryPayment,
    
    // Utilities
    clearError,
    clearSuccess,
    reset,
    
    // Stripe availability
    stripeLoaded: !!(stripe && elements)
  };
};

/**
 * Hook for subscription management
 */
export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {string} userId - User ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation result
   */
  const cancelSubscription = useCallback(async (subscriptionId, userId, reason = '') => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.cancelSubscription(subscriptionId, userId, reason);

      // Track cancellation
      ReactGA.event({
        category: 'Subscription',
        action: 'Cancel',
        label: reason || 'No reason provided'
      });

      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to cancel subscription';
      setError(errorMessage);
      setLoading(false);

      // Track cancellation failure
      ReactGA.event({
        category: 'Subscription',
        action: 'CancelFailed',
        label: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Reactivate subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reactivation result
   */
  const reactivateSubscription = useCallback(async (subscriptionId, userId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.reactivateSubscription(subscriptionId, userId);

      // Track reactivation
      ReactGA.event({
        category: 'Subscription',
        action: 'Reactivate',
        label: subscriptionId
      });

      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to reactivate subscription';
      setError(errorMessage);
      setLoading(false);

      // Track reactivation failure
      ReactGA.event({
        category: 'Subscription',
        action: 'ReactivateFailed',
        label: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get subscription status
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Subscription status
   */
  const getSubscriptionStatus = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getSubscriptionStatus(userId);
      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to get subscription status';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    cancelSubscription,
    reactivateSubscription,
    getSubscriptionStatus,
    
    // Utilities
    clearError
  };
};

/**
 * Hook for download management
 */
export const useDownloads = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate download token
   * @param {string} userId - User ID
   * @param {string} platform - Platform (windows/mac)
   * @returns {Promise<Object>} Token generation result
   */
  const generateDownloadToken = useCallback(async (userId, platform) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.generateDownloadToken(userId, platform);

      // Track token generation
      ReactGA.event({
        category: 'Download',
        action: 'GenerateToken',
        label: platform
      });

      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to generate download token';
      setError(errorMessage);
      setLoading(false);

      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Check download eligibility
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Eligibility result
   */
  const checkEligibility = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.checkDownloadEligibility(userId);
      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to check download eligibility';
      setError(errorMessage);
      setLoading(false);
      return { eligible: false, error: errorMessage };
    }
  }, []);

  /**
   * Get download history
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Download history
   */
  const getDownloadHistory = useCallback(async (userId, page = 1, limit = 50) => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentService.getDownloadHistory(userId, page, limit);
      setLoading(false);
      return result;

    } catch (err) {
      const errorMessage = err.message || 'Failed to get download history';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    generateDownloadToken,
    checkEligibility,
    getDownloadHistory,
    
    // Utilities
    clearError
  };
};