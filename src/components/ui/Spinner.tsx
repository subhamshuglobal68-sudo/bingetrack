import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)} role="status" aria-label="Loading">
      <div
        className="h-8 w-8 animate-spin rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0%, transparent 70%, #d4a853 100%)',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
