import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h1 className="display-1 fw-bold">404</h1>
      <p className="h4 mb-4">Страница не найдена</p>
      <Link to="/" className="btn btn-primary">
        Вернуться на главную
      </Link>
    </div>
  )
}

export default NotFound