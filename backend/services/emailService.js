// backend/services/emailService.js
const nodemailer = require('nodemailer');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/email.log' })
  ]
});

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.init();
  }

  /**
   * Initialize email transporter
   */
  async init() {
    try {
      // Configure based on environment
      if (process.env.NODE_ENV === 'production') {
        // Production: Use your email service (SendGrid, SES, etc.)
        this.transporter = nodemailer.createTransporter({
          service: process.env.EMAIL_SERVICE || 'sendgrid',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else {
        // Development: Use Ethereal for testing
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransporter({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      this.initialized = true;
      logger.info('Email service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
      throw new Error('Email service initialization failed');
    }
  }

  /**
   * Send email
   */
  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      if (!this.initialized) {
        await this.init();
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@herma.app',
        to,
        subject,
        html: htmlContent,
        text: textContent || this.stripHtml(htmlContent)
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      logger.info(`Email sent successfully to ${to}: ${subject}`);
      return info;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Herma Pro!';
    const htmlContent = this.getWelcomeEmailTemplate(user);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send subscription confirmation email
   */
  async sendSubscriptionConfirmation(user, subscription) {
    const subject = 'Your Herma Pro subscription is active!';
    const htmlContent = this.getSubscriptionConfirmationTemplate(user, subscription);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send payment failed email
   */
  async sendPaymentFailedEmail(user, subscription) {
    const subject = 'Payment failed for your Herma Pro subscription';
    const htmlContent = this.getPaymentFailedTemplate(user, subscription);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send subscription cancellation email
   */
  async sendSubscriptionCancellationEmail(user, subscription) {
    const subject = 'Your Herma Pro subscription has been cancelled';
    const htmlContent = this.getSubscriptionCancellationTemplate(user, subscription);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send subscription expiring soon email
   */
  async sendSubscriptionExpiringEmail(user, subscription) {
    const subject = 'Your Herma Pro subscription expires soon';
    const htmlContent = this.getSubscriptionExpiringTemplate(user, subscription);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Send download link email
   */
  async sendDownloadLinkEmail(user, downloadToken, platform) {
    const subject = 'Your Herma Pro download is ready';
    const htmlContent = this.getDownloadLinkTemplate(user, downloadToken, platform);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  /**
   * Welcome email template
   */
  getWelcomeEmailTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Herma Pro</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Herma Pro!</h1>
            <p>Thank you for choosing private AI</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>Welcome to Herma Pro! You now have access to unlimited AI capabilities with complete privacy on your ${user.platform === 'mac' ? 'Mac' : 'Windows'} device.</p>
            
            <h3>What's next?</h3>
            <ol>
              <li>Download and install Herma Pro from your account</li>
              <li>Activate using your email address: ${user.email}</li>
              <li>Start using unlimited AI capabilities</li>
            </ol>
            
            <a href="${process.env.FRONTEND_URL}/download-success" class="button">Access Your Downloads</a>
            
            <h3>Need help?</h3>
            <p>Our support team is here to help you get started:</p>
            <ul>
              <li>📧 Email: support@herma.app</li>
              <li>📖 Documentation: ${process.env.FRONTEND_URL}/docs</li>
              <li>❓ FAQ: ${process.env.FRONTEND_URL}/#faq</li>
            </ul>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
            <p>You received this email because you signed up for Herma Pro.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Subscription confirmation email template
   */
  getSubscriptionConfirmationTemplate(user, subscription) {
    const nextBillingDate = new Date(subscription.current_period_end).toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Subscription Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .subscription-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Subscription Confirmed!</h1>
            <p>Your Herma Pro subscription is now active</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>Great news! Your payment was successful and your Herma Pro subscription is now active.</p>
            
            <div class="subscription-details">
              <h3>Subscription Details</h3>
              <p><strong>Plan:</strong> Herma Pro</p>
              <p><strong>Price:</strong> $9.99/month</p>
              <p><strong>Next billing date:</strong> ${nextBillingDate}</p>
              <p><strong>Platform:</strong> ${user.platform === 'mac' ? 'macOS' : 'Windows'}</p>
            </div>
            
            <a href="${process.env.FRONTEND_URL}/download-success" class="button">Download Herma Pro</a>
            
            <h3>What you get with Herma Pro:</h3>
            <ul>
              <li>✨ Unlimited AI interactions</li>
              <li>🚀 Advanced AI capabilities</li>
              <li>🔒 Complete privacy - all data stays on your device</li>
              <li>💬 Priority support</li>
              <li>🔄 Regular updates and new features</li>
            </ul>
            
            <p><small>You can cancel your subscription anytime from your account settings.</small></p>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Payment failed email template
   */
  getPaymentFailedTemplate(user, subscription) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Failed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Payment Failed</h1>
            <p>We couldn't process your payment</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>We were unable to process your payment for your Herma Pro subscription. This could be due to:</p>
            
            <ul>
              <li>Insufficient funds</li>
              <li>Expired card</li>
              <li>Card declined by your bank</li>
              <li>Incorrect billing information</li>
            </ul>
            
            <p>Please update your payment method to continue enjoying Herma Pro without interruption.</p>
            
            <a href="${process.env.FRONTEND_URL}/account/billing" class="button">Update Payment Method</a>
            
            <p>If you continue to experience issues, please contact our support team at support@herma.app</p>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Subscription cancellation email template
   */
  getSubscriptionCancellationTemplate(user, subscription) {
    const endDate = new Date(subscription.current_period_end).toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Subscription Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Subscription Cancelled</h1>
            <p>We're sorry to see you go</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>Your Herma Pro subscription has been cancelled as requested.</p>
            
            <h3>Important details:</h3>
            <ul>
              <li>Your subscription will remain active until <strong>${endDate}</strong></li>
              <li>You'll continue to have access to all Pro features until then</li>
              <li>No further charges will be made</li>
              <li>You can reactivate anytime before the end date</li>
            </ul>
            
            <a href="${process.env.FRONTEND_URL}/account" class="button">Reactivate Subscription</a>
            
            <h3>We'd love your feedback</h3>
            <p>If you have a moment, we'd appreciate knowing why you cancelled so we can improve Herma Pro for everyone.</p>
            
            <p>Thank you for being a Herma Pro user!</p>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Subscription expiring email template
   */
  getSubscriptionExpiringTemplate(user, subscription) {
    const endDate = new Date(subscription.current_period_end).toLocaleDateString();
    const daysLeft = Math.ceil((new Date(subscription.current_period_end) - new Date()) / (1000 * 60 * 60 * 24));
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Subscription Expiring Soon</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ffc107; color: #212529; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⏰ Subscription Expiring Soon</h1>
            <p>Don't lose access to Herma Pro</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>Your Herma Pro subscription expires in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong> (${endDate}).</p>
            
            <p>To continue enjoying unlimited AI capabilities with complete privacy, please update your payment method or reactivate your subscription.</p>
            
            <a href="${process.env.FRONTEND_URL}/account/billing" class="button">Update Payment Method</a>
            
            <h3>What you'll lose without Herma Pro:</h3>
            <ul>
              <li>❌ Unlimited AI interactions</li>
              <li>❌ Advanced AI features</li>
              <li>❌ Priority support</li>
              <li>❌ Latest updates and improvements</li>
            </ul>
            
            <p>Questions? Contact us at support@herma.app</p>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Download link email template
   */
  getDownloadLinkTemplate(user, downloadToken, platform) {
    const downloadUrl = `${process.env.API_URL}/download/${platform}/${downloadToken}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Herma Pro Download</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📥 Your Download is Ready</h1>
            <p>Herma Pro for ${platform === 'mac' ? 'macOS' : 'Windows'}</p>
          </div>
          <div class="content">
            <h2>Hi ${user.full_name},</h2>
            <p>Your Herma Pro download is ready! Click the button below to download the installer for your ${platform === 'mac' ? 'Mac' : 'Windows'} device.</p>
            
            <a href="${downloadUrl}" class="button">Download Herma Pro</a>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> This download link expires in 1 hour for security reasons. If you need a new link, please visit your account page.
            </div>
            
            <h3>Installation Instructions:</h3>
            <ol>
              <li>Download the installer using the button above</li>
              <li>Run the installer and follow the setup wizard</li>
              <li>Launch Herma Pro and activate using your email: ${user.email}</li>
              <li>Start enjoying unlimited AI capabilities!</li>
            </ol>
            
            <h3>Need help?</h3>
            <p>Visit our <a href="${process.env.FRONTEND_URL}/docs">documentation</a> or contact support at support@herma.app</p>
          </div>
          <div class="footer">
            <p>© 2024 Herma. All rights reserved.</p>
            <p>This download link was requested from IP: ${process.env.REQUEST_IP || 'Unknown'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Strip HTML tags from content
   */
  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }

  /**
   * Send bulk emails (for newsletters, announcements)
   */
  async sendBulkEmail(recipients, subject, htmlContent, textContent = null) {
    const results = [];
    const batchSize = 10; // Send in batches to avoid rate limiting
    
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const promises = batch.map(recipient => 
        this.sendEmail(recipient.email, subject, htmlContent, textContent)
          .then(result => ({ success: true, email: recipient.email, result }))
          .catch(error => ({ success: false, email: recipient.email, error: error.message }))
      );
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
      
      // Wait between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(subject, message, data = {}) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      logger.warn('Admin email not configured');
      return;
    }

    const htmlContent = `
      <h2>${subject}</h2>
      <p>${message}</p>
      ${Object.keys(data).length > 0 ? `
        <h3>Additional Data:</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      ` : ''}
      <p><small>Sent at: ${new Date().toISOString()}</small></p>
    `;

    return await this.sendEmail(adminEmail, `[Herma Admin] ${subject}`, htmlContent);
  }
}

module.exports = new EmailService();