// backend/routes/downloads.js
const express = require('express');
const User = require('../models/User');
const { verifyDownloadToken, markTokenAsUsed, createRateLimiter } = require('../middleware/auth');
const { validateDownloadRequest } = require('../middleware/validation');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Rate limiting for downloads
const downloadRateLimit = createRateLimiter(60 * 1000, 5); // 5 downloads per minute

/**
 * Secure download endpoint
 */
router.get('/:platform/:token',
  downloadRateLimit,
  validateDownloadRequest,
  verifyDownloadToken,
  async (req, res) => {
    try {
      const { platform, token } = req.params;
      const downloadToken = req.downloadToken;

      // Get download URLs from environment
      const downloadUrls = {
        windows: process.env.WINDOWS_PAID_REPO,
        mac: process.env.MAC_PAID_REPO
      };

      const downloadUrl = downloadUrls[platform];
      if (!downloadUrl) {
        return res.status(404).json({ error: 'Download not available for this platform' });
      }

      // Mark token as used
      await markTokenAsUsed(downloadToken.id);

      // Record download in history
      await recordDownload(downloadToken.user_id, platform, 'paid', req.ip, req.get('User-Agent'), downloadToken.id);

      // For GitHub releases, redirect to the file
      // In production, you might want to stream the file through your server for better security
      res.redirect(downloadUrl);

    } catch (error) {
      console.error('Error processing download:', error);
      res.status(500).json({ error: 'Download failed' });
    }
  }
);

/**
 * Get download history for user
 */
router.get('/history/:userId',
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const history = await getDownloadHistory(userId, parseInt(page), parseInt(limit));
      res.json(history);

    } catch (error) {
      console.error('Error getting download history:', error);
      res.status(500).json({ error: 'Failed to get download history' });
    }
  }
);

/**
 * Get download statistics (admin endpoint)
 */
router.get('/stats/overview',
  async (req, res) => {
    try {
      const stats = await getDownloadStatistics();
      res.json(stats);

    } catch (error) {
      console.error('Error getting download stats:', error);
      res.status(500).json({ error: 'Failed to get download statistics' });
    }
  }
);

/**
 * Get download analytics by date range
 */
router.get('/analytics',
  async (req, res) => {
    try {
      const { startDate, endDate, platform, type } = req.query;
      
      const analytics = await getDownloadAnalytics({
        startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default 30 days
        endDate: endDate ? new Date(endDate) : new Date(),
        platform,
        downloadType: type
      });

      res.json(analytics);

    } catch (error) {
      console.error('Error getting download analytics:', error);
      res.status(500).json({ error: 'Failed to get download analytics' });
    }
  }
);

/**
 * Validate download eligibility
 */
router.get('/eligibility/:userId',
  async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const hasActiveSubscription = await user.hasActiveSubscription();
      const subscriptions = await user.getActiveSubscriptions();

      res.json({
        eligible: hasActiveSubscription,
        subscriptions: subscriptions.map(sub => ({
          id: sub.id,
          status: sub.status,
          current_period_end: sub.current_period_end,
          plan_type: sub.plan_type
        }))
      });

    } catch (error) {
      console.error('Error checking download eligibility:', error);
      res.status(500).json({ error: 'Failed to check eligibility' });
    }
  }
);

/**
 * Generate new download token for existing user
 */
router.post('/generate-token',
  downloadRateLimit,
  async (req, res) => {
    try {
      const { userId, platform } = req.body;

      if (!userId || !platform) {
        return res.status(400).json({ error: 'User ID and platform are required' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user has active subscription
      const hasActiveSubscription = await user.hasActiveSubscription();
      if (!hasActiveSubscription) {
        return res.status(403).json({ error: 'Active subscription required' });
      }

      // Generate new download token
      const { generateDownloadToken } = require('../middleware/auth');
      const downloadToken = await generateDownloadToken(userId, platform);

      // Send download link via email
      const emailService = require('../services/emailService');
      try {
        await emailService.sendDownloadLinkEmail(user, downloadToken.token, platform);
      } catch (emailError) {
        console.error('Failed to send download email:', emailError);
        // Don't fail the request if email fails
      }

      res.json({
        success: true,
        token: downloadToken.token,
        expires_at: downloadToken.expires_at,
        message: 'Download link sent to your email'
      });

    } catch (error) {
      console.error('Error generating download token:', error);
      res.status(500).json({ error: 'Failed to generate download token' });
    }
  }
);

/**
 * Check download token validity
 */
router.get('/token/:token/status',
  async (req, res) => {
    try {
      const { token } = req.params;

      const result = await pool.query(
        `SELECT dt.*, u.email, u.full_name 
         FROM download_tokens dt
         JOIN users u ON dt.user_id = u.id
         WHERE dt.token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        return res.json({
          valid: false,
          reason: 'Token not found'
        });
      }

      const tokenData = result.rows[0];
      const now = new Date();
      const expiresAt = new Date(tokenData.expires_at);
      const isExpired = now > expiresAt;
      const isUsed = tokenData.used_at !== null;

      res.json({
        valid: !isExpired && !isUsed,
        expired: isExpired,
        used: isUsed,
        expires_at: tokenData.expires_at,
        used_at: tokenData.used_at,
        platform: tokenData.platform,
        reason: isExpired ? 'Token expired' : isUsed ? 'Token already used' : null
      });

    } catch (error) {
      console.error('Error checking token status:', error);
      res.status(500).json({ error: 'Failed to check token status' });
    }
  }
);

/**
 * Record download in database
 */
async function recordDownload(userId, platform, downloadType, ipAddress, userAgent, downloadTokenId = null) {
  try {
    await pool.query(
      `INSERT INTO downloads (user_id, platform, version, download_type, ip_address, user_agent, download_token_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, platform, '0.1.0', downloadType, ipAddress, userAgent, downloadTokenId]
    );
  } catch (error) {
    console.error('Error recording download:', error);
    throw error;
  }
}

/**
 * Get download history with pagination
 */
async function getDownloadHistory(userId, page = 1, limit = 50) {
  try {
    const offset = (page - 1) * limit;
    
    const [dataResult, countResult] = await Promise.all([
      pool.query(
        `SELECT * FROM downloads 
         WHERE user_id = $1 
         ORDER BY completed_at DESC 
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) as total FROM downloads WHERE user_id = $1`,
        [userId]
      )
    ]);

    return {
      downloads: dataResult.rows,
      total: parseInt(countResult.rows[0].total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
    };
  } catch (error) {
    console.error('Error getting download history:', error);
    throw error;
  }
}

/**
 * Get download statistics
 */
async function getDownloadStatistics() {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_downloads,
        COUNT(CASE WHEN download_type = 'free' THEN 1 END) as free_downloads,
        COUNT(CASE WHEN download_type = 'paid' THEN 1 END) as paid_downloads,
        COUNT(CASE WHEN platform = 'windows' THEN 1 END) as windows_downloads,
        COUNT(CASE WHEN platform = 'mac' THEN 1 END) as mac_downloads,
        COUNT(CASE WHEN completed_at >= CURRENT_DATE THEN 1 END) as downloads_today,
        COUNT(CASE WHEN completed_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as downloads_7d,
        COUNT(CASE WHEN completed_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as downloads_30d,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT ip_address) as unique_ips
      FROM downloads
    `);

    return result.rows[0];
  } catch (error) {
    console.error('Error getting download statistics:', error);
    throw error;
  }
}

/**
 * Get download analytics with filters
 */
async function getDownloadAnalytics(filters) {
  try {
    let whereClause = 'WHERE completed_at >= $1 AND completed_at <= $2';
    const values = [filters.startDate, filters.endDate];
    let paramCount = 3;

    if (filters.platform) {
      whereClause += ` AND platform = ${paramCount}`;
      values.push(filters.platform);
      paramCount++;
    }

    if (filters.downloadType) {
      whereClause += ` AND download_type = ${paramCount}`;
      values.push(filters.downloadType);
      paramCount++;
    }

    // Daily breakdown
    const dailyQuery = `
      SELECT 
        DATE_TRUNC('day', completed_at) as date,
        COUNT(*) as downloads,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(CASE WHEN platform = 'windows' THEN 1 END) as windows,
        COUNT(CASE WHEN platform = 'mac' THEN 1 END) as mac,
        COUNT(CASE WHEN download_type = 'free' THEN 1 END) as free,
        COUNT(CASE WHEN download_type = 'paid' THEN 1 END) as paid
      FROM downloads 
      ${whereClause}
      GROUP BY DATE_TRUNC('day', completed_at)
      ORDER BY date
    `;

    // Summary query
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_downloads,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(CASE WHEN platform = 'windows' THEN 1 END) as windows_downloads,
        COUNT(CASE WHEN platform = 'mac' THEN 1 END) as mac_downloads,
        COUNT(CASE WHEN download_type = 'free' THEN 1 END) as free_downloads,
        COUNT(CASE WHEN download_type = 'paid' THEN 1 END) as paid_downloads,
        ROUND(AVG(CASE WHEN download_type = 'paid' THEN 9.99 ELSE 0 END), 2) as avg_revenue_per_download
      FROM downloads 
      ${whereClause}
    `;

    const [dailyResult, summaryResult] = await Promise.all([
      pool.query(dailyQuery, values),
      pool.query(summaryQuery, values)
    ]);

    return {
      summary: summaryResult.rows[0],
      daily: dailyResult.rows,
      period: {
        start: filters.startDate,
        end: filters.endDate
      }
    };
  } catch (error) {
    console.error('Error getting download analytics:', error);
    throw error;
  }
}

/**
 * Cleanup expired tokens (should be run periodically)
 */
router.post('/cleanup-tokens',
  async (req, res) => {
    try {
      const { cleanupExpiredTokens } = require('../middleware/auth');
      await cleanupExpiredTokens();
      res.json({ success: true, message: 'Expired tokens cleaned up' });
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
      res.status(500).json({ error: 'Failed to cleanup tokens' });
    }
  }
);

/**
 * Get top download locations by IP
 */
router.get('/analytics/locations',
  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          ip_address,
          COUNT(*) as download_count,
          COUNT(DISTINCT user_id) as unique_users,
          MAX(completed_at) as last_download
        FROM downloads 
        WHERE completed_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY ip_address
        ORDER BY download_count DESC
        LIMIT 100
      `);

      res.json(result.rows);
    } catch (error) {
      console.error('Error getting download locations:', error);
      res.status(500).json({ error: 'Failed to get download locations' });
    }
  }
);

/**
 * Get download trends
 */
router.get('/analytics/trends',
  async (req, res) => {
    try {
      const { period = '30d' } = req.query;
      
      let interval;
      switch (period) {
        case '7d':
          interval = '7 days';
          break;
        case '30d':
          interval = '30 days';
          break;
        case '90d':
          interval = '90 days';
          break;
        default:
          interval = '30 days';
      }

      const result = await pool.query(`
        SELECT 
          DATE_TRUNC('day', completed_at) as date,
          COUNT(*) as downloads,
          COUNT(CASE WHEN download_type = 'paid' THEN 1 END) as paid_downloads,
          COUNT(CASE WHEN download_type = 'free' THEN 1 END) as free_downloads,
          COUNT(DISTINCT user_id) as unique_users
        FROM downloads 
        WHERE completed_at >= CURRENT_DATE - INTERVAL '${interval}'
        GROUP BY DATE_TRUNC('day', completed_at)
        ORDER BY date
      `);

      res.json({
        period,
        data: result.rows
      });
    } catch (error) {
      console.error('Error getting download trends:', error);
      res.status(500).json({ error: 'Failed to get download trends' });
    }
  }
);

module.exports = router;