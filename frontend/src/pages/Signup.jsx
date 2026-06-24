import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useSignupMutation } from '../api/authApi'
import { setCredentials } from '../slices/authSlice'
import { useState } from 'react'
import { getSignupValidationSchema } from '../schemas/signupSchema'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = getSignupValidationSchema(t)

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setErrorMessage('')
      const { username, password } = values
      const response = await signup({ username, password }).unwrap()
      dispatch(setCredentials({ 
        token: response.token, 
        username: response.username 
      }))
      navigate('/')
    } catch (err) {
      if (err.status === 409) {
        setFieldError('username', t('signup.errors.userExists'))
      } else {
        setErrorMessage(t('signup.errors.registration'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="auth-title">{t('signup.pageName')}</h2>
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="mb-4">
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  placeholder={t('signup.username')}
                  autoComplete="off"
                  autoFocus
                  disabled={isLoading || isSubmitting}
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder={t('signup.password')}
                  autoComplete="new-password"
                  disabled={isLoading || isSubmitting}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder={t('signup.confirmPassword')}
                  autoComplete="new-password"
                  disabled={isLoading || isSubmitting}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-outline-primary w-100 mb-3"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? t('signup.submitting') : t('signup.submit')}
              </button>

              <div className="text-center">
                <span className="text-dark fw-semibold">{t('signup.hasAccount')} </span>
                <Link to="/login" className="btn btn-outline-primary w-100">{t('signup.loginLink')}</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signup