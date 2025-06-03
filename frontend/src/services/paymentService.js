// frontend/src/services/paymentService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class PaymentService {
  
  /**
   * Create a payment intent for the subscription
   * @param {Object} paymentData - User payment information
   * @returns {Promise<Object>} Payment intent response
   */
  async createPaymentIntent(paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          platform: paymentData.platform,
          name: paymentData.name,
          country: paymentData.country,
          postal_code: paymentData.postal_code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.message || 'Failed to create payment intent');
    }
  }

  /**
   * Confirm subscription after successful payment
   * @param {string} subscriptionId - Stripe subscription ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Confirmation response
   */
  async confirmSubscription(subscriptionId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/confirm-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming subscription:', error);
      throw new Error(error.message || 'Failed to confirm subscription');
    }
  }

  /**
   * Get secure download URL
   * @param {string} platform - Platform (windows/mac)
   * @param {string} token - Download token
   * @returns {Promise<Object>} Download URL response
   */
  async getDownloadUrl(platform, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/downloads/${platform}/${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw new Error(error.message || 'Failed to get download URL');
    }
  }

  /**
   * Get user subscription status
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Subscription data
   */
  async getSubscriptionStatus(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting subscription status:', error);
      throw new Error(error.message || 'Failed to get subscription status');
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID to cancel
   * @param {string} userId - User ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancellation response
   */
  async cancelSubscription(subscriptionId, userId, reason = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          userId,
          reason
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.message || 'Failed to cancel subscription');
    }
  }

  /**
   * Reactivate cancelled subscription
   * @param {string} subscriptionId - Subscription ID to reactivate
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Reactivation response
   */
  async reactivateSubscription(subscriptionId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw new Error(error.message || 'Failed to reactivate subscription');
    }
  }

  /**
   * Update payment method
   * @param {string} subscriptionId - Subscription ID
   * @param {string} paymentMethodId - New payment method ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Update response
   */
  async updatePaymentMethod(subscriptionId, paymentMethodId, userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/update-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          paymentMethodId,
          userId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw new Error(error.message || 'Failed to update payment method');
    }
  }

  /**
   * Get user's invoices
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Invoices response
   */
  async getInvoices(userId, page = 1, limit = 20) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/invoices?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw new Error(error.message || 'Failed to get invoices');
    }
  }

  /**
   * Get upcoming invoice
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Upcoming invoice response
   */
  async getUpcomingInvoice(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/subscriptions/${userId}/upcoming-invoice`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting upcoming invoice:', error);
      throw new Error(error.message || 'Failed to get upcoming invoice');
    }
  }

  /**
   * Generate new download token
   * @param {string} userId - User ID
   * @param {string} platform - Platform (windows/mac)
   * @returns {Promise<Object>} Token response
   */
  async generateDownloadToken(userId, platform) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/downloads/generate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          platform
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating download token:', error);
      throw new Error(error.message || 'Failed to generate download token');
    }
  }

  /**
   * Get download history
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Download history response
   */
  async getDownloadHistory(userId, page = 1, limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/downloads/history/${userId}?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting download history:', error);
      throw new Error(error.message || 'Failed to get download history');
    }
  }

  /**
   * Check download eligibility
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Eligibility response
   */
  async checkDownloadEligibility(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/downloads/eligibility/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking download eligibility:', error);
      throw new Error(error.message || 'Failed to check download eligibility');
    }
  }

  /**
   * Retry failed payment
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Retry response
   */
  async retryPayment(subscriptionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/retry-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error retrying payment:', error);
      throw new Error(error.message || 'Failed to retry payment');
    }
  }

  /**
   * Check download token status
   * @param {string} token - Download token
   * @returns {Promise<Object>} Token status response
   */
  async checkTokenStatus(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/downloads/token/${token}/status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking token status:', error);
      throw new Error(error.message || 'Failed to check token status');
    }
  }

  /**
   * Process payment using Stripe Elements
   * @param {Object} stripe - Stripe instance
   * @param {Object} elements - Stripe elements
   * @param {string} clientSecret - Payment intent client secret
   * @param {Object} billingDetails - Billing information
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(stripe, elements, clientSecret, billingDetails) {
    try {
      const cardElement = elements.getElement('card');
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { paymentIntent, error: null };
    } catch (error) {
      console.error('Payment processing error:', error);
      return { paymentIntent: null, error: error.message };
    }
  }

  /**
   * Handle API errors consistently
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} Parsed response or throws error
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  }

  /**
   * Get payment history
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Payment history response
   */
  async getPaymentHistory(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/history/${userId}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw new Error(error.message || 'Failed to get payment history');
    }
  }
}

export default new PaymentService();