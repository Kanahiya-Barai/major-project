import { useEffect, useRef, useState } from 'react'

const GOOGLE_SCRIPT_ID = 'google-identity-services'
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID)
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google script'))
    document.head.appendChild(script)
  })

const GoogleSignInButton = ({ onCredential, onError, text = 'signin_with', disabled = false }) => {
  const buttonRef = useRef(null)
  const [status, setStatus] = useState('loading')
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    let cancelled = false

    if (!clientId) {
      setStatus('missing_config')
      return undefined
    }

    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              await onCredential?.(response.credential)
            } catch (error) {
              onError?.(error)
            }
          },
        })
        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          width: 320,
          text,
        })
        setStatus('ready')
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus('failed')
          onError?.(error)
        }
      })

    return () => {
      cancelled = true
    }
  }, [clientId, onCredential, onError, text])

  if (status === 'missing_config') {
    return null
  }

  return (
    <div className={disabled ? 'pointer-events-none opacity-60' : ''}>
      <div ref={buttonRef} className="min-h-11" />
    </div>
  )
}

export default GoogleSignInButton
