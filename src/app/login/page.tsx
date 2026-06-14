import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in or create a BingeTrack account to build and share movie watchlists.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginClient />
}
