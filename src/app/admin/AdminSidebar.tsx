'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gift, House, LayoutDashboard, LogOut, Shield, Users } from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/gifts', icon: Gift, label: 'Presentes' },
  { href: '/admin/guests', icon: Users, label: 'Convidados' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-full md:w-56 md:flex-shrink-0 flex flex-col px-3 py-3 md:py-8 md:px-4 gap-3 md:gap-0 sticky top-0 z-30"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="text-center md:mb-8">
        <div className="flex justify-center mb-1">
          <Shield size={22} />
        </div>
        <div className="font-serif text-sm font-semibold" style={{ color: 'var(--text)' }}>Admin</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Gustavo & Rebeca</div>
      </div>

      <nav className="flex-1">
        <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
                style={{
                  background: active ? 'var(--accent)' : 'transparent',
                  color: active ? '#0d0d0d' : 'var(--muted)',
                  fontWeight: active ? '500' : '400',
                }}
              >
                <Icon size={16} /> {label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-1 md:mt-4">
        <Link
          href="/"
          className="flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--text)]"
          style={{ color: 'var(--muted)' }}
        >
          <House size={16} /> Voltar ao site
        </Link>

        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2.5 rounded-xl text-sm transition-all hover:text-[var(--text)]"
            style={{ color: 'var(--muted)' }}
          >
            <LogOut size={16} /> Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
