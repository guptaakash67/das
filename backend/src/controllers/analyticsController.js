// src/controllers/analyticsController.js
const Sales = require('../models/Sales');

// Get Summary Analytics
const getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate, product, category, region } = req.query;

    // Build match query
    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    if (product) matchQuery.product = product;
    if (category) matchQuery.category = category;
    if (region) matchQuery.region = region;

    const result = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalSales: { $sum: '$quantity' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$revenue' }
        }
      }
    ]);

    const summary = result[0] || {
      totalRevenue: 0,
      totalSales: 0,
      totalOrders: 0,
      avgOrderValue: 0
    };

    res.json({ success: true, data: summary });

  } catch (error) {
    next(error);
  }
};

// Get Sales Trends
const getTrends = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day', category, region } = req.query;

    // Build match query
    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    if (category) matchQuery.category = category;
    if (region) matchQuery.region = region;

    // Group by date format
    let dateFormat;
    switch (groupBy) {
      case 'month':
        dateFormat = { $dateToString: { format: '%Y-%m', date: '$date' } };
        break;
      case 'week':
        dateFormat = { $dateToString: { format: '%Y-W%V', date: '$date' } };
        break;
      default:
        dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$date' } };
    }

    const trends = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: dateFormat,
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          revenue: 1,
          sales: 1,
          orders: 1
        }
      }
    ]);

    res.json({ success: true, data: trends });

  } catch (error) {
    next(error);
  }
};

// Get Product Analytics
const getProductAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, category, region, limit = 10 } = req.query;

    // Build match query
    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    if (category) matchQuery.category = category;
    if (region) matchQuery.region = region;

    const products = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$product',
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 0,
          product: '$_id',
          revenue: 1,
          sales: 1,
          orders: 1
        }
      }
    ]);

    res.json({ success: true, data: products });

  } catch (error) {
    next(error);
  }
};

// Get Category Analytics
const getCategoryAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, region } = req.query;

    // Build match query
    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    if (region) matchQuery.region = region;

    const categories = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          revenue: 1,
          sales: 1,
          orders: 1
        }
      }
    ]);

    res.json({ success: true, data: categories });

  } catch (error) {
    next(error);
  }
};

// Get Region Analytics
const getRegionAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, category, product } = req.query;

    // Build match query
    const matchQuery = {};
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }
    if (category) matchQuery.category = category;
    if (product) matchQuery.product = product;

    const regions = await Sales.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$region',
          revenue: { $sum: '$revenue' },
          sales: { $sum: '$quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      {
        $project: {
          _id: 0,
          region: '$_id',
          revenue: 1,
          sales: 1,
          orders: 1
        }
      }
    ]);

    res.json({ success: true, data: regions });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getTrends,
  getProductAnalytics,
  getCategoryAnalytics,
  getRegionAnalytics
};