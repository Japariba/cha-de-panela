'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError('Email ou senha incorretos.'); return }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💍</div>
          <h1 className="font-serif text-3xl font-light" style={{ color: 'var(--text)' }}>Área Admin</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Chá de Panela — Gustavo & Rebeca</p>
        </div>
        <form onSubmit={handleLogin} className="rounded-2xl p-7 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#0d0d0d' }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}


