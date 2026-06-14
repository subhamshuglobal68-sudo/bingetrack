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
    console.error('[Auth Callback Error]', error, errorDescription)
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
  const { data: { user }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[Auth Callback] Code exchange failed:', exchangeError.message)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Invalid or expired link. Please try again.')}`, requestUrl.origin)
    )
  }

  // Auto-create profile if it doesn't exist (handles first-time signup)
  if (user) {
    const baseUsername = user.email?.split('@')[0] ?? `user_${user.id.slice(0, 8)}`
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: baseUsername,
          full_name: null,
          avatar_url: null,
        },
        { onConflict: 'id' }
      )
    // If username conflicts with another user, retry with suffix
    if (profileError?.code === '23505') {
      await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            username: `${baseUsername}_${user.id.slice(0, 6)}`,
            full_name: null,
            avatar_url: null,
          },
          { onConflict: 'id' }
        )
    } else if (profileError) {
      console.error('[Auth Callback] Profile upsert failed:', profileError.message)
    }
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
    // Only copy Supabase auth cookies (prefixed with sb-)
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, cookie.value)
    }
  }

  return response
}
