import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPosterUrl } from '@/lib/omdb'
import { formatYear } from '@/lib/utils'
import { WatchlistHeader } from '@/components/watchlists/WatchlistHeader'
import { RemoveMovieButton } from '@/components/watchlists/RemoveMovieButton'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Metadata } from 'next'
import type { Watchlist, WatchlistItem } from '@/types'

interface WatchlistDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: WatchlistDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: watchlist } = await supabase
    .from('watchlists')
    .select('name')
    .eq('id', id)
    .single()
  return {
    title: watchlist ? `${watchlist.name} — BingeTrack` : 'Watchlist — BingeTrack',
  }
}

export default async function WatchlistDetailPage({ params }: WatchlistDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch watchlist
  const { data: watchlist } = await supabase
    .from('watchlists')
    .select('*')
    .eq('id', id)
    .single()

  if (!watchlist) notFound()

  // Check ownership
  const isOwner = user?.id === watchlist.user_id

  // If private and not owner, 404
  if (!watchlist.is_public && !isOwner) notFound()

  // Fetch items
  const { data: items } = await supabase
    .from('watchlist_items')
    .select('*')
    .eq('watchlist_id', id)
    .order('added_at', { ascending: false })

  const movieItems = (items ?? []) as WatchlistItem[]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <WatchlistHeader
        watchlist={watchlist as Watchlist}
        isOwner={isOwner}
        itemCount={movieItems.length}
      />

      {movieItems.length === 0 ? (
        <EmptyState
          title="No movies yet"
          description="Search for movies and add them to this watchlist."
          action={
            <Link
              href="/"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all"
            >
              Browse Movies
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movieItems.map(item => {
            const posterUrl = getPosterUrl(item.poster_url)
            return (
              <div key={item.id} className="group relative">
                {/* Remove button (owner only) */}
                {isOwner && (
                  <RemoveMovieButton
                    watchlistId={id}
                    imdbId={item.imdb_id}
                    movieTitle={item.title}
                  />
                )}

                <Link href={`/movie/${item.imdb_id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl bg-surface aspect-[2/3] ring-1 ring-border group-hover:ring-accent/50 transition-all duration-300">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-text-secondary text-xs text-center p-4">
                        No poster
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="mt-2.5 px-0.5">
                    <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </p>
                    {item.release_year && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatYear(String(item.release_year))}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
