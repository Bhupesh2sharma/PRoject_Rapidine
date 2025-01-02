const { check, validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: errors.array() 
      });
    }
    next();
  };
};

exports.validateLogin = [
  check('username').trim().notEmpty().withMessage('Username is required'),
  check('password').trim().notEmpty().withMessage('Password is required')
];

exports.validateRegister = [
  check('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  check('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('role')
    .optional()
    .isIn(['admin', 'waiter']).withMessage('Invalid role specified')
]; 