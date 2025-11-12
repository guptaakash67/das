// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { validateDateRange, validatePagination } = require('../middleware/validateRequest');
const {
  uploadSalesData,
  getAllSales,
  getFilterOptions,
  clearAllData
} = require('../controllers/uploadController');

// Upload sales data
router.post('/upload', upload.single('file'), uploadSalesData);

// Get all sales data with filters
router.get('/sales', validateDateRange, validatePagination, getAllSales);

// Get filter options (products, categories, regions)
router.get('/filters', getFilterOptions);

// Clear all sales data (for testing)
router.delete('/sales/clear', clearAllData);

module.exports = router;