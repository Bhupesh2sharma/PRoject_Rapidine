const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const menuItems = [
  {
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, and basil',
    price: 299,
    category: 'Pizza',
    image: 'pizza.jpg'
  },
  {
    name: 'Chicken Burger',
    description: 'Grilled chicken patty with lettuce and special sauce',
    price: 199,
    category: 'Burgers',
    image: 'burger.jpg'
  }
  // Add more items as needed
];

mongoose.connect('mongodb://localhost:27017/Rapid_dine')
  .then(async () => {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error seeding menu items:', error);
    process.exit(1);
  }); 