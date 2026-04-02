const { body, param, validationResult } = require("express-validator");

/**
 * Validation rules for numeric fields (IDs, counts, etc.)
 */
const validateNumeric = (fieldName) => {
  return body(fieldName)
    .trim()
    .isInt({ min: 1 })
    .withMessage(`${fieldName} must be a positive integer`);
};

/**
 * Validation rule for email fields
 */
const validateEmail = (fieldName) => {
  return body(fieldName)
    .trim()
    .isEmail()
    .withMessage(`${fieldName} must be a valid email address`)
    .normalizeEmail();
};

/**
 * Validation rule for text fields (no HTML/scripts)
 */
const validateText = (fieldName, minLength = 1, maxLength = 255) => {
  return body(fieldName)
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${fieldName} must be between ${minLength} and ${maxLength} characters`)
    .escape()
    .custom((value) => {
      if (/<script|<iframe|<img|javascript:|onerror|onload|onclick/i.test(value)) {
        throw new Error(`${fieldName} contains malicious content`);
      }
      return true;
    });
};

/**
 * Validation rule for password fields
 */
const validatePassword = () => {
  return body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom((value) => {
      if (/<script|<iframe|<img|javascript:|onerror|onload|onclick/i.test(value)) {
        throw new Error('Password contains invalid characters');
      }
      if (!/[A-Z]/.test(value)) {
        throw new Error('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(value)) {
        throw new Error('Password must contain at least one lowercase letter');
      }
      if (!/[0-9]/.test(value)) {
        throw new Error('Password must contain at least one number');
      }
      if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]/.test(value)) {
        throw new Error('Password must contain at least one special character');
      }
      return true;
    });
};

/**
 * Middleware to handle validation errors
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

module.exports = {
  validateNumeric,
  validateEmail,
  validateText,
  validatePassword,
  handleValidationErrors,
  body,
  param,
};
