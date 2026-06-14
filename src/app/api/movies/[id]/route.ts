import { getMovieDetail } from '@/lib/omdb'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
