const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route at root level
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

// Test route for menu
app.get('/test-menu', async (req, res) => {
    try {
        const menuItems = await mongoose.connection.db.collection('menuitems').find({}).toArray();
        res.json({ 
            message: 'Menu test route',
            items: menuItems,
            dbStatus: mongoose.connection.readyState
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            dbStatus: mongoose.connection.readyState
        });
    }
});

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        console.log('Connection string:', process.env.MONGODB_URI);
        
        // List all collections
        mongoose.connection.db.listCollections().toArray()
            .then(collections => {
                console.log('Available collections:', collections.map(c => c.name));
            })
            .catch(err => console.error('Error listing collections:', err));
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menu', menuRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

