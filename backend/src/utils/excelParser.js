// src/utils/excelParser.js
const xlsx = require('xlsx');

const parseExcelFile = (filePath) => {
  try {
    // Read workbook
    const workbook = xlsx.readFile(filePath);
    
    // Get first sheet name
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error('Excel file has no sheets');
    }
    
    // Get worksheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, {
      raw: false, // Convert dates to strings
      defval: '', // Default value for empty cells
      blankrows: false // Skip blank rows
    });

    // Clean headers (convert to lowercase)
    const cleanedData = data.map(row => {
      const cleanedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim().toLowerCase();
        cleanedRow[cleanKey] = row[key]?.toString().trim();
      });
      return cleanedRow;
    });

    console.log(`✅ Parsed ${cleanedData.length} rows from Excel`);
    return cleanedData;
    
  } catch (error) {
    console.error('❌ Excel Parse Error:', error);
    throw new Error('Failed to parse Excel file: ' + error.message);
  }
};

module.exports = { parseExcelFile };