// src/models/Sales.js
const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: [true, 'Date is required'],
    index: true 
  },
  product: { 
    type: String, 
    required: [true, 'Product is required'],
    trim: true,
    index: true 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    index: true 
  },
  region: { 
    type: String, 
    required: [true, 'Region is required'],
    trim: true,
    index: true 
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be positive']
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  revenue: { 
    type: Number, 
    required: [true, 'Revenue is required'],
    min: [0, 'Revenue must be positive']
  }
}, { 
  timestamps: true,
  collection: 'sales'
});

// Compound indexes for common queries
salesSchema.index({ date: 1, category: 1 });
salesSchema.index({ date: 1, region: 1 });
salesSchema.index({ category: 1, region: 1 });

// Virtual for formatted date
salesSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Static method to get date range
salesSchema.statics.getDateRange = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        minDate: { $min: '$date' },
        maxDate: { $max: '$date' }
      }
    }
  ]);
  return result[0] || { minDate: null, maxDate: null };
};

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;