import Image from 'next/image'
import Link from 'next/link'
import { getPosterUrl } from '@/lib/omdb'
import { formatYear } from '@/lib/utils'
import type { OMDbSearchResult } from '@/types'

interface MovieCardProps {
  movie: OMDbSearchResult
  priority?: boolean
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.Poster)

  return (
    <Link href={`/movie/${movie.imdbID}`} className="group block animate-fade-in-scale" id={`movie-card-${movie.imdbID}`}>
      <div className="card-glow relative overflow-hidden rounded-xl bg-gradient-card aspect-[2/3] border border-[#2a2520] shadow-lg shadow-black/40 group-hover:border-[#3a3228]">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-secondary text-xs text-center p-4">
            No poster available
          </div>
        )}

        {/* Enhanced hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bottom gradient for title readability */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="truncate text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
          {movie.Title}
        </p>
        <p className="text-xs text-text-secondary mt-0.5">{formatYear(movie.Year)}</p>
      </div>
    </Link>
  )
}
