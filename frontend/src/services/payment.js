import api from './api'

export const paymentService = {
  async createPayment({ amount, receiverName, receiverAccount, failedAttempts = 0 }) {
    const { data } = await api.post('/payment/create', {
      amount,
      receiver_name: receiverName,
      receiver_account: receiverAccount,
      failed_attempts: failedAttempts,
    })
    return data
  },

  async getUserTransactions({ limit } = {}) {
    const { data } = await api.get('/payment/transactions', {
      params: limit ? { limit } : undefined,
    })
    return data
  },

  async getUserStats() {
    const { data } = await api.get('/payment/stats')
    return data
  },

  async getSpendingTrend() {
    const { data } = await api.get('/payment/analytics/spending-trend')
    return data
  },

  async getRiskDistribution() {
    const { data } = await api.get('/payment/analytics/risk-distribution')
    return data
  },
}
