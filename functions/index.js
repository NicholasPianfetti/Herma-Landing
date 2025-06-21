const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Initialize Stripe with environment variable
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

const allowedOrigins = [
  "https://hermaai.com",
  "https://www.hermaai.com",
  "https://herma-landing-b5105.web.app",
  "https://herma-landing-b5105.firebaseapp.com",
  "http://localhost:3000"
];

// CORS configuration - this is the key fix
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// CRITICAL: Explicitly handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Raw body parser for Stripe webhooks (must be before express.json())
app.use("/webhook", express.raw({type: "application/json"}));

// JSON parser for other routes
app.use(express.json());

// Add explicit CORS headers middleware as backup
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, stripe-signature');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

/**
 * Health check endpoint
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    message: "Firebase Functions API is running"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
  });
});

/**
 * Create Stripe Checkout Session
 */
app.post("/create-checkout-session", async (req, res) => {
  try {
    const {userId, userEmail, priceId, successUrl, cancelUrl} = req.body;
    
    console.log("Creating checkout session for:", {
      userId,
      userEmail,
      priceId
    });

    // Validation
    if (!userId || !userEmail || !priceId) {
      return res.status(400).json({
        error: "Missing required fields: userId, userEmail, and priceId are required"
      });
    }

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log("Found existing customer:", customer.id);
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {userId}
      });
      console.log("Created new customer:", customer.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${process.env.APP_URL || 'https://hermaai.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'https://hermaai.com'}/cancel`,
      metadata: {
        userId
      }
    });

    console.log("Created checkout session:", session.id);
    res.json({id: session.id, url: session.url});
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message
    });
  }
});

/**
 * Create Stripe Customer Portal Session
 */
app.post("/create-portal-session", async (req, res) => {
  try {
    const {customerId, returnUrl} = req.body;

    if (!customerId) {
      return res.status(400).json({error: "Customer ID is required"});
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.APP_URL || 'https://hermaai.com'}`,
    });

    res.json({url: portalSession.url});
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * Get subscription status
 */
app.get("/subscription-status/:userId", async (req, res) => {
  try {
    const {userId} = req.params;

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userDoc.data();

    // If user has a Stripe customer ID, get subscription from Stripe
    if (userData.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripeCustomerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        return res.json({
          status: "active",
          customerId: userData.stripeCustomerId,
          subscriptionId: subscription.id,
          nextBillingDate: new Date(subscription.current_period_end * 1000).toLocaleDateString(),
          amount: subscription.items.data[0].price.unit_amount,
        });
      }
    }

    // Return Firebase status if no active Stripe subscription
    res.json({
      status: userData.subscriptionStatus || "free",
      customerId: userData.stripeCustomerId || null,
    });
  } catch (error) {
    console.error("Error getting subscription status:", error);
    res.status(500).json({error: error.message});
  }
});

/**
 * Stripe Webhook Handler
 * Causes error on stripe website, fix is at bottom of file
 */
// app.post("/webhook", async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     console.log("Received webhook event");
//     event = stripe.webhooks.constructEvent(
//       req.body, 
//       sig, 
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("Webhook event type:", event.type);
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       case "checkout.session.completed":
//         console.log("Processing checkout.session.completed event");
//         await handleCheckoutSessionCompleted(event.data.object);
//         break;

//       case "customer.subscription.created":
//       case "customer.subscription.updated":
//         console.log("Processing subscription event:", event.type);
//         await handleSubscriptionUpdated(event.data.object);
//         break;

//       case "customer.subscription.deleted":
//         console.log("Processing subscription deleted event");
//         await handleSubscriptionDeleted(event.data.object);
//         break;

//       case "invoice.payment_succeeded":
//         console.log("Processing payment succeeded event");
//         await handlePaymentSucceeded(event.data.object);
//         break;

//       case "invoice.payment_failed":
//         console.log("Processing payment failed event");
//         await handlePaymentFailed(event.data.object);
//         break;

//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     res.json({received: true});
//   } catch (error) {
//     console.error("Error processing webhook:", error);
//     res.status(500).json({error: error.message});
//   }
// });

// [Rest of your webhook handler functions remain the same]
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const customerId = session.customer;

  await db.collection("users").doc(userId).set({
    stripeCustomerId: customerId,
    subscriptionStatus: "active",
    isPro: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();
  
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: subscription.status,
      isPro: subscription.status === "active",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();
  
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "canceled",
      isPro: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();
  
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "active",
      isPro: true,
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();
  
  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "payment_failed",
      isPro: false,
      lastPaymentAttempt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

// Export the single Express app as the main API function
exports.api = functions.https.onRequest(app);

// [Keep your other exports as they were]
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const {priceId, successUrl, cancelUrl} = data;
  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;

  try {
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {userId}
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl || `${process.env.APP_URL || 'https://hermaai.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.APP_URL || 'https://hermaai.com'}/cancel`,
      metadata: {
        userId
      }
    });

    return {sessionId: session.id, url: session.url};
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
  }
});

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (allowedOrigins.includes(req.headers.origin)) {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body || req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({received: true});
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message
    });
  }
});

// Separate webhook function that handles raw body properly
exports.stripeWebhookHandler = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    console.log("Webhook received - raw body length:", req.rawBody ? req.rawBody.length : 'no rawBody');
    console.log("Body type:", typeof req.body);
    
    // Use req.rawBody (which Firebase provides) or req.body
    const payload = req.rawBody || req.body;
    
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log("✅ Webhook signature verified successfully");
    console.log("Event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log("🛒 Processing checkout.session.completed");
        await handleCheckoutSessionCompleted(event.data.object);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        console.log("📋 Processing subscription event:", event.type);
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        console.log("❌ Processing subscription deleted");
        await handleSubscriptionDeleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        console.log("💰 Processing payment succeeded");
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        console.log("💳 Processing payment failed");
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    console.log("✅ Webhook processed successfully");
    res.json({received: true, event_type: event.type});
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    res.status(500).json({
      error: 'Failed to process webhook',
      details: error.message,
      event_type: event.type
    });
  }
});