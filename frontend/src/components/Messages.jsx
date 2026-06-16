import { useEffect, useState, useRef } from 'react'
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi'
import useSocket from '../hooks/useSocket'

const Messages = ({ channelId, channelName }) => {
  const { data: messages, isLoading, error } = useGetMessagesQuery()
  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation()
  const { socket, isConnected } = useSocket()
  const [newMessage, setNewMessage] = useState('')
  const [localMessages, setLocalMessages] = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messages) {
      const filtered = messages.filter(msg => msg.channelId === channelId)
      setLocalMessages(filtered)
    }
  }, [messages, channelId])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message) => {
      if (message.channelId === channelId) {
        setLocalMessages((prev) => [...prev, message])
      }
    }

    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, channelId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    const messageData = {
      body: newMessage,
      channelId,
    }

    try {
      setNewMessage('')
      await addMessage(messageData).unwrap()
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err)
      alert('Не удалось отправить сообщение')
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        Загрузка сообщений...
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-danger">
        Ошибка загрузки сообщений
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="m-0"># {channelName}</h5>
        <span className={`badge ${isConnected ? 'bg-success' : 'bg-danger'}`}>
          {isConnected ? 'Подключено' : 'Отключено'}
        </span>
      </div>
      
      <div className="flex-grow-1 overflow-auto p-3">
        {localMessages.length === 0 ? (
          <p className="text-muted text-center">Нет сообщений. Будьте первым!</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {localMessages.map((message) => (
              <div key={message.id} className="card">
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between">
                    <strong>{message.username}</strong>
                    <small className="text-muted">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                  <p className="m-0 mt-1 text-break">{message.body}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-3 border-top">
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected || isAdding}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isConnected || isAdding || !newMessage.trim()}
          >
            {isAdding ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Messages