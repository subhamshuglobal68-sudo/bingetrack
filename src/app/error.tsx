'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-2xl border border-[#2a2520] bg-surface p-8 shadow-2xl max-w-md w-full">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle size={24} className="text-destructive" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-bold text-text-primary font-display">
          Something went wrong
        </h2>
        <p className="mb-6 text-sm text-text-secondary">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="w-full">
          Try Again
        </Button>
      </div>
    </div>
  )
}
