'use client'
import { createClient } from '@/lib/supabase/client'
import { Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(() => code ? '' : 'No reset code found. Please request a new password reset link.')
  const [success, setSuccess] = useState('')
  const [exchanging, setExchanging] = useState(true)
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) return
    supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeError }) => {
      setExchanging(false)
      if (exchangeError) {
        setError(exchangeError.message === 'PKCE code verifier not found in storage'
          ? 'Session expired. Please request a new password reset link.'
          : exchangeError.message)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError('Failed to update password. The link may have expired. Please request a new one.')
    } else {
      setSuccess('Password updated! Redirecting to sign in...')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (exchanging && code) {
    return (
      <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-surface" />
        <div className="flex flex-col items-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2520] border-t-[#d4a853]" />
          <p className="text-sm text-text-secondary">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-surface" />

      <div className="w-full max-w-sm">
        <div className="animate-modal-enter rounded-2xl border border-[#2a2520] border-t-2 border-t-[#d4a853] bg-surface p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-[#d4a853]/10 p-4">
              <Film size={40} className="text-[#d4a853]" strokeWidth={2} />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-text-primary font-display">
            {error ? 'Link Expired' : 'Set New Password'}
          </h1>
          <p className="mb-8 text-sm text-text-secondary leading-relaxed">
            {error
              ? 'Please request a new password reset link.'
              : 'Choose a strong password for your account.'}
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-[#2a1a10]/50 border border-[#c44040]/30 px-4 py-3 text-sm text-[#e88080]">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg bg-[#1a1a10]/50 border border-[#4a9e6e]/30 px-4 py-3 text-sm text-[#6abe8e]">
              {success}
            </div>
          )}

          {!error && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="New password"
                  required
                  minLength={6}
                  maxLength={128}
                  className="w-full rounded-lg border border-[#2a2520] bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-[#d4a853] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20 transition-all"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                  maxLength={128}
                  className="w-full rounded-lg border border-[#2a2520] bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-[#d4a853] focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20 transition-all"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-3"
                isLoading={loading}
              >
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2a2520] border-t-[#d4a853]" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
