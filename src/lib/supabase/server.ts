import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieToSet = {
  name: string
  value: string
  options?: Record<string, unknown>
}

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieToSet['options']) {
          try {
            cookieStore.set(name, value, options as never)
          } catch {}
        },
        remove(name: string, options: CookieToSet['options']) {
          try {
            cookieStore.set(name, '', { ...(options || {}), maxAge: 0 } as never)
          } catch {}
        },
      },
    }
  )
}
