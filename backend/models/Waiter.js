const mongoose = require('mongoose');

const waiterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'busy', 'break', 'off'],
    default: 'active'
  },
  assignedTables: [{
    type: String
  }],
  shift: {
    type: String,
    enum: ['day', 'night'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Waiter', waiterSchema); 