const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { tableNumber, customerName, items, total } = req.body;
        
        const newOrder = new Order({
            tableNumber,
            customerName,
            items,
            total,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();
        console.log('New order created:', savedOrder); // Debug log
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get all orders (for testing)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        console.log('Fetched orders:', orders); // Debug log
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

module.exports = router;
