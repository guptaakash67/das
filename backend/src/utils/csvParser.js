// src/utils/csvParser.js
const fs = require('fs');
const csvParser = require('csv-parser');

const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser({
        mapHeaders: ({ header }) => header.trim().toLowerCase(),
        skipEmptyLines: true
      }))
      .on('data', (data) => {
        // Clean and validate each row
        const cleanedData = {};
        Object.keys(data).forEach(key => {
          cleanedData[key] = data[key]?.trim();
        });
        results.push(cleanedData);
      })
      .on('end', () => {
        console.log(`✅ Parsed ${results.length} rows from CSV`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('❌ CSV Parse Error:', error);
        reject(new Error('Failed to parse CSV file: ' + error.message));
      });
  });
};

module.exports = { parseCSVFile };