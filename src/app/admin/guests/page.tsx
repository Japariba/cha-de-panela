import { createClient } from '@/lib/supabase/server'

type GuestRow = {
  id: string
  nome: string
  telefone: string | null
  confirmou: boolean
  qtd_acompanhantes: number
  created_at: string
}

export default async function AdminGuestsPage() {
  const supabase = await createClient()
  const { data: guests, error } = await supabase
    .from('convidados')
    .select('*')
    .order('created_at', { ascending: false })

  const confirmed = (guests || []).filter((g: { confirmou: boolean }) => g.confirmou)
  const declined = (guests || []).filter((g: { confirmou: boolean }) => !g.confirmou)
  const totalPessoas = confirmed.reduce(
    (sum: number, g: { qtd_acompanhantes: number }) => sum + 1 + g.qtd_acompanhantes,
    0
  )

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-light mb-1" style={{ color: 'var(--text)' }}>
        Convidados
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
        {confirmed.length} confirmados - {declined.length} nao vao - {totalPessoas} pessoas no total
      </p>

      {error && (
        <div className="mb-6 rounded-2xl px-4 py-3 text-sm" style={{ background: '#2a1616', border: '1px solid #5a2a2a', color: '#f0b4b4' }}>
          Não foi possível carregar a lista de convidados agora. Atualize a página e tente novamente.
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {!guests?.length ? (
          <div className="py-16 text-center text-sm italic" style={{ color: 'var(--muted)', background: 'var(--surface)' }}>
            Nenhuma resposta de RSVP ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm" style={{ background: 'var(--surface)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nome', 'WhatsApp', 'Status', 'Acomp.', 'Data'].map((header) => (
                    <th
                      key={header}
                      className="text-left px-5 py-3 text-xs uppercase tracking-wider"
                      style={{ color: 'var(--muted)' }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(guests as GuestRow[]).map((guest) => (
                  <tr key={guest.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--text)' }}>{guest.nome}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--text)' }}>{guest.telefone || '-'}</td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={
                          guest.confirmou
                            ? { background: '#1a2a1a', color: '#8fd08f' }
                            : { background: '#2a1616', color: '#d27f7f' }
                        }
                      >
                        {guest.confirmou ? 'Confirmado' : 'Nao vai'}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--text)' }}>
                      {guest.confirmou
                        ? `${1 + guest.qtd_acompanhantes} pessoa${1 + guest.qtd_acompanhantes > 1 ? 's' : ''}`
                        : '-'}
                    </td>
                    <td className="px-5 py-3 text-xs" style={{ color: 'var(--text)' }}>
                      {new Date(guest.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

