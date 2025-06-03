// backend/routes/payments.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const emailService = require('../services/emailService');
const { validatePaymentIntent, validateSubscriptionConfirmation } = require('../middleware/validation');
const { createRateLimiter } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Rate limiting for payment endpoints
const paymentRateLimit = createRateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes

/**
 * Create payment intent for subscription
 */
router.post('/create-payment-intent', 
  paymentRateLimit,
  validatePaymentIntent,
  async (req, res) => {
    try {
      const { email, platform, name, country, postal_code } = req.body;

      // Check if user already exists
      let user = await User.findByEmail(email);
      
      // Create or update Stripe customer
      let customer;
      if (user && user.stripe_customer_id) {
        customer = await stripe.customers.retrieve(user.stripe_customer_id);
      } else {
        customer = await stripe.customers.create({
          email: email,
          name: name,
          metadata: {
            platform: platform,
            country: country
          }
        });
      }

      // Create or update user in database
      if (!user) {
        user = await User.create({
          email,
          full_name: name,
          platform,
          country,
          postal_code,
          stripe_customer_id: customer.id
        });
      } else if (!user.stripe_customer_id) {
        await user.update({ stripe_customer_id: customer.id });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Store subscription in database
      await Subscription.create({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_price_id: process.env.STRIPE_PRICE_ID,
        status: 'incomplete',
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });

      // Track payment attempt
      await trackPaymentAttempt(email, platform, 999, 'pending', subscription.latest_invoice.payment_intent.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        userId: user.id
      });

    } catch (error) {
      console.error('Error creating payment intent:', error);
      
      // Track failed payment attempt
      if (req.body.email) {
        await trackPaymentAttempt(req.body.email, req.body.platform, 999, 'failed', null, error.message);
      }

      res.status(500).json({ 
        error: 'Failed to create payment intent',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * Confirm subscription after successful payment
 */
router.post('/confirm-subscription',
  paymentRateLimit,
  validateSubscriptionConfirmation,
  async (req, res) => {
    try {
      const { subscriptionId, userId } = req.body;

      // Retrieve subscription from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      if (stripeSubscription.status !== 'active') {
        return res.status(400).json({ 
          error: 'Subscription is not active',
          status: stripeSubscription.status
        });
      }

      // Update subscription in database
      const subscription = await Subscription.findByStripeId(subscriptionId);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }

      await subscription.update({
        status: 'active',
        current_period_start: new Date(stripeSubscription.current_period_start * 1000),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000)
      });

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate download token
      const { generateDownloadToken } = require('../middleware/auth');
      const downloadToken = await generateDownloadToken(userId, user.platform);

      // Send confirmation email
      try {
        await emailService.sendSubscriptionConfirmation(user, subscription);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the request if email fails
      }

      // Track successful payment
      await trackPaymentAttempt(user.email, user.platform, 999, 'succeeded', stripeSubscription.latest_invoice.payment_intent);

      res.json({
        success: true,
        downloadToken: downloadToken.token,
        subscription: subscription.toJSON()
      });

    } catch (error) {
      console.error('Error confirming subscription:', error);
      res.status(500).json({ 
        error: 'Failed to confirm subscription',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * Handle Stripe webhooks
 */
router.post('/webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      await handleStripeWebhook(event);
      res.json({received: true});
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Webhook handler failed' });
    }
  }
);

/**
 * Get payment history for user
 */
router.get('/history/:userId',
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const history = await user.getPaymentHistory();
      res.json({ history });

    } catch (error) {
      console.error('Error getting payment history:', error);
      res.status(500).json({ error: 'Failed to get payment history' });
    }
  }
);

/**
 * Retry failed payment
 */
router.post('/retry-payment',
  paymentRateLimit,
  async (req, res) => {
    try {
      const { subscriptionId } = req.body;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const invoice = await stripe.invoices.retrieve(subscription.latest_invoice);

      if (invoice.status === 'paid') {
        return res.json({ success: true, message: 'Payment already completed' });
      }

      // Retry the payment
      const paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent);
      
      res.json({
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status
      });

    } catch (error) {
      console.error('Error retrying payment:', error);
      res.status(500).json({ error: 'Failed to retry payment' });
    }
  }
);

/**
 * Handle Stripe webhook events
 */
async function handleStripeWebhook(event) {
  // Store webhook event
  await storeWebhookEvent(event);

  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
      
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
      
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Handle subscription created webhook
 */
async function handleSubscriptionCreated(subscription) {
  try {
    const user = await User.findByStripeCustomerId(subscription.customer);
    if (!user) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    // Subscription should already exist from payment intent, just update status
    const dbSubscription = await Subscription.findByStripeId(subscription.id);
    if (dbSubscription) {
      await dbSubscription.update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });
    }
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

/**
 * Handle subscription updated webhook
 */
async function handleSubscriptionUpdated(subscription) {
  try {
    const dbSubscription = await Subscription.findByStripeId(subscription.id);
    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    await dbSubscription.update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
    });

    // Send email notifications based on status
    const user = await User.findById(dbSubscription.user_id);
    if (user) {
      if (subscription.status === 'active' && subscription.cancel_at_period_end) {
        await emailService.sendSubscriptionCancellationEmail(user, dbSubscription);
      }
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

/**
 * Handle subscription deleted webhook
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    const dbSubscription = await Subscription.findByStripeId(subscription.id);
    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    await dbSubscription.update({
      status: 'canceled',
      canceled_at: new Date()
    });

    const user = await User.findById(dbSubscription.user_id);
    if (user) {
      await emailService.sendSubscriptionCancellationEmail(user, dbSubscription);
    }
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

/**
 * Handle payment succeeded webhook
 */
async function handlePaymentSucceeded(invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const user = await User.findByStripeCustomerId(subscription.customer);
      
      if (user) {
        await trackPaymentAttempt(user.email, user.platform, invoice.amount_paid, 'succeeded', invoice.payment_intent);
        
        // Send receipt email
        await emailService.sendSubscriptionConfirmation(user, { current_period_end: subscription.current_period_end });
      }
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

/**
 * Handle payment failed webhook
 */
async function handlePaymentFailed(invoice) {
  try {
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      const user = await User.findByStripeCustomerId(subscription.customer);
      
      if (user) {
        await trackPaymentAttempt(user.email, user.platform, invoice.amount_due, 'failed', invoice.payment_intent, 'Payment failed');
        
        const dbSubscription = await Subscription.findByStripeId(subscription.id);
        if (dbSubscription) {
          await emailService.sendPaymentFailedEmail(user, dbSubscription);
        }
      }
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

/**
 * Handle payment intent succeeded webhook
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Additional processing if needed
    console.log('Payment intent succeeded:', paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

/**
 * Track payment attempt in database
 */
async function trackPaymentAttempt(email, platform, amountCents, status, stripePaymentIntentId, failureReason = null) {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    await pool.query(
      `INSERT INTO payment_attempts (email, platform, amount_cents, status, stripe_payment_intent_id, failure_reason, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [email, platform, amountCents, status, stripePaymentIntentId, failureReason, new Date()]
    );
  } catch (error) {
    console.error('Error tracking payment attempt:', error);
  }
}

/**
 * Store webhook event for debugging
 */
async function storeWebhookEvent(event) {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    await pool.query(
      `INSERT INTO webhook_events (stripe_event_id, event_type, data, processed_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (stripe_event_id) DO NOTHING`,
      [event.id, event.type, event, new Date()]
    );
  } catch (error) {
    console.error('Error storing webhook event:', error);
  }
}

module.exports = router;