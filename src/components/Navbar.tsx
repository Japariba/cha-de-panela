'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',       label: 'Evento' },
  { href: '/rsvp',   label: 'RSVP' },
  { href: '/gifts',  label: 'Presentes' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 px-5 py-3"
      style={{ background: 'rgba(253,246,238,0.94)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--border)' }}
    >
      <span className="font-serif text-lg font-semibold" style={{ color: 'var(--deep)' }}>
        💍 Gustavo & Rebeca
      </span>
      <div className="flex flex-wrap gap-2">
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
      </div>
    </nav>
  )
}
