import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field } from 'formik'
import * as yup from 'yup'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAddChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'
import { containsProfanity } from '../../utils/profanityFilter'

const AddChannelModal = ({ show, onClose, onSelectChannel }) => {
  const { t } = useTranslation()
  const [addChannel, { isLoading }] = useAddChannelMutation()
  const { data: channels } = useGetChannelsQuery()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [show])

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    const name = values.name.trim()
    
    if (!name) {
      setFieldError('name', t('modals.add.errors.required'))
      return
    }
    
    if (name.length < 3 || name.length > 20) {
      setFieldError('name', t('modals.add.errors.length'))
      return
    }
    
    if (channels?.some(ch => ch.name === name)) {
      setFieldError('name', t('modals.add.errors.unique'))
      return
    }
    
    if (containsProfanity(name)) {
      setFieldError('name', t('profanity.channelNameContains'))
      return
    }

    try {
      const newChannel = await addChannel({ name }).unwrap()
      resetForm()
      onSelectChannel(newChannel.id)
      onClose()
      toast.success(t('toasts.success.channelCreated'))
    } catch (err) {
      console.error('Ошибка создания канала:', err)
      setFieldError('name', t('modals.add.errors.create'))
      toast.error(t('toasts.error.channelCreateError'))
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
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, errors, touched, isSubmitting }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label className="visually-hidden">{t('modals.add.placeholder')}</Form.Label>
                <Field
                  as={Form.Control}
                  name="name"
                  ref={inputRef}
                  isInvalid={!!errors.name}
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
                {t('modals.add.submit')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal