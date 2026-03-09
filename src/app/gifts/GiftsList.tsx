'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Gift } from '@/lib/types'
import { EVENT_INFO } from '@/lib/types'
import Toast from '@/components/Toast'

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  disponivel: { bg: '#1a2a1a', color: '#8fd08f', label: '✅ Disponível' },
  reservado:  { bg: '#2b2418', color: '#d0aa68', label: '🟡 Reservado' },
  pago:       { bg: '#271f31', color: '#b79adb', label: '🟣 Pago via Pix' },
}

type PublicGift = Pick<Gift, 'id' | 'nome' | 'descricao' | 'valor_sugerido' | 'status' | 'icone'>

export default function GiftsList() {
  const supabase = createClient()
  const [gifts, setGifts] = useState<PublicGift[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  // Modal state
  const [modal, setModal] = useState<{ gift: PublicGift; type: 'pix' | 'fisico' } | null>(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState('')

  const fetchGifts = useCallback(async () => {
    const { data } = await supabase
      .from('presentes')
      .select('id,nome,descricao,valor_sugerido,status,icone')
      .order('nome')
    setGifts(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchGifts() }, [fetchGifts])

  const openModal = (gift: PublicGift, type: 'pix' | 'fisico') => {
    setNome(''); setModalError('')
    setModal({ gift, type })
  }
  const closeModal = () => setModal(null)

  const confirm = async () => {
    if (!nome.trim()) { setModalError('Por favor, informe seu nome.'); return }
    if (!modal) return
    setSaving(true)
    const { error } = await supabase.from('presentes').update({
      status: modal.type === 'pix' ? 'pago' : 'reservado',
      reservado_por: nome.trim(),
      tipo_entrega: modal.type,
    }).eq('id', modal.gift.id).eq('status', 'disponivel') // guard: only update if still available
    setSaving(false)
    if (error) { setModalError('Erro ao reservar. Tente novamente.'); return }
    closeModal()
    fetchGifts()
    setToast(modal.type === 'pix' ? `🎉 Obrigada, ${nome}! Pagamento registrado.` : `✅ Reservado para ${nome}! 🛍️`)
  }

  if (loading) return <div className="text-center py-16 text-sm" style={{ color: 'var(--muted)' }}>Carregando…</div>
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
              </div>
              {!taken && (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => openModal(gift, 'pix')}
                    className="text-xs font-medium px-3 py-2 rounded-full transition-all hover:-translate-y-0.5"
                    style={{ background: 'var(--accent)', color: '#0d0d0d' }}
                  >
                    💳 Pix
                  </button>
                  <button
                    onClick={() => openModal(gift, 'fisico')}
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
              {modal.type === 'pix' ? '💳 Presentear via Pix' : '🛍️ Vou comprar e levar!'}
            </h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--muted)' }}>
              Você escolheu: <strong>{modal.gift.nome}</strong>.{' '}
              {modal.type === 'pix' ? 'Realize o pagamento e confirme seu nome.' : 'Reservaremos o item no seu nome.'}
            </p>

            {modal.type === 'pix' && (
              <div className="rounded-xl p-4 text-center mb-4" style={{ background: 'var(--surface-2)', border: '1px dashed var(--border)' }}>
                <div className="text-sm font-semibold break-all mb-1" style={{ color: 'var(--text)' }}>{EVENT_INFO.chave_pix}</div>
                {modal.gift.valor_sugerido && (
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    Valor sugerido: R$ {modal.gift.valor_sugerido.toFixed(2).replace('.', ',')}
                  </div>
                )}
              </div>
            )}

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
                style={{ background: modal.type === 'pix' ? 'var(--accent)' : 'var(--accent-2)', color: '#0d0d0d' }}
              >
                {saving ? 'Salvando…' : modal.type === 'pix' ? 'Confirmar ✓' : 'Reservar ✓'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast('')} />
    </>
  )
}
