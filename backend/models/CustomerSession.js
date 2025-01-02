const mongoose = require('mongoose');

const customerSessionSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomerSession', customerSessionSchema); 