// backend/routes/subscriptions.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const emailService = require('../services/emailService');
const { verifyToken, verifyActiveSubscription, createRateLimiter } = require('../middleware/auth');
const { validateUserId, validateSubscriptionCancellation, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Rate limiting
const subscriptionRateLimit = createRateLimiter(15 * 60 * 1000, 20); // 20 requests per 15 minutes

/**
 * Get user's subscription status
 */
router.get('/:userId',
  subscriptionRateLimit,
  validateUserId,
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const subscriptions = await Subscription.findByUserId(userId);
      const activeSubscription = await Subscription.getActiveByUserId(userId);

      res.json({
        user: user.toJSON(),
        subscriptions: subscriptions.map(sub => sub.toJSON()),
        activeSubscription: activeSubscription ? activeSubscription.toJSON() : null,
        hasActiveSubscription: !!activeSubscription
      });

    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  }
);

/**
 * Cancel subscription
 */
router.post('/cancel',
  subscriptionRateLimit,
  validateSubscriptionCancellation,
  async (req, res) => {
    try {
      const { subscriptionId, userId, reason } = req.body;

      // Verify subscription belongs to user
      const subscription = await Subscription.findByStripeId(subscriptionId);
      if (!subscription || subscription.user_id !== userId) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Cancel in Stripe
      const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        metadata: {
          cancellation_reason: reason || 'User requested cancellation'
        }
      });

      // Update in database
      await subscription.cancel(true);

      // Get user for email
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendSubscriptionCancellationEmail(user, subscription);
      }

      // Track cancellation reason
      await trackCancellationReason(userId, reason);

      res.json({
        success: true,
        subscription: subscription.toJSON(),
        message: 'Subscription cancelled successfully. Access will continue until the end of your billing period.'
      });

    } catch (error) {
      console.error('Error cancelling subscription:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  }
);

/**
 * Reactivate cancelled subscription
 */
router.post('/reactivate',
  subscriptionRateLimit,
  async (req, res) => {
    try {
      const { subscriptionId, userId } = req.body;

      // Verify subscription belongs to user
      const subscription = await Subscription.findByStripeId(subscriptionId);
      if (!subscription || subscription.user_id !== userId) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Check if subscription can be reactivated
      if (!subscription.cancel_at_period_end) {
        return res.status(400).json({ error: 'Subscription is not scheduled for cancellation' });
      }

      // Reactivate in Stripe
      const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      // Update in database
      await subscription.reactivate();

      // Get user for email
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendSubscriptionConfirmation(user, subscription);
      }

      res.json({
        success: true,
        subscription: subscription.toJSON(),
        message: 'Subscription reactivated successfully'
      });

    } catch (error) {
      console.error('Error reactivating subscription:', error);
      res.status(500).json({ error: 'Failed to reactivate subscription' });
    }
  }
);

/**
 * Update payment method
 */
router.post('/update-payment-method',
  subscriptionRateLimit,
  async (req, res) => {
    try {
      const { subscriptionId, paymentMethodId, userId } = req.body;

      // Verify subscription belongs to user
      const subscription = await Subscription.findByStripeId(subscriptionId);
      if (!subscription || subscription.user_id !== userId) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      // Get user for customer ID
      const user = await User.findById(userId);
      if (!user || !user.stripe_customer_id) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripe_customer_id,
      });

      // Update default payment method
      await stripe.customers.update(user.stripe_customer_id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Update subscription's default payment method
      await stripe.subscriptions.update(subscriptionId, {
        default_payment_method: paymentMethodId,
      });

      res.json({
        success: true,
        message: 'Payment method updated successfully'
      });

    } catch (error) {
      console.error('Error updating payment method:', error);
      res.status(500).json({ error: 'Failed to update payment method' });
    }
  }
);

/**
 * Get subscription invoices
 */
router.get('/:userId/invoices',
  subscriptionRateLimit,
  validateUserId,
  validatePagination,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const user = await User.findById(userId);
      if (!user || !user.stripe_customer_id) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get invoices from Stripe
      const invoices = await stripe.invoices.list({
        customer: user.stripe_customer_id,
        limit: parseInt(limit),
        starting_after: page > 1 ? await getLastInvoiceId(user.stripe_customer_id, (page - 1) * limit) : undefined
      });

      res.json({
        invoices: invoices.data.map(invoice => ({
          id: invoice.id,
          amount_paid: invoice.amount_paid,
          amount_due: invoice.amount_due,
          currency: invoice.currency,
          status: invoice.status,
          created: invoice.created,
          invoice_pdf: invoice.invoice_pdf,
          hosted_invoice_url: invoice.hosted_invoice_url,
          period_start: invoice.period_start,
          period_end: invoice.period_end
        })),
        has_more: invoices.has_more,
        page: parseInt(page),
        limit: parseInt(limit)
      });

    } catch (error) {
      console.error('Error getting invoices:', error);
      res.status(500).json({ error: 'Failed to get invoices' });
    }
  }
);

/**
 * Get upcoming invoice preview
 */
router.get('/:userId/upcoming-invoice',
  subscriptionRateLimit,
  validateUserId,
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId);
      if (!user || !user.stripe_customer_id) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const activeSubscription = await Subscription.getActiveByUserId(userId);
      if (!activeSubscription) {
        return res.status(404).json({ error: 'No active subscription found' });
      }

      // Get upcoming invoice from Stripe
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: user.stripe_customer_id,
        subscription: activeSubscription.stripe_subscription_id
      });

      res.json({
        amount_due: upcomingInvoice.amount_due,
        currency: upcomingInvoice.currency,
        period_start: upcomingInvoice.period_start,
        period_end: upcomingInvoice.period_end,
        next_payment_attempt: upcomingInvoice.next_payment_attempt,
        lines: upcomingInvoice.lines.data.map(line => ({
          description: line.description,
          amount: line.amount,
          period: {
            start: line.period.start,
            end: line.period.end
          }
        }))
      });

    } catch (error) {
      console.error('Error getting upcoming invoice:', error);
      if (error.code === 'invoice_upcoming_none') {
        return res.json({ message: 'No upcoming invoice' });
      }
      res.status(500).json({ error: 'Failed to get upcoming invoice' });
    }
  }
);

/**
 * Get all subscriptions with filters (admin endpoint)
 */
router.get('/',
  validatePagination,
  async (req, res) => {
    try {
      const { page = 1, limit = 50, status, plan_type, user_id, expiring_soon } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (plan_type) filters.plan_type = plan_type;
      if (user_id) filters.user_id = user_id;
      if (expiring_soon === 'true') filters.expiring_soon = true;

      const result = await Subscription.findAll(parseInt(page), parseInt(limit), filters);
      res.json(result);

    } catch (error) {
      console.error('Error getting subscriptions:', error);
      res.status(500).json({ error: 'Failed to get subscriptions' });
    }
  }
);

/**
 * Get subscription statistics
 */
router.get('/stats/overview',
  async (req, res) => {
    try {
      const stats = await Subscription.getStatistics();
      res.json(stats);

    } catch (error) {
      console.error('Error getting subscription statistics:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }
);

/**
 * Get monthly revenue data
 */
router.get('/stats/revenue',
  async (req, res) => {
    try {
      const { months = 12 } = req.query;
      const revenue = await Subscription.getMonthlyRevenue(parseInt(months));
      res.json(revenue);

    } catch (error) {
      console.error('Error getting revenue data:', error);
      res.status(500).json({ error: 'Failed to get revenue data' });
    }
  }
);

/**
 * Get expiring subscriptions
 */
router.get('/expiring/:days?',
  async (req, res) => {
    try {
      const { days = 7 } = req.params;
      const expiring = await Subscription.getExpiring(parseInt(days));
      res.json(expiring);

    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      res.status(500).json({ error: 'Failed to get expiring subscriptions' });
    }
  }
);

/**
 * Send expiring subscription notifications
 */
router.post('/notify-expiring',
  async (req, res) => {
    try {
      const { days = 7 } = req.body;
      const expiring = await Subscription.getExpiring(days);
      
      const results = [];
      for (const sub of expiring) {
        try {
          const user = await User.findById(sub.user_id);
          if (user) {
            await emailService.sendSubscriptionExpiringEmail(user, sub);
            results.push({ success: true, email: user.email });
          }
        } catch (error) {
          results.push({ success: false, email: sub.email, error: error.message });
        }
      }

      res.json({
        success: true,
        notified: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      });

    } catch (error) {
      console.error('Error sending expiring notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  }
);

/**
 * Get subscription by Stripe ID
 */
router.get('/stripe/:stripeId',
  async (req, res) => {
    try {
      const { stripeId } = req.params;
      
      const subscription = await Subscription.findByStripeId(stripeId);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      const subscriptionWithUser = await subscription.getWithUser();
      res.json(subscriptionWithUser);

    } catch (error) {
      console.error('Error getting subscription by Stripe ID:', error);
      res.status(500).json({ error: 'Failed to get subscription' });
    }
  }
);

/**
 * Update subscription metadata
 */
router.patch('/:subscriptionId/metadata',
  async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { metadata } = req.body;

      // Update in Stripe
      const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        metadata
      });

      res.json({
        success: true,
        metadata: stripeSubscription.metadata
      });

    } catch (error) {
      console.error('Error updating subscription metadata:', error);
      res.status(500).json({ error: 'Failed to update metadata' });
    }
  }
);

/**
 * Helper function to track cancellation reasons
 */
async function trackCancellationReason(userId, reason) {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    await pool.query(
      `INSERT INTO cancellation_reasons (user_id, reason, created_at)
       VALUES ($1, $2, $3)`,
      [userId, reason, new Date()]
    );
  } catch (error) {
    console.error('Error tracking cancellation reason:', error);
  }
}

/**
 * Helper function to get last invoice ID for pagination
 */
async function getLastInvoiceId(customerId, offset) {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 1,
      starting_after: undefined
    });
    
    // This is a simplified implementation
    // In a real scenario, you'd need to implement proper pagination
    return null;
  } catch (error) {
    console.error('Error getting last invoice ID:', error);
    return null;
  }
}

module.exports = router;