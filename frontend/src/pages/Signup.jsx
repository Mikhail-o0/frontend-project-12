import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSignupMutation } from '../api/authApi'
import { setCredentials } from '../slices/authSlice'
import { useState } from 'react'
import * as yup from 'yup'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  const [errorMessage, setErrorMessage] = useState('')

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов'),
    password: yup
      .string()
      .required('Обязательное поле')
      .min(6, 'Не менее 6 символов'),
    confirmPassword: yup
      .string()
      .required('Обязательное поле')
      .oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
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
      navigate('/')
    } catch (err) {
      if (err.status === 409) {
        setFieldError('username', 'Пользователь с таким именем уже существует')
      } else {
        setErrorMessage('Ошибка регистрации. Попробуйте еще раз.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Регистрация</h2>
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

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Имя пользователя
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                  placeholder="Введите имя пользователя"
                  disabled={isLoading || isSubmitting}
                />
                {errors.username && touched.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                  placeholder="Введите пароль"
                  disabled={isLoading || isSubmitting}
                />
                {errors.password && touched.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Подтверждение пароля
                </label>
                <Field
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Повторите пароль"
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
                {isLoading || isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              <div className="text-center">
                <span className="text-muted">Уже есть аккаунт? </span>
                <Link to="/login">Войти</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Signup