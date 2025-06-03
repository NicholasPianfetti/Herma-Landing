-- database/schema.sql
-- PostgreSQL database schema for Herma app

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    stripe_customer_id VARCHAR(255) UNIQUE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('windows', 'mac')),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    stripe_price_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
    plan_type VARCHAR(50) NOT NULL DEFAULT 'pro',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Download tokens table (for secure downloads)
CREATE TABLE download_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('windows', 'mac')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Download history table
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('windows', 'mac')),
    version VARCHAR(50) NOT NULL,
    download_type VARCHAR(20) NOT NULL CHECK (download_type IN ('free', 'paid')),
    ip_address INET,
    user_agent TEXT,
    download_token_id UUID REFERENCES download_tokens(id),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment attempts table (for analytics)
CREATE TABLE payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Webhook events table (for Stripe webhook processing)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    processed BOOLEAN DEFAULT false,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_download_tokens_token ON download_tokens(token);
CREATE INDEX idx_download_tokens_user_id ON download_tokens(user_id);
CREATE INDEX idx_download_tokens_expires_at ON download_tokens(expires_at);
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_created_at ON downloads(completed_at);
CREATE INDEX idx_payment_attempts_email ON payment_attempts(email);
CREATE INDEX idx_payment_attempts_created_at ON payment_attempts(created_at);
CREATE INDEX idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO users (email, full_name, platform, country) VALUES
('test@example.com', 'Test User', 'windows', 'United States'),
('demo@example.com', 'Demo User', 'mac', 'Canada');

-- docker-compose.yml for local development
/*
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: herma_db
      POSTGRES_USER: herma_user
      POSTGRES_PASSWORD: herma_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://herma_user:herma_password@postgres:5432/herma_db
      REDIS_URL: redis://redis:6379
      STRIPE_SECRET_KEY: sk_test_your_key_here
      STRIPE_WEBHOOK_SECRET: whsec_your_webhook_secret
      NODE_ENV: development
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules
    
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001
      REACT_APP_STRIPE_PUBLISHABLE_KEY: pk_test_your_key_here
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
  redis_data:
*/

-- Deployment configuration for production

-- backend/Dockerfile
/*
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
*/

-- Kubernetes deployment (k8s/deployment.yaml)
/*
apiVersion: apps/v1
kind: Deployment
metadata:
  name: herma-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: herma-backend
  template:
    metadata:
      labels:
        app: herma-backend
    spec:
      containers:
      - name: herma-backend
        image: your-registry/herma-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: herma-secrets
              key: database-url
        - name: STRIPE_SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: herma-secrets
              key: stripe-secret-key
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: herma-secrets
              key: redis-url
---
apiVersion: v1
kind: Service
metadata:
  name: herma-backend-service
spec:
  selector:
    app: herma-backend
  ports:
  - port: 80
    targetPort: 3001
  type: LoadBalancer
*/

-- Monitoring and analytics queries

-- Monthly revenue report
CREATE OR REPLACE VIEW monthly_revenue AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as new_subscriptions,
    COUNT(*) * 9.99 as monthly_revenue,
    COUNT(CASE WHEN platform = 'windows' THEN 1 END) as windows_users,
    COUNT(CASE WHEN platform = 'mac' THEN 1 END) as mac_users
FROM subscriptions 
WHERE status = 'active'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Download analytics
CREATE OR REPLACE VIEW download_analytics AS
SELECT 
    DATE_TRUNC('day', completed_at) as date,
    platform,
    download_type,
    COUNT(*) as download_count
FROM downloads 
GROUP BY DATE_TRUNC('day', completed_at), platform, download_type
ORDER BY date DESC;

-- User retention analysis
CREATE OR REPLACE VIEW user_retention AS
SELECT 
    DATE_TRUNC('month', u.created_at) as signup_month,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN s.status = 'active' THEN u.id END) as active_subscribers,
    ROUND(
        COUNT(DISTINCT CASE WHEN s.status = 'active' THEN u.id END)::DECIMAL / 
        COUNT(DISTINCT u.id) * 100, 2
    ) as retention_rate
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
GROUP BY DATE_TRUNC('month', u.created_at)
ORDER BY signup_month DESC;

-- Performance monitoring
CREATE OR REPLACE VIEW system_health AS
SELECT 
    'active_subscriptions' as metric,
    COUNT(*) as value
FROM subscriptions WHERE status = 'active'
UNION ALL
SELECT 
    'total_downloads_today' as metric,
    COUNT(*) as value
FROM downloads WHERE completed_at >= CURRENT_DATE
UNION ALL
SELECT 
    'revenue_this_month' as metric,
    (COUNT(*) * 9.99)::INTEGER as value
FROM subscriptions 
WHERE status = 'active' 
AND created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- Cleanup expired tokens (run as cron job)
DELETE FROM download_tokens 
WHERE expires_at < CURRENT_TIMESTAMP;

-- Archive old download records (run monthly)
DELETE FROM downloads 
WHERE completed_at < CURRENT_TIMESTAMP - INTERVAL '6 months';