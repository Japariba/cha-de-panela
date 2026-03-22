import { DEFAULT_COOKIE_OPTIONS, deleteChunks } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function getStorageKey() {
  const hostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname
  return `sb-${hostname.split('.')[0]}-auth-token`
}

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  const storageKey = getStorageKey()

  await deleteChunks(
    storageKey,
    async (chunkName) => request.cookies.get(chunkName)?.value,
    async (chunkName) => {
      response.cookies.set(chunkName, '', { ...DEFAULT_COOKIE_OPTIONS, maxAge: 0 })
    }
  )

  return response
}
