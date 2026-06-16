import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useSignupMutation } from '../api/authApi'
import { setCredentials } from '../slices/authSlice'
import { useState } from 'react'
import * as yup from 'yup'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const getValidationSchema = () => yup.object().shape({
    username: yup
      .string()
      .required(t('signup.errors.required'))
      .min(3, t('signup.errors.usernameLength'))
      .max(20, t('signup.errors.usernameLength')),
    password: yup
      .string()
      .required(t('signup.errors.required'))
      .min(6, t('signup.errors.passwordLength')),
    confirmPassword: yup
      .string()
      .required(t('signup.errors.required'))
      .oneOf([yup.ref('password'), null], t('signup.errors.passwordMismatch')),
  })

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setErrorMessage('')
      const { username, password } = values
      const response = await signup({ username, password }).unwrap()
      dispatch(setCredentials({ 
        token: response.token, 
        username: response.username 
      }))
      
      await new Promise(resolve => setTimeout(resolve, 100))
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
        <h2 className="text-center mb-4">{t('signup.pageName')}</h2>
        <Formik
          initialValues={{ username: '', password: '', confirmPassword: '' }}
          validationSchema={getValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  {t('signup.username')}
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  placeholder={t('signup.username')}
                  disabled={isLoading || isSubmitting}
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t('signup.password')}
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder={t('signup.password')}
                  disabled={isLoading || isSubmitting}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  {t('signup.confirmPassword')}
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder={t('signup.confirmPassword')}
                  disabled={isLoading || isSubmitting}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading || isSubmitting}
              >
                {t('signup.submit')}
              </button>

              <div className="text-center">
                <span className="text-muted">{t('signup.hasAccount')} </span>
                <Link to="/login">{t('signup.loginLink')}</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signup