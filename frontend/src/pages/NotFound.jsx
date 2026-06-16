import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()
  
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <h1 className="display-1 fw-bold">404</h1>
      <p className="h4 mb-4">{t('notFound.title')}</p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.link')}
      </Link>
    </div>
  )
}

export default NotFound