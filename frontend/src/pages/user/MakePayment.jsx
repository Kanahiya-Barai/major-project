import { useMemo, useState } from 'react'
import { Calendar, CreditCard, Lock, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { paymentService } from '../../services/payment'

const decisionStyles = {
  ALLOW: {
    tone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    icon: ShieldCheck,
    title: 'Payment Approved',
  },
  OTP_REQUIRED: {
    tone: 'text-amber-700 bg-amber-50 border-amber-200',
    icon: ShieldQuestion,
    title: 'OTP Verification Required',
  },
  BLOCK: {
    tone: 'text-rose-700 bg-rose-50 border-rose-200',
    icon: ShieldAlert,
    title: 'Payment Blocked',
  },
}

const MakePayment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    receiverName: '',
    receiverAccount: '',
    failedAttempts: 0,
  })
  const [loading, setLoading] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [showOtpPrompt, setShowOtpPrompt] = useState(false)
  const [paymentResult, setPaymentResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const activeDecision = paymentResult?.decision
  const decisionUi = useMemo(
    () => (activeDecision ? decisionStyles[activeDecision] : null),
    [activeDecision],
  )

  const handleChange = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }))
  }

  const handlePayment = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setPaymentResult(null)
    setShowOtpPrompt(false)

    try {
      const result = await paymentService.createPayment({
        amount: Number.parseFloat(formData.amount),
        receiverName: formData.receiverName,
        receiverAccount: formData.receiverAccount,
        failedAttempts: Number(formData.failedAttempts || 0),
      })

      setPaymentResult(result)

      if (result.decision === 'OTP_REQUIRED') {
        setShowOtpPrompt(true)
      }
    } catch (error) {
      setErrorMessage(error?.detail || 'Unable to process payment right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = (event) => {
    event.preventDefault()
    window.alert(`OTP entered: ${otpValue || 'N/A'}`)
    setShowOtpPrompt(false)
    setOtpValue('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Make a Payment</h1>
        <p className="text-gray-600">Submit a transaction and receive a real fraud decision.</p>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Name</label>
              <input
                type="text"
                value={formData.receiverName}
                onChange={handleChange('receiverName')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="Aarav Sharma"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Receiver Account</label>
              <input
                type="text"
                value={formData.receiverAccount}
                onChange={handleChange('receiverAccount')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="9876543210"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={handleChange('amount')}
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="0.00"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Failed Attempts</label>
              <input
                type="number"
                value={formData.failedAttempts}
                onChange={handleChange('failedAttempts')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                min="0"
                max="10"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Card Details</h3>
            <div className="space-y-4">
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  defaultValue="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    defaultValue="12/25"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    defaultValue="123"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay ₹${formData.amount || '0'}`}
          </button>
        </form>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {paymentResult && decisionUi ? (
        <div className={`rounded-2xl border px-4 py-4 ${decisionUi.tone}`}>
          <div className="flex items-start gap-3">
            <decisionUi.icon className="mt-0.5 h-5 w-5" />
            <div>
              <p className="font-semibold">{decisionUi.title}</p>
              <p className="text-sm mt-1">{paymentResult.message}</p>
              <p className="text-sm mt-1">Decision: {paymentResult.decision}</p>
              <p className="text-sm">Risk Score: {paymentResult.risk_score}</p>
            </div>
          </div>
        </div>
      ) : null}

      {showOtpPrompt ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-800">OTP verification required</p>
          <p className="text-sm text-amber-700 mt-1">
            Backend requested OTP verification for this transaction.
          </p>
          <form onSubmit={handleOtpSubmit} className="mt-4 flex gap-3">
            <input
              type="text"
              value={otpValue}
              onChange={(event) => setOtpValue(event.target.value)}
              placeholder="Enter OTP"
              className="flex-1 rounded-xl border border-amber-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300"
              maxLength={6}
            />
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-4 py-3 font-medium text-white hover:bg-amber-600"
            >
              Submit OTP
            </button>
          </form>
        </div>
      ) : null}
    </div>
  )
}

export default MakePayment
