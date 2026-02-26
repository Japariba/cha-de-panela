import { createClient } from '@/lib/supabase/server'

export default async function AdminGuestsPage() {
  const supabase = await createClient()
  const { data: guests } = await supabase.from('convidados').select('*').order('created_at', { ascending: false })

  const confirmed = (guests || []).filter((g: { confirmou: boolean }) => g.confirmou)
  const declined  = (guests || []).filter((g: { confirmou: boolean }) => !g.confirmou)
  const totalPessoas = confirmed.reduce((s: number, g: { qtd_acompanhantes: number }) => s + 1 + g.qtd_acompanhantes, 0)

  return (
    <div>
      <h1 className="font-serif text-3xl font-light mb-1" style={{ color: 'var(--deep)' }}>Convidados</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        {confirmed.length} confirmados · {declined.length} não vão · {totalPessoas} pessoas no total
      </p>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {!guests?.length ? (
          <div className="py-16 text-center text-sm italic" style={{ color: 'var(--muted)', background: 'var(--card)' }}>
            Nenhuma resposta de RSVP ainda.
          </div>
        ) : (
          <table className="w-full text-sm" style={{ background: 'var(--card)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Nome', 'WhatsApp', 'Status', 'Acomp.', 'Data'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(guests as Array<{ id: string; nome: string; telefone: string | null; confirmou: boolean; qtd_acompanhantes: number; created_at: string }>)
                .map(g => (
                <tr key={g.id} style={{ borderBottom: '1px solid #f0e8e0' }}>
                  <td className="px-5 py-3 font-medium">{g.nome}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--muted)' }}>{g.telefone || '—'}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                      style={g.confirmou
                        ? { background: '#edf6ea', color: '#4a8c40' }
                        : { background: '#fde8e8', color: '#b03030' }}>
                      {g.confirmou ? '✅ Confirmado' : '❌ Não vai'}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ color: 'var(--muted)' }}>
                    {g.confirmou ? `${1 + g.qtd_acompanhantes} pessoa${1 + g.qtd_acompanhantes > 1 ? 's' : ''}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--muted)' }}>
                    {new Date(g.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
