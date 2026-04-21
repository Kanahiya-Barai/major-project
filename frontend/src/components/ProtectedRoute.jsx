import { Navigate, Outlet } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, continueAsDemo } = useContext(AuthContext)
  const expectedRole = allowedRoles?.length === 1 ? allowedRoles[0] : null

  useEffect(() => {
    if (!loading && import.meta.env.DEV && expectedRole) {
      if (!user || user.role !== expectedRole) {
        continueAsDemo(expectedRole)
      }
    }
  }, [continueAsDemo, expectedRole, loading, user])

  if (loading) return <Loader fullScreen />

  if (!user) {
    if (import.meta.env.DEV && expectedRole) {
      return <Loader fullScreen />
    }
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (import.meta.env.DEV && expectedRole) {
      return <Loader fullScreen />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
