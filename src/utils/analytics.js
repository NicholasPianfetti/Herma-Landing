// src/utils/analytics.js
import ReactGA from 'react-ga4';

/**
 * Initialize analytics with enhanced configuration options
 */
export const initializeAnalytics = () => {
  ReactGA.initialize('G-FSS7V9WPY5', {
    debug: process.env.NODE_ENV === 'development',
    testMode: false,
    gaOptions: {
      siteSpeedSampleRate: 100,
      cookieFlags: 'SameSite=None;Secure'
    },
    gtagOptions: {
      send_page_view: false,
      allow_google_signals: true,
      allow_ad_personalization_signals: true,
    }
  });
};

/**
 * Track app users specially on your website
 * Call this function early in your website's load sequence
 */
export const trackAppUsers = () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('utm_source');
  const medium = urlParams.get('utm_medium');
  const campaign = urlParams.get('utm_campaign');
  
  // If user came from the app, track it specially
  if (source === 'herma_app') {
    // Track as a special event
    ReactGA.event({
      category: 'App Users',
      action: 'Website Visit',
      label: medium || 'Unknown Medium',
      // Include more useful data
      campaign: campaign || 'Unknown Campaign',
      nonInteraction: false
    });
    
    // Set a user property to mark this as an app user
    ReactGA.gtag('set', 'user_properties', {
      is_app_user: 'true',
      app_referral_medium: medium || 'Unknown Medium',
      app_referral_campaign: campaign || 'Unknown Campaign'
    });
    
    // Store in localStorage for session persistence
    localStorage.setItem('appUser', 'true');
    localStorage.setItem('appUserFirstSeen', Date.now().toString());
    
    // Track acquisition source for returning visitors
    if (!localStorage.getItem('appUserSource')) {
      localStorage.setItem('appUserSource', medium || 'Unknown');
    }
  }
  
  // Check if this is a returning app user
  const isAppUser = localStorage.getItem('appUser') === 'true';
  if (isAppUser && !source) {
    const firstSeen = localStorage.getItem('appUserFirstSeen');
    const appSource = localStorage.getItem('appUserSource') || 'Unknown';
    const daysSinceFirstVisit = firstSeen ? 
      Math.floor((Date.now() - parseInt(firstSeen)) / (1000 * 60 * 60 * 24)) : 
      'unknown';
    
    // Track returning app user
    ReactGA.event({
      category: 'App Users',
      action: 'Returning Visit',
      label: `Original Source: ${appSource}`,
      value: parseInt(daysSinceFirstVisit) || 0,
      nonInteraction: false
    });
  }
};

/**
 * Call this at the end of form submissions
 * to track conversion success rates for app users vs. regular users
 */
export const trackConversion = (conversionType) => {
  const isAppUser = localStorage.getItem('appUser') === 'true';
  let appSource = 'N/A';
  let daysSinceFirstVisit = 0;
  
  if (isAppUser) {
    appSource = localStorage.getItem('appUserSource') || 'Unknown';
    const firstSeen = localStorage.getItem('appUserFirstSeen');
    daysSinceFirstVisit = firstSeen ? 
      Math.floor((Date.now() - parseInt(firstSeen)) / (1000 * 60 * 60 * 24)) : 0;
  }
  
  ReactGA.event({
    category: 'Conversion',
    action: conversionType,
    label: isAppUser ? 'App User' : 'Regular User',
    // Send additional data to help with analysis
    app_user: isAppUser ? 'yes' : 'no',
    app_source: appSource,
    days_since_first_visit: daysSinceFirstVisit,
    nonInteraction: false
  });
};