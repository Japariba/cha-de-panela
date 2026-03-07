'use client'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  onDone: () => void
}

export default function Toast({ message, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 3000)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm shadow-xl transition-all duration-300"
      style={{
        background: 'var(--surface-2)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.45)',
        transform: visible ? 'translateY(0)' : 'translateY(80px)',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
