import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { WebSiteSchema, WebAppSchema } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bingetrack.vercel.app'),
  title: {
    default: 'BingeTrack — Track Your Movies',
    template: '%s — BingeTrack',
  },
  description:
    'Create and share movie watchlists for free. Search any film, track what you want to watch, and share curated lists with friends.',
  openGraph: {
    siteName: 'BingeTrack',
    type: 'website',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'BingeTrack — Track Your Movies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: { canonical: 'https://bingetrack.vercel.app' },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="film-grain flex min-h-screen flex-col bg-background antialiased font-sans">
        <WebSiteSchema />
        <WebAppSchema />
        <div className="warm-spotlight" />
        <div className="dust-motes" />
        <Navbar profile={profile} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
