import type { OMDbSearchResult, OMDbMovie } from '@/types'

const OMDB_BASE = 'https://www.omdbapi.com'

function apiKey(): string {
  const key = process.env.OMDB_API_KEY
  if (!key) throw new Error('OMDB_API_KEY is not set')
  return key
}

export function getPosterUrl(poster: string | null): string | null {
  if (!poster || poster === 'N/A') return null
  return poster
}

export function getYouTubeTrailerUrl(title: string): string {
  const query = encodeURIComponent(`${title} official trailer`)
  return `https://www.youtube.com/results?search_query=${query}`
}

const detailCache = new Map<string, { data: OMDbMovie; ts: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour
const MAX_CACHE_SIZE = 500

export async function searchMovies(query: string): Promise<OMDbSearchResult[]> {
  const res = await fetch(
    `${OMDB_BASE}/?s=${encodeURIComponent(query)}&apikey=${apiKey()}&type=movie`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('OMDb search failed')
  const data = await res.json()
  if (data.Response === 'False') return []
  return (data.Search ?? []) as OMDbSearchResult[]
}

export async function getPopularMovies(): Promise<OMDbSearchResult[]> {
  const genres = ['action', 'comedy', 'drama', 'thriller', 'adventure']
  const genre = genres[Math.floor(Math.random() * genres.length)]
  const res = await fetch(
    `${OMDB_BASE}/?s=${genre}&apikey=${apiKey()}&type=movie`,
    { next: { revalidate: 86400 } }
  )
  if (!res.ok) throw new Error('OMDb popular movies fetch failed')
  const data = await res.json()
  if (data.Response === 'False') return []
  return (data.Search ?? []) as OMDbSearchResult[]
}

export async function getMovieDetail(imdbID: string): Promise<OMDbMovie | null> {
  const cached = detailCache.get(imdbID)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data

  const res = await fetch(
    `${OMDB_BASE}/?i=${imdbID}&apikey=${apiKey()}&plot=full`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return null
  const data = await res.json()
  if (data.Response === 'False') return null

  detailCache.set(imdbID, { data, ts: Date.now() })

  // Evict oldest entry if cache exceeds max size
  if (detailCache.size > MAX_CACHE_SIZE) {
    const oldestKey = detailCache.keys().next().value
    if (oldestKey) detailCache.delete(oldestKey)
  }

  return data as OMDbMovie
}
