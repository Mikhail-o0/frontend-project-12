import { Modal, Form, Button } from 'react-bootstrap'
import { Formik, Field } from 'formik'
import * as yup from 'yup'
import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useRenameChannelMutation, useGetChannelsQuery } from '../../api/channelsApi'
import { containsProfanity } from '../../utils/profanityFilter'

const RenameChannelModal = ({ show, onClose, channelId, currentName }) => {
  const { t } = useTranslation()
  const [renameChannel, { isLoading }] = useRenameChannelMutation()
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
      .required(t('modals.rename.errors.required'))
      .min(3, t('modals.rename.errors.length'))
      .max(20, t('modals.rename.errors.length'))
      .test(
        'unique',
        t('modals.rename.errors.unique'),
        (value) => {
          if (!channels) return true
          return !channels.some(ch => ch.name === value && ch.id !== channelId)
        }
      ),
  })

  const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
    if (containsProfanity(values.name)) {
      setFieldError('name', t('profanity.channelNameContains'))
      return
    }

    try {
      await renameChannel({ id: channelId, name: values.name }).unwrap()
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
        validationSchema={getValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('modals.rename.placeholder')}</Form.Label>
                <Field
                  as={Form.Control}
                  name="name"
                  placeholder={t('modals.rename.placeholder')}
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
                {t('modals.rename.cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading || isSubmitting}>
                {t('modals.rename.submit')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal