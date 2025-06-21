# Herma Payment Pipeline & Workflow Documentation

## Overview

This document explains the complete payment pipeline and workflow for the Herma Landing Page, detailing both the user experience and the technical implementation across all involved files.

## User Experience Flow

### 1. Initial Entry Point - Home Page (Hero.jsx)

**File:** `src/components/Hero.jsx`

The user journey begins on the home page where users see:
- Main hero section with app preview
- "Upgrade to Pro" button prominently displayed
- Download button for the free app

**Key Code Section:**
```jsx
// Lines 218-230 in Hero.jsx
<button
  onClick={handleUpgradeClick}
  disabled={loading}
  className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:ring-offset-2 w-full sm:w-auto sm:min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
>
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
  <span className="relative flex items-center justify-center gap-2">
    <span className="text-lg">⭐</span>
    <span>{loading ? 'Processing...' : 'Upgrade to Pro'}</span>
  </span>
</button>
```

### 2. Authentication Check

**Files Involved:**
- `src/context/AuthContext.js` - Manages user authentication state
- `src/components/Hero.jsx` - Checks user state before proceeding
- `src/pages/Login.jsx` - Handles login and redirects to checkout

When the user clicks "Upgrade to Pro":

**If User is NOT Logged In:**
- User is redirected to `/login?redirect=checkout` route
- Login page (`src/pages/Login.jsx`) is displayed
- User can sign in with email/password or Google OAuth
- After successful login, user is automatically redirected to Stripe checkout page
- Loading states show "Redirecting to checkout..." during the process

**If User IS Logged In:**
- Payment flow proceeds directly to Stripe checkout

**Key Code Section:**
```jsx
// Lines 113-115 in Hero.jsx
const handleUpgradeClick = async () => {
  if (!user) {
    navigate('/login?redirect=checkout');
    return;
  }
  // ... proceed with payment flow
};

// Lines 25-30 in Login.jsx
useEffect(() => {
  if (user && location.search.includes('redirect=checkout')) {
    handleCheckoutRedirect();
  }
}, [user, location.search]);
```

### 3. Stripe Checkout Session Creation

**Files Involved:**
- `src/services/stripeService.js` - Main service for Stripe operations
- `src/stripe.js` - Alternative Stripe configuration
- `functions/index.js` - Backend API endpoint
- `backend/server.js` - Alternative backend implementation

**Process:**
1. Frontend calls `createCheckoutSession(user)` from `stripeService.js`
2. Request is sent to backend API endpoint
3. Backend creates Stripe customer (or retrieves existing)
4. Stripe checkout session is created with subscription details
5. User is redirected to Stripe's hosted checkout page

**Key Code Section:**
```jsx
// Lines 8-56 in stripeService.js
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
    
    const response = await fetch(`${FUNCTIONS_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.url) {
      window.location.href = data.url;
      return data;
    }
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    throw error;
  }
};
```

### 4. Stripe Hosted Checkout

**What the User Sees:**
- Stripe's secure, hosted checkout page
- Payment form with card details
- Product information (Herma Pro - $15/month)
- Terms and conditions
- Secure payment processing

**Backend Processing:**
- `functions/index.js` (lines 91-158) handles session creation
- `backend/server.js` (lines 60-110) provides alternative implementation

### 5. Payment Success & Webhook Processing

**Files Involved:**
- `functions/index.js` - Webhook handlers (lines 228-572)
- `backend/server.js` - Alternative webhook implementation (lines 160-331)
- `src/components/SuccessPage.jsx` - Success page display

**Process:**
1. User completes payment on Stripe
2. Stripe sends webhook events to backend
3. Backend processes webhook and updates user subscription status
4. User is redirected to success page

**Webhook Events Handled:**
- `checkout.session.completed` - Initial payment success
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription status changes
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Recurring payment success
- `invoice.payment_failed` - Payment failure

### 6. Success Page Display

**File:** `src/components/SuccessPage.jsx`

**What the User Sees:**
- Confirmation message with celebration emoji
- Subscription details (status, email, next billing date, amount)
- Loading state while subscription status updates
- Navigation buttons to dashboard and subscription management
- "What's Next" section explaining activated features
- Troubleshooting section if status is still updating

**Key Features:**
- Automatic subscription status checking
- Manual refresh button for status updates
- Clear next steps for the user

## Technical Implementation Details

### Authentication System

**Files:**
- `src/context/AuthContext.js` - React context for auth state
- `src/firebase/auth.js` - Firebase authentication functions
- `src/firebase/config.js` - Firebase configuration
- `src/components/AuthButton.jsx` - Floating auth button

**Features:**
- Email/password authentication
- Google OAuth integration
- Persistent login state
- User profile management
- Automatic checkout redirect after login (when coming from upgrade flow)

### Checkout Redirect System

**Files:**
- `src/components/Hero.jsx` - Initiates redirect with query parameter
- `src/pages/Login.jsx` - Handles redirect logic and checkout flow

**Process:**
1. User clicks "Upgrade to Pro" while not logged in
2. Hero component redirects to `/login?redirect=checkout`
3. Login page detects the redirect parameter
4. After successful authentication, Login page automatically initiates checkout
5. User is taken directly to Stripe checkout page

**Key Features:**
- Seamless user experience from login to checkout
- Loading states indicate checkout redirection
- Fallback to home page if checkout fails
- Works with both email/password and Google OAuth

### Routing System

**Files:**
- `src/App.jsx` - Main routing configuration
- `src/index.js` - App initialization with AuthProvider

**Routes:**
- `/` - Home page with Hero component
- `/login` - Login page
- `/upgrade` - Purchase page (alternative entry point)
- `/success` - Success page after payment
- `/test-upgrade` - Testing page for payment flow

### Stripe Integration

**Configuration Files:**
- `src/stripe/config.js` - Stripe initialization
- `src/stripe.js` - Alternative Stripe service
- `src/services/stripeService.js` - Main Stripe service

**Environment Variables Required:**
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `REACT_APP_STRIPE_MONTHLY_PRICE_ID` - Product price ID
- `REACT_APP_FUNCTIONS_URL` - Backend API URL
- `REACT_APP_API_URL` - Alternative API URL

### Backend Services

**Primary Backend:** `functions/index.js`
- Express.js server running on Firebase Functions
- Stripe webhook processing
- User subscription management
- Customer creation and management

**Alternative Backend:** `backend/server.js`
- Standalone Express.js server
- Similar functionality to Firebase Functions
- Can be deployed separately

### Database Integration

**Firebase Firestore Collections:**
- `users` - User profiles and subscription data
- Fields: `uid`, `email`, `stripeCustomerId`, `subscriptionStatus`, `isPro`, `updatedAt`

**Subscription Status Values:**
- `free` - No active subscription
- `active` - Active subscription
- `payment_failed` - Payment processing failed
- `canceled` - Subscription cancelled

## File Modification Guide

### To Modify the Checkout Process:

1. **Change Pricing/Products:**
   - Update `STRIPE_PRICE_ID` in `src/services/stripeService.js`
   - Modify product details in `functions/index.js` (line 130-140)

2. **Modify Success/Cancel URLs:**
   - Update in `src/services/stripeService.js` (lines 18-19)
   - Update in `functions/index.js` (line 140)

3. **Change Payment Flow:**
   - Modify `handleUpgradeClick` in `src/components/Hero.jsx`
   - Update `createCheckoutSession` in `src/services/stripeService.js`

4. **Add New Payment Methods:**
   - Update `payment_method_types` in `functions/index.js` (line 125)
   - Modify Stripe checkout session configuration

### To Modify the Success Page:

1. **Change Success Page Content:**
   - Edit `src/components/SuccessPage.jsx`
   - Modify subscription status display logic
   - Update navigation buttons

2. **Add Post-Payment Actions:**
   - Implement in `src/components/SuccessPage.jsx`
   - Add API calls for additional setup

### To Modify Authentication:

1. **Add New Auth Providers:**
   - Update `src/firebase/auth.js`
   - Modify `src/context/AuthContext.js`
   - Update UI components

2. **Change Auth Flow:**
   - Modify `src/components/Hero.jsx` authentication check
   - Update routing logic in `src/App.jsx`

3. **Modify Checkout Redirect:**
   - Update redirect parameter in `src/components/Hero.jsx` (line 114)
   - Modify redirect logic in `src/pages/Login.jsx` (lines 25-30)
   - Change loading messages for checkout redirect

### To Modify Webhook Processing:

1. **Add New Webhook Events:**
   - Update switch statement in `functions/index.js` (lines 250-270)
   - Add corresponding handler functions

2. **Change Database Updates:**
   - Modify webhook handler functions in `functions/index.js`
   - Update Firestore document structure

## Testing the Payment Flow

### Test Environment Setup:

1. **Use Stripe Test Keys:**
   - Set `REACT_APP_STRIPE_PUBLISHABLE_KEY` to test key
   - Use test webhook endpoints

2. **Test Card Numbers:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any 3-digit CVC

3. **Test Pages:**
   - `/test-upgrade` - Dedicated testing page
   - Includes subscription status checking
   - Customer portal access

### Debugging:

1. **Check Console Logs:**
   - Frontend logs in browser console
   - Backend logs in Firebase Functions console

2. **Verify Webhook Delivery:**
   - Check Stripe dashboard for webhook events
   - Monitor Firebase Functions logs

3. **Test API Endpoints:**
   - Health check: `${API_URL}/health`
   - Subscription status: `${API_URL}/subscription-status/{userId}`

## Security Considerations

1. **Environment Variables:**
   - Never commit API keys to version control
   - Use environment variables for all sensitive data

2. **Webhook Security:**
   - Verify webhook signatures
   - Use HTTPS endpoints only

3. **User Authentication:**
   - Always verify user authentication before payment
   - Validate user permissions

4. **Data Validation:**
   - Validate all input data
   - Sanitize user inputs

## Deployment Notes

1. **Environment Setup:**
   - Configure all required environment variables
   - Set up Stripe webhook endpoints
   - Configure Firebase project

2. **Domain Configuration:**
   - Update success/cancel URLs for production
   - Configure CORS settings
   - Set up custom domain if needed

3. **Monitoring:**
   - Set up error tracking
   - Monitor webhook delivery
   - Track payment success rates

This documentation provides a complete overview of the payment pipeline and should help developers understand and modify the checkout process effectively. 