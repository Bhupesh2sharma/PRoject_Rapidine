const rateLimit = require('express-rate-limit');

// Base rate limiter configuration
const createLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // Default: 15 minutes
    max: options.max || 100, // Default: 100 requests per windowMs
    message: options.message || 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limiters for different routes
exports.authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

exports.apiLimiter = createLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests from this IP, please try again after a minute'
});

exports.orderLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 orders per hour
  message: 'Order limit exceeded, please try again later'
});

exports.sensitiveOpLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: 'Too many sensitive operations attempted, please try again later'
}); 