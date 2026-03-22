'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'

export default function RSVPPage() {
  const [supabase] = useState(() => createClient())
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [vai, setVai] = useState<'sim' | 'nao'>('sim')
  const [acomp, setAcomp] = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = nome.trim()
    if (!trimmedName) { setError('Por favor, informe seu nome.'); return }
    setLoading(true)
    setError('')

    const { error: dbError } = await supabase.from('convidados').insert({
      nome: trimmedName,
      telefone: telefone.trim() || null,
      confirmou: vai === 'sim',
      qtd_acompanhantes: vai === 'sim' ? acomp : 0,
    })

    setLoading(false)
    if (dbError) { setError('Erro ao salvar. Tente novamente.'); return }
    setSuccess(true)
  }

  return (
    <>
      <Navbar />
      <main className="relative z-10 max-w-lg mx-auto px-6 py-12">
        <h1 className="font-serif font-light text-4xl text-center mb-2" style={{ color: 'var(--text)' }}>
          Confirmar Presença
        </h1>
        <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Nos diga se vai poder comparecer para prepararmos tudo com carinho 🌷
        </p>

        {!success ? (
          <form onSubmit={handleSubmit} className="rounded-2xl p-7 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            {/* Nome */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Seu nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Ana Paula Silva"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors"
                style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>
                WhatsApp
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="(19) 99999-9999"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              />
            </div>

            {/* Vai? */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>
                Vai comparecer?
              </label>
              <div className="flex gap-3">
                {(['sim', 'nao'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVai(v)}
                    className="flex-1 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      border: '1.5px solid',
                      borderColor: vai === v ? 'var(--accent)' : 'var(--border)',
                      background:  vai === v ? 'var(--surface)' : 'var(--surface-2)',
                      color:       vai === v ? 'var(--accent)' : 'var(--text)',
                      fontWeight:  vai === v ? '500' : '400',
                    }}
                  >
                    {v === 'sim' ? '✅ Sim, vou!' : '😢 Não poderei'}
                  </button>
                ))}
              </div>
            </div>

            {/* Acompanhantes */}
            {vai === 'sim' && (
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>
                  Acompanhantes
                </label>
                <select
                  value={acomp}
                  onChange={e => setAcomp(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)', appearance: 'none' }}
                >
                  <option value={0}>Só eu</option>
                  {[1,2,3,4].map(n => <option key={n} value={n}>+ {n} pessoa{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: 'var(--accent)', color: '#0d0d0d' }}
            >
              {loading ? 'Salvando…' : 'Confirmar presença →'}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#0f1a0f', border: '1px solid #2a4a2a' }}>
            <div className="text-5xl mb-4">{vai === 'sim' ? '🎉' : '💙'}</div>
            <h2 className="font-serif text-2xl mb-2" style={{ color: '#b9e0b9' }}>
              {vai === 'sim' ? `Presença confirmada, ${nome}!` : `Tudo certo, ${nome}`}
            </h2>
            <p className="text-sm mb-6" style={{ color: '#93c793' }}>
              {vai === 'sim'
                ? 'Que alegria! Te esperamos no dia 29 de Março com muito amor. 💍'
                : 'Sentiremos sua falta, mas obrigada por avisar!'}
            </p>
            <Link
              href="/gifts"
              className="inline-block text-sm font-medium px-6 py-3 rounded-full border transition-all hover:-translate-y-0.5"
              style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}
            >
              Ver lista de presentes 🎁
            </Link>
          </div>
        )}
      </main>
    </>
  )
}



