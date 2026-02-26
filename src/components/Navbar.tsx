'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield } from 'lucide-react'

const links = [
  { href: '/',       label: 'Evento' },
  { href: '/rsvp',   label: 'RSVP' },
  { href: '/gifts',  label: 'Presentes' },
]

export default function Navbar() {
  const pathname = usePathname()
  const adminActive = pathname.startsWith('/admin')

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 px-5 py-3"
      style={{ background: 'rgba(253,246,238,0.94)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}
    >
      <span className="font-serif text-lg font-semibold" style={{ color: 'var(--deep)' }}>
        💍 Gustavo & Rebeca
      </span>
      <div className="flex items-center flex-wrap gap-2">
        {links.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={{
                borderColor: active ? 'var(--deep)' : 'var(--border)',
                background:  active ? 'var(--deep)' : 'transparent',
                color:       active ? 'var(--cream)' : 'var(--muted)',
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
            borderColor: adminActive ? 'var(--deep)' : 'var(--border)',
            background: adminActive ? 'var(--deep)' : 'transparent',
            color: adminActive ? 'var(--cream)' : 'var(--muted)',
          }}
        >
          <Shield size={16} />
        </Link>
      </div>
    </nav>
  )
}
