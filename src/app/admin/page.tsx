import { createClient } from '@/lib/supabase/server'
import { CreditCard, Gift, Mail, Users, Wallet } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const [{ data: guests }, { data: gifts }] = await Promise.all([
    supabase.from('convidados').select('*'),
    supabase.from('presentes').select('*'),
  ])

  const confirmed = (guests || []).filter((g: { confirmou: boolean }) => g.confirmou)
  const totalPessoas = confirmed.reduce((s: number, g: { qtd_acompanhantes: number }) => s + 1 + g.qtd_acompanhantes, 0)

  const stats = [
    { label: 'Respostas RSVP', value: (guests || []).length, icon: Mail },
    { label: 'Pessoas confirmadas', value: totalPessoas, icon: Users },
    { label: 'Presentes cadastrados', value: (gifts || []).length, icon: Gift },
    { label: 'Reservados/Pagos', value: (gifts || []).filter((g: { status: string }) => g.status !== 'disponivel').length, icon: Wallet },
    { label: 'Pagos via Pix', value: (gifts || []).filter((g: { status: string }) => g.status === 'pago').length, icon: CreditCard },
  ]

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl font-light mb-1" style={{ color: 'var(--deep)' }}>Dashboard</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--muted)' }}>Visao geral do Cha de Panela - 29/03/2026</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4 md:p-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="mb-1 flex justify-center">
              <Icon size={18} />
            </div>
            <div className="font-serif text-2xl md:text-3xl font-light" style={{ color: 'var(--deep)' }}>{value}</div>
            <div className="text-xs mt-1 leading-tight" style={{ color: 'var(--muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <div className="px-4 md:px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--card)' }}>
          <h2 className="font-serif text-xl" style={{ color: 'var(--deep)' }}>Confirmacoes recentes</h2>
        </div>
        {!guests?.length ? (
          <div className="px-5 py-8 text-center text-sm italic" style={{ color: 'var(--muted)', background: 'var(--card)' }}>Nenhuma confirmacao ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm" style={{ background: 'var(--card)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nome', 'WhatsApp', 'Status', '+Acomp.'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(guests as Array<{ id: string; nome: string; telefone: string | null; confirmou: boolean; qtd_acompanhantes: number }>)
                  .slice(0, 10).map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #f0e8e0' }}>
                    <td className="px-5 py-3">{g.nome}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--muted)' }}>{g.telefone || '-'}</td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={g.confirmou ? { background: '#edf6ea', color: '#4a8c40' } : { background: '#fde8e8', color: '#b03030' }}
                      >
                        {g.confirmou ? 'Confirmado' : 'Nao vai'}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--muted)' }}>{g.confirmou ? `+${g.qtd_acompanhantes}` : '-'}</td>
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
