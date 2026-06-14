import { getMovieDetail } from '@/lib/omdb'
import { rateLimit } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { limited } = rateLimit(`movie:${ip}`, 60_000, 60)
  if (limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { id } = await params

  if (!/^tt\d{7,}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid IMDB ID format' }, { status: 400 })
  }

  try {
    const movie = await getMovieDetail(id)
    if (!movie) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(movie)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    )
  }
}
