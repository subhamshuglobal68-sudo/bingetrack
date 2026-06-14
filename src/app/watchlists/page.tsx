'use client'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { WatchlistGrid } from '@/components/watchlists/WatchlistGrid'
import { CreateWatchlistModal } from '@/components/watchlists/CreateWatchlistModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import type { WatchlistWithCount } from '@/types'

export default function WatchlistsPage() {
  const supabase = createClient()
  const [watchlists, setWatchlists] = useState<WatchlistWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const fetchWatchlists = async () => {
    const { data } = await supabase
      .from('watchlists')
      .select('*, watchlist_items(count)')
      .order('created_at', { ascending: false })

    setWatchlists((data as WatchlistWithCount[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWatchlists()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch when window regains focus (covers navigation back from detail)
  useEffect(() => {
    const handler = () => fetchWatchlists()
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return <Spinner className="mt-20" />

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            My Watchlists
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {watchlists.length} {watchlists.length === 1 ? 'list' : 'lists'}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} id="new-watchlist-btn">
          <Plus size={16} /> New List
        </Button>
      </div>

      {/* Content */}
      {watchlists.length === 0 ? (
        <EmptyState
          title="No watchlists yet"
          description="Create your first watchlist to start organizing your favorite movies."
          action={
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create Watchlist
            </Button>
          }
        />
      ) : (
        <WatchlistGrid watchlists={watchlists} />
      )}

      {/* Create modal */}
      <CreateWatchlistModal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false)
          fetchWatchlists()
        }}
      />
    </div>
  )
}
