import { WatchlistCard } from './WatchlistCard'
import type { WatchlistWithCount } from '@/types'

interface WatchlistGridProps {
  watchlists: WatchlistWithCount[]
  basePath?: string
}

export function WatchlistGrid({ watchlists, basePath }: WatchlistGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {watchlists.map(watchlist => (
        <WatchlistCard
          key={watchlist.id}
          watchlist={watchlist}
          basePath={basePath}
        />
      ))}
    </div>
  )
}
