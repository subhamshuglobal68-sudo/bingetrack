import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

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
  title: 'BingeTrack — Track Your Movies',
  description:
    'Create and share movie watchlists. Discover, organize, and track the films you love. Powered by OMDb.',
  openGraph: {
    title: 'BingeTrack — Track Your Movies',
    description:
      'Create and share movie watchlists. Discover, organize, and track the films you love.',
    siteName: 'BingeTrack',
    type: 'website',
  },
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
        <div className="warm-spotlight" />
        <div className="dust-motes" />
        <Navbar profile={profile} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
