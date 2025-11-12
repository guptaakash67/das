import React, { useState, useEffect } from 'react';
import { Upload, Download, Calendar, Filter, TrendingUp, DollarSign, Package, MapPin } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data structure
const SAMPLE_DATA = `date,product,category,region,quantity,price,revenue
2024-01-01,Laptop,Electronics,East,4,507,2028
2024-01-01,Smartphone,Electronics,North,9,228,2052
2024-01-02,Tablet,Electronics,South,5,400,2000`;

const SalesDashboard = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    region: '',
    product: ''
  });

  // Extract unique values for filters
  const categories = [...new Set(data.map(d => d.category))];
  const regions = [...new Set(data.map(d => d.region))];
  const products = [...new Set(data.map(d => d.product))];

  // Parse CSV data
  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(/[,\t]/);
    
    return lines.slice(1).map(line => {
      const values = line.split(/[,\t]/);
      const obj = {};
      headers.forEach((header, i) => {
        const key = header.trim();
        const value = values[i]?.trim();
        
        if (key === 'date') obj[key] = value;
        else if (['quantity', 'price', 'revenue'].includes(key)) {
          obj[key] = parseFloat(value) || 0;
        } else {
          obj[key] = value;
        }
      });
      return obj;
    });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const parsed = parseCSV(text);
        setData(parsed);
        setFilteredData(parsed);
        setLoading(false);
      } catch (err) {
        alert('Error parsing file: ' + err.message);
        setLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Load sample data
  const loadSampleData = () => {
    const parsed = parseCSV(SAMPLE_DATA);
    setData(parsed);
    setFilteredData(parsed);
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...data];

    if (filters.startDate) {
      filtered = filtered.filter(d => d.date >= filters.startDate);
    }
    if (filters.endDate) {
      filtered = filtered.filter(d => d.date <= filters.endDate);
    }
    if (filters.category) {
      filtered = filtered.filter(d => d.category === filters.category);
    }
    if (filters.region) {
      filtered = filtered.filter(d => d.region === filters.region);
    }
    if (filters.product) {
      filtered = filtered.filter(d => d.product === filters.product);
    }

    setFilteredData(filtered);
  }, [filters, data]);

  // Calculate metrics
  const totalRevenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
  const totalSales = filteredData.reduce((sum, d) => sum + d.quantity, 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalOrders = filteredData.length;

  // Revenue trend data (daily)
  const revenueTrend = Object.values(
    filteredData.reduce((acc, d) => {
      if (!acc[d.date]) acc[d.date] = { date: d.date, revenue: 0 };
      acc[d.date].revenue += d.revenue;
      return acc;
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date));

  // Product-wise sales
  const productSales = Object.values(
    filteredData.reduce((acc, d) => {
      if (!acc[d.product]) acc[d.product] = { product: d.product, sales: 0, revenue: 0 };
      acc[d.product].sales += d.quantity;
      acc[d.product].revenue += d.revenue;
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  // Region-wise revenue
  const regionRevenue = Object.values(
    filteredData.reduce((acc, d) => {
      if (!acc[d.region]) acc[d.region] = { region: d.region, revenue: 0 };
      acc[d.region].revenue += d.revenue;
      return acc;
    }, {})
  );

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Sales Analytics Dashboard</h1>
          <p className="text-slate-600">Track your sales performance and revenue insights</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
              <Upload className="w-5 h-5" />
              <span>Upload CSV/Excel</span>
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={loadSampleData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Load Sample Data
            </button>
            <div className="text-sm text-slate-600">
              {data.length > 0 && `${data.length} records loaded`}
            </div>
          </div>
        </div>

        {/* Filters */}
        {data.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                <select
                  value={filters.region}
                  onChange={(e) => setFilters({...filters, region: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Regions</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                <select
                  value={filters.product}
                  onChange={(e) => setFilters({...filters, product: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Products</option>
                  {products.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <button
              onClick={() => setFilters({ startDate: '', endDate: '', category: '', region: '', product: '' })}
              className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* KPI Cards */}
        {filteredData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total Revenue</span>
                </div>
                <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total Sales</span>
                </div>
                <div className="text-3xl font-bold">{totalSales.toLocaleString()}</div>
              </div>
              
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Avg Order Value</span>
                </div>
                <div className="text-3xl font-bold">${avgOrderValue.toFixed(2)}</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-8 h-8 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Total Orders</span>
                </div>
                <div className="text-3xl font-bold">{totalOrders.toLocaleString()}</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Product Sales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Product-wise Sales</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productSales.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="product" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Region Revenue */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Region</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ region, percent }) => `${region}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {regionRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Empty State */}
        {data.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Upload className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Data Available</h3>
            <p className="text-slate-600 mb-4">Upload a CSV file or load sample data to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;