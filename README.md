
<p align="center">
  <img src="public/icon.png" alt="BingeTrack" width="80" />
</p>

<h1 align="center">BingeTrack</h1>

<p align="center">
  <strong>A free movie watchlist tracking app with a cinematic dark UI — search any film, organize curated watchlists, and share your taste with the world.</strong>
</p>

<p align="center">
  <a href="https://bingetrack.vercel.app">Live Demo</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a>
</p>

---

## Features

- **Movie Search & Discovery** — Search any movie via OMDb with real-time debounced results, or browse trending titles by genre
- **Movie Details** — View poster, IMDb rating, director, cast, runtime, genres, awards, plot synopsis, and trailer link for any film
- **Watchlists** — Create, rename, and delete public or private watchlists; add and remove movies from any list
- **User Profiles** — Auto-generated username from email, public profile pages at `/u/[username]` with avatar and shared watchlists
- **Authentication** — Email/password sign-up and sign-in with Supabase Auth, including email confirmation, password reset, and Google OAuth (ready)
- **Data Export** — Download your entire profile and watchlists as JSON or CSV for GDPR compliance
- **Privacy Policy** — Dedicated privacy policy page at `/privacy`
- **"The Screening Room" UI** — A 9-layer CSS background system with projector cone, anamorphic streak, dust particles, film grain, velvet depth, and warm spotlight effects

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + PostgREST) |
| Authentication | [Supabase Auth](https://supabase.com/auth) |
| Movie Data | [OMDb API](http://www.omdbapi.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | Inter (body) + Outfit (headings) via `next/font` |

## Getting Started

### Prerequisites

- **Node.js** `>= 18`
- A **Supabase** project ([free tier](https://supabase.com/pricing) works)
- An **OMDb API** key — get one free at [omdbapi.com](http://www.omdbapi.com/apikey.aspx)

### Installation

```bash
git clone https://github.com/subhamshuglobal68-sudo/bingetrack.git
cd bingetrack
npm install
```

### Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `OMDB_API_KEY` | Yes | Your OMDb API key (server-only) |

### Supabase Database Setup

Create the following tables in your Supabase project's SQL Editor:

```sql
-- User profiles (auto-created on signup via trigger)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Watchlists
create table watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Watchlist items
create table watchlist_items (
  id uuid primary key default gen_random_uuid(),
  watchlist_id uuid references watchlists(id) on delete cascade not null,
  imdb_id text not null,
  title text not null,
  poster_url text,
  release_year text,
  added_at timestamptz default now(),
  unique(watchlist_id, imdb_id)
);
```

Enable **Row Level Security (RLS)** on all tables and create policies so users can only modify their own data. Watchlist items are readable by anyone when the parent watchlist is public.

### Run the App

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── app/
│   ├── api/movies/              # OMDb proxy routes (search, detail, popular)
│   ├── auth/callback/           # Supabase auth callback handler
│   ├── login/                   # Auth page (login / signup / forgot password)
│   ├── reset-password/          # Password reset page
│   ├── search/                  # Search results page
│   ├── movie/[id]/              # Movie detail page by IMDb ID
│   ├── watchlists/              # Dashboard + watchlist detail pages
│   ├── u/[username]/            # Public profile pages
│   ├── privacy/                 # Privacy policy
│   ├── api/movies/              # Server-side OMDb API proxy
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # Custom 404 page
│   ├── loading.tsx              # Root loading skeleton
│   ├── robots.ts                # SEO robots.txt
│   ├── sitemap.ts               # SEO sitemap
│   └── layout.tsx               # Root layout (Navbar + Footer + fonts)
├── components/
│   ├── data/                    # ExportDataModal (JSON/CSV download)
│   ├── layout/                  # Navbar, Footer
│   ├── movies/                  # MovieCard, MovieGrid, MovieSearch, AddToWatchlistButton
│   ├── seo/                     # JsonLd structured data
│   ├── ui/                      # Avatar, Button, EmptyState, Modal, Spinner, Toast
│   └── watchlists/              # WatchlistCard, WatchlistGrid, WatchlistHeader, CreateWatchlistModal, RemoveMovieButton
├── lib/
│   ├── omdb.ts                  # OMDb API client with in-memory cache (500 entries, 1h TTL)
│   ├── rate-limit.ts            # In-memory sliding window rate limiter
│   ├── supabase/                # Server + browser Supabase clients
│   └── utils.ts                 # Utility functions (cn, formatters, getInitials)
├── types/
│   └── index.ts                 # TypeScript type definitions
└── middleware.ts                 # Supabase session refresh + auth route protection
```

## API Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/movies/search?q={query}` | Search OMDb for movies by title |
| GET | `/api/movies/popular` | Random genre popular movies (revalidates daily) |
| GET | `/api/movies/{imdbID}` | Full movie details by IMDb ID |

All watchlist CRUD operations run directly from the client via Supabase — Row Level Security enforces permissions at the database level.

## Security

BingeTrack implements defense-in-depth security at multiple layers:

| Layer | Implementation |
| --- | --- |
| **Input Validation** | `maxLength` constraints, regex patterns, IMDb ID format validation on all user inputs |
| **Rate Limiting** | In-memory sliding window rate limiter on all API routes (30 req/min default) |
| **Security Headers** | `X-Content-Type-Options: nosniff`, `Content-Security-Policy: frame-ancestors 'self' https://sourabh08.vercel.app`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()` |
| **Auth Protection** | Middleware enforces session refresh; unauthenticated users redirected from `/watchlists` to `/login` |
| **Open Redirect Guard** | Auth flows validate redirect targets against allowed paths |
| **RLS + App-Level** | Supabase Row Level Security policies alongside app-level `user_id` filters for defense in depth |
| **Error Boundaries** | Global `error.tsx` and custom `not-found.tsx` prevent unhandled crashes |
| **API Key Isolation** | `OMDB_API_KEY` is server-only — never exposed to the client bundle |

## UI: "The Screening Room"

The UI is built on a 9-layer CSS background system that creates an immersive cinematic experience:

1. **Velvet Depth** — Corner shadow radials simulating heavy theater curtains
2. **Vignette** — Dark edges fading to neutral center
3. **Screen Glow** — Soft central warm light pool
4. **Projector Cone** — Animated conic gradient beam from above
5. **Anamorphic Streak** — Horizontal gold lens flare drifting across the viewport
6. **Film Grain** — SVG fractal noise overlay with radial reel stripes
7. **Warm Spotlight** — Breathing radial gradient spotlight from above
8. **Dust Motes** — Floating gold particles in the projector beam
9. **Ambient Warmth** — Drifting warm light pools at the bottom-left and top-right

All animations respect `prefers-reduced-motion` for accessibility.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the **ISC License**.

Movie data and images are provided by the [OMDb API](http://www.omdbapi.com/) under their terms of service.
