type SearchParams = Promise<{
  error?: string
}>

function getErrorMessage(error?: string) {
  if (error === 'invalid_credentials') return 'Email ou senha incorretos.'
  if (error === 'missing_credentials') return 'Preencha email e senha para continuar.'
  if (error === 'unexpected') return 'Nao foi possivel concluir o login agora. Tente novamente.'
  return ''
}

export default async function LoginPage({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ? await searchParams : undefined
  const error = getErrorMessage(params?.error)

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💍</div>
          <h1 className="font-serif text-3xl font-light" style={{ color: 'var(--text)' }}>Área Admin</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Chá de Panela — Gustavo & Rebeca</p>
        </div>

        <form action="/auth/login" method="post" className="rounded-2xl p-7 space-y-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium mb-2" style={{ color: 'var(--muted)' }}>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--surface-2)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-full text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--accent)', color: '#0d0d0d' }}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
