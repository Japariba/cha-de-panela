import Navbar from '@/components/Navbar'
import Petals from '@/components/Petals'
import GiftsList from './GiftsList'

export default function GiftsPage() {
  return (
    <>
      <Petals />
      <Navbar />
      <main className="relative z-10 max-w-2xl mx-auto px-5 py-12">
        <h1 className="font-serif font-light text-4xl text-center mb-2" style={{ color: 'var(--deep)' }}>
          Lista de Presentes
        </h1>
        <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Escolha um item para presentear o casal 🏠
        </p>
        <GiftsList />
      </main>
    </>
  )
}
