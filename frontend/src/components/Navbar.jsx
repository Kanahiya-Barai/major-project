import { Bell, Search, User, LogOut } from 'lucide-react'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const query = e.target.search.value
    if (query) {
      alert(`Search for "${query}" - feature coming soon!`)
      e.target.reset()
    }
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
    // In production, fetch real notifications
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-surface border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition">
              FinTech<span className="text-gray-800">Dash</span>
            </Link>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="search"
                placeholder="Search transactions, users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-900">Notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                      <p className="text-sm font-medium text-gray-900">New transaction flagged</p>
                      <p className="text-xs text-gray-500">Transaction #txn_123 has high risk score</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition">
                      <p className="text-sm font-medium text-gray-900">Payment successful</p>
                      <p className="text-xs text-gray-500">Your payment of ₹5,000 was processed</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100">
                    <button
                      onClick={() => navigate('/user/transactions')}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/user/profile" className="hidden sm:block text-right hover:opacity-80 transition">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </Link>
              <button
                onClick={() => navigate('/user/profile')}
                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition"
              >
                <User className="h-5 w-5 text-primary" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
