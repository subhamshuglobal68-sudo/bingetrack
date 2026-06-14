import type { OMDbMovie, Profile } from '@/types'

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BingeTrack',
    url: 'https://bingetrack.vercel.app',
    description:
      'Free movie watchlist app. Search any film, build lists, share with friends.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://bingetrack.vercel.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebAppSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BingeTrack',
    applicationCategory: 'EntertainmentApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Free movie watchlist app. Search any film, build lists, share with friends.',
    url: 'https://bingetrack.vercel.app',
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function MovieSchema({ movie }: { movie: OMDbMovie }) {
  const hasRating = movie.imdbRating && movie.imdbRating !== 'N/A'
  const hasVotes = movie.imdbVotes && movie.imdbVotes !== 'N/A'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.Title,
    description: movie.Plot !== 'N/A' ? movie.Plot : undefined,
    image: movie.Poster !== 'N/A' ? movie.Poster : undefined,
    datePublished: movie.Year,
    genre:
      movie.Genre !== 'N/A' ? movie.Genre.split(', ') : undefined,
    duration:
      movie.Runtime !== 'N/A'
        ? `PT${movie.Runtime.replace(' min', '')}M`
        : undefined,
    director:
      movie.Director !== 'N/A'
        ? movie.Director.split(', ').map((name) => ({
            '@type': 'Person',
            name,
          }))
        : undefined,
    aggregateRating:
      hasRating && hasVotes
        ? {
            '@type': 'AggregateRating',
            ratingValue: movie.imdbRating,
            ratingCount: movie.imdbVotes.replace(/,/g, ''),
            bestRating: '10',
            worstRating: '1',
            ratingExplanation: 'IMDB user rating',
          }
        : undefined,
    sameAs: `https://www.imdb.com/title/${movie.imdbID}/`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProfileSchema({ profile }: { profile: Profile }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.full_name ?? profile.username,
      identifier: profile.username,
      ...(profile.avatar_url && { image: profile.avatar_url }),
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
