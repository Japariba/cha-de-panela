'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin',         icon: '📊', label: 'Dashboard' },
  { href: '/admin/gifts',   icon: '🎁', label: 'Presentes' },
  { href: '/admin/guests',  icon: '👥', label: 'Convidados' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside
      className="w-56 flex-shrink-0 flex flex-col py-8 px-4"
      style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
    >
      <div className="text-center mb-8">
        <div className="text-2xl mb-1">💍</div>
        <div className="font-serif text-sm font-semibold" style={{ color: 'var(--deep)' }}>Admin</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Gustavo & Rebeca</div>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map(({ href, icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: active ? 'var(--deep)' : 'transparent',
                color: active ? 'var(--cream)' : 'var(--muted)',
                fontWeight: active ? '500' : '400',
              }}
            >
              <span>{icon}</span> {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all mt-4 hover:opacity-80"
        style={{ color: 'var(--muted)' }}
      >
        🚪 Sair
      </button>
    </aside>
  )
}
