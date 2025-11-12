// src/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { validateDateRange, validateGroupBy } = require('../middleware/validateRequest');
const {
  getSummary,
  getTrends,
  getProductAnalytics,
  getCategoryAnalytics,
  getRegionAnalytics
} = require('../controllers/analyticsController');

// Get summary analytics (total revenue, sales, orders, avg order value)
router.get('/summary', validateDateRange, getSummary);

// Get sales trends (daily/weekly/monthly)
router.get('/trends', validateDateRange, validateGroupBy, getTrends);

// Get product-wise analytics
router.get('/products', validateDateRange, getProductAnalytics);

// Get category-wise analytics
router.get('/categories', validateDateRange, getCategoryAnalytics);

// Get region-wise analytics
router.get('/regions', validateDateRange, getRegionAnalytics);

module.exports = router;