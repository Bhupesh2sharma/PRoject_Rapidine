const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Staff = require('../models/Staff');
const auth = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with:', req.body);
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    console.log('Admin found:', admin ? 'Yes' : 'No');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValidPassword ? 'Yes' : 'No');

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful, token generated');

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get all orders
router.get('/orders', auth, async (req, res) => {
    try {
        // Add cache control headers
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const { date } = req.query;
        let query = {};

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

router.use((req, res, next) => {
  console.log('Admin Route accessed:', req.method, req.path);
  next();
});

router.get('/dashboard-stats', async (req, res) => {
  console.log('Dashboard stats route hit');
  try {
      // Get total orders
      const totalOrders = await Order.countDocuments();
      console.log('Total orders:', totalOrders);
      
      // Get active orders
      const activeOrders = await Order.countDocuments({
          status: { $in: ['pending', 'preparing'] }
      });
      console.log('Active orders:', activeOrders);

      // Get total menu items
      const totalMenuItems = await MenuItem.countDocuments();
      console.log('Total menu items:', totalMenuItems);

      // Get total staff
      const totalStaff = await Staff.countDocuments();
      console.log('Total staff:', totalStaff);

      const stats = {
          totalOrders,
          activeOrders,
          totalMenuItems,
          totalStaff
      };
      
      console.log('Sending stats:', stats);
      res.json(stats);
  } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ message: error.message });
  }
});


module.exports = router; 