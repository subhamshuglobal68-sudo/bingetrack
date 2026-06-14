# BingeTrack

A movie tracking and watchlist management web application built with Next.js, Supabase, and the OMDb API. Discover movies, create curated watchlists, and share your taste with others.

## Features

- **Movie Discovery** -- Search any movie via OMDb with real-time debounced results, or browse popular titles by genre
- **Movie Details** -- View poster, rating, director, cast, runtime, genres, awards, and plot synopsis for any film
- **Watchlists** -- Create, manage, and share personal watchlists with public/private visibility controls
- **User Profiles** -- Public profile pages displaying your username, avatar, and shared watchlists
- **Authentication** -- Email/password sign-up and sign-in with Supabase Auth, including email confirmation flow
- **Cinematic UI** -- Dark theme with warm gold accents, animated spotlight effects, film grain texture, and GPU-accelerated transitions

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Database | Supabase (Postgres + PostgREST) |
| Auth | Supabase Auth |
| Movie Data | OMDb API |
| Icons | Lucide React |
| Fonts | Inter (body) + Outfit (headings) |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- An OMDb API key (get one at [omdbapi.com](http://www.omdbapi.com/apikey.aspx))

### Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OMDB_API_KEY=your_omdb_api_key
```

### Supabase Database Setup

Create these tables in your Supabase project:

```sql
-- User profiles
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

Enable Row Level Security (RLS) on all tables and create policies so users can only modify their own data. Watchlist items are readable by anyone if the parent watchlist is public.

### Installation

```bash
git clone https://github.com/subhamshuglobal68-sudo/bingetrack.git
cd bingetrack
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
  app/
    api/movies/        # OMDb API proxy routes (search, popular, detail)
    auth/callback/     # Supabase auth callback handler
    login/             # Login and signup page
    movie/[id]/        # Movie detail page
    u/[username]/      # Public user profile
    watchlists/        # Watchlist dashboard and detail pages
  components/
    layout/            # Navbar, Footer
    movies/            # MovieCard, MovieGrid, MovieSearch, AddToWatchlistButton, RatingBadge
    ui/                # Avatar, Button, EmptyState, Modal, Spinner, Toast
    watchlists/        # WatchlistCard, WatchlistGrid, WatchlistHeader, CreateWatchlistModal, RemoveMovieButton
  lib/
    omdb.ts            # OMDb API client with in-memory cache
    supabase/          # Server and browser Supabase clients
    utils.ts           # Utility functions (cn, formatters, getInitials)
  types/
    index.ts           # TypeScript type definitions
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/popular` | Random genre popular movies (revalidates daily) |
| GET | `/api/movies/search?q={query}` | Search OMDb for movies |
| GET | `/api/movies/{imdbID}` | Full movie details by IMDb ID |

All watchlist CRUD operations run directly from the client via Supabase with Row Level Security enforcing permissions.

## License

This project uses the OMDb API under their terms of service. Movie data and images are provided by OMDb.
