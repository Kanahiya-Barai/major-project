import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  CreditCard,
  ChevronRight
} from 'lucide-react'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const { register, continueAsDemo } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return
    }
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
    } catch (err) {
      setError(err?.detail || err?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAccess = (role) => {
    const demoUser = continueAsDemo(role)
    navigate(demoUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')
  }

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    
    const strengths = [
      { label: 'Weak', color: 'bg-rose-500' },
      { label: 'Fair', color: 'bg-amber-500' },
      { label: 'Good', color: 'bg-emerald-500' },
      { label: 'Strong', color: 'bg-emerald-600' }
    ]
    return { 
      score, 
      label: strengths[score]?.label || '', 
      color: strengths[score]?.color || '' 
    }
  }

  const passwordStrength = getPasswordStrength(form.password)

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

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/20 via-transparent to-indigo-100/20" />
        <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
        <div className="absolute inset-x-0 top-48 h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-32 h-px bg-gradient-to-r from-transparent via-indigo-200/40 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[40px] border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_20px_80px_-15px_rgba(37,99,235,0.15)] xl:grid-cols-[1.1fr_0.9fr] transition-all duration-500 hover:shadow-[0_25px_90px_-12px_rgba(37,99,235,0.2)]">
          
          {/* Left Panel - Hero Section */}
          <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 px-10 py-12 text-white xl:flex xl:flex-col xl:justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 animate-gradient-x" />
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
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
                <span className="tracking-wide">Join the platform</span>
              </div>

              <div className="mt-12 max-w-xl animate-in slide-in-from-left duration-700 delay-100">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-300/80">Get Started Today</p>
                <h1 className="mt-6 text-5xl font-bold leading-[1.2] tracking-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Secure your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                    financial future
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-300/90">
                  Create your account in seconds and gain access to enterprise‑grade fraud monitoring, real‑time alerts, and actionable insights.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="mt-10 grid gap-5 sm:grid-cols-2 animate-in slide-in-from-bottom duration-700 delay-200">
                {[
                  { icon: ShieldCheck, title: 'Bank-level security', desc: '256-bit encryption' },
                  { icon: Users, title: 'Team collaboration', desc: 'Multi-user workspaces' },
                  { icon: CreditCard, title: 'Payment protection', desc: 'Fraud detection built‑in' },
                  { icon: Building2, title: 'Enterprise ready', desc: 'Scale as you grow' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="rounded-lg bg-white/10 p-2">
                      <feature.icon className="h-5 w-5 text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom testimonial */}
            <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 animate-in slide-in-from-bottom duration-700 delay-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                  JD
                </div>
                <div>
                  <p className="text-sm italic text-slate-300">"FinTechDash helped us reduce fraud by 73% within the first month. The dashboard is incredibly intuitive."</p>
                  <p className="mt-2 text-xs font-medium text-blue-300">— Jane Doe, CTO at SecurePay</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel - Registration Form */}
          <section className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 bg-gradient-to-br from-white/60 via-white/50 to-slate-50/60 backdrop-blur-sm">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Free forever plan
                </div>
                <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">Create account</h2>
                <p className="mt-3 text-base text-slate-600 leading-relaxed">
                  Start monitoring your transactions with confidence. No credit card required.
                </p>
              </div>

              <div className="rounded-[32px] border border-slate-200/80 bg-white/80 backdrop-blur-md p-8 shadow-[0_20px_50px_-8px_rgba(15,23,42,0.1)] transition-all hover:shadow-[0_25px_60px_-12px_rgba(37,99,235,0.15)]">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2.5 block text-sm font-semibold text-slate-700">Full name</label>
                    <div className="group relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2.5 block text-sm font-semibold text-slate-700">Email address</label>
                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="mb-2.5 block text-sm font-semibold text-slate-700">Password</label>
                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-12 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 hover:border-slate-300"
                        placeholder="Create a strong password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {form.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 rounded-full bg-slate-200">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score === 0 ? 'text-slate-400' :
                            passwordStrength.score === 1 ? 'text-rose-600' :
                            passwordStrength.score === 2 ? 'text-amber-600' :
                            'text-emerald-600'
                          }`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Use 8+ characters with uppercase, numbers & symbols
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Terms acceptance */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                    />
                    <label htmlFor="terms" className="text-sm text-slate-600">
                      I agree to the{' '}
                      <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
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
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create account
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
                        Or try a demo
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
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
                </div>

                {/* Sign in link */}
                <p className="mt-8 text-center text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Sign in
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

export default Register
