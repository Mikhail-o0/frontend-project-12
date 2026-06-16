import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import { useRef, useEffect } from 'react'
import { useRenameChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'

const RenameChannelModal = ({ show, onClose, channelId, currentName }) => {
  const [renameChannel, { isLoading }] = useRenameChannelMutation()
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
          return !channels.some(ch => ch.name === value && ch.id !== channelId)
        }
      ),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    try {
      await renameChannel({ id: channelId, name: values.name }).unwrap()
      resetForm()
      onClose()
    } catch (err) {
      console.error('Ошибка переименования:', err)
      setFieldError('name', 'Не удалось переименовать канал')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Body>
              <Form.Group>
                <Field
                  as={Form.Control}
                  name="name"
                  placeholder="Введите новое название"
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
                {isLoading || isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal