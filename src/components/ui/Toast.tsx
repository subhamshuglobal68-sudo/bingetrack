'use client'
import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl border',
        'animate-toast-slide-in',
        visible ? 'opacity-100' : 'opacity-0 transition-opacity duration-300',
        type === 'success'
          ? 'bg-[#1a1810]/90 text-[#e8c06a] border-[#3a3228]/50'
          : 'bg-destructive/10 text-destructive border-destructive/30'
      )}
    >
      {type === 'success' ? (
        <CheckCircle size={18} className="text-[#d4a853] shrink-0" />
      ) : (
        <XCircle size={18} className="text-destructive shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-1 shrink-0 cursor-pointer"
        aria-label="Dismiss"
      >
        <X size={14} className="opacity-60 hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  return { toast, showToast, dismissToast }
}
