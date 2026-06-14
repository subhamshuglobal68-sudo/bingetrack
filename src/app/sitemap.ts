import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bingetrack.vercel.app'
  const supabase = await createClient()

  const [{ data: watchlists }, { data: profiles }] = await Promise.all([
    supabase
      .from('watchlists')
      .select('id, updated_at')
      .eq('is_public', true),
    supabase.from('profiles').select('username, created_at'),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const watchlistRoutes: MetadataRoute.Sitemap = (watchlists ?? []).map(
    (w) => ({
      url: `${baseUrl}/watchlists/${w.id}`,
      lastModified: new Date(w.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  )

  const profileRoutes: MetadataRoute.Sitemap = (profiles ?? []).map((p) => ({
    url: `${baseUrl}/u/${p.username}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...watchlistRoutes, ...profileRoutes]
}
