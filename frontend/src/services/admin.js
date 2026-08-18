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
    const { data } = await api.get('/payment/alerts')
    return data
  },

  async updateAlert(alertId, payload) {
    const { data } = await api.post(`/payment/alerts/${alertId}`, payload)
    return data
  },

  async getModelMetrics() {
    const { data } = await api.get('/payment/model-metrics')
    return data
  },

  async getUsers() {
    const { data } = await api.get('/users')
    return data
  },

  async getFraudRing() {
    const { data } = await api.get('/payment/fraud-ring')
    return data
  }
}
