import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Loader from './Loader'

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <Loader fullScreen />

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
