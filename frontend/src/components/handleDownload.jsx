import ReactGA from 'react-ga4';

/**
 * Enhanced download handler with free/paid version support
 * @param {string} platform - The platform ('windows' or 'mac')
 * @param {string} version - The version type ('free' or 'paid')
 * @param {function} navigate - React Router navigate function
 */
const handleDownload = (platform, version = 'free', navigate = null) => {
  // Get additional context information
  const referrer = document.referrer || 'direct';
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const deviceType = window.innerWidth <= 768 ? 'mobile' : 
                    (window.innerWidth <= 1024 ? 'tablet' : 'desktop');
  const timeOnPage = Math.round(performance.now() / 1000);
  
  // Track the download attempt
  ReactGA.event({
    category: 'App Downloads',
    action: 'download_attempt',
    label: `${platform}_${version}`,
    value: 1,
    nonInteraction: false,
    app_version: 'v0.1.0',
    device_type: deviceType,
    screen_size: screenSize,
    time_before_download: timeOnPage,
    referrer: referrer,
    version_type: version,
    send_to: 'G-FSS7V9WPY5'
  });

  // Handle paid version - redirect to payment page
  if (version === 'paid') {
    if (navigate) {
      // Store the platform preference in sessionStorage for after payment
      sessionStorage.setItem('selectedPlatform', platform);
      sessionStorage.setItem('downloadIntent', 'paid');
      
      // Track paid version interest
      ReactGA.event({
        category: 'Conversion',
        action: 'paid_version_interest',
        label: platform,
        send_to: 'G-FSS7V9WPY5'
      });
      
      // Navigate to payment page
      navigate('/checkout');
      return;
    } else {
      console.error('Navigate function not provided for paid version');
      return;
    }
  }

  // Handle free version download
  handleFreeDownload(platform);
};

/**
 * Handles free version download
 * @param {string} platform - The platform ('windows' or 'mac')
 */
const handleFreeDownload = (platform) => {
  // Define free version download URLs (temporary variables for easy change)
  const FREE_REPO_WINDOWS = 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.msi';
  const FREE_REPO_MAC = 'https://github.com/USER/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.dmg';
  
  const freeDownloadUrls = {
    windows: FREE_REPO_WINDOWS,
    mac: FREE_REPO_MAC,
  };
  
  const downloadUrl = freeDownloadUrls[platform];
  
  if (!downloadUrl) {
    console.error(`Invalid platform for free version: ${platform}`);
    ReactGA.event({
      category: 'Error',
      action: 'FreeDownloadError',
      label: `Invalid platform: ${platform}`,
      nonInteraction: true
    });
    return;
  }
  
  // Track free download initiation
  ReactGA.event({
    category: 'App Downloads',
    action: 'free_download_initiated',
    label: platform
  });
  
  // Create download link
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = platform === 'windows' ? 'Herma-Free-0.1.0.msi' : 'Herma-Free-0.1.0.dmg';
  link.style.display = 'none';
  link.setAttribute('data-download-platform', platform);
  link.setAttribute('data-download-version', 'free');
  
  // Execute download
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
    ReactGA.event({
      category: 'App Downloads',
      action: 'free_download_completed',
      label: platform
    });
  }, 1000);
};

/**
 * Handles paid version download (called after successful payment)
 * @param {string} platform - The platform ('windows' or 'mac')
 * @param {string} userId - The user's ID from payment system
 */
const handlePaidDownload = (platform, userId) => {
  // Define paid version download URLs (temporary variables for easy change)
  const PAID_REPO_WINDOWS = 'https://github.com/NicholasPianfetti/Herma-Releases/releases/download/v0.1.20/Herma-Setup-0.1.20.exe';
  const PAID_REPO_MAC = 'https://github.com/NicholasPianfetti/Herma-Releases/releases/download/v0.1.20/Herma-Pro-0.1.0.dmg';
  
  const paidDownloadUrls = {
    windows: PAID_REPO_WINDOWS,
    mac: PAID_REPO_MAC,
  };
  
  const downloadUrl = paidDownloadUrls[platform];
  
  if (!downloadUrl) {
    console.error(`Invalid platform for paid version: ${platform}`);
    return;
  }
  
  // Track paid download
  ReactGA.event({
    category: 'App Downloads',
    action: 'paid_download_completed',
    label: platform,
    value: 1, // This represents a conversion
    send_to: 'G-FSS7V9WPY5'
  });
  
  // Create download link
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = platform === 'windows' ? 'Herma-Pro-0.1.0.msi' : 'Herma-Pro-0.1.0.dmg';
  link.style.display = 'none';
  link.setAttribute('data-download-platform', platform);
  link.setAttribute('data-download-version', 'paid');
  link.setAttribute('data-user-id', userId);
  
  // Execute download
  document.body.appendChild(link);
  link.click();
  
  setTimeout(() => {
    document.body.removeChild(link);
  }, 1000);
};

export default handleDownload;
export { handleFreeDownload, handlePaidDownload };