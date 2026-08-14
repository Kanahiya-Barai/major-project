import api from './api'

const roleFromEmail = (email) => (String(email || '').toLowerCase().includes('admin') ? 'admin' : 'user')
const nameFromEmail = (email) => String(email || '').split('@', 1)[0] || 'User'

export const authService = {
  async login(email, password) {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const { data: tokenData } = await api.post('/auth/login', { email: normalizedEmail, password })
    const token = tokenData?.access_token
    if (!token) {
      throw new Error('Login succeeded but token was not returned by the server')
    }

    const { data: me } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    return {
      user: {
        id: String(me?.id),
        name: nameFromEmail(me?.email || normalizedEmail),
        email: me?.email || normalizedEmail,
        role: me?.role || roleFromEmail(me?.email || normalizedEmail),
        balance: me?.balance,
      },
      token,
    }
  },

  async register(userData) {
    const email = String(userData?.email || '').trim().toLowerCase()
    const password = userData?.password
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    await api.post('/auth/register', { email, password })
    return this.login(email, password)
  },

  async loginWithGoogle(credential) {
    const { data: tokenData } = await api.post('/auth/google', { credential })
    const token = tokenData?.access_token
    if (!token) {
      throw new Error('Google sign-in succeeded but token was not returned by the server')
    }

    const { data: me } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })

    return {
      user: {
        id: String(me?.id),
        name: nameFromEmail(me?.email),
        email: me?.email,
        role: me?.role || roleFromEmail(me?.email),
        balance: me?.balance,
      },
      token,
    }
  },

  async getProfile() {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('No token')

    if (token.startsWith('mock-jwt-token-')) {
      const email = token.includes('admin') ? 'admin@example.com' : 'user@example.com'
      return {
        id: token.includes('admin') ? '2' : '1',
        name: token.includes('admin') ? 'Admin User' : 'John Doe',
        email,
        role: roleFromEmail(email),
      }
    }

    const { data: me } = await api.get('/auth/me')
    return {
      id: String(me?.id),
      name: nameFromEmail(me?.email),
      email: me?.email,
      role: me?.role || roleFromEmail(me?.email),
      balance: me?.balance,
    }
  },
}
