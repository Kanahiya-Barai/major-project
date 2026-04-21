import { useState, useEffect } from 'react'
import { CreditCard, History, TrendingUp, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RiskCard from '../../components/RiskCard'
import TransactionTable from '../../components/TransactionTable'
import SkeletonLoader from '../../components/SkeletonLoader'
import { paymentService } from '../../services/payment'

const UserDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsData, txData] = await Promise.all([
          paymentService.getUserStats(),
          paymentService.getUserTransactions({ limit: 5 })
        ])
        setStats(statsData)
        setRecentTransactions(txData)
      } catch (error) {
        console.error('Failed to fetch dashboard data', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonLoader type="card" count={4} />
        <SkeletonLoader type="table" count={5} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RiskCard
          title="Total Spent"
          value={stats?.totalSpent}
          change={stats?.spentChange}
          riskLevel="Low"
          icon={CreditCard}
        />
        <RiskCard
          title="Transactions"
          value={stats?.transactionCount}
          change={stats?.txChange}
          riskLevel="Low"
          icon={History}
        />
        <RiskCard
          title="Average Risk Score"
          value={stats?.avgRiskScore}
          riskLevel={stats?.avgRiskScore > 40 ? 'Medium' : 'Low'}
          icon={Shield}
          filterType="risk"
        />
        <RiskCard
          title="Monthly Spend"
          value={stats?.monthlySpend}
          change={stats?.monthlyChange}
          riskLevel="Low"
          icon={TrendingUp}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button
            onClick={() => navigate('/user/transactions')}
            className="text-sm text-primary font-medium hover:underline"
          >
            View all
          </button>
        </div>
        <TransactionTable transactions={recentTransactions} showRisk={true} />
      </div>
    </div>
  )
}

export default UserDashboard