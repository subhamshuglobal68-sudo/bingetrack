import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  let redirectTo = requestUrl.searchParams.get('redirect') ?? '/watchlists'

  // Validate: only allow relative paths starting with / (block protocol-relative URLs)
  if (!redirectTo.startsWith('/') || redirectTo.startsWith('//') || redirectTo.includes('://')) {
    redirectTo = '/watchlists'
  }

  // Handle auth errors from Supabase (e.g., expired/invalid link)
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription ?? error)}`, requestUrl.origin)
    )
  }

  // No code parameter — link is invalid
  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=Invalid+or+expired+link.+Please+try+again.', requestUrl.origin)
    )
  }

  const supabase = await createClient()

  // Exchange the authorization code for a session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Invalid or expired link. Please try again.')}`, requestUrl.origin)
    )
  }

  // Build the redirect URL
  const redirectUrl = type === 'recovery'
    ? new URL('/reset-password', requestUrl.origin)
    : new URL(redirectTo, requestUrl.origin)

  const response = NextResponse.redirect(redirectUrl)

  // Carry session cookies from the cookie store onto the redirect response
  // exchangeCodeForSession writes cookies to the server-side cookie store,
  // but NextResponse.redirect() creates a fresh response that doesn't inherit them.
  const cookieStore = await cookies()
  for (const cookie of cookieStore.getAll()) {
    response.cookies.set(cookie.name, cookie.value)
  }

  return response
}
