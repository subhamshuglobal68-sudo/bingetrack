import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  let redirectTo = requestUrl.searchParams.get('redirect') ?? '/watchlists'

  // Validate: only allow relative paths starting with / (block protocol-relative URLs)
  if (!redirectTo.startsWith('/') || redirectTo.startsWith('//') || redirectTo.includes('://')) {
    redirectTo = '/watchlists'
  }

  // Handle auth errors (e.g., expired confirmation link)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription ?? error)}`, requestUrl.origin)
    )
  }

  const supabase = await createClient()

  // Flow 1: Magic link / OAuth — Supabase sends a ?code= parameter
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('Invalid or expired link. Please try again.')}`, requestUrl.origin)
      )
    }
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  }

  // Flow 2: Email confirmation — Supabase sends ?token_hash=xxx&type=signup
  if (tokenHash && type) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'magiclink' | 'recovery' | 'email_change',
    })
    if (verifyError) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('Invalid or expired confirmation link. Please try again.')}`, requestUrl.origin)
      )
    }
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  }

  // No recognized auth parameters
  return NextResponse.redirect(
    new URL('/login?error=Missing+authorization+code', requestUrl.origin)
  )
}
