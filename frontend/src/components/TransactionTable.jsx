import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'

const statusStyles = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  failed: 'bg-danger/10 text-danger',
  flagged: 'bg-danger/10 text-danger',
}

const TransactionTable = ({ transactions, showRisk = true }) => {
  const navigate = useNavigate()

  const handleRowClick = (txId) => {
    // Navigate to transaction details (would need a details page)
    // For now, just alert
    alert(`View details for transaction #${txId}`)
    // navigate(`/transaction/${txId}`)
  }

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {showRisk && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
              )}
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => handleRowClick(tx.id)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{tx.id.slice(0, 8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(tx.amount)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[tx.status]}`}>
                    {tx.status}
                  </span>
                </td>
                {showRisk && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      tx.riskScore > 70 ? 'text-danger' : tx.riskScore > 40 ? 'text-warning' : 'text-success'
                    }`}>
                      {tx.riskScore}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionTable