import type { Metadata } from 'next'
import WatchlistsDashboard from './WatchlistsDashboard'

export const metadata: Metadata = {
  title: 'My Watchlists',
  robots: { index: false, follow: false },
}

export default function WatchlistsPage() {
  return <WatchlistsDashboard />
}
