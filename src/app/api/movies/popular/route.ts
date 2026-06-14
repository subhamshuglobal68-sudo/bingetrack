import { getPopularMovies } from '@/lib/omdb'
import { rateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { limited } = rateLimit(`popular:${ip}`, 60_000, 10)
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const results = await getPopularMovies()
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch popular movies' },
      { status: 500 }
    )
  }
}
