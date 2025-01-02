const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validate, validateLogin, validateRegister } = require('../middleware/validate');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { authLimiter, sensitiveOpLimiter } = require('../middleware/rateLimit');

// Register new user (Admin only)
router.post('/register', 
  sensitiveOpLimiter,
  protect, 
  authorize('admin'),
  validate(validateRegister),
  async (req, res) => {
    try {
      const { username, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create new user
      const user = await User.create({
        username,
        password,
        role: role || 'waiter'
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }
);

// Login
router.post('/login',
  authLimiter,
  validate(validateLogin),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).json({ message: 'Login error' });
    }
  }
);

// Refresh token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router; 