'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { MovieGrid } from './MovieGrid'
import { Spinner } from '@/components/ui/Spinner'
import type { OMDbSearchResult } from '@/types'

interface MovieSearchProps {
  onSearchActive?: (active: boolean) => void
}

export function MovieSearch({ onSearchActive }: MovieSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OMDbSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.results ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => search(query), 300)
    return () => clearTimeout(timer)
  }, [query, search])

  // Notify parent about search state
  useEffect(() => {
    onSearchActive?.(query.trim().length > 0)
  }, [query, onSearchActive])

  return (
    <div className="w-full" id="movie-search">
      {/* Search input */}
      <div className="relative max-w-2xl mx-auto">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary"
          size={20}
        />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          id="search-input"
          className="w-full rounded-2xl border border-[#2a2520] bg-surface py-4 pl-14 pr-14 text-lg text-text-primary placeholder:text-text-secondary/60 focus:border-[#d4a853]/50 focus:outline-none focus:ring-2 focus:ring-[#d4a853]/20 focus:shadow-[0_0_20px_rgba(212,168,83,0.1)] transition-all duration-300 shadow-lg shadow-black/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setHasSearched(false)
            }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors rounded-full p-1 hover:bg-surface-2 cursor-pointer"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results */}
      {loading && <Spinner className="mt-10" />}
      {!loading && hasSearched && results.length === 0 && (
        <p className="mt-10 text-center text-text-secondary">
          No movies found for &ldquo;{query}&rdquo;
        </p>
      )}
      {!loading && results.length > 0 && (
        <div className="mt-10">
          <p className="mb-4 text-sm text-text-secondary">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <MovieGrid movies={results} />
        </div>
      )}
    </div>
  )
}
