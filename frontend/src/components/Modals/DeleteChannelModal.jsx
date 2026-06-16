import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDeleteChannelMutation } from '../../api/channelsApi'

const DeleteChannelModal = ({ show, onClose, channelId, channelName }) => {
  const { t } = useTranslation()
  const [deleteChannel, { isLoading }] = useDeleteChannelMutation()

  const handleDelete = async () => {
    try {
      await deleteChannel(channelId).unwrap()
      onClose()
    } catch (err) {
      console.error('Ошибка удаления канала:', err)
      alert(t('modals.delete.error'))
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.delete.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modals.delete.confirm')} <strong>"{channelName}"</strong>?</p>
        <p className="text-muted small">{t('modals.delete.warning')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {t('modals.delete.cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? t('modals.delete.submitting') : t('modals.delete.submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal