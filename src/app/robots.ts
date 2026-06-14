import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/movie/', '/u/', '/watchlists/', '/privacy'],
        disallow: [
          '/api/',
          '/auth/',
          '/login',
          '/signup',
          '/forgot-password',
          '/search',
        ],
      },
    ],
    sitemap: 'https://bingetrack.vercel.app/sitemap.xml',
  }
}
