import { MovieCard } from './MovieCard'
import type { OMDbSearchResult } from '@/types'

export function MovieGrid({ movies }: { movies: OMDbSearchResult[] }) {
  if (movies.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, index) => (
        <div key={movie.imdbID} className={`animate-fade-in-scale stagger-${Math.min(index + 1, 6)}`}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}
