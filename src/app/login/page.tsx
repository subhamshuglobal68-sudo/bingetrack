'use client'
import { createClient } from '@/lib/supabase/client'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const rawRedirect = searchParams.get('redirect') ?? '/watchlists'
  const redirect = rawRedirect.startsWith('/') && !rawRedirect.includes('://')
    ? rawRedirect
    : '/watchlists'
  const supabase = createClient()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })
      setLoading(false)
      if (error) {
        setError(error.message)
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
        setError(error.message)
      } else {
        window.location.href = redirect
      }
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-accent/10 p-4">
              <Film size={40} className="text-accent" strokeWidth={2} />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary">
            Welcome to BingeTrack
          </h1>
          <p className="mb-8 text-sm text-text-secondary leading-relaxed">
            {mode === 'signin'
              ? 'Sign in to create and manage your movie watchlists.'
              : 'Create an account to start tracking movies.'}
          </p>

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-lg bg-background p-1">
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess('') }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setSuccess('') }}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-950/50 border border-red-800/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-green-950/50 border border-green-800/30 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3"
              isLoading={loading}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text-secondary">
          By signing in, you agree to our terms. Your data stays private.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
