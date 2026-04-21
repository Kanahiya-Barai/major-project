import { useEffect, useRef } from 'react'

export const useWebSocket = (url, options = {}) => {
  const { onMessage, onOpen, onClose, reconnect = true } = options
  const wsRef = useRef(null)

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        onClose?.()
        if (reconnect) {
          setTimeout(connect, 3000)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error', error)
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
    }
  }, [url, onMessage, onOpen, onClose, reconnect])

  return wsRef.current
}