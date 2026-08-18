import { X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

const AlertPopup = ({ alert, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  if (!alert) return null

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="absolute bottom-6 right-6 animate-in slide-in-from-bottom-2 fade-in duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="bg-surface rounded-2xl shadow-lg border border-danger/20 p-4 max-w-sm cursor-pointer hover:shadow-xl transition-shadow"
          onClick={onClick}
        >
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-danger" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900">Fraud Alert</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                Transaction ID: #{alert.transactionId}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertPopup
