// backend/models/User.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.full_name = data.full_name;
    this.stripe_customer_id = data.stripe_customer_id;
    this.platform = data.platform;
    this.country = data.country;
    this.postal_code = data.postal_code;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.last_login = data.last_login;
    this.is_active = data.is_active;
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    try {
      const {
        email,
        full_name,
        platform,
        country = null,
        postal_code = null,
        stripe_customer_id = null
      } = userData;

      const id = uuidv4();
      
      const query = `
        INSERT INTO users (id, email, full_name, platform, country, postal_code, stripe_customer_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [id, email, full_name, platform, country, postal_code, stripe_customer_id];
      const result = await pool.query(query, values);
      
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Find user by Stripe customer ID
   */
  static async findByStripeCustomerId(stripeCustomerId) {
    try {
      const query = 'SELECT * FROM users WHERE stripe_customer_id = $1';
      const result = await pool.query(query, [stripeCustomerId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new User(result.rows[0]);
    } catch (error) {
      console.error('Error finding user by Stripe customer ID:', error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Update user
   */
  async update(updateData) {
    try {
      const allowedFields = ['full_name', 'platform', 'country', 'postal_code', 'stripe_customer_id', 'last_login', 'is_active'];
      const updates = [];
      const values = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }

      if (updates.length === 0) {
        throw new Error('No valid fields to update');
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(this.id);

      const query = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      // Update current instance
      Object.assign(this, result.rows[0]);
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  /**
   * Delete user (soft delete)
   */
  async delete() {
    try {
      const query = `
        UPDATE users 
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [this.id]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      this.is_active = false;
      return this;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Get user's active subscriptions
   */
  async getActiveSubscriptions() {
    try {
      const query = `
        SELECT * FROM subscriptions 
        WHERE user_id = $1 AND status = 'active'
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query, [this.id]);
      return result.rows;
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      throw new Error('Failed to get subscriptions');
    }
  }

  /**
   * Get user's download history
   */
  async getDownloadHistory(limit = 50) {
    try {
      const query = `
        SELECT * FROM downloads 
        WHERE user_id = $1 
        ORDER BY completed_at DESC 
        LIMIT $2
      `;
      
      const result = await pool.query(query, [this.id, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting download history:', error);
      throw new Error('Failed to get download history');
    }
  }

  /**
   * Get user's payment attempts
   */
  async getPaymentHistory(limit = 50) {
    try {
      const query = `
        SELECT * FROM payment_attempts 
        WHERE email = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      
      const result = await pool.query(query, [this.email, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw new Error('Failed to get payment history');
    }
  }

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription() {
    try {
      const query = `
        SELECT COUNT(*) as count FROM subscriptions 
        WHERE user_id = $1 AND status = 'active' AND current_period_end > NOW()
      `;
      
      const result = await pool.query(query, [this.id]);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking active subscription:', error);
      throw new Error('Failed to check subscription status');
    }
  }

  /**
   * Update last login time
   */
  async updateLastLogin() {
    try {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = $1
        RETURNING last_login
      `;
      
      const result = await pool.query(query, [this.id]);
      this.last_login = result.rows[0].last_login;
      return this.last_login;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error('Failed to update last login');
    }
  }

  /**
   * Get all users with pagination
   */
  static async findAll(page = 1, limit = 50, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = 'WHERE is_active = true';
      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.platform) {
        whereClause += ` AND platform = $${paramCount}`;
        values.push(filters.platform);
        paramCount++;
      }

      if (filters.country) {
        whereClause += ` AND country = $${paramCount}`;
        values.push(filters.country);
        paramCount++;
      }

      if (filters.hasSubscription !== undefined) {
        if (filters.hasSubscription) {
          whereClause += ` AND EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id AND status = 'active')`;
        } else {
          whereClause += ` AND NOT EXISTS (SELECT 1 FROM subscriptions WHERE user_id = users.id AND status = 'active')`;
        }
      }

      // Add pagination parameters
      values.push(limit, offset);
      
      const query = `
        SELECT * FROM users 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      const countQuery = `
        SELECT COUNT(*) as total FROM users ${whereClause}
      `;

      const [dataResult, countResult] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, values.slice(0, -2)) // Remove pagination params for count
      ]);

      return {
        users: dataResult.rows.map(row => new User(row)),
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      };
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to get users');
    }
  }

  /**
   * Get user statistics
   */
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d,
          COUNT(CASE WHEN platform = 'windows' THEN 1 END) as windows_users,
          COUNT(CASE WHEN platform = 'mac' THEN 1 END) as mac_users,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
          COUNT(CASE WHEN last_login >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as active_7d
        FROM users
      `;
      
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user statistics:', error);
      throw new Error('Failed to get user statistics');
    }
  }

  /**
   * Search users by email or name
   */
  static async search(searchTerm, limit = 50) {
    try {
      const query = `
        SELECT * FROM users 
        WHERE is_active = true 
        AND (email ILIKE $1 OR full_name ILIKE $1)
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      
      const result = await pool.query(query, [`%${searchTerm}%`, limit]);
      return result.rows.map(row => new User(row));
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }

  /**
   * Convert to JSON (removes sensitive data)
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      full_name: this.full_name,
      platform: this.platform,
      country: this.country,
      postal_code: this.postal_code,
      created_at: this.created_at,
      updated_at: this.updated_at,
      last_login: this.last_login,
      is_active: this.is_active
      // Note: stripe_customer_id is intentionally excluded for security
    };
  }

  /**
   * Convert to public JSON (even less sensitive data)
   */
  toPublicJSON() {
    return {
      id: this.id,
      full_name: this.full_name,
      platform: this.platform,
      created_at: this.created_at,
      is_active: this.is_active
    };
  }
}

module.exports = User;