import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-warning/10 border-b border-warning/20 py-2 px-4 z-50 flex items-center justify-center gap-2 text-warning">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">You're offline. Some features may be unavailable.</span>
    </div>
  )
}

export default NetworkStatus