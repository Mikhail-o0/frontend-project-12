import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLoginMutation } from '../api/authApi'
import { setCredentials } from '../slices/authSlice'
import { useState } from 'react'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setErrorMessage('')
      const response = await login(values).unwrap()
      dispatch(setCredentials({ 
        token: response.token, 
        username: values.username 
      }))
      navigate('/')
    } catch (err) {
      if (err.status === 401) {
        setErrorMessage(t('login.errors.invalidCredentials'))
      } else {
        setErrorMessage(t('login.errors.connection'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">{t('login.pageName')}</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  {t('login.username')}
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder={t('login.username')}
                  required
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t('login.password')}
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder={t('login.password')}
                  required
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? t('login.submitting') : t('login.submit')}
              </button>

              <div className="text-center">
                <span className="text-muted">{t('login.noAccount')} </span>
                <Link to="/signup">{t('login.signupLink')}</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login