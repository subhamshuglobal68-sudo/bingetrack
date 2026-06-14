export function Footer() {
  return (
    <footer className="mt-auto relative border-t border-[#2a2520] bg-[#0a0a0a]/50 py-8">
      {/* Gradient top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a853]/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-text-secondary">
        <p>
          Movie data and ratings provided by the{' '}
          <a
            href="https://www.omdbapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d4a853] hover:underline font-medium transition-colors"
          >
            OMDb API (Open Movie Database)
          </a>
          . Ratings shown are IMDB community ratings on a 1–10 scale.
          BingeTrack is not affiliated with, endorsed by, or certified by OMDb or IMDB.
        </p>
      </div>
    </footer>
  )
}
