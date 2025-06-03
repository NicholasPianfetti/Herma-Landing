// frontend/src/utils/downloadManager.js
import paymentService from '../services/paymentService';
import ReactGA from 'react-ga4';

/**
 * Download Manager utility class for handling secure downloads
 */
export class DownloadManager {
  
  /**
   * Download paid version with secure token
   * @param {string} platform - Platform (windows/mac)
   * @param {string} downloadToken - Secure download token
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Download result
   */
  static async downloadPaidVersion(platform, downloadToken, options = {}) {
    try {
      // Track download attempt
      ReactGA.event({
        category: 'Download',
        action: 'PaidDownloadAttempt',
        label: platform,
        value: 1
      });

      // Check token status first
      const tokenStatus = await paymentService.checkTokenStatus(downloadToken);
      
      if (!tokenStatus.valid) {
        throw new Error(tokenStatus.reason || 'Download token is invalid');
      }

      // Create download URL
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/downloads/${platform}/${downloadToken}`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = platform === 'windows' ? 'Herma-Pro-0.1.0.msi' : 'Herma-Pro-0.1.0.dmg';
      link.style.display = 'none';
      link.setAttribute('data-download-platform', platform);
      link.setAttribute('data-download-version', 'paid');
      link.setAttribute('data-download-token', downloadToken);
      
      // Add to DOM and execute download
      document.body.appendChild(link);
      link.click();
      
      // Remove from DOM after a delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);
      
      // Track successful download initiation
      ReactGA.event({
        category: 'Download',
        action: 'PaidDownloadSuccess',
        label: platform,
        value: 1
      });

      // Record download locally for user tracking
      this.recordDownloadLocally({
        platform,
        version: 'paid',
        timestamp: new Date().toISOString(),
        token: downloadToken
      });

      return { success: true };
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Track download failure
      ReactGA.event({
        category: 'Download',
        action: 'PaidDownloadFailed',
        label: `${platform}_${error.message}`,
        value: 1
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Download free version
   * @param {string} platform - Platform (windows/mac)
   * @returns {Promise<Object>} Download result
   */
  static async downloadFreeVersion(platform) {
    try {
      // Track free download attempt
      ReactGA.event({
        category: 'Download',
        action: 'FreeDownloadAttempt',
        label: platform,
        value: 1
      });

      // Free version URLs (these should be publicly accessible)
      const freeDownloadUrls = {
        windows: process.env.REACT_APP_FREE_DOWNLOAD_WINDOWS || 'https://github.com/USER/HERMA-FREE/releases/download/v0.1.0/Herma-Free-0.1.0.msi',
        mac: process.env.REACT_APP_FREE_DOWNLOAD_MAC || 'https://github.com/USER/HERMA-FREE/releases/download/v0.1.0/Herma-Free-0.1.0.dmg'
      };

      const downloadUrl = freeDownloadUrls[platform];
      if (!downloadUrl) {
        throw new Error(`Free version not available for ${platform}`);
      }

      // Create download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = platform === 'windows' ? 'Herma-Free-0.1.0.msi' : 'Herma-Free-0.1.0.dmg';
      link.style.display = 'none';
      link.setAttribute('data-download-platform', platform);
      link.setAttribute('data-download-version', 'free');
      
      // Add to DOM and execute download
      document.body.appendChild(link);
      link.click();
      
      // Remove from DOM after a delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 1000);

      // Track successful free download
      ReactGA.event({
        category: 'Download',
        action: 'FreeDownloadSuccess',
        label: platform,
        value: 1
      });

      // Record download locally
      this.recordDownloadLocally({
        platform,
        version: 'free',
        timestamp: new Date().toISOString()
      });

      return { success: true };

    } catch (error) {
      console.error('Free download failed:', error);
      
      // Track free download failure
      ReactGA.event({
        category: 'Download',
        action: 'FreeDownloadFailed',
        label: `${platform}_${error.message}`,
        value: 1
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has valid subscription for download
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Whether user can download
   */
  static async canUserDownload(userId) {
    try {
      const { eligible } = await paymentService.checkDownloadEligibility(userId);
      return eligible;
    } catch (error) {
      console.error('Error checking download eligibility:', error);
      return false;
    }
  }

  /**
   * Get download history for user (from API)
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Download history from server
   */
  static async getServerDownloadHistory(userId, page = 1, limit = 50) {
    try {
      return await paymentService.getDownloadHistory(userId, page, limit);
    } catch (error) {
      console.error('Error getting server download history:', error);
      throw error;
    }
  }

  /**
   * Get local download history (from localStorage)
   * @returns {Array} Local download history
   */
  static getLocalDownloadHistory() {
    try {
      const history = localStorage.getItem('herma_download_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting local download history:', error);
      return [];
    }
  }

  /**
   * Record download in local storage
   * @param {Object} downloadInfo - Download information
   */
  static recordDownloadLocally(downloadInfo) {
    try {
      const history = this.getLocalDownloadHistory();
      const newEntry = {
        ...downloadInfo,
        id: Date.now(),
        timestamp: downloadInfo.timestamp || new Date().toISOString()
      };
      
      history.unshift(newEntry); // Add to beginning
      
      // Keep only last 50 downloads
      const recentHistory = history.slice(0, 50);
      
      localStorage.setItem('herma_download_history', JSON.stringify(recentHistory));
    } catch (error) {
      console.error('Error recording download locally:', error);
    }
  }

  /**
   * Clear local download history
   */
  static clearLocalHistory() {
    try {
      localStorage.removeItem('herma_download_history');
    } catch (error) {
      console.error('Error clearing local history:', error);
    }
  }

  /**
   * Generate new download token and initiate download
   * @param {string} userId - User ID
   * @param {string} platform - Platform (windows/mac)
   * @returns {Promise<Object>} Token generation and download result
   */
  static async generateTokenAndDownload(userId, platform) {
    try {
      // Check eligibility first
      const canDownload = await this.canUserDownload(userId);
      if (!canDownload) {
        throw new Error('Active subscription required for paid downloads');
      }

      // Generate new token
      const tokenResult = await paymentService.generateDownloadToken(userId, platform);
      
      if (!tokenResult.success) {
        throw new Error(tokenResult.error || 'Failed to generate download token');
      }

      // Initiate download with new token
      return await this.downloadPaidVersion(platform, tokenResult.token);

    } catch (error) {
      console.error('Error generating token and downloading:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle download based on version type
   * @param {string} platform - Platform (windows/mac)
   * @param {string} version - Version type ('free' or 'paid')
   * @param {Object} options - Additional options (userId, token, etc.)
   * @returns {Promise<Object>} Download result
   */
  static async handleDownload(platform, version, options = {}) {
    try {
      if (version === 'free') {
        return await this.downloadFreeVersion(platform);
      } else if (version === 'paid') {
        if (options.token) {
          return await this.downloadPaidVersion(platform, options.token);
        } else if (options.userId) {
          return await this.generateTokenAndDownload(options.userId, platform);
        } else {
          throw new Error('Token or userId required for paid downloads');
        }
      } else {
        throw new Error('Invalid version type. Must be "free" or "paid"');
      }
    } catch (error) {
      console.error('Error handling download:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate download token before use
   * @param {string} token - Download token
   * @returns {Promise<Object>} Token validation result
   */
  static async validateToken(token) {
    try {
      return await paymentService.checkTokenStatus(token);
    } catch (error) {
      console.error('Error validating token:', error);
      return { valid: false, reason: error.message };
    }
  }

  /**
   * Get download statistics for analytics
   * @returns {Object} Download statistics from local storage
   */
  static getDownloadStats() {
    try {
      const history = this.getLocalDownloadHistory();
      
      const stats = {
        total: history.length,
        free: history.filter(d => d.version === 'free').length,
        paid: history.filter(d => d.version === 'paid').length,
        windows: history.filter(d => d.platform === 'windows').length,
        mac: history.filter(d => d.platform === 'mac').length,
        lastDownload: history.length > 0 ? history[0].timestamp : null,
        downloadsToday: history.filter(d => {
          const downloadDate = new Date(d.timestamp).toDateString();
          const today = new Date().toDateString();
          return downloadDate === today;
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error getting download stats:', error);
      return {
        total: 0,
        free: 0,
        paid: 0,
        windows: 0,
        mac: 0,
        lastDownload: null,
        downloadsToday: 0
      };
    }
  }

  /**
   * Check if browser supports downloads
   * @returns {boolean} Whether browser supports downloads
   */
  static isBrowserSupported() {
    return typeof document !== 'undefined' && 
           typeof document.createElement === 'function' &&
           typeof URL !== 'undefined';
  }

  /**
   * Get user's platform automatically
   * @returns {string} Detected platform ('windows', 'mac', or 'unknown')
   */
  static detectPlatform() {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    if (platform.indexOf('Mac') !== -1 || 
        userAgent.indexOf('Macintosh') !== -1 || 
        userAgent.indexOf('MacIntel') !== -1) {
      return 'mac';
    }
    
    if (platform.indexOf('Win') !== -1 || 
        userAgent.indexOf('Windows') !== -1) {
      return 'windows';
    }
    
    if (platform.indexOf('Linux') !== -1 || 
        userAgent.indexOf('Linux') !== -1) {
      return 'linux'; // Note: not supported yet
    }
    
    return 'unknown';
  }

  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get estimated download time
   * @param {number} fileSizeBytes - File size in bytes
   * @param {number} speedMbps - Download speed in Mbps
   * @returns {string} Estimated download time
   */
  static getEstimatedDownloadTime(fileSizeBytes, speedMbps = 10) {
    const fileSizeMb = fileSizeBytes / (1024 * 1024);
    const timeSeconds = (fileSizeMb * 8) / speedMbps;
    
    if (timeSeconds < 60) {
      return `${Math.round(timeSeconds)} seconds`;
    } else if (timeSeconds < 3600) {
      return `${Math.round(timeSeconds / 60)} minutes`;
    } else {
      return `${Math.round(timeSeconds / 3600)} hours`;
    }
  }
}

export default DownloadManager;