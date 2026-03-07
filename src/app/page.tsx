import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CopyPix from './CopyPix'
import { EVENT_INFO } from '@/lib/types'

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10">
        {/* HERO */}
        <section className="text-center px-6 pt-16 pb-12">

          <h1 className="font-serif font-light leading-tight mb-4" style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)', color: 'var(--text)' }}>
            Chá de Panela<br />
            <em className="italic" style={{ color: 'var(--accent)' }}>Gustavo & Rebeca</em>
          </h1>

          <p className="text-sm mb-10 max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Um momento especial para celebrar o novo lar que será construído com amor.
          </p>

          {/* INFO CHIPS */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: '📅', text: EVENT_INFO.data },
              { icon: '⏰', text: EVENT_INFO.horario },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <span>{icon}</span> {text}
              </div>
            ))}
            <a
              href={EVENT_INFO.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-opacity hover:opacity-80"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--accent)' }}
            >
              📍 Ver no Maps
            </a>
          </div>

          <p className="text-xs mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
            Condomínio Jardim de Monaco — Salão de Festas<br />
            Av. Olívio Franceschini, 2505 — Hortolândia, SP
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/presenca"
              className="text-sm font-medium px-7 py-3 rounded-full transition-all hover:-translate-y-0.5"
              style={{ background: 'var(--accent)', color: '#0d0d0d', boxShadow: '0 4px 18px rgba(0,0,0,0.35)' }}
            >
              ✅ Confirmar Presença
            </Link>
            <Link
              href="/gifts"
              className="text-sm font-medium px-7 py-3 rounded-full border transition-all hover:-translate-y-0.5"
              style={{ border: '1.5px solid var(--accent)', color: 'var(--accent)' }}
            >
              🎁 Ver Lista de Presentes
            </Link>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 max-w-md mx-auto px-6 mb-7">
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--muted)' }}>Presentear via Pix</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        {/* PIX BOX */}
        <div className="max-w-sm mx-auto mb-20 mx-6 text-center rounded-2xl p-7" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--text)' }}>💳 Chave Pix</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>Prefere presentear com um valor? Use a chave abaixo.</p>
          <div
            className="text-sm font-medium px-4 py-2.5 rounded-xl mb-3 break-all"
            style={{ background: 'var(--surface)', border: '1px dashed var(--border)', color: 'var(--text)' }}
          >
            {EVENT_INFO.chave_pix}
          </div>
          <CopyPix value={EVENT_INFO.chave_pix} />
        </div>
      </main>
    </>
  )
}


