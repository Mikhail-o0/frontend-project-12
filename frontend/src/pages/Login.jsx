import { Formik, Form, Field } from "formik"

const Login = () => {
  const initialValues = {
    username: '',
    password: '',
  }

  const handleSubmit = (value) => {
    console.log('Formdata', values)
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Войти</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <Form>
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
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Войти
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default Login
