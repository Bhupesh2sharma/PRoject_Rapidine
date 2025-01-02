const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');

// Get all menu items (public route)
router.get('/', async (req, res) => {
    try {
        console.log('Attempting to fetch menu items...');
        const menuItems = await Menu.find().sort({ category: 1 });
        console.log('Found menu items:', menuItems);
        
        if (!menuItems || menuItems.length === 0) {
            console.log('No menu items found in database');
        }
        
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ 
            message: 'Error fetching menu items',
            error: error.message 
        });
    }
});

// Add new menu item (admin only)
router.post('/', auth, async (req, res) => {
    try {
        console.log('Received new menu item data:', req.body);
        const { name, description, price, category, image } = req.body;
        
        const newMenuItem = new Menu({
            name,
            description,
            price: parseFloat(price),
            category,
            image
        });

        const savedMenuItem = await newMenuItem.save();
        console.log('Saved new menu item:', savedMenuItem);
        res.status(201).json(savedMenuItem);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ 
            message: 'Error creating menu item',
            error: error.message 
        });
    }
});

// Update menu item (admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const menuItem = await Menu.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.json(menuItem);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ message: 'Error updating menu item' });
    }
});

// Delete menu item (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const menuItem = await Menu.findByIdAndDelete(id);
        
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Error deleting menu item' });
    }
});

module.exports = router;
