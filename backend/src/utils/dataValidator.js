// src/utils/dataValidator.js

const validateAndTransformData = (data) => {
  const errors = [];
  const transformedData = [];

  data.forEach((row, index) => {
    try {
      // Extract fields (handle different casing)
      const date = row.date || row.Date;
      const product = row.product || row.Product;
      const category = row.category || row.Category;
      const region = row.region || row.Region;
      const quantity = row.quantity || row.Quantity;
      const price = row.price || row.Price;
      const revenue = row.revenue || row.Revenue;

      // Validate required fields
      if (!date) {
        errors.push(`Row ${index + 1}: Missing date`);
        return;
      }
      if (!product) {
        errors.push(`Row ${index + 1}: Missing product`);
        return;
      }
      if (!category) {
        errors.push(`Row ${index + 1}: Missing category`);
        return;
      }
      if (!region) {
        errors.push(`Row ${index + 1}: Missing region`);
        return;
      }

      // Parse and validate numeric fields
      const parsedQuantity = parseFloat(quantity);
      const parsedPrice = parseFloat(price);
      const parsedRevenue = parseFloat(revenue);

      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        errors.push(`Row ${index + 1}: Invalid quantity (${quantity})`);
        return;
      }
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        errors.push(`Row ${index + 1}: Invalid price (${price})`);
        return;
      }
      if (isNaN(parsedRevenue) || parsedRevenue < 0) {
        errors.push(`Row ${index + 1}: Invalid revenue (${revenue})`);
        return;
      }

      // Parse date
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        errors.push(`Row ${index + 1}: Invalid date format (${date})`);
        return;
      }

      // Transform data
      transformedData.push({
        date: parsedDate,
        product: product.trim(),
        category: category.trim(),
        region: region.trim(),
        quantity: parsedQuantity,
        price: parsedPrice,
        revenue: parsedRevenue
      });

    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`);
    }
  });

  // Throw error if any validation failed
  if (errors.length > 0) {
    const errorMessage = errors.slice(0, 10).join('; ');
    const remainingErrors = errors.length > 10 ? ` and ${errors.length - 10} more errors` : '';
    throw new Error(`Validation failed: ${errorMessage}${remainingErrors}`);
  }

  console.log(`✅ Validated ${transformedData.length} records`);
  return transformedData;
};

module.exports = { validateAndTransformData };