import { Formik, Form, Field } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../api/authApi'
import { setCredentials } from '../slices/authSlice'
import { useState } from 'react'

const Login = () => {
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
        setErrorMessage('Неверные имя пользователя или пароль')
      } else {
        setErrorMessage('Ошибка соединения с сервером')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Войти</h2>
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
                  Имя пользователя
                </label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Введите имя пользователя"
                  required
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Пароль
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Введите пароль"
                  required
                  disabled={isLoading || isSubmitting}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading || isSubmitting}
              >
                {isLoading || isSubmitting ? 'Вход...' : 'Войти'}
              </button>

              <div className="text-center">
                <span className="text-muted">Нет аккаунта? </span>
                <Link to="/signup">Зарегистрироваться</Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login