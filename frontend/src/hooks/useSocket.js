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
    
    if (!token) return

    const socketInstance = io('http://localhost:5002', {
      auth: {
        token: `Bearer ${token}`,
      },
    })

    socketInstance.on('connect', () => {
      console.log('WebSocket подключен')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('WebSocket отключен')
      setIsConnected(false)
      toast.error(t('toasts.error.networkError'))
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Ошибка подключения WebSocket:', error)
      setIsConnected(false)
      toast.error(t('toasts.error.networkError'))
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}

export default useSocket