import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react'
import { adminService } from '../../services/admin'
import SkeletonLoader from '../../components/SkeletonLoader'

const Alerts = () => {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    adminService.getAlerts()
      .then(setAlerts)
      .finally(() => setLoading(false))
  }, [])

  const handleAction = (action, alertId) => {
    alert(`${action} alert ${alertId}`)
  }

  const severityStyles = {
    high: 'bg-danger/10 text-danger border-danger/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    low: 'bg-success/10 text-success border-success/20'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor and manage suspicious activities</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90 transition">
          Export Alerts
        </button>
      </div>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-surface rounded-2xl border p-6 ${severityStyles[alert.severity]} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${severityStyles[alert.severity]}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.message}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${severityStyles[alert.severity]}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Transaction ID: <span className="font-mono">{alert.transactionId}</span>
                    </p>
                    <p className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction('View', alert.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAction('Resolve', alert.id)}
                    className="p-2 text-success hover:bg-success/10 rounded-lg transition"
                    title="Mark as resolved"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleAction('Dismiss', alert.id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition"
                    title="Dismiss"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Alerts