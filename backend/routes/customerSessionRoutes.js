const express = require('express');
const router = express.Router();
const CustomerSession = require('../models/CustomerSession');

// Debug log for routes
router.use((req, res, next) => {
    console.log(`CustomerSession Route: ${req.method} ${req.url}`);
    next();
});

// Check if table is occupied
router.get('/check/:tableNumber', async (req, res) => {
    try {
        const existingSession = await CustomerSession.findOne({
            tableNumber: req.params.tableNumber,
            active: true
        });
        
        res.json({
            isOccupied: !!existingSession,
            sessionDetails: existingSession
        });
    } catch (error) {
        console.error('Error checking table:', error);
        res.status(500).json({ message: error.message });
    }
});

// Create new customer session
router.post('/', async (req, res) => {
    console.log('Received session creation request:', req.body);
    
    try {
        const { tableNumber, customerName, numberOfPeople } = req.body;

        // Validate input
        if (!tableNumber || !customerName || !numberOfPeople) {
            return res.status(400).json({ 
                message: 'Missing required fields' 
            });
        }

        // Check if table is already occupied
        const existingSession = await CustomerSession.findOne({
            tableNumber,
            active: true
        });

        if (existingSession) {
            return res.status(400).json({ 
                message: 'Table is already occupied' 
            });
        }

        // Create new session
        const session = new CustomerSession({
            tableNumber,
            customerName,
            numberOfPeople,
            active: true
        });

        const savedSession = await session.save();
        console.log('Created new session:', savedSession);
        
        res.status(201).json(savedSession);
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 