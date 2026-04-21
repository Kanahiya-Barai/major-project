import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { riskColor } from '../utils/riskColor'

const RiskCard = ({ title, value, change, riskLevel, icon: Icon, filterType }) => {
  const colorClasses = riskColor(riskLevel)
  const navigate = useNavigate()

  const handleClick = () => {
    if (filterType) {
      // Navigate to filtered view
      navigate(`/transactions?risk=${riskLevel.toLowerCase()}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-surface rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
        filterType ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses.bg}`}>
          <Icon className={`h-5 w-5 ${colorClasses.text}`} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm flex items-center gap-1 mt-1 ${change > 0 ? 'text-success' : 'text-danger'}`}>
              {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
          {riskLevel}
        </div>
      </div>
    </div>
  )
}

export default RiskCard