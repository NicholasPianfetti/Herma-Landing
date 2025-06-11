import ReactGA from 'react-ga4';

/**
 * Handles app downloads for different platforms with enhanced analytics
 * @param {string} platform - The platform ('windows' or 'mac')
 */
const handleDownload = (platform) => {
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
    label: platform, // 'windows' or 'mac'
    value: 1, // Count as one download
    
    // Include more context with the event
    nonInteraction: false,
    
    // Custom dimensions and metrics
    app_version: 'v0.1.0',
    device_type: deviceType,
    screen_size: screenSize,
    time_before_download: timeOnPage,
    referrer: referrer,
    
    // For conversion tracking
    send_to: 'G-FSS7V9WPY5'
  });
  
  // 2. Define the download URLs for each platform
  const downloadUrls = {
    windows: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.msi',
    mac: 'https://github.com/NicholasPianfetti/Herma-Landing/releases/download/v0.1.0/Herma-0.1.0.dmg',
  };
  
  // 3. Get the correct download URL
  const downloadUrl = downloadUrls[platform];
  
  if (!downloadUrl) {
    console.error(`Invalid platform: ${platform}`);
    
    // Track error events
    ReactGA.event({
      category: 'Error',
      action: 'DownloadError',
      label: `Invalid platform: ${platform}`,
      nonInteraction: true
    });
    
    return;
  }
  
  // Track download initiation as a separate event
  ReactGA.event({
    category: 'App Downloads',
    action: 'download_initiated',
    label: platform
  });
  
  // 4. Create an invisible anchor element
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = platform === 'windows' ? 'Herma-0.1.0.exe' : 'Herma-0.1.0.dmg';
  link.style.display = 'none';
  link.setAttribute('data-download-platform', platform);
  
  // 5. Add to DOM, trigger click, then remove
  document.body.appendChild(link);
  link.click();
  
  // 6. Small delay before removing the element
  setTimeout(() => {
    document.body.removeChild(link);
    
    // 7. Track successful download attempt (not guaranteed but close enough)
    ReactGA.event({
      category: 'App Downloads',
      action: 'download_completed',
      label: platform
    });
  }, 1000);
  
  // 8. Return false to prevent any default button behavior
  return false;
};

export default handleDownload;