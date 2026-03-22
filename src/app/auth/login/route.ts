import { DEFAULT_COOKIE_OPTIONS, createChunks, deleteChunks } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

function getStorageKey() {
  const hostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname
  return `sb-${hostname.split('.')[0]}-auth-token`
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return NextResponse.redirect(new URL('/admin/login?error=missing_credentials', request.url))
  }

  const response = NextResponse.redirect(new URL('/admin', request.url))
  const storageKey = getStorageKey()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.redirect(new URL('/admin/login?error=invalid_credentials', request.url))
  }

  await deleteChunks(
    storageKey,
    async (chunkName) => request.cookies.get(chunkName)?.value,
    async (chunkName) => {
      response.cookies.set(chunkName, '', { ...DEFAULT_COOKIE_OPTIONS, maxAge: 0 })
    }
  )

  const chunks = createChunks(storageKey, JSON.stringify(data.session))
  chunks.forEach(({ name, value }) => {
    response.cookies.set(name, value, DEFAULT_COOKIE_OPTIONS)
  })

  return response
}
