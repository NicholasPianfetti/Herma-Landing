// src/utils/handleDownload.jsx - Updated with tier tracking as JSX function
import ReactGA from 'react-ga4';
import { trackDownload } from '../services/api';

/**
 * Handles app downloads for different platforms with enhanced analytics and tier tracking
 * @param {string} platform - The platform ('windows' or 'mac')
 * @param {string} tier - The user tier ('free' or 'pro')
 * @param {string} uid - The user ID (optional for free downloads)
 */
const handleDownload = (platform, tier = 'free', uid = null) => {
  // Get additional context information
  const referrer = document.referrer || 'direct';
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const deviceType = window.innerWidth <= 768 ? 'mobile' : 
                    (window.innerWidth <= 1024 ? 'tablet' : 'desktop');
  const timeOnPage = Math.round(performance.now() / 1000); // Time on page in seconds
  
  // 1. Track the download event in Google Analytics with enhanced data
  ReactGA.event({
    category: 'App Downloads',
    action: 'download',
    label: `${platform}_${tier}`, // 'windows_free', 'mac_pro', etc.
    value: 1, // Count as one download
    
    // Include more context with the event
    nonInteraction: false,
    
    // Custom dimensions and metrics
    app_version: process.env.REACT_APP_APP_VERSION || 'v0.1.0',
    device_type: deviceType,
    screen_size: screenSize,
    time_before_download: timeOnPage,
    referrer: referrer,
    user_tier: tier,
    is_authenticated: uid ? 'yes' : 'no',
    
    // For conversion tracking
    send_to: 'G-FSS7V9WPY5'
  });

  // 2. Track in Firebase for analytics
  if (uid || tier === 'free') {
    trackDownload(uid, platform, tier).catch(console.error);
  }
  
  // 3. Define the download URLs for each platform and tier
  const downloadUrls = {
    windows: {
      free: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.msi',
      pro: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.msi' // Same installer, features unlocked via auth
    },
    mac: {
      free: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.dmg',
      pro: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.dmg' // Same installer, features unlocked via auth
    }
  };
  
  // 4. Get the correct download URL
  const downloadUrl = downloadUrls[platform]?.[tier] || downloadUrls[platform]?.free;
  
  if (!downloadUrl) {
    console.error(`Invalid platform or tier: ${platform}/${tier}`);
    
    // Track error events
    ReactGA.event({
      category: 'Error',
      action: 'DownloadError',
      label: `Invalid platform/tier: ${platform}/${tier}`,
      nonInteraction: true
    });
    
    return;
  }
  
  // Track download initiation as a separate event
  ReactGA.event({
    category: 'App Downloads',
    action: 'download_initiated',
    label: `${platform}_${tier}`
  });
  
  // 5. Create an invisible anchor element
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = platform === 'windows' ? 'Herma-0.1.0.msi' : 'Herma-0.1.0.dmg';
  link.style.display = 'none';
  link.setAttribute('data-download-platform', platform);
  link.setAttribute('data-download-tier', tier);
  
  // 6. Add to DOM, trigger click, then remove
  document.body.appendChild(link);
  link.click();
  
  // 7. Small delay before removing the element
  setTimeout(() => {
    document.body.removeChild(link);
    
    // 8. Track successful download attempt (not guaranteed but close enough)
    ReactGA.event({
      category: 'App Downloads',
      action: 'download_completed',
      label: `${platform}_${tier}`
    });

    // Track conversion events for different tiers
    if (tier === 'pro') {
      ReactGA.event({
        category: 'Conversions',
        action: 'ProDownload',
        label: platform,
        value: 1
      });
    }
  }, 1000);
  
  // 9. Return false to prevent any default button behavior
  return false;
};

export default handleDownload;