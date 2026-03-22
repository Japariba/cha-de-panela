'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Gift } from '@/lib/types'
import Toast from '@/components/Toast'

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  disponivel: { bg: '#1a2a1a', color: '#8fd08f', label: '✅ Disponível' },
  reservado:  { bg: '#2b2418', color: '#d0aa68', label: '🟡 Reservado' },
  pago:       { bg: '#271f31', color: '#b79adb', label: '🟣 Pago via Pix' },
}

type PublicGift = Pick<Gift, 'id' | 'nome' | 'descricao' | 'valor_sugerido' | 'status' | 'icone' | 'reservado_por'>

export default function GiftsList() {
  const [supabase] = useState(() => createClient())
  const [gifts, setGifts] = useState<PublicGift[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState('')

  // Modal state
  const [modal, setModal] = useState<PublicGift | null>(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchGifts = useCallback(async () => {
    const { data, error } = await supabase
      .from('presentes')
      .select('id,nome,descricao,valor_sugerido,status,icone,reservado_por')
      .order('nome')
    if (error) {
      setGifts([])
      setLoadError('Não foi possível carregar a lista de presentes agora. Tente novamente em instantes.')
      setLoading(false)
      return
    }
    setLoadError('')
    setGifts(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { void fetchGifts() }, [fetchGifts])

  const openModal = (gift: PublicGift) => {
    setNome('')
    setModalError('')
    setSaving(false)
    setModal(gift)
  }
  const closeModal = () => {
    setSaving(false)
    setModalError('')
    setModal(null)
  }

  const confirm = async () => {
    if (!modal) return
    const trimmedName = nome.trim()
    if (!trimmedName) { setModalError('Por favor, informe seu nome.'); return }

    setSaving(true)
    setModalError('')

    const { data, error } = await supabase
      .from('presentes')
      .update({
        status: 'reservado',
        reservado_por: trimmedName,
        tipo_entrega: 'fisico',
      })
      .eq('id', modal.id)
      .eq('status', 'disponivel')
      .select('id')
      .maybeSingle()

    setSaving(false)
    if (error) { setModalError('Erro ao reservar. Tente novamente.'); return }

    if (!data) {
      await fetchGifts()
      setModalError('Este presente acabou de ser reservado por outra pessoa. Escolha outro item.')
      return
    }

    closeModal()
    await fetchGifts()
    setToast(`✅ Reservado para ${trimmedName}! 🛍️`)
  }

  if (loading) return <div className="text-center py-16 text-sm" style={{ color: 'var(--muted)' }}>Carregando…</div>
  if (loadError) return <div className="text-center py-16 text-sm" style={{ color: '#d27f7f' }}>{loadError}</div>
  if (!gifts.length) return (
    <div className="text-center py-16 text-sm" style={{ color: 'var(--muted)' }}>
      A lista de presentes ainda não foi cadastrada. Volte em breve! 🌷
    </div>
  )

  return (
    <>
      <div className="space-y-3">
        {gifts.map(gift => {
          const st = statusStyle[gift.status]
          const taken = gift.status !== 'disponivel'
          return (
            <div
              key={gift.id}
              className="flex items-center gap-4 rounded-2xl p-5 transition-shadow"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                opacity: taken ? 0.6 : 1,
                boxShadow: taken ? 'none' : undefined,
              }}
            >
              <div className="text-3xl flex-shrink-0">{gift.icone || '🎁'}</div>
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg font-semibold leading-tight mb-0.5" style={{ color: 'var(--text)' }}>
                  {gift.nome}
                </div>
                {gift.descricao && <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>{gift.descricao}</div>}
                {gift.valor_sugerido && (
                  <div className="text-sm font-medium mb-1.5" style={{ color: 'var(--accent)' }}>
                    R$ {gift.valor_sugerido.toFixed(2).replace('.', ',')}
                  </div>
                )}
                <span className="inline-block text-xs px-3 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.color }}>
                  {st.label}
                </span>
                {taken && gift.reservado_por && (
                  <div className="text-xs italic mt-1" style={{ color: 'var(--muted)' }}>
                    por {gift.reservado_por}
                  </div>
                )}
              </div>
              {!taken && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => openModal(gift)}
                    className="text-xs font-medium px-3 py-2 rounded-full transition-all hover:-translate-y-0.5"
                    style={{ background: 'var(--accent-2)', color: '#0d0d0d' }}
                  >
                    🛍️ Levar
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="rounded-2xl p-7 w-full max-w-sm animate-slide-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-serif text-2xl mb-1" style={{ color: 'var(--text)' }}>
              🛍️ Vou comprar e levar!
            </h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Você escolheu: <strong>{modal.nome}</strong>. Reservaremos o item no seu nome.
            </p>

            <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>
              Seu nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Fernanda Costa"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-2"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
            {modalError && <p className="text-xs text-red-500 mb-2">{modalError}</p>}

            <div className="flex gap-3 mt-4">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-full text-sm border transition-all"
                style={{ border: '1.5px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirm}
                disabled={saving}
                className="flex-1 py-3 rounded-full text-sm font-medium text-white transition-all disabled:opacity-60"
                style={{ background: 'var(--accent-2)', color: '#0d0d0d' }}
              >
                {saving ? 'Salvando…' : 'Reservar ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
