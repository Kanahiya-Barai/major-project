import { TrendingUp, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { riskColor } from '../utils/riskColor'

const RiskCard = ({ title, value, change, riskLevel, icon: Icon, filterType, formatValue }) => {
  const colorClasses = riskColor(riskLevel)
  const navigate = useNavigate()
  const normalizedChange = Number(change)
  const showChange = Number.isFinite(normalizedChange) && normalizedChange !== 0
  const displayValue = formatValue ? formatValue(value) : value

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="break-words text-2xl font-bold leading-tight text-gray-900">{displayValue}</p>
          {showChange && (
            <p className={`mt-1 flex items-center gap-1 text-sm ${normalizedChange > 0 ? 'text-success' : 'text-danger'}`}>
              {normalizedChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(normalizedChange)}%
            </p>
          )}
        </div>
        <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${colorClasses.bg} ${colorClasses.text}`}>
          {riskLevel}
        </div>
      </div>
    </div>
  )
}

export default RiskCard
