import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAddChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'

const AddChannelModal = ({ show, onClose, onSelectChannel }) => {
  const { t } = useTranslation()
  const [addChannel, { isLoading }] = useAddChannelMutation()
  const { data: channels } = useGetChannelsQuery()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [show])

  const getValidationSchema = () => yup.object().shape({
    name: yup
      .string()
      .required(t('modals.add.errors.required'))
      .min(3, t('modals.add.errors.length'))
      .max(20, t('modals.add.errors.length'))
      .test(
        'unique',
        t('modals.add.errors.unique'),
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
      setFieldError('name', t('modals.add.errors.create'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add.title')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={getValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Body>
              <Form.Group>
                <Field
                  as={Form.Control}
                  name="name"
                  placeholder={t('modals.add.placeholder')}
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
                {t('modals.add.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? t('modals.add.submitting') : t('modals.add.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal