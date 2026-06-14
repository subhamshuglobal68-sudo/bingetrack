'use client'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') ?? '/watchlists'
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.includes('://')
    ? rawRedirect
    : '/watchlists'
  const supabase = createClient()

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(() => searchParams.get('error') ?? '')
  const [success, setSuccess] = useState('')

  const getFriendlyError = (message: string) => {
    if (message.includes('Invalid login credentials')) return 'Invalid email or password.'
    if (message.includes('already registered') || message.includes('User already registered')) return 'An account with this email already exists. If you recently deleted this account, please wait a few minutes or contact support.'
    if (message.includes('Email not confirmed')) return 'Please confirm your email before signing in.'
    if (message.includes('Password should be at least')) return 'Password must be at least 6 characters.'
    if (message.includes('Unable to validate email address')) return 'Please enter a valid email address.'
    if (message.includes('Database error saving new user')) return 'An account with this email may already exist. If you recently deleted this account, please wait a few minutes and try again.'
    if (message.includes('signup is disabled')) return 'Sign-ups are currently disabled.'
    if (message.includes('rate limit')) return 'Too many attempts. Please try again later.'
    return 'Something went wrong. Please try again.'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })
      setLoading(false)
      if (error) {
        setError(getFriendlyError(error.message))
      } else {
        setSuccess('Check your email for a password reset link.')
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })
      setLoading(false)
      if (error) {
        setError(getFriendlyError(error.message))
      } else {
        setSuccess('Check your email for a confirmation link.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setLoading(false)
      if (error) {
        setError(getFriendlyError(error.message))
      } else {
        window.location.href = redirect
      }
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-surface" />

      <div className="w-full max-w-sm">
        <div className="animate-modal-enter rounded-2xl border border-[#2a2520] border-t-2 border-t-[#d4a853] bg-surface p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-[#d4a853]/10 p-4">
              <Film size={40} className="text-[#d4a853]" strokeWidth={2} />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary font-display">
            {mode === 'forgot' ? 'Reset Password' : 'Welcome to BingeTrack'}
          </h1>
          <p className="mb-8 text-sm text-text-secondary leading-relaxed">
            {mode === 'signin'
              ? 'Sign in to create and manage your movie watchlists.'
              : mode === 'signup'
                ? 'Create an account to start tracking movies.'
                : 'Enter your email and we\'ll send you a reset link.'}
          </p>

          {/* Mode toggle — hidden in forgot mode */}
          {mode !== 'forgot' && (
            <div className="mb-6 flex rounded-lg bg-background p-1" role="tablist">
              <button
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => { setMode('signin'); setError(''); setSuccess(''); setShowPassword(false) }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign In
              </button>
              <button
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); setShowPassword(false) }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error / Success */}
          {error && (
            <div role="alert" className="mb-4 rounded-lg bg-[#2a1a10]/50 border border-[#c44040]/30 px-4 py-3 text-sm text-[#e88080]">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="mb-4 rounded-lg bg-[#1a1a10]/50 border border-[#4a9e6e]/30 px-4 py-3 text-sm text-[#6abe8e]">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="sr-only">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                aria-required="true"
                maxLength={254}
                className="w-full rounded-lg border border-[#2a2520] bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-[#d4a853] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20 transition-all"
              />
            </div>
            {mode !== 'forgot' && (
              <div className="relative">
                <label htmlFor="login-password" className="sr-only">
                  Password
                </label>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  aria-required="true"
                  minLength={6}
                  maxLength={128}
                  className="w-full rounded-lg border border-[#2a2520] bg-background px-4 py-3 pr-10 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-[#d4a853] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-[#d4a853] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
            <Button
              type="submit"
              className="w-full py-3"
              isLoading={loading}
              aria-busy={loading}
            >
              {mode === 'signin'
                ? 'Sign In'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Send Reset Link'}
            </Button>
          </form>

          {/* Forgot password link — only in signin mode */}
          {mode === 'signin' && (
            <button
              onClick={() => { setMode('forgot'); setError(''); setSuccess(''); setShowPassword(false) }}
              className="mt-4 text-xs text-text-secondary hover:text-[#d4a853] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          )}

          {/* Back to sign in — only in forgot mode */}
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); setShowPassword(false) }}
              className="mt-4 text-xs text-text-secondary hover:text-[#d4a853] transition-colors cursor-pointer"
            >
              Back to sign in
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-text-secondary">
          By signing in, you agree to our terms. View our{' '}
          <a href="/privacy" className="text-[#d4a853] hover:underline transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2520] border-t-[#d4a853]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
