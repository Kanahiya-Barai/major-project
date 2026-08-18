import { useState, useEffect } from 'react'
import { Search, Filter, Download } from 'lucide-react'
import TransactionTable from '../../components/TransactionTable'
import SkeletonLoader from '../../components/SkeletonLoader'
import { adminService } from '../../services/admin'

const csvColumns = [
  ['Transaction ID', (tx) => tx.id],
  ['Amount', (tx) => tx.amount],
  ['Status', (tx) => tx.status],
  ['Risk Score', (tx) => tx.riskScore],
  ['Risk Level', (tx) => tx.riskLevel],
  ['Decision', (tx) => tx.decision],
  ['Category', (tx) => tx.category],
  ['Date', (tx) => tx.date],
  ['Message', (tx) => tx.message],
]

const escapeCsvValue = (value) => {
  const normalized = value == null ? '' : String(value)
  const escaped = normalized.replace(/"/g, '""')
  return `"${escaped}"`
}

const Transactions = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    adminService.getRecentTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false))
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || tx.status === filter
    return matchesSearch && matchesFilter
  })

  const handleExportCsv = () => {
    const rows = [
      csvColumns.map(([label]) => escapeCsvValue(label)).join(','),
      ...filteredTransactions.map((transaction) =>
        csvColumns.map(([, getValue]) => escapeCsvValue(getValue(transaction))).join(','),
      ),
    ]
    const csvContent = rows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${filter}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">View and manage all platform transactions</p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={loading || filteredTransactions.length === 0}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="table" count={10} />
      ) : (
        <TransactionTable transactions={filteredTransactions} showRisk={true} />
      )}
    </div>
  )
}

export default Transactions
