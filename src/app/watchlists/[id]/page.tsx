import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getPosterUrl } from '@/lib/omdb'
import { formatYear } from '@/lib/utils'
import { WatchlistHeader } from '@/components/watchlists/WatchlistHeader'
import { RemoveMovieButton } from '@/components/watchlists/RemoveMovieButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'
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
    .select('name, description')
    .eq('id', id)
    .single()

  if (!watchlist) {
    return { title: 'Watchlist — BingeTrack' }
  }

  const { count } = await supabase
    .from('watchlist_items')
    .select('*', { count: 'exact', head: true })
    .eq('watchlist_id', id)

  const title = watchlist.name
  const description = watchlist.description
    ? watchlist.description.slice(0, 155)
    : `A curated movie watchlist on BingeTrack with ${count ?? 0} films.`

  return {
    title: `${title} — Watchlist`,
    description,
    openGraph: {
      title: `${title} — BingeTrack Watchlist`,
      description,
    },
    twitter: {
      card: 'summary',
      title: `${title} — BingeTrack Watchlist`,
      description,
    },
    alternates: {
      canonical: `https://bingetrack.vercel.app/watchlists/${id}`,
    },
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
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://bingetrack.vercel.app' },
          {
            name: watchlist.name,
            url: `https://bingetrack.vercel.app/watchlists/${id}`,
          },
        ]}
      />

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
              className="rounded-lg bg-gradient-accent px-5 py-2.5 text-sm font-medium text-[#0a0a0a] font-semibold shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/30 transition-all"
            >
              Browse Movies
            </Link>
          }
        />
      ) : (
        <ul
          aria-label="Movies in this watchlist"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {movieItems.map((item) => {
            const posterUrl = getPosterUrl(item.poster_url)
            return (
              <li key={item.id} className="group relative">
                {/* Remove button (owner only) */}
                {isOwner && (
                  <RemoveMovieButton
                    watchlistId={id}
                    imdbId={item.imdb_id}
                    movieTitle={item.title}
                  />
                )}

                <Link href={`/movie/${item.imdb_id}`} className="block">
                  <div className="relative overflow-hidden rounded-xl bg-surface aspect-[2/3] border border-[#2a2520] shadow-lg shadow-black/40 group-hover:border-[#3a3228] transition-all duration-300">
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
                    <p className="truncate text-sm font-medium text-text-primary group-hover:text-[#d4a853] transition-colors">
                      {item.title}
                    </p>
                    {item.release_year && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatYear(String(item.release_year))}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
