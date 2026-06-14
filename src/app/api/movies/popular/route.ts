import { getPopularMovies } from '@/lib/omdb'
import { NextResponse } from 'next/server'

export async function GET() {
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
