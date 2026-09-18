import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../ui/Loader'

/**
 * Wraps a route so it requires authentication, and optionally a specific role.
 * @param {{ children: React.ReactNode, allowedRole?: 'ADMIN' | 'CANDIDATE' }} props
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader fullscreen label="Checking your session…" />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    const fallback = user.role === 'ADMIN' ? '/admin/jobs' : '/candidate/upload'
    return <Navigate to={fallback} replace />
  }

  return children
}
