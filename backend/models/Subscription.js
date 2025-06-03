// backend/models/Subscription.js
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Subscription {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.stripe_subscription_id = data.stripe_subscription_id;
    this.stripe_price_id = data.stripe_price_id;
    this.status = data.status;
    this.plan_type = data.plan_type;
    this.current_period_start = data.current_period_start;
    this.current_period_end = data.current_period_end;
    this.cancel_at_period_end = data.cancel_at_period_end;
    this.canceled_at = data.canceled_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  /**
   * Create a new subscription
   */
  static async create(subscriptionData) {
    try {
      const {
        user_id,
        stripe_subscription_id,
        stripe_price_id,
        status,
        plan_type = 'pro',
        current_period_start,
        current_period_end
      } = subscriptionData;

      const id = uuidv4();
      
      const query = `
        INSERT INTO subscriptions (
          id, user_id, stripe_subscription_id, stripe_price_id, 
          status, plan_type, current_period_start, current_period_end
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const values = [
        id, user_id, stripe_subscription_id, stripe_price_id,
        status, plan_type, current_period_start, current_period_end
      ];
      
      const result = await pool.query(query, values);
      return new Subscription(result.rows[0]);
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Find subscription by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM subscriptions WHERE id = $1';
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new Subscription(result.rows[0]);
    } catch (error) {
      console.error('Error finding subscription by ID:', error);
      throw new Error('Failed to find subscription');
    }
  }

  /**
   * Find subscription by Stripe subscription ID
   */
  static async findByStripeId(stripeSubscriptionId) {
    try {
      const query = 'SELECT * FROM subscriptions WHERE stripe_subscription_id = $1';
      const result = await pool.query(query, [stripeSubscriptionId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new Subscription(result.rows[0]);
    } catch (error) {
      console.error('Error finding subscription by Stripe ID:', error);
      throw new Error('Failed to find subscription');
    }
  }

  /**
   * Find subscriptions by user ID
   */
  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM subscriptions 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query, [userId]);
      
      return result.rows.map(row => new Subscription(row));
    } catch (error) {
      console.error('Error finding subscriptions by user ID:', error);
      throw new Error('Failed to find subscriptions');
    }
  }

  /**
   * Get active subscription for user
   */
  static async getActiveByUserId(userId) {
    try {
      const query = `
        SELECT * FROM subscriptions 
        WHERE user_id = $1 AND status = 'active' AND current_period_end > NOW()
        ORDER BY current_period_end DESC
        LIMIT 1
      `;
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return new Subscription(result.rows[0]);
    } catch (error) {
      console.error('Error finding active subscription:', error);
      throw new Error('Failed to find active subscription');
    }
  }

  /**
   * Update subscription
   */
  async update(updateData) {
    try {
      const allowedFields = [
        'status', 'current_period_start', 'current_period_end',
        'cancel_at_period_end', 'canceled_at', 'stripe_price_id'
      ];
      
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
        UPDATE subscriptions 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Subscription not found');
      }

      Object.assign(this, result.rows[0]);
      return this;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancel(cancelAtPeriodEnd = true) {
    try {
      const updateData = {
        cancel_at_period_end: cancelAtPeriodEnd
      };

      if (!cancelAtPeriodEnd) {
        updateData.status = 'canceled';
        updateData.canceled_at = new Date();
      }

      return await this.update(updateData);
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivate() {
    try {
      return await this.update({
        cancel_at_period_end: false,
        canceled_at: null,
        status: 'active'
      });
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw new Error('Failed to reactivate subscription');
    }
  }

  /**
   * Check if subscription is active
   */
  isActive() {
    return this.status === 'active' && new Date(this.current_period_end) > new Date();
  }

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  isExpiringSoon() {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return new Date(this.current_period_end) <= sevenDaysFromNow;
  }

  /**
   * Get days until expiration
   */
  getDaysUntilExpiration() {
    const now = new Date();
    const endDate = new Date(this.current_period_end);
    const diffTime = endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get subscription with user information
   */
  async getWithUser() {
    try {
      const query = `
        SELECT s.*, u.email, u.full_name, u.platform
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = $1
      `;
      
      const result = await pool.query(query, [this.id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error getting subscription with user:', error);
      throw new Error('Failed to get subscription with user');
    }
  }

  /**
   * Get all subscriptions with pagination and filters
   */
  static async findAll(page = 1, limit = 50, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      let whereClause = 'WHERE 1=1';
      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.status) {
        whereClause += ` AND status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }

      if (filters.plan_type) {
        whereClause += ` AND plan_type = $${paramCount}`;
        values.push(filters.plan_type);
        paramCount++;
      }

      if (filters.user_id) {
        whereClause += ` AND user_id = $${paramCount}`;
        values.push(filters.user_id);
        paramCount++;
      }

      if (filters.expiring_soon) {
        whereClause += ` AND current_period_end <= NOW() + INTERVAL '7 days'`;
      }

      // Add pagination parameters
      values.push(limit, offset);
      
      const query = `
        SELECT s.*, u.email, u.full_name, u.platform
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        ${whereClause}
        ORDER BY s.created_at DESC 
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      const countQuery = `
        SELECT COUNT(*) as total 
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        ${whereClause}
      `;

      const [dataResult, countResult] = await Promise.all([
        pool.query(query, values),
        pool.query(countQuery, values.slice(0, -2))
      ]);

      return {
        subscriptions: dataResult.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      };
    } catch (error) {
      console.error('Error finding all subscriptions:', error);
      throw new Error('Failed to get subscriptions');
    }
  }

  /**
   * Get subscription statistics
   */
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
          COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled_subscriptions,
          COUNT(CASE WHEN status = 'past_due' THEN 1 END) as past_due_subscriptions,
          COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_subscriptions_30d,
          COUNT(CASE WHEN status = 'active' AND current_period_end <= NOW() + INTERVAL '7 days' THEN 1 END) as expiring_soon,
          ROUND(AVG(CASE WHEN status = 'active' THEN EXTRACT(EPOCH FROM (current_period_end - current_period_start)) / 86400 END), 2) as avg_billing_cycle_days
        FROM subscriptions
      `;
      
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting subscription statistics:', error);
      throw new Error('Failed to get subscription statistics');
    }
  }

  /**
   * Get monthly revenue data
   */
  static async getMonthlyRevenue(months = 12) {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as new_subscriptions,
          COUNT(*) * 9.99 as monthly_revenue
        FROM subscriptions 
        WHERE status = 'active' 
        AND created_at >= NOW() - INTERVAL '${months} months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month DESC
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting monthly revenue:', error);
      throw new Error('Failed to get monthly revenue');
    }
  }

  /**
   * Get expiring subscriptions
   */
  static async getExpiring(days = 7) {
    try {
      const query = `
        SELECT s.*, u.email, u.full_name
        FROM subscriptions s
        JOIN users u ON s.user_id = u.id
        WHERE s.status = 'active' 
        AND s.current_period_end <= NOW() + INTERVAL '${days} days'
        AND s.current_period_end > NOW()
        ORDER BY s.current_period_end ASC
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting expiring subscriptions:', error);
      throw new Error('Failed to get expiring subscriptions');
    }
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      stripe_subscription_id: this.stripe_subscription_id,
      status: this.status,
      plan_type: this.plan_type,
      current_period_start: this.current_period_start,
      current_period_end: this.current_period_end,
      cancel_at_period_end: this.cancel_at_period_end,
      canceled_at: this.canceled_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
      is_active: this.isActive(),
      days_until_expiration: this.getDaysUntilExpiration(),
      is_expiring_soon: this.isExpiringSoon()
    };
  }
}

module.exports = Subscription;