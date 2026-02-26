'use client'
import { useState } from 'react'

export default function CopyPix({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="text-xs font-medium transition-colors"
      style={{ background: 'none', border: 'none', color: copied ? 'var(--sage)' : 'var(--rose)', cursor: 'pointer' }}
    >
      {copied ? '✓ Copiado!' : '📋 Copiar chave'}
    </button>
  )
}
