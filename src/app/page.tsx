'use client'

import { useState, useCallback, useEffect } from 'react'
import { MovieGrid } from '@/components/movies/MovieGrid'
import { MovieSearch } from '@/components/movies/MovieSearch'
import { Spinner } from '@/components/ui/Spinner'
import type { OMDbSearchResult } from '@/types'

export default function HomePage() {
  const [searchActive, setSearchActive] = useState(false)
  const [popular, setPopular] = useState<OMDbSearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch('/api/movies/popular')
        const data = await res.json()
        setPopular(data.results ?? [])
      } catch {
        setPopular([])
      } finally {
        setLoading(false)
      }
    }
    fetchPopular()
  }, [])

  const handleSearchActive = useCallback((active: boolean) => {
    setSearchActive(active)
  }, [])

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12">
      {/* Hero gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-hero" />

      {/* Hero */}
      <div className="mb-14 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-display animate-fade-in-up">
          <span className="text-text-primary">Discover & Track </span>
          <span className="bg-gradient-to-r from-[#d4a853] to-[#e8c06a] bg-clip-text text-transparent">Movies</span>
        </h1>
        <p className="mb-10 text-lg text-text-secondary max-w-xl mx-auto leading-relaxed animate-fade-in-up stagger-1">
          Search any movie, save it to a list, share with friends.
        </p>
        <div className="animate-fade-in-up stagger-2">
          <MovieSearch onSearchActive={handleSearchActive} />
        </div>
      </div>

      {/* Popular movies (hidden when search is active) */}
      {!searchActive && (
        <section className="animate-fade-in-up stagger-3">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-semibold text-text-primary">Popular Right Now</h2>
            <div className="h-px flex-1 bg-[#2a2520]" />
          </div>
          {loading ? <Spinner /> : <MovieGrid movies={popular} />}
        </section>
      )}
    </div>
  )
}
