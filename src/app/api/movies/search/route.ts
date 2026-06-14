import { searchMovies } from '@/lib/omdb'
import { rateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { limited } = rateLimit(`search:${ip}`, 60_000, 30)
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  if (q.length > 200) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = await searchMovies(q)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
