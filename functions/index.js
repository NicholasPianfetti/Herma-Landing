/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:3001",
    "https://hermaai.com",
    "https://www.hermaai.com",
    "https://herma-landing-b5105.web.app/",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Raw body parser for Stripe webhooks
app.use("/webhook", express.raw({ type: "application/json" }));

// JSON parser for other routes
app.use(express.json());

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * Create Stripe Checkout Session
 */
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { userId, userEmail, priceId, successUrl, cancelUrl } = req.body;
    console.log("Creating checkout session for:", {
      userId,
      userEmail,
      priceId,
    });

    // Create or retrieve customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log("Found existing customer:", customer.id);
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
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
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    console.log("Created checkout session:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create Stripe Customer Portal Session
 */
app.post("/create-portal-session", async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get subscription status
 */
app.get("/subscription-status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
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
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stripe Webhook Handler
 */
app.post("/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    console.log("Received webhook event");
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Webhook event type:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
    case "checkout.session.completed":
      console.log("Processing checkout.session.completed event");
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      console.log("Processing subscription event:", event.type);
      await handleSubscriptionUpdated(event.data.object);
      break;

    case "customer.subscription.deleted":
      console.log("Processing subscription deleted event");
      await handleSubscriptionDeleted(event.data.object);
      break;

    case "invoice.payment_succeeded":
      console.log("Processing payment succeeded event");
      await handlePaymentSucceeded(event.data.object);
      break;

    case "invoice.payment_failed":
      console.log("Processing payment failed event");
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle checkout session completed
 * @param {object} session - Stripe session object
 */
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const customerId = session.customer;

  // Update user document in Firestore
  await db.collection("users").doc(userId).update({
    stripeCustomerId: customerId,
    subscriptionStatus: "active",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Handle subscription updated
 * @param {object} subscription - Stripe subscription object
 */
async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: subscription.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Handle subscription deleted
 * @param {object} subscription - Stripe subscription object
 */
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "canceled",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Handle payment succeeded
 * @param {object} invoice - Stripe invoice object
 */
async function handlePaymentSucceeded(invoice) {
  const customerId = invoice.customer;

  // Find user by Stripe customer ID
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "active",
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

/**
 * Handle payment failed
 * @param {object} invoice - Stripe invoice object
 */
async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer;

  // Find user by Stripe customer ID
  const usersRef = db.collection("users");
  const snapshot = await usersRef
    .where("stripeCustomerId", "==", customerId)
    .get();

  if (!snapshot.empty) {
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: "payment_failed",
      lastPaymentAttempt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
