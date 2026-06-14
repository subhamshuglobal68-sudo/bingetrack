import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read the BingeTrack privacy policy. How we collect, use, and protect your data.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://bingetrack.vercel.app/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-surface" />

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-text-primary font-display sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm text-text-secondary">
        Last updated: June 14, 2026
      </p>

      <div className="space-y-10 text-text-secondary leading-relaxed text-[15px]">
        {/* Introduction */}
        <p>
          BingeTrack is a movie watchlist app. This privacy policy explains what data we collect,
          why we collect it, and how we handle it. We keep things simple and transparent.
        </p>

        {/* Account Data */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Account Data</h2>
          <p className="mb-3">
            When you create an account, we collect the following through Supabase Authentication:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong className="text-text-primary">Email address</strong> — required for sign-up and sign-in.</li>
            <li><strong className="text-text-primary">Password</strong> — stored as a secure hash by Supabase. We never see or can access your plain-text password.</li>
            <li><strong className="text-text-primary">User ID</strong> — an internal unique identifier used to link your account to your data.</li>
          </ul>
        </section>

        {/* Profile Data */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Profile Data</h2>
          <p className="mb-3">
            Once signed up, you can optionally fill in a profile. We store the following in our database:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong className="text-text-primary">Username</strong> — unique and required. Used to build your public profile URL.</li>
            <li><strong className="text-text-primary">Full name</strong> — optional.</li>
            <li><strong className="text-text-primary">Avatar URL</strong> — optional.</li>
            <li><strong className="text-text-primary">Created at</strong> — a timestamp of when your account was created.</li>
          </ul>
        </section>

        {/* Watchlist Data */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Watchlist Data</h2>
          <p className="mb-3">
            The core of the app. We store the following for each watchlist:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Watchlist names and descriptions you create.</li>
            <li>Movie entries — including IMDb IDs, titles, poster URLs, and release years.</li>
            <li>Visibility setting — whether a watchlist is public or private.</li>
            <li>Created and updated timestamps.</li>
          </ul>
        </section>

        {/* Usage Data & Tracking */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Usage Data &amp; Tracking</h2>
          <p className="mb-3">
            BingeTrack is intentionally lightweight on tracking:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>No analytics cookies.</li>
            <li>No third-party tracking scripts.</li>
            <li>No advertising or ad-related data collection.</li>
            <li>We use <strong className="text-text-primary">session cookies</strong> — these are Supabase authentication tokens required to keep you signed in. They are not used for tracking.</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Third-Party Services</h2>
          <p className="mb-3">
            BingeTrack relies on the following third-party services to function:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-text-primary">Supabase</strong> — handles authentication and hosts our Postgres database. Supabase&apos;s own privacy policy governs how they handle infrastructure data.
            </li>
            <li>
              <strong className="text-text-primary">OMDb API</strong> — provides movie metadata such as titles, posters, ratings, and release years. OMDb may log API requests (as any HTTP service does).
            </li>
            <li>
              <strong className="text-text-primary">Vercel</strong> — hosts and deploys the application. Standard server logs may be collected by Vercel.
            </li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Data Sharing</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong className="text-text-primary">Public watchlists</strong> — if you set a watchlist to public, it is visible to anyone with the link or your profile page.</li>
            <li>We do <strong className="text-text-primary">not</strong> sell your data.</li>
            <li>We do <strong className="text-text-primary">not</strong> share your data with advertisers or any other third parties beyond the services described above.</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Your Rights</h2>
          <p className="mb-3">
            You are in control of your data. You can:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong className="text-text-primary">Delete your account</strong> — this removes all of your data from our systems permanently.</li>
            <li><strong className="text-text-primary">Export your data</strong> — request a copy of all data we hold about you.</li>
            <li><strong className="text-text-primary">Update your profile</strong> — change your username, name, or avatar at any time from your account settings.</li>
          </ul>
        </section>

        {/* Children&apos;s Privacy */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Children&apos;s Privacy</h2>
          <p>
            BingeTrack is not directed at children under the age of 13. We do not knowingly collect
            personal information from children. If you believe a child has provided us with data,
            please contact us and we will remove it.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Any changes will be reflected on this page
            with an updated date. We encourage you to review this page periodically.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text-primary">Questions?</h2>
          <p>
            If you have any questions about this privacy policy or your data,{' '}
            <a
              href="https://github.com/subhamshuglobal68-sudo/bingetrack/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d4a853] hover:underline font-medium transition-colors"
            >
              open an issue on GitHub
            </a>
            {' '}and we will get back to you.
          </p>
        </section>

        {/* Back to home */}
        <div className="pt-4 border-t border-[#2a2520]">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-[#d4a853] transition-colors"
          >
            &larr; Back to BingeTrack
          </Link>
        </div>
      </div>
    </div>
  )
}
