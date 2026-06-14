import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  let redirectTo = requestUrl.searchParams.get('redirect') ?? '/watchlists'

  // Validate: only allow relative paths starting with /
  if (!redirectTo.startsWith('/') || redirectTo.includes('://')) {
    redirectTo = '/watchlists'
  }

  // Handle auth errors (e.g., expired confirmation link)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription ?? error)}`, requestUrl.origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Missing+authorization+code', requestUrl.origin)
    )
  }

  const supabase = await createClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Invalid or expired link. Please try again.')}`, requestUrl.origin)
    )
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
