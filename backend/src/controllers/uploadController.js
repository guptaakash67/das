// src/controllers/uploadController.js
const fs = require('fs');
const path = require('path');
const Sales = require('../models/Sales');
const { parseCSVFile } = require('../utils/csvParser');
const { parseExcelFile } = require('../utils/excelParser');
const { validateAndTransformData } = require('../utils/dataValidator');

// Upload and Import Sales Data
const uploadSalesData = async (req, res, next) => {
  let filePath;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    console.log(`📤 Processing file: ${req.file.originalname}`);

    // Parse file based on type
    let rawData;
    if (fileExt === '.csv') {
      rawData = await parseCSVFile(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      rawData = parseExcelFile(filePath);
    } else {
      throw new Error('Unsupported file format');
    }

    // Validate and transform data
    const transformedData = validateAndTransformData(rawData);

    // Insert into database
    const result = await Sales.insertMany(transformedData, { ordered: false });

    console.log(`✅ Imported ${result.length} records`);

    res.json({
      success: true,
      message: `Successfully imported ${result.length} records`,
      count: result.length
    });

  } catch (error) {
    console.error('Upload Error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Duplicate records found',
        details: 'Some records already exist in the database'
      });
    }

    next(error);
  } finally {
    // Clean up uploaded file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  Cleaned up temporary file`);
    }
  }
};

// Get All Sales Data
const getAllSales = async (req, res, next) => {
  try {
    const { 
      startDate, 
      endDate, 
      product, 
      category, 
      region, 
      page = 1, 
      limit = 100 
    } = req.query;

    // Build query
    const query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (product) query.product = product;
    if (category) query.category = category;
    if (region) query.region = region;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sales = await Sales.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Sales.countDocuments(query);

    res.json({
      success: true,
      data: sales,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get Filter Options
const getFilterOptions = async (req, res, next) => {
  try {
    const [products, categories, regions] = await Promise.all([
      Sales.distinct('product'),
      Sales.distinct('category'),
      Sales.distinct('region')
    ]);

    res.json({
      success: true,
      data: {
        products: products.sort(),
        categories: categories.sort(),
        regions: regions.sort()
      }
    });

  } catch (error) {
    next(error);
  }
};

// Clear All Data
const clearAllData = async (req, res, next) => {
  try {
    const result = await Sales.deleteMany({});
    
    console.log(`🗑️  Deleted ${result.deletedCount} records`);
    
    res.json({ 
      success: true, 
      message: `Deleted ${result.deletedCount} records` 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSalesData,
  getAllSales,
  getFilterOptions,
  clearAllData
};