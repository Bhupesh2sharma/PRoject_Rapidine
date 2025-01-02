const express = require('express');
const router = express.Router();
const CustomerSession = require('../models/CustomerSession');

// Check if table is available
router.get('/check/:tableNumber', async (req, res) => {
  try {
    const { tableNumber } = req.params;
    const existingSession = await CustomerSession.findOne({ 
      tableNumber, 
      active: true 
    });
    
    res.json({ 
      isOccupied: !!existingSession,
      sessionDetails: existingSession ? {
        customerName: existingSession.customerName,
        numberOfPeople: existingSession.numberOfPeople,
        startTime: existingSession.createdAt
      } : null
    });
  } catch (error) {
    console.error('Table check error:', error);
    res.status(500).json({ message: 'Error checking table availability' });
  }
});

// Create new session
router.post('/', async (req, res) => {
  try {
    const { tableNumber, customerName, numberOfPeople } = req.body;

    // Validate inputs
    if (!tableNumber || !customerName || !numberOfPeople) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing active session
    const existingSession = await CustomerSession.findOne({ 
      tableNumber, 
      active: true 
    });

    if (existingSession) {
      return res.status(400).json({ 
        message: 'This table is currently occupied',
        sessionDetails: {
          customerName: existingSession.customerName,
          numberOfPeople: existingSession.numberOfPeople,
          startTime: existingSession.createdAt
        }
      });
    }

    // Create new session
    const session = new CustomerSession({
      tableNumber: tableNumber.trim(),
      customerName: customerName.trim(),
      numberOfPeople: parseInt(numberOfPeople),
      active: true
    });

    const savedSession = await session.save();
    console.log('New session created:', savedSession);

    res.status(201).json(savedSession);

  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ 
      message: 'Error creating session',
      error: error.message 
    });
  }
});

module.exports = router; 