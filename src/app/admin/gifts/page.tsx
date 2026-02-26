'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Gift } from '@/lib/types'
import Toast from '@/components/Toast'

const ICONS = ['🎁','🥘','🍳','🔪','🧺','🥗','☕','🧴','🍽️','🪴','🛁','🛏️','🪣','🧹','🫙','🍷','🫖','🧇','🥂','🫕']

const emptyForm = { nome: '', descricao: '', valor_sugerido: '', icone: '🎁' }

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  disponivel: { bg: '#edf6ea', color: '#4a8c40',  label: '✅ Disponível' },
  reservado:  { bg: '#fff4e0', color: '#b07720',  label: '🟡 Reservado' },
  pago:       { bg: '#f0e8f6', color: '#7040a0',  label: '🟣 Pago via Pix' },
}

export default function AdminGiftsPage() {
  const supabase = createClient()
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchGifts = useCallback(async () => {
    const { data } = await supabase.from('presentes').select('*').order('nome')
    setGifts(data || []); setLoading(false)
  }, [supabase])

  useEffect(() => { fetchGifts() }, [fetchGifts])

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (g: Gift) => {
    setForm({ nome: g.nome, descricao: g.descricao || '', valor_sugerido: g.valor_sugerido?.toString() || '', icone: g.icone || '🎁' })
    setEditId(g.id); setShowForm(true)
  }

  const saveGift = async () => {
    if (!form.nome.trim()) return
    setSaving(true)
    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
      valor_sugerido: form.valor_sugerido ? parseFloat(form.valor_sugerido.replace(',', '.')) : null,
      icone: form.icone,
    }
    if (editId) {
      await supabase.from('presentes').update(payload).eq('id', editId)
      setToast('✅ Presente atualizado!')
    } else {
      await supabase.from('presentes').insert({ ...payload, status: 'disponivel', reservado_por: null, tipo_entrega: null })
      setToast('✅ Presente adicionado!')
    }
    setSaving(false); setShowForm(false); fetchGifts()
  }

  const resetGift = async (id: string) => {
    await supabase.from('presentes').update({ status: 'disponivel', reservado_por: null, tipo_entrega: null }).eq('id', id)
    setToast('🔄 Presente liberado novamente.')
    fetchGifts()
  }

  const deleteGift = async (id: string) => {
    await supabase.from('presentes').delete().eq('id', id)
    setDeleteId(null); setToast('🗑️ Presente removido.'); fetchGifts()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl font-light" style={{ color: 'var(--deep)' }}>Presentes</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{gifts.length} item(s) cadastrado(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--deep)', color: 'var(--cream)' }}
        >
          + Adicionar presente
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm" style={{ color: 'var(--muted)' }}>Carregando…</div>
      ) : !gifts.length ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-4xl mb-3">🎁</div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Nenhum presente ainda. Clique em &quot;Adicionar&quot; para começar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {gifts.map(g => {
            const st = statusStyle[g.status]
            return (
              <div key={g.id} className="flex items-center gap-4 rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="text-2xl">{g.icone || '🎁'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm" style={{ color: 'var(--deep)' }}>{g.nome}</div>
                  {g.descricao && <div className="text-xs" style={{ color: 'var(--muted)' }}>{g.descricao}</div>}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {g.valor_sugerido && (
                      <span className="text-xs font-medium" style={{ color: 'var(--rose)' }}>
                        R$ {g.valor_sugerido.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.color }}>
                      {st.label}
                    </span>
                    {g.reservado_por && <span className="text-xs italic" style={{ color: 'var(--muted)' }}>por {g.reservado_por}</span>}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {g.status !== 'disponivel' && (
                    <button onClick={() => resetGift(g.id)} className="text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={{ border: '1px solid var(--border)', color: 'var(--muted)' }} title="Liberar presente">
                      🔄
                    </button>
                  )}
                  <button onClick={() => openEdit(g)} className="text-xs px-3 py-1.5 rounded-full border transition-all"
                    style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                    ✏️
                  </button>
                  <button onClick={() => setDeleteId(g.id)} className="text-xs px-3 py-1.5 rounded-full border transition-all"
                    style={{ border: '1px solid #fca5a5', color: '#b03030' }}>
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(58,37,32,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="rounded-2xl p-7 w-full max-w-md animate-slide-up" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="font-serif text-2xl mb-5" style={{ color: 'var(--deep)' }}>
              {editId ? '✏️ Editar presente' : '+ Novo presente'}
            </h3>

            {/* Icon picker */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>Ícone</label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icone: ic }))}
                    className="w-8 h-8 text-lg rounded-lg transition-all"
                    style={{ background: form.icone === ic ? 'var(--blush)' : 'var(--cream)', border: `1.5px solid ${form.icone === ic ? 'var(--rose)' : 'var(--border)'}` }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Nome do presente *', key: 'nome', placeholder: 'Ex: Panela de Pressão', type: 'text' },
                { label: 'Descrição', key: 'descricao', placeholder: 'Ex: 6 litros, Tramontina', type: 'text' },
                { label: 'Valor sugerido (R$)', key: 'valor_sugerido', placeholder: 'Ex: 120,00', type: 'text' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-wider font-medium mb-1.5" style={{ color: 'var(--muted)' }}>{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--cream)', border: '1.5px solid var(--border)', color: 'var(--deep)' }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-full text-sm border"
                style={{ border: '1.5px solid var(--deep)', color: 'var(--deep)' }}>
                Cancelar
              </button>
              <button onClick={saveGift} disabled={saving || !form.nome.trim()}
                className="flex-1 py-3 rounded-full text-sm font-medium text-white disabled:opacity-60"
                style={{ background: 'var(--deep)' }}>
                {saving ? 'Salvando…' : editId ? 'Salvar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(58,37,32,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl p-7 w-full max-w-sm animate-slide-up text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--deep)' }}>Remover presente?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Essa ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-full text-sm border"
                style={{ border: '1.5px solid var(--border)', color: 'var(--muted)' }}>Cancelar</button>
              <button onClick={() => deleteGift(deleteId)}
                className="flex-1 py-3 rounded-full text-sm font-medium text-white"
                style={{ background: '#b03030' }}>Remover</button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}
