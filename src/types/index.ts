export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type Watchlist = {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export type WatchlistItem = {
  id: string
  watchlist_id: string
  imdb_id: string
  title: string
  poster_url: string | null
  release_year: number | null
  added_at: string
}

// Watchlist with count of items (used in dashboard and profile)
export type WatchlistWithCount = Watchlist & {
  watchlist_items: { count: number }[]
}

export type OMDbSearchResult = {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type: string
}

export type OMDbMovie = {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Actors: string
  Plot: string
  Language: string
  Awards: string
  Poster: string
  imdbRating: string
  imdbVotes: string
  Response: string
}
