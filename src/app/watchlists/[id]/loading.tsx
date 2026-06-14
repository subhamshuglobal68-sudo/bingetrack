export default function WatchlistLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8 flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-lg bg-surface" />
          <div className="h-4 w-40 rounded bg-surface" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-surface" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] rounded-xl bg-surface border border-[#2a2520]" />
            <div className="h-4 w-3/4 rounded bg-surface" />
            <div className="h-3 w-1/2 rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  )
}
