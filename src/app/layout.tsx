import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Chá de Panela — Gustavo & Rebeca',
  description: '29 de Março de 2026 • Hortolândia - SP',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
