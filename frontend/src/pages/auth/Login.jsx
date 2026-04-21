import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  Activity,
  Fingerprint,
  ChevronRight
} from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login, continueAsDemo } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password, rememberMe)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
    } catch (err) {
      setError(err?.detail || err?.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = (role) => {
    const demoUser = continueAsDemo(role)
    navigate(demoUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400/15 to-teal-500/15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/3 h-72 w-72 rounded-full bg-gradient-to-tl from-purple-400/15 to-pink-500/15 blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-20 left-1/4 h-2 w-2 rounded-full bg-blue-400/30 animate-ping" />
        <div className="absolute bottom-32 right-1/4 h-3 w-3 rounded-full bg-indigo-400/20 animate-pulse" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(37,99,235,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.05)_1px,transparent_1px)] [background-size:60px_60px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[40px] border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_20px_80px_-15px_rgba(37,99,235,0.15)] xl:grid-cols-[1.1fr_0.9fr] transition-all duration-500 hover:shadow-[0_25px_90px_-12px_rgba(37,99,235,0.2)]">
          
          {/* Left Panel - Hero Section */}
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 px-10 py-12 text-white xl:flex xl:flex-col xl:justify-between">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 animate-gradient-x" />
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/5 backdrop-blur-sm"
                  style={{
                    width: Math.random() * 100 + 50 + 'px',
                    height: Math.random() * 100 + 50 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
                    animationDelay: `-${Math.random() * 10}s`
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white/90 shadow-lg animate-in slide-in-from-top duration-700">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="tracking-wide">Enterprise Fraud Monitoring</span>
              </div>

              <div className="mt-12 max-w-xl animate-in slide-in-from-left duration-700 delay-100">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-300/80">FinTechDash</p>
                <h1 className="mt-6 text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    See risk
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    faster.
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300/90">
                  One dashboard for payments, alerts, user activity, and live risk signals — designed for teams that demand clarity in seconds.
                </p>
              </div>

              {/* Live stats */}
              <div className="mt-12 grid gap-5 sm:grid-cols-3 animate-in slide-in-from-bottom duration-700 delay-200">
                {[
                  { label: 'Response time', value: '1.2s', sub: 'avg alert ack', icon: Zap, color: 'text-yellow-300' },
                  { label: 'Protected volume', value: '₹8.4L', sub: 'monitored today', icon: TrendingUp, color: 'text-emerald-300' },
                  { label: 'Detection confidence', value: '98.1%', sub: 'model coverage', icon: Activity, color: 'text-blue-300' }
                ].map((stat, idx) => (
                  <div key={idx} className="group rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/10 hover:border-white/25 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/50">{stat.label}</p>
                      <stat.icon className={`h-4 w-4 ${stat.color} opacity-70`} />
                    </div>
                    <p className="mt-3 text-3xl font-bold tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom trust indicators */}
            <div className="relative mt-8 grid gap-4 md:grid-cols-2 animate-in slide-in-from-bottom duration-700 delay-300">
              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all hover:bg-white/8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 p-3 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Bank-grade security</p>
                    <p className="mt-1 text-sm text-slate-400">Role-based access with mock authentication for demos</p>
                  </div>
                </div>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all hover:bg-white/8">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-400/20 to-indigo-500/20 p-3 group-hover:scale-110 transition-transform">
                    <Fingerprint className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="font-semibold">Instant demo access</p>
                    <p className="mt-1 text-sm text-slate-400">Jump into admin or user flows with one click</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel - Login Form */}
          <section className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 bg-gradient-to-br from-white/60 via-white/50 to-slate-50/60 backdrop-blur-sm">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure Access
                </div>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  Sign in to monitor transactions, review alerts, and manage operations with confidence.
                </p>
              </div>

              <div className="rounded-[32px] border border-slate-200/80 bg-white/80 backdrop-blur-md p-8 shadow-[0_20px_50px_-8px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_25px_60px_-12px_rgba(37,99,235,0.15)]">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email field */}
                  <div>
                    <label className="mb-2.5 block text-sm font-semibold text-slate-700">Email address</label>
                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-700">Password</label>
                      <button 
                        type="button" 
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        onClick={() => alert('Password reset functionality coming soon')}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me checkbox */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                    </label>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:from-slate-800 hover:to-slate-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="relative flex items-center gap-2">
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In Securely
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Demo access section */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white/80 px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                        Quick Demo Access
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-5 shadow-inner">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 p-3">
                        <Sparkles className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">Jump right in</p>
                        <p className="mt-1 text-sm text-slate-600">
                          Explore the platform instantly with pre-filled demo accounts.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleDemoAccess('user')}
                        className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:shadow"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User Demo
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoAccess('admin')}
                        className="group flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 text-sm font-medium text-blue-700 shadow-sm transition-all hover:from-blue-100 hover:to-indigo-100 hover:shadow"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          Admin Demo
                        </span>
                        <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
                      </button>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-100/60 p-4 text-xs">
                      <p className="font-semibold uppercase tracking-wider text-slate-500">Demo Credentials</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-700">User Account</p>
                          <p className="font-mono text-slate-600">user@example.com</p>
                          <p className="font-mono text-slate-600">password</p>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-700">Admin Account</p>
                          <p className="font-mono text-slate-600">admin@example.com</p>
                          <p className="font-mono text-slate-600">password</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign up link */}
                <p className="mt-8 text-center text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default Login
