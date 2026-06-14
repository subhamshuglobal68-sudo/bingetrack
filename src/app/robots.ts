import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/watchlists/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://bingetrack.vercel.app' : 'http://localhost:3000'}/sitemap.xml`,
  }
}
