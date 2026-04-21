import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import TransactionTable from '../../components/TransactionTable'
import SkeletonLoader from '../../components/SkeletonLoader'
import { paymentService } from '../../services/payment'

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    paymentService.getUserTransactions({ limit: 50 })
      .then(setTransactions)
      .finally(() => setLoading(false))
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || tx.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-1">View all your past transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search transactions..."
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

export default TransactionHistory