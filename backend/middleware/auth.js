// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Verify JWT token middleware
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Invalid token.' 
    });
  }
};

/**
 * Verify user has active subscription
 */
const verifyActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      `SELECT s.* FROM subscriptions s 
       WHERE s.user_id = $1 AND s.status = 'active' 
       AND s.current_period_end > NOW()`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ 
        error: 'Active subscription required.' 
      });
    }

    req.subscription = result.rows[0];
    next();
  } catch (error) {
    console.error('Subscription verification error:', error);
    res.status(500).json({ 
      error: 'Error verifying subscription.' 
    });
  }
};

/**
 * Verify download token
 */
const verifyDownloadToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const result = await pool.query(
      `SELECT dt.*, u.email FROM download_tokens dt
       JOIN users u ON dt.user_id = u.id
       WHERE dt.token = $1 AND dt.expires_at > NOW() AND dt.used_at IS NULL`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid or expired download token.' 
      });
    }

    req.downloadToken = result.rows[0];
    next();
  } catch (error) {
    console.error('Download token verification error:', error);
    res.status(500).json({ 
      error: 'Error verifying download token.' 
    });
  }
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
    }
  );
};

/**
 * Generate download token
 */
const generateDownloadToken = async (userId, platform) => {
  try {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const result = await pool.query(
      `INSERT INTO download_tokens (user_id, token, platform, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, token, platform, expiresAt]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error generating download token:', error);
    throw new Error('Failed to generate download token');
  }
};

/**
 * Mark download token as used
 */
const markTokenAsUsed = async (tokenId) => {
  try {
    await pool.query(
      `UPDATE download_tokens SET used_at = NOW() WHERE id = $1`,
      [tokenId]
    );
  } catch (error) {
    console.error('Error marking token as used:', error);
  }
};

/**
 * Clean up expired tokens (should be run periodically)
 */
const cleanupExpiredTokens = async () => {
  try {
    const result = await pool.query(
      `DELETE FROM download_tokens WHERE expires_at < NOW()`
    );
    console.log(`Cleaned up ${result.rowCount} expired tokens`);
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};

/**
 * Rate limiting middleware
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * API key authentication for internal services
 */
const verifyApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ 
      error: 'Invalid API key.' 
    });
  }
  
  next();
};

/**
 * Check if user owns resource
 */
const checkResourceOwnership = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    const userId = req.user.id;
    const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
    
    if (userId !== resourceUserId) {
      return res.status(403).json({ 
        error: 'Access denied. You can only access your own resources.' 
      });
    }
    
    next();
  };
};

module.exports = {
  verifyToken,
  verifyActiveSubscription,
  verifyDownloadToken,
  verifyApiKey,
  generateToken,
  generateDownloadToken,
  markTokenAsUsed,
  cleanupExpiredTokens,
  createRateLimiter,
  checkResourceOwnership
};