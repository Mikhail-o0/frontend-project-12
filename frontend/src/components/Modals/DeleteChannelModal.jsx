import { Modal, Button } from 'react-bootstrap'
import { useDeleteChannelMutation } from '../../api/channelsApi'

const DeleteChannelModal = ({ show, onClose, channelId, channelName }) => {
  const [deleteChannel, { isLoading }] = useDeleteChannelMutation()

  const handleDelete = async () => {
    try {
      await deleteChannel(channelId).unwrap()
      onClose()
    } catch (err) {
      console.error('Ошибка удаления канала:', err)
      alert('Не удалось удалить канал')
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены, что хотите удалить канал <strong>"{channelName}"</strong>?</p>
        <p className="text-muted small">Все сообщения этого канала будут удалены.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannelModal