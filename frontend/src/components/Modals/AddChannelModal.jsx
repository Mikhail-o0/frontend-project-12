import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import { useRef, useEffect } from 'react'
import { useAddChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'

const AddChannelModal = ({ show, onClose, onSelectChannel }) => {
  const [addChannel, { isLoading }] = useAddChannelMutation()
  const { data: channels } = useGetChannelsQuery()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [show])

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Обязательное поле')
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .test(
        'unique',
        'Канал с таким именем уже существует',
        (value) => {
          if (!channels) return true
          return !channels.some(ch => ch.name === value)
        }
      ),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      const newChannel = await addChannel(values).unwrap()
      resetForm()
      onSelectChannel(newChannel.id)
      onClose()
    } catch (err) {
      console.error('Ошибка создания канала:', err)
      setFieldError('name', 'Не удалось создать канал')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Body>
              <Form.Group>
                <Field
                  as={Form.Control}
                  name="name"
                  placeholder="Введите название канала"
                  ref={inputRef}
                  isInvalid={!!errors.name && touched.name}
                  disabled={isLoading || isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose} disabled={isLoading || isSubmitting}>
                Отмена
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? 'Создание...' : 'Отправить'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal