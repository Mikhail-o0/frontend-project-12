import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold">
          Hexlet Chat
        </Link>
        
        {isAuthenticated && (
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              <i className="bi bi-person-circle"></i> {user}
            </span>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header