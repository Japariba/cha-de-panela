'use client'
import { useState } from 'react'

export default function CopyPix({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const copy = async () => {
    setError('')

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('clipboard_unavailable')
      }

      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
      setError('Não foi possível copiar automaticamente. Use a chave exibida acima.')
    }
  }

  return (
    <>
      <button
        onClick={copy}
        className="text-xs font-medium transition-colors"
        style={{ background: 'none', border: 'none', color: copied ? 'var(--accent-2)' : 'var(--accent)', cursor: 'pointer' }}
      >
        {copied ? '✓ Copiado!' : '📋 Copiar chave'}
      </button>
      {error && (
        <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          {error}
        </p>
      )}
    </>
  )
}
