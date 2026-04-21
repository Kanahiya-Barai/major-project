import { useState } from 'react'
import { FileText, Download, TrendingUp, TrendingDown, Users, CreditCard, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Reports = () => {
  const [dateRange, setDateRange] = useState('last30days')

  const revenueData = [
    { month: 'Jan', revenue: 45000, transactions: 120 },
    { month: 'Feb', revenue: 52000, transactions: 145 },
    { month: 'Mar', revenue: 48000, transactions: 132 },
    { month: 'Apr', revenue: 61000, transactions: 168 },
    { month: 'May', revenue: 55000, transactions: 150 },
    { month: 'Jun', revenue: 67000, transactions: 185 },
  ]

  const riskData = [
    { name: 'Low Risk', value: 1245 },
    { name: 'Medium Risk', value: 423 },
    { name: 'High Risk', value: 87 },
  ]

  const handleExport = (format) => {
    alert(`Export report as ${format}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and export detailed reports</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          >
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last90days">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Revenue</h3>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹3,28,000</p>
          <p className="text-sm text-success mt-1">+12.5% from last period</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Transactions</h3>
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">900</p>
          <p className="text-sm text-success mt-1">+8.2% from last period</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Active Users</h3>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,243</p>
          <p className="text-sm text-success mt-1">+5.1% from last period</p>
        </div>
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 text-sm font-medium">Fraud Rate</h3>
            <TrendingDown className="h-5 w-5 text-success" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0.8%</p>
          <p className="text-sm text-success mt-1">-0.3% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Transaction Summary', icon: CreditCard },
            { name: 'Risk Assessment', icon: AlertTriangle },
            { name: 'User Activity', icon: Users },
          ].map((report) => (
            <div key={report.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium text-gray-900">{report.name}</span>
              </div>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
