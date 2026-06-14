import type { Metadata } from 'next'
import { MovieSearch } from '@/components/movies/MovieSearch'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" Movie Results` : 'Search Movies',
    robots: { index: false },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-text-primary font-display">
        {q ? `Results for "${q}"` : 'Search Movies'}
      </h1>
      <MovieSearch initialQuery={q} />
    </div>
  )
}
