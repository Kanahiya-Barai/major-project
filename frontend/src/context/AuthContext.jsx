import { createContext, useEffect, useState } from 'react'
import { authService } from '../services/auth'

export const AuthContext = createContext()

const demoUsers = {
  admin: { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  user: { id: '1', name: 'John Doe', email: 'user@example.com', role: 'user' },
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    authService
      .getProfile()
      .then((userData) => setUser(userData))
      .catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { user: nextUser, token } = await authService.login(email, password)
    localStorage.setItem('token', token)
    setUser(nextUser)
    return nextUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const register = async (userData) => {
    const { user: nextUser, token } = await authService.register(userData)
    localStorage.setItem('token', token)
    setUser(nextUser)
    return nextUser
  }

  const continueAsDemo = (role = 'user') => {
    const normalizedRole = role === 'admin' ? 'admin' : 'user'
    const demoUser = demoUsers[normalizedRole]
    localStorage.setItem('token', `mock-jwt-token-${normalizedRole}`)
    setUser(demoUser)
    return demoUser
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, continueAsDemo }}>
      {children}
    </AuthContext.Provider>
  )
}
