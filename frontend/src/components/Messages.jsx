import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useGetMessagesQuery, useAddMessageMutation } from '../api/messagesApi'
import useSocket from '../hooks/useSocket'
import { containsProfanity } from '../utils/profanityFilter'

const Messages = ({ channelId, channelName }) => {
  const { t } = useTranslation()
  const { data: messages, isLoading, error, refetch } = useGetMessagesQuery()
  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation()
  const { socket, isConnected } = useSocket()
  const [newMessage, setNewMessage] = useState('')
  const [localMessages, setLocalMessages] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null) // ← Добавлен ref для поля ввода
  
  const currentUser = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (messages) {
      const filtered = messages
        .filter(msg => msg.channelId === channelId)
        .map(msg => ({
          ...msg,
          username: msg.username || msg.author || 'Unknown'
        }))
      setLocalMessages(filtered)
    }
  }, [messages, channelId])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message) => {
      if (message.channelId === channelId) {
        setLocalMessages((prev) => {
          const exists = prev.some(msg => msg.id === message.id)
          if (exists) return prev
          
          return [...prev, {
            ...message,
            username: message.username || message.author || 'Unknown'
          }]
        })
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

    if (containsProfanity(newMessage)) {
      toast.error(t('profanity.messageContains'))
      return
    }

    const messageData = {
      body: newMessage,
      channelId,
      username: currentUser,
    }

    try {
      setNewMessage('')
      await addMessage(messageData).unwrap()
      await refetch()

      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err)
      toast.error(t('toasts.error.messageSendError'))
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        {t('chat.messages.loading')}
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 text-danger">
        {t('chat.messages.error')}
      </div>
    )
  }

  return (
    <div className="d-flex flex-column" style={{ height: '100%', overflow: 'hidden' }}>
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ flexShrink: 0 }}>
        <div>
          <h5 className="m-0"># {channelName}</h5>
          <small className="text-muted">
            {localMessages.length} {t('chat.messages.count', { count: localMessages.length })}
          </small>
        </div>
        <span className={`badge ${isConnected ? 'bg-success' : 'bg-danger'}`}>
          {isConnected ? t('chat.messages.connected') : t('chat.messages.disconnected')}
        </span>
      </div>
      
      <div className="flex-grow-1 overflow-auto p-3" style={{ minHeight: 0 }}>
        {localMessages.length === 0 ? (
          <p className="text-muted text-center">{t('chat.messages.empty')}</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {localMessages.map((message) => (
              <div key={message.id} className="card">
                <div className="card-body p-2">
                  <p className="m-0 text-break">
                    <strong>{message.username}:</strong> {message.body}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-3 border-top" style={{ flexShrink: 0 }}>
        <form onSubmit={handleSubmit} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder={t('chat.messages.placeholder')}
            aria-label="Новое сообщение"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isConnected || isAdding}
            ref={inputRef} // ← Добавлен ref
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={!isConnected || isAdding || !newMessage.trim()}
          >
            {isAdding ? t('chat.messages.sending') : t('chat.messages.send')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Messages