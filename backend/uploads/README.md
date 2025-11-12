# Sales & Revenue Analytics Backend API

Complete Node.js + Express + MongoDB backend for the Sales Analytics Dashboard.

## 🚀 Features

- ✅ CSV/Excel file upload and parsing
- ✅ MongoDB data storage with indexing
- ✅ RESTful API endpoints
- ✅ Advanced filtering and aggregation
- ✅ Sales trend analysis (daily/weekly/monthly)
- ✅ Product, category, and region analytics
- ✅ Error handling and validation
- ✅ CORS enabled for frontend integration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - Local or MongoDB Atlas
- npm or yarn

## 🔧 Installation

1. **Clone or create the project directory**
   ```bash
   mkdir sales-analytics-backend
   cd sales-analytics-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/sales_analytics
   PORT=5000
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

### Upload Sales Data
```
POST /api/upload
Content-Type: multipart/form-data
Body: { file: <CSV or Excel file> }

Response: {
  "success": true,
  "message": "Successfully imported 100 records",
  "count": 100
}
```

### Get Sales Data
```
GET /api/sales?startDate=2024-01-01&endDate=2024-12-31&category=Electronics&region=East&page=1&limit=100

Response: {
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1000,
    "pages": 10
  }
}
```

### Get Summary Analytics
```
GET /api/analytics/summary?startDate=2024-01-01&endDate=2024-12-31

Response: {
  "success": true,
  "data": {
    "totalRevenue": 1500000,
    "totalSales": 5000,
    "totalOrders": 1200,
    "avgOrderValue": 300
  }
}
```

### Get Sales Trends
```
GET /api/analytics/trends?groupBy=day&startDate=2024-01-01&endDate=2024-01-31

Parameters:
- groupBy: day | week | month
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- category: optional
- region: optional

Response: {
  "success": true,
  "data": [
    { "date": "2024-01-01", "revenue": 15000, "sales": 50, "orders": 25 },
    { "date": "2024-01-02", "revenue": 18000, "sales": 60, "orders": 30 }
  ]
}
```

### Get Product Analytics
```
GET /api/analytics/products?limit=10

Response: {
  "success": true,
  "data": [
    { "product": "Laptop", "revenue": 500000, "sales": 200, "orders": 150 },
    { "product": "Smartphone", "revenue": 400000, "sales": 400, "orders": 300 }
  ]
}
```

### Get Category Analytics
```
GET /api/analytics/categories

Response: {
  "success": true,
  "data": [
    { "category": "Electronics", "revenue": 1200000, "sales": 3000, "orders": 800 }
  ]
}
```

### Get Region Analytics
```
GET /api/analytics/regions

Response: {
  "success": true,
  "data": [
    { "region": "East", "revenue": 400000, "sales": 1200, "orders": 300 },
    { "region": "West", "revenue": 350000, "sales": 1100, "orders": 280 }
  ]
}
```

### Get Filter Options
```
GET /api/filters

Response: {
  "success": true,
  "data": {
    "products": ["Laptop", "Smartphone", "Tablet"],
    "categories": ["Electronics", "Accessories"],
    "regions": ["East", "West", "North", "South"]
  }
}
```

### Clear All Data (Testing)
```
DELETE /api/sales/clear

Response: {
  "success": true,
  "message": "Deleted 1000 records"
}
```

## 📊 Data Format

### CSV/Excel File Format
```csv
date,product,category,region,quantity,price,revenue
2024-01-01,Laptop,Electronics,East,4,507,2028
2024-01-01,Smartphone,Electronics,North,9,228,2052
```

**Required Fields:**
- `date`: YYYY-MM-DD format
- `product`: Product name
- `category`: Product category
- `region`: Sales region
- `quantity`: Number of units sold
- `price`: Unit price
- `revenue`: Total revenue (quantity × price)

## 🗄️ Database Schema

```javascript
{
  date: Date,           // Sales date
  product: String,      // Product name (indexed)
  category: String,     // Category (indexed)
  region: String,       // Region (indexed)
  quantity: Number,     // Quantity sold
  price: Number,        // Unit price
  revenue: Number,      // Total revenue
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

## 🔍 Query Parameters

Most endpoints support these optional query parameters:

- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `product`: Filter by product name
- `category`: Filter by category
- `region`: Filter by region
- `page`: Page number for pagination (default: 1)
- `limit`: Results per page (default: 100)

## 🛠️ Error Handling

All endpoints return errors in this format:
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

## 🧪 Testing

Test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)

Example cURL command:
```bash
# Upload CSV file
curl -X POST http://localhost:5000/api/upload \
  -F "file=@sales_data.csv"

# Get sales summary
curl http://localhost:5000/api/analytics/summary
```

## 📝 Notes

- The `uploads/` directory stores temporary files during upload processing
- Files are automatically deleted after processing
- MongoDB indexes are created on `date`, `product`, `category`, and `region` for better query performance
- Use MongoDB Atlas for cloud deployment

## 🚢 Deployment

### Using MongoDB Atlas (Cloud)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sales_analytics
   ```

### Deploy to Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_connection_string
git push heroku main
```

### Deploy to Vercel/Railway/Render

Follow their Node.js deployment guides and set environment variables.

## 🤝 Integration with Frontend

Update your React frontend to use this API:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Upload file
const formData = new FormData();
formData.append('file', file);
await fetch(`${API_BASE_URL}/upload`, {
  method: 'POST',
  body: formData
});

// Get analytics
const response = await fetch(`${API_BASE_URL}/analytics/summary`);
const data = await response.json();
```

## 📄 License

MIT