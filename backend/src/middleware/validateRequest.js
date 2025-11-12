// src/middleware/validateRequest.js

const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && isNaN(Date.parse(startDate))) {
    return res.status(400).json({
      error: 'Invalid start date',
      details: 'Start date must be in YYYY-MM-DD format'
    });
  }

  if (endDate && isNaN(Date.parse(endDate))) {
    return res.status(400).json({
      error: 'Invalid end date',
      details: 'End date must be in YYYY-MM-DD format'
    });
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({
      error: 'Invalid date range',
      details: 'Start date must be before end date'
    });
  }

  next();
};

const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      error: 'Invalid page number',
      details: 'Page must be a positive integer'
    });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 1000)) {
    return res.status(400).json({
      error: 'Invalid limit',
      details: 'Limit must be between 1 and 1000'
    });
  }

  next();
};

const validateGroupBy = (req, res, next) => {
  const { groupBy } = req.query;
  const validGroupBy = ['day', 'week', 'month'];

  if (groupBy && !validGroupBy.includes(groupBy)) {
    return res.status(400).json({
      error: 'Invalid groupBy parameter',
      details: `groupBy must be one of: ${validGroupBy.join(', ')}`
    });
  }

  next();
};

module.exports = {
  validateDateRange,
  validatePagination,
  validateGroupBy
};