import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/Avatar'
import { WatchlistGrid } from '@/components/watchlists/WatchlistGrid'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Metadata } from 'next'
import type { WatchlistWithCount } from '@/types'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  return {
    title: `@${username} — BingeTrack`,
    description: `View ${username}'s public movie watchlists on BingeTrack.`,
  }
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  // Fetch public watchlists
  const { data: watchlists } = await supabase
    .from('watchlists')
    .select('*, watchlist_items(count)')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const publicWatchlists = (watchlists ?? []) as WatchlistWithCount[]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Profile header */}
      <div className="mb-10 flex items-center gap-5">
        <Avatar src={profile.avatar_url} name={profile.full_name} size={72} />
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {profile.full_name ?? profile.username}
          </h1>
          <p className="text-text-secondary text-sm mt-0.5">@{profile.username}</p>
        </div>
      </div>

      {/* Watchlists */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text-primary">Public Watchlists</h2>
          <div className="h-px flex-1 bg-[#2a2520]" />
          <span className="text-sm text-text-secondary">
            {publicWatchlists.length} {publicWatchlists.length === 1 ? 'list' : 'lists'}
          </span>
        </div>

        {publicWatchlists.length === 0 ? (
          <EmptyState
            title="No public watchlists"
            description="This user hasn't shared any watchlists yet."
          />
        ) : (
          <WatchlistGrid watchlists={publicWatchlists} />
        )}
      </section>
    </div>
  )
}
