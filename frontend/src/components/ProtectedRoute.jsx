import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const token = localStorage.getItem('token')

  // Проверяем и Redux state, и localStorage
  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute