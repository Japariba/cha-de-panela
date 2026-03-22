'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'

const links = [
  { href: '/',       label: 'Evento' },
  { href: '/presenca',   label: 'Presença' },
  { href: '/gifts',  label: 'Presentes' },
]

export default function Navbar() {
  const pathname = usePathname()
  const adminActive = pathname.startsWith('/admin')

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 px-5 py-3"
      style={{ background: 'rgba(13,13,13,0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}
    >
      <Link href="/" className="font-serif text-lg font-semibold" style={{ color: 'var(--text)' }}>
        💍 Gustavo & Rebeca
      </Link>
      <div className="flex items-center flex-wrap gap-2">
        {links.map(({ href, label }) => {
          const active = href === '/presenca'
            ? pathname === '/presenca' || pathname === '/rsvp'
            : pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: active ? 'var(--accent)' : 'var(--border)',
                background:  active ? 'var(--accent)' : 'transparent',
                color:       active ? '#0d0d0d' : 'var(--muted)',
              }}
            >
              {label}
            </Link>
          )
        })}
        <Link
          href="/admin"
          aria-label="Abrir painel admin"
          title="Admin"
          className="inline-flex items-center justify-center p-2 rounded-full border transition-all"
          style={{
            borderColor: adminActive ? 'var(--accent)' : 'var(--border)',
            background: adminActive ? 'var(--accent)' : 'transparent',
            color: adminActive ? '#0d0d0d' : 'var(--muted)',
          }}
        >
          <Shield size={16} />
        </Link>
      </div>
    </nav>
  )
}

