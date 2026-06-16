import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  // Проверяем ТОЛЬКО localStorage - это синхронная операция
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute