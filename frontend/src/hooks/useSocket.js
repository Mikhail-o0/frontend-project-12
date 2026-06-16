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
      return
    }

    const isDevelopment = import.meta.env.DEV
    const socketUrl = isDevelopment 
      ? 'http://localhost:5001'
      : window.location.origin

    console.log('Connecting to WebSocket:', socketUrl)

    const socketInstance = io(socketUrl, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
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
      console.error('WebSocket error:', error.message)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }, [t])

  return { socket, isConnected }
}

export default useSocket