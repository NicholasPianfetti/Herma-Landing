// backend/middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');
const Joi = require('joi');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('platform')
    .isIn(['windows', 'mac'])
    .withMessage('Platform must be either windows or mac'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),
  
  body('postal_code')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Postal code must be 20 characters or less'),
  
  handleValidationErrors
];

/**
 * Payment intent validation
 */
const validatePaymentIntent = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('platform')
    .isIn(['windows', 'mac'])
    .withMessage('Platform must be either windows or mac'),
  
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country is required'),
  
  handleValidationErrors
];

/**
 * Subscription confirmation validation
 */
const validateSubscriptionConfirmation = [
  body('subscriptionId')
    .matches(/^sub_[a-zA-Z0-9_]+$/)
    .withMessage('Invalid subscription ID format'),
  
  body('userId')
    .isUUID(4)
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

/**
 * Download request validation
 */
const validateDownloadRequest = [
  param('platform')
    .isIn(['windows', 'mac'])
    .withMessage('Platform must be either windows or mac'),
  
  param('token')
    .isLength({ min: 32, max: 128 })
    .isAlphanumeric()
    .withMessage('Invalid token format'),
  
  handleValidationErrors
];

/**
 * Subscription cancellation validation
 */
const validateSubscriptionCancellation = [
  body('subscriptionId')
    .matches(/^sub_[a-zA-Z0-9_]+$/)
    .withMessage('Invalid subscription ID format'),
  
  body('userId')
    .isUUID(4)
    .withMessage('Invalid user ID format'),
  
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cancellation reason must be 500 characters or less'),
  
  handleValidationErrors
];

/**
 * User ID parameter validation
 */
const validateUserId = [
  param('userId')
    .isUUID(4)
    .withMessage('Invalid user ID format'),
  
  handleValidationErrors
];

/**
 * Email validation
 */
const validateEmail = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

/**
 * Advanced validation using Joi for complex objects
 */
const createJoiValidator = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    req.body = value; // Use validated and sanitized data
    next();
  };
};

/**
 * Joi schemas for complex validation
 */
const schemas = {
  userProfile: Joi.object({
    full_name: Joi.string().trim().min(2).max(100).required(),
    country: Joi.string().trim().min(2).max(100).optional(),
    postal_code: Joi.string().trim().max(20).optional(),
    platform: Joi.string().valid('windows', 'mac').required()
  }),
  
  paymentData: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().trim().min(2).max(100).required(),
    platform: Joi.string().valid('windows', 'mac').required(),
    country: Joi.string().trim().min(2).max(100).required(),
    postal_code: Joi.string().trim().max(20).optional(),
    metadata: Joi.object().optional()
  }),
  
  webhookData: Joi.object({
    id: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.object().required(),
    created: Joi.number().required()
  })
};

/**
 * Sanitize input data
 */
const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS attempts
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };
  
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };
  
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  next();
};

/**
 * Validate file upload
 */
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }
    
    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }
    
    // Check file size
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
      });
    }
    
    next();
  };
};

/**
 * Validate IP address for rate limiting
 */
const validateIP = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  // Basic IP validation
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (!ipRegex.test(ip)) {
    return res.status(400).json({
      error: 'Invalid IP address'
    });
  }
  
  req.clientIP = ip;
  next();
};

module.exports = {
  // Express-validator middleware
  validateUserRegistration,
  validatePaymentIntent,
  validateSubscriptionConfirmation,
  validateDownloadRequest,
  validateSubscriptionCancellation,
  validateUserId,
  validateEmail,
  validatePagination,
  
  // Joi validation
  createJoiValidator,
  schemas,
  
  // General validation utilities
  handleValidationErrors,
  sanitizeInput,
  validateFileUpload,
  validateIP
};