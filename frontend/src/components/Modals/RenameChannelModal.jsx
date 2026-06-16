import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Form as FormikForm, Field } from 'formik'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useRenameChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'
import { censorText } from '../../utils/profanityFilter'

const RenameChannelModal = ({ show, onClose, channelId, currentName }) => {
  const { t } = useTranslation()
  const [renameChannel, { isLoading }] = useRenameChannelMutation()
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
    // Цензурируем нецензурную лексику
    const name = censorText(values.name.trim())
    
    if (!name) {
      setFieldError('name', t('modals.rename.errors.required'))
      return
    }
    
    if (name.length < 3 || name.length > 20) {
      setFieldError('name', t('modals.rename.errors.length'))
      return
    }
    
    if (channels?.some(ch => ch.name === name && ch.id !== channelId)) {
      setFieldError('name', t('modals.rename.errors.unique'))
      return
    }

    try {
      await renameChannel({ id: channelId, name }).unwrap()
      resetForm()
      onClose()
      toast.success(t('toasts.success.channelRenamed'))
    } catch (err) {
      console.error('Ошибка переименования:', err)
      setFieldError('name', t('modals.rename.errors.rename'))
      toast.error(t('toasts.error.channelRenameError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.rename.title')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: currentName || '' }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit, errors, isSubmitting }) => (
          <FormikForm onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label htmlFor="rename-channel-input" className="visually-hidden">
                  {t('modals.rename.placeholder')}
                </Form.Label>
                <Field
                  as={Form.Control}
                  id="rename-channel-input"
                  name="name"
                  placeholder={t('modals.rename.placeholder')}
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
                {t('modals.rename.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading || isSubmitting}>
                {t('modals.rename.submit')}
              </Button>
            </Modal.Footer>
          </FormikForm>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal