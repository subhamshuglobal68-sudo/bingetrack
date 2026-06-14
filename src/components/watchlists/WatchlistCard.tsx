import Link from 'next/link'
import { Globe, Lock } from 'lucide-react'
import type { WatchlistWithCount } from '@/types'

interface WatchlistCardProps {
  watchlist: WatchlistWithCount
  basePath?: string
}

export function WatchlistCard({ watchlist, basePath = '/watchlists' }: WatchlistCardProps) {
  const count = watchlist.watchlist_items?.[0]?.count ?? 0

  return (
    <Link
      href={`${basePath}/${watchlist.id}`}
      className="group block rounded-2xl border border-[#2a2520] bg-gradient-card p-5 transition-all duration-200 hover:border-[#3a3228] hover:shadow-lg hover:shadow-black/40 card-glow"
      id={`watchlist-card-${watchlist.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors truncate pr-2">
          {watchlist.name}
        </h3>
        {watchlist.is_public ? (
          <Globe size={14} className="text-green-soft shrink-0 mt-1" />
        ) : (
          <Lock size={14} className="text-text-secondary shrink-0 mt-1" />
        )}
      </div>
      {watchlist.description && (
        <p className="text-sm text-text-secondary mb-3 line-clamp-2">
          {watchlist.description}
        </p>
      )}
      <p className="text-xs text-text-secondary">
        {count} {count === 1 ? 'movie' : 'movies'}
      </p>
    </Link>
  )
}
