import { Film } from 'lucide-react'
import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-surface-2 to-surface p-4 text-[#8a8078]">
        {icon ?? <Film size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-text-primary font-display">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-text-secondary text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
