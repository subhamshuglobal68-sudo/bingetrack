import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getMovieDetail, getPosterUrl, getYouTubeTrailerUrl } from '@/lib/omdb'
import { createClient } from '@/lib/supabase/server'
import { formatYear, formatRating, formatRuntime } from '@/lib/utils'
import { AddToWatchlistButton } from '@/components/movies/AddToWatchlistButton'
import { Star, Clock, Calendar, Clapperboard, ExternalLink, Film } from 'lucide-react'
import type { Metadata } from 'next'

interface MoviePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetail(id)
  if (!movie) return { title: 'Movie Not Found — BingeTrack' }
  return {
    title: `${movie.Title} (${formatYear(movie.Year)}) — BingeTrack`,
    description: movie.Plot?.slice(0, 160),
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  const movie = await getMovieDetail(id)
  if (!movie) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const posterUrl = getPosterUrl(movie.Poster)
  const trailerUrl = getYouTubeTrailerUrl(movie.Title)
  const imdbRating = formatRating(movie.imdbRating)

  return (
    <div className="relative">
      {/* Cinematic backdrop gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-cinematic-backdrop" />

      <div className="relative mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0 mx-auto md:mx-0 animate-fade-in-up">
            <div className="relative h-[420px] w-[280px] overflow-hidden rounded-2xl bg-surface shadow-2xl shadow-black/40 border border-[#2a2520] film-frame">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.Title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-text-secondary">
                  No poster
                </div>
              )}
            </div>
          </div>

          {/* Info — staggered entrance */}
          <div className="flex-1 space-y-6 animate-fade-in-up stagger-1">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-text-primary font-display">
                {movie.Title}
              </h1>

              {/* Meta row */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formatYear(movie.Year)}
                </span>
                {movie.Runtime && movie.Runtime !== 'N/A' && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatRuntime(movie.Runtime)}
                  </span>
                )}
                {movie.Director && movie.Director !== 'N/A' && (
                  <span className="flex items-center gap-1.5">
                    <Clapperboard size={14} />
                    {movie.Director}
                  </span>
                )}
              </div>
            </div>

            {/* Genre */}
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="flex flex-wrap gap-2">
                {movie.Genre.split(', ').map(genre => (
                  <span
                    key={genre}
                    className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-text-secondary border border-[#2a2520]"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Rating */}
            {imdbRating !== 'N/A' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-surface border border-[#2a2520] px-4 py-3">
                  <Star
                    size={22}
                    className="text-rating"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  <span className="text-2xl font-bold text-text-primary">
                    {imdbRating}
                  </span>
                  <span className="text-sm text-text-secondary">/10</span>
                </div>
                {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                  <span className="text-sm text-text-secondary">
                    {movie.imdbVotes} votes
                  </span>
                )}
              </div>
            )}

            {/* Buttons row */}
            <div className="flex flex-wrap items-center gap-3">
              <AddToWatchlistButton
                movie={{
                  imdb_id: movie.imdbID,
                  title: movie.Title,
                  poster_url: movie.Poster !== 'N/A' ? movie.Poster : null,
                  release_year: movie.Year,
                }}
                isLoggedIn={!!user}
                userId={user?.id}
              />

              {/* Watch Trailer */}
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press inline-flex items-center gap-2 rounded-lg bg-surface border border-[#2a2520] px-4 py-2.5 text-sm font-medium text-text-primary hover:border-[#d4a853]/50 hover:text-[#d4a853] transition-all"
              >
                <Film size={16} />
                Watch Trailer
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Plot */}
            {movie.Plot && movie.Plot !== 'N/A' && (
              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                  Overview
                </h2>
                <p className="text-text-primary/90 leading-relaxed">{movie.Plot}</p>
              </div>
            )}

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {movie.Released && movie.Released !== 'N/A' && (
                <div>
                  <span className="text-text-secondary">Release Date</span>
                  <p className="text-text-primary mt-0.5">{movie.Released}</p>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div>
                  <span className="text-text-secondary">Language</span>
                  <p className="text-text-primary mt-0.5">{movie.Language}</p>
                </div>
              )}
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="col-span-2">
                  <span className="text-text-secondary">Actors</span>
                  <p className="text-text-primary mt-0.5">{movie.Actors}</p>
                </div>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="col-span-2">
                  <span className="text-text-secondary">Awards</span>
                  <p className="text-text-primary mt-0.5">{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
