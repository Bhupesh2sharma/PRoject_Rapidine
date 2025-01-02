const mongoose = require('mongoose');

const customerSessionSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Table number is required'],
    trim: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'],
    min: [1, 'Number of people must be at least 1']
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
customerSessionSchema.index({ tableNumber: 1, active: 1 });

module.exports = mongoose.model('CustomerSession', customerSessionSchema); 