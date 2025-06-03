// backend/server.js - Express.js server setup
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

// Database setup (use your preferred database)
// This example uses a simple in-memory store for demo purposes
// In production, use PostgreSQL, MongoDB, etc.
const users = new Map();
const subscriptions = new Map();

// Webhook endpoint for Stripe (for production use)
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      // Update user subscription status
      handleSuccessfulPayment(paymentIntent);
      break;
    case 'invoice.payment_failed':
      const invoice = event.data.object;
      console.log('Invoice payment failed');
      handleFailedPayment(invoice);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { email, platform } = req.body;
    
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        platform: platform
      }
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: process.env.STRIPE_PRICE_ID, // Your Stripe price ID for $9.99/month
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    // Store user data
    const userId = uuidv4();
    users.set(userId, {
      id: userId,
      email: email,
      stripeCustomerId: customer.id,
      platform: platform,
      createdAt: new Date().toISOString()
    });

    subscriptions.set(subscription.id, {
      userId: userId,
      subscriptionId: subscription.id,
      status: 'incomplete',
      plan: 'pro',
      platform: platform
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      userId: userId
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm subscription after payment
app.post('/confirm-subscription', async (req, res) => {
  try {
    const { subscriptionId, userId } = req.body;
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.status === 'active') {
      // Update subscription status
      subscriptions.set(subscriptionId, {
        ...subscriptions.get(subscriptionId),
        status: 'active'
      });

      // Generate download token
      const downloadToken = generateDownloadToken(userId);
      
      res.json({
        success: true,
        downloadToken: downloadToken,
        subscription: subscription
      });
    } else {
      res.status(400).json({ error: 'Subscription not active' });
    }
  } catch (error) {
    console.error('Error confirming subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify download token and provide download URL
app.get('/download/:platform/:token', async (req, res) => {
  try {
    const { platform, token } = req.params;
    
    // Verify token
    const userId = verifyDownloadToken(token);
    if (!userId) {
      return res.status(401).json({ error: 'Invalid download token' });
    }

    // Check if user has active subscription
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate secure download URL (temporary URL valid for 1 hour)
    const downloadUrl = await generateSecureDownloadUrl(platform, userId);
    
    res.json({
      downloadUrl: downloadUrl,
      expiresIn: 3600 // 1 hour
    });
  } catch (error) {
    console.error('Error providing download:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user subscription status
app.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = users.get(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get active subscriptions for user
    const userSubscriptions = Array.from(subscriptions.values()).filter(
      sub => sub.userId === userId && sub.status === 'active'
    );

    res.json({
      user: user,
      subscriptions: userSubscriptions
    });
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
app.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId, userId } = req.body;
    
    // Verify user owns subscription
    const subscription = subscriptions.get(subscriptionId);
    if (!subscription || subscription.userId !== userId) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Cancel in Stripe
    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
    
    // Update local record
    subscriptions.set(subscriptionId, {
      ...subscription,
      status: 'canceled',
      canceledAt: new Date().toISOString()
    });

    res.json({
      success: true,
      subscription: canceledSubscription
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function handleSuccessfulPayment(paymentIntent) {
  // Update subscription status in database
  console.log('Processing successful payment:', paymentIntent.id);
  // Implement your success logic here
}

function handleFailedPayment(invoice) {
  // Handle failed payment (send email, update status, etc.)
  console.log('Processing failed payment:', invoice.id);
  // Implement your failure logic here
}

function generateDownloadToken(userId) {
  // Generate a secure token for download access
  // In production, use proper JWT or similar
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  // Store token with expiration (use Redis in production)
  const tokenData = {
    userId: userId,
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
  };
  
  // Store in temporary cache (use Redis in production)
  global.downloadTokens = global.downloadTokens || new Map();
  global.downloadTokens.set(token, tokenData);
  
  return token;
}

function verifyDownloadToken(token) {
  global.downloadTokens = global.downloadTokens || new Map();
  const tokenData = global.downloadTokens.get(token);
  
  if (!tokenData || tokenData.expiresAt < Date.now()) {
    return null;
  }
  
  return tokenData.userId;
}

async function generateSecureDownloadUrl(platform, userId) {
  // Generate a pre-signed URL or secure download link
  // This could be to your file storage (AWS S3, Google Cloud Storage, etc.)
  
  const baseUrls = {
    windows: process.env.WINDOWS_DOWNLOAD_BASE_URL || 'https://github.com/USER/HERMA-PAID/releases/download/v0.1.0/Herma-Pro-0.1.0.msi',
    mac: process.env.MAC_DOWNLOAD_BASE_URL || 'https://github.com/USER/HERMA-PAID/releases/download/v0.1.0/Herma-Pro-0.1.0.dmg'
  };
  
  // For GitHub releases, you might want to use a proxy endpoint
  // to track downloads and ensure only paying users can access
  return baseUrls[platform];
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// backend/package.json - Dependencies
/*
{
  "name": "herma-backend",
  "version": "1.0.0",
  "description": "Backend for Herma app payments and downloads",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "stripe": "^12.9.0",
    "uuid": "^9.0.0",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
*/

// .env - Environment variables
/*
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID=price_your_price_id_for_999_monthly
WINDOWS_DOWNLOAD_BASE_URL=https://github.com/USER/HERMA-PAID/releases/download/v0.1.0/Herma-Pro-0.1.0.msi
MAC_DOWNLOAD_BASE_URL=https://github.com/USER/HERMA-PAID/releases/download/v0.1.0/Herma-Pro-0.1.0.dmg
DATABASE_URL=your_database_connection_string
NODE_ENV=development
PORT=3001
*/