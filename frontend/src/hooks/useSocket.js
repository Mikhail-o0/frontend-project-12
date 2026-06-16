import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

const useSocket = () => {
  const { t } = useTranslation()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('No token, skipping WebSocket connection')
      return
    }

    // Используем относительный путь - socket.io подключится к текущему домену
    // В разработке: localhost:5002 → прокси Vite → localhost:5001
    // В продакшене: hexlet-chat.onrender.com → тот же сервер
    const socketUrl = ''
    
    console.log('Connecting to WebSocket:', socketUrl || window.location.origin)

    try {
      const socketInstance = io(socketUrl, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      })

      socketInstance.on('connect', () => {
        console.log('WebSocket connected')
        setIsConnected(true)
      })

      socketInstance.on('disconnect', () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
      })

      socketInstance.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error.message)
        setIsConnected(false)
        if (!socketInstance.recovered) {
          toast.error(t('toasts.error.networkError'))
        }
      })

      socketInstance.on('error', (error) => {
        console.error('WebSocket error:', error)
      })

      setSocket(socketInstance)

      return () => {
        console.log('Cleaning up WebSocket connection')
        socketInstance.disconnect()
      }
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setIsConnected(false)
    }
  }, [t])

  return { socket, isConnected }
}

export default useSocket