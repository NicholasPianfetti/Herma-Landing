// frontend/src/utils/handleDownload.js
import ReactGA from 'react-ga4';
import DownloadManager from './downloadManager';

/**
 * Enhanced download handler with free/paid version support
 * @param {string} platform - The platform ('windows', 'mac', or auto-detect)
 * @param {string} version - The version type ('free' or 'paid')
 * @param {function} navigate - React Router navigate function (optional)
 * @param {Object} options - Additional options
 */
const handleDownload = async (platform, version = 'free', navigate = null, options = {}) => {
  // Auto-detect platform if not specified
  if (!platform || platform === 'auto') {
    platform = DownloadManager.detectPlatform();
    if (platform === 'unknown' || platform === 'linux') {
      // Default to Windows for unknown platforms
      platform = 'windows';
    }
  }

  // Validate inputs
  if (!['windows', 'mac'].includes(platform)) {
    console.error('Invalid platform:', platform);
    return { success: false, error: 'Invalid platform specified' };
  }

  if (!['free', 'paid'].includes(version)) {
    console.error('Invalid version:', version);
    return { success: false, error: 'Invalid version specified' };
  }

  // Get additional context information for analytics
  const referrer = document.referrer || 'direct';
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const deviceType = window.innerWidth <= 768 ? 'mobile' : 
                    (window.innerWidth <= 1024 ? 'tablet' : 'desktop');
  const timeOnPage = Math.round(performance.now() / 1000);

  // Track the download attempt with enhanced analytics
  ReactGA.event({
    category: 'App Downloads',
    action: 'download_attempt',
    label: `${platform}_${version}`,
    value: 1,
    nonInteraction: false,
    
    // Enhanced tracking data
    app_version: 'v0.1.0',
    device_type: deviceType,
    screen_size: screenSize,
    time_before_download: timeOnPage,
    referrer: referrer,
    version_type: version,
    
    // For conversion tracking
    send_to: 'G-FSS7V9WPY5'
  });

  try {
    let result;

    if (version === 'paid') {
      result = await handlePaidDownload(platform, navigate, options);
    } else {
      result = await handleFreeDownload(platform);
    }

    if (result.success) {
      // Track successful download initiation
      ReactGA.event({
        category: 'App Downloads',
        action: `${version}_download_initiated`,
        label: platform,
        value: 1
      });

      // Track conversion for paid downloads
      if (version === 'paid') {
        ReactGA.event({
          category: 'Conversion',
          action: 'paid_download_completed',
          label: platform,
          value: 999 // $9.99 in cents
        });
      }
    } else {
      // Track download failure
      ReactGA.event({
        category: 'App Downloads',
        action: `${version}_download_failed`,
        label: `${platform}_${result.error}`,
        value: 1
      });
    }

    return result;

  } catch (error) {
    console.error('Download handler error:', error);
    
    // Track unexpected errors
    ReactGA.event({
      category: 'Error',
      action: 'DownloadHandlerError',
      label: `${platform}_${version}_${error.message}`,
      nonInteraction: true
    });

    return { success: false, error: error.message };
  }
};

/**
 * Handle paid version download
 * @param {string} platform - Platform (windows/mac)
 * @param {function} navigate - React Router navigate function
 * @param {Object} options - Additional options (userId, token)
 */
const handlePaidDownload = async (platform, navigate, options = {}) => {
  try {
    // If we have a download token, use it directly
    if (options.token) {
      return await DownloadManager.downloadPaidVersion(platform, options.token);
    }

    // If we have a userId, generate a new token
    if (options.userId) {
      return await DownloadManager.generateTokenAndDownload(options.userId, platform);
    }

    // If no token or userId, redirect to payment page
    if (navigate) {
      // Store the platform preference for after payment
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
      return { success: true, redirected: true };
    } else {
      // Fallback: redirect using window.location
      sessionStorage.setItem('selectedPlatform', platform);
      sessionStorage.setItem('downloadIntent', 'paid');
      window.location.href = '/checkout';
      return { success: true, redirected: true };
    }

  } catch (error) {
    console.error('Paid download error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle free version download
 * @param {string} platform - Platform (windows/mac)
 */
const handleFreeDownload = async (platform) => {
  try {
    return await DownloadManager.downloadFreeVersion(platform);
  } catch (error) {
    console.error('Free download error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle download with token (for post-payment downloads)
 * @param {string} platform - Platform (windows/mac)
 * @param {string} userId - User ID
 * @param {string} token - Download token (optional)
 */
const handlePaidDownloadWithAuth = async (platform, userId, token = null) => {
  try {
    const options = { userId };
    if (token) {
      options.token = token;
    }

    const result = await DownloadManager.handleDownload(platform, 'paid', options);
    
    if (result.success) {
      // Track authenticated paid download
      ReactGA.event({
        category: 'App Downloads',
        action: 'authenticated_paid_download',
        label: platform,
        value: 999
      });
    }

    return result;

  } catch (error) {
    console.error('Authenticated download error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get download button text based on platform and version
 * @param {string} platform - Platform (windows/mac)
 * @param {string} version - Version type (free/paid)
 * @returns {string} Button text
 */
const getDownloadButtonText = (platform, version) => {
  const platformName = platform === 'mac' ? 'Mac' : 'Windows';
  const versionText = version === 'paid' ? 'Pro' : 'Free';
  
  const platformIcon = platform === 'mac' ? '⌘' : '⊞';
  
  return `${platformIcon} Download Herma ${versionText} for ${platformName}`;
};

/**
 * Get file information for display
 * @param {string} platform - Platform (windows/mac)
 * @param {string} version - Version type (free/paid)
 * @returns {Object} File information
 */
const getFileInfo = (platform, version) => {
  // Estimated file sizes (you should update these with actual sizes)
  const fileSizes = {
    free: {
      windows: 85 * 1024 * 1024, // 85 MB
      mac: 92 * 1024 * 1024      // 92 MB
    },
    paid: {
      windows: 125 * 1024 * 1024, // 125 MB
      mac: 135 * 1024 * 1024      // 135 MB
    }
  };

  const fileNames = {
    free: {
      windows: 'Herma-Free-0.1.0.msi',
      mac: 'Herma-Free-0.1.0.dmg'
    },
    paid: {
      windows: 'Herma-Pro-0.1.0.msi',
      mac: 'Herma-Pro-0.1.0.dmg'
    }
  };

  const size = fileSizes[version]?.[platform] || 0;
  const fileName = fileNames[version]?.[platform] || 'Herma-App';

  return {
    fileName,
    fileSize: size,
    formattedSize: DownloadManager.formatFileSize(size),
    estimatedTime: DownloadManager.getEstimatedDownloadTime(size),
    platform,
    version
  };
};

/**
 * Check download requirements
 * @param {string} platform - Platform (windows/mac)
 * @returns {Object} Requirements check result
 */
const checkDownloadRequirements = (platform) => {
  const requirements = {
    windows: {
      os: 'Windows 10 or later',
      memory: '16GB RAM recommended',
      storage: '20GB available space',
      processor: 'Modern CPU (Intel i5/AMD Ryzen 5 or higher)'
    },
    mac: {
      os: 'macOS 11.0 or later',
      memory: '16GB RAM recommended', 
      storage: '20GB available space',
      processor: 'Intel or Apple Silicon'
    }
  };

  return {
    supported: ['windows', 'mac'].includes(platform),
    requirements: requirements[platform] || null,
    platform
  };
};

/**
 * Handle download error with user-friendly messages
 * @param {Error} error - Download error
 * @param {string} platform - Platform
 * @param {string} version - Version type
 * @returns {string} User-friendly error message
 */
const handleDownloadError = (error, platform, version) => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('token')) {
    return 'Download link has expired. Please try again or contact support.';
  }
  
  if (errorMessage.includes('subscription')) {
    return 'Active subscription required. Please upgrade to Herma Pro to access this download.';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (errorMessage.includes('platform')) {
    return `Download not available for ${platform}. Please contact support.`;
  }
  
  // Generic error message
  return `Download failed. Please try again or contact support if the problem persists.`;
};

// Named exports for specific use cases
export {
  handleFreeDownload,
  handlePaidDownload,
  handlePaidDownloadWithAuth,
  getDownloadButtonText,
  getFileInfo,
  checkDownloadRequirements,
  handleDownloadError
};

// Default export
export default handleDownload;