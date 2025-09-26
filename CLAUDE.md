# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Herma Landing**, a React-based landing page for the Herma AI application with integrated Stripe payment processing and Firebase authentication. The project includes:

- **Frontend**: React app with Tailwind CSS styling
- **Backend Services**: Firebase Functions and alternative Express.js backend
- **Payment Processing**: Stripe subscription management
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Firestore for user and subscription data
- **Deployment**: Firebase Hosting

## Development Commands

### Frontend (Main React App)
```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Deploy to Firebase
npm run deploy

# Deploy all Firebase services
npm run deploy:all
```

### Backend Services
```bash
# Firebase Functions
cd functions
npm run serve          # Local emulator
npm run deploy         # Deploy functions
npm run lint           # ESLint
npm run logs           # View function logs

# Alternative Express Backend
cd backend
npm run dev           # Development with nodemon
npm start            # Production server
```

## Architecture Overview

### Multi-Service Architecture
The project uses a hybrid architecture with both Firebase Functions and a standalone Express backend for flexibility:

- **Primary**: Firebase Functions (`functions/index.js`) - Production backend
- **Alternative**: Express.js server (`backend/server.js`) - Development/backup

### Key Components Structure

**Authentication Flow**:
- `src/context/AuthContext.js` - Global auth state management
- `src/firebase/auth.js` - Firebase auth functions
- `src/pages/Login.jsx` - Login page with checkout redirect
- `src/components/AuthButton.jsx` - Floating auth interface

**Payment Pipeline**:
- `src/components/Hero.jsx` - Main upgrade button and flow initiation
- `src/services/stripeService.js` - Stripe API integration
- `src/components/SuccessPage.jsx` - Post-payment success handling
- `functions/index.js` - Webhook processing and subscription management

**Routing & Navigation**:
- `src/App.jsx` - HashRouter with main route definitions
- Routes: `/`, `/login`, `/upgrade`, `/success`, `/privacy-policy`, `/terms-of-service`

### Data Flow Patterns

**Authentication-Payment Integration**:
1. User clicks upgrade → checks auth state
2. If not authenticated → redirects to `/login?redirect=checkout`
3. After login → automatically redirects to Stripe checkout
4. Post-payment → webhook updates Firestore → success page shows status

**State Management**:
- Authentication: React Context (`AuthContext`)
- No global state management library (Redux/Zustand)
- Local component state for UI interactions

**API Communication**:
- Frontend → Firebase Functions via fetch API
- Stripe webhooks → Firebase Functions → Firestore updates
- Real-time subscription status via Firestore listeners

## Environment Variables

Required for development:
```bash
# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_STRIPE_MONTHLY_PRICE_ID=price_...

# API Endpoints
REACT_APP_FUNCTIONS_URL=https://...
REACT_APP_API_URL=http://localhost:5000

# Firebase (auto-configured)
```

## Key File Locations

**Payment Implementation**:
- `src/services/stripeService.js` - Stripe checkout session creation
- `functions/index.js:91-158` - Checkout session backend
- `functions/index.js:228-572` - Webhook event processing

**Authentication System**:
- `src/context/AuthContext.js` - Auth provider and hooks
- `src/firebase/auth.js` - Firebase auth utilities
- `src/components/Hero.jsx:113-115` - Auth-payment integration

**Database Schema**:
- `users` collection: `{uid, email, stripeCustomerId, subscriptionStatus, isPro, updatedAt}`
- Subscription statuses: `free`, `active`, `payment_failed`, `canceled`

## Testing & Quality

**Payment Testing**:
- Use Stripe test cards: `4242 4242 4242 4242` (success)
- Test webhook delivery in Stripe dashboard
- Monitor Firebase Functions logs for debugging

**No Automated Testing**:
- Project uses Create React App's default Jest setup
- No existing test suites implemented
- Manual testing for payment flows recommended

## Special Considerations

**Legacy Node Configuration**:
- All npm scripts use `NODE_OPTIONS=--openssl-legacy-provider` for compatibility
- Required for React Scripts 5.0.1 with current Node versions

**HashRouter Usage**:
- Uses HashRouter instead of BrowserRouter for Firebase Hosting compatibility
- All routes prefixed with `#` in URLs

**Dual Backend Support**:
- Firebase Functions for production (recommended)
- Express backend in `/backend` for development/local testing
- Both implement identical API endpoints

**Comprehensive Documentation**:
- See `PAYMENT_PIPELINE.md` for detailed payment flow documentation
- Contains specific line references and modification guides

## Quality Assurance & Testing

**Development Workflow**:
- Always run `npm run build` before deploying to catch build errors
- Test payment flows using Stripe test cards: `4242 4242 4242 4242` (success)
- Check Firebase Functions logs for webhook processing errors
- Use browser developer tools to monitor API requests and console errors

**Required Testing Steps**:
1. Authentication flow (login, Google OAuth, logout)
2. Payment flow end-to-end with test cards
3. Webhook delivery in Stripe dashboard
4. Success page subscription status updates
5. Responsive design on mobile devices

## Windows Development Notes

**Node.js Compatibility**:
- All scripts require `NODE_OPTIONS=--openssl-legacy-provider` (already configured in package.json)
- Required for React Scripts 5.0.1 compatibility with newer Node.js versions

**Firebase Deployment**:
- Install Firebase CLI globally: `npm install -g firebase-tools`
- Login with `firebase login`
- Deploy with `npm run deploy` (hosting only) or `npm run deploy:all` (all services)

# Important Instruction Reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.