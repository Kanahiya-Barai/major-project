import api from './api'
import { formatCurrency } from '../utils/formatCurrency'

export const adminService = {
  async getStats() {
    const { data: transactions } = await api.get('/payment/transactions')
    const { data: usersCount } = await api.get('/users/count')

    const totalVolumeValue = transactions
      .filter((tx) => tx.status !== 'failed')
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

    const avgRiskScore =
      transactions.length > 0
        ? transactions.reduce((sum, tx) => sum + Number(tx.riskScore || 0), 0) / transactions.length
        : 0

    const fraudAlerts = transactions.filter((tx) => Number(tx.riskScore || 0) > 70 || tx.status === 'failed').length

    return {
      totalVolume: formatCurrency(totalVolumeValue),
      volumeChange: 0,
      activeUsers: usersCount?.count ?? 0,
      usersChange: 0,
      fraudAlerts,
      fraudChange: 0,
      avgRiskScore: Math.round(avgRiskScore),
    }
  },

  async getRecentTransactions({ limit = 50 } = {}) {
    const { data } = await api.get('/payment/transactions', {
      params: limit ? { limit } : undefined,
    })
    return data
  },

  async getAlerts() {
    const { data: transactions } = await api.get('/payment/transactions')
    const alerts = transactions
      .filter((tx) => Number(tx.riskScore || 0) > 40 || tx.status === 'failed')
      .slice(0, 20)
      .map((tx, index) => {
        const score = Number(tx.riskScore || 0)
        const severity = score > 70 || tx.status === 'failed' ? 'high' : score > 55 ? 'medium' : 'low'
        const message =
          tx.status === 'failed'
            ? 'Transaction failed due to fraud risk'
            : score > 70
              ? 'High risk score transaction detected'
              : 'Unusual transaction risk detected'

        return {
          id: `alert_${index}_${tx.id}`,
          transactionId: tx.id,
          message,
          severity,
          timestamp: new Date().toISOString(),
        }
      })

    return alerts
  },

  async getUsers() {
    const { data } = await api.get('/users')
    return data
  }
}
