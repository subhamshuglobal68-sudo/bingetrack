export default function MovieLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Poster skeleton */}
        <div className="mx-auto w-full max-w-sm shrink-0 md:mx-0 md:w-80">
          <div className="aspect-[2/3] rounded-2xl bg-surface border border-[#2a2520]" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 space-y-4">
          <div className="h-8 w-3/4 rounded-lg bg-surface" />
          <div className="h-4 w-1/3 rounded-lg bg-surface" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-surface" />
            <div className="h-6 w-20 rounded-full bg-surface" />
            <div className="h-6 w-14 rounded-full bg-surface" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-surface" />
            <div className="h-4 w-full rounded bg-surface" />
            <div className="h-4 w-2/3 rounded bg-surface" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-10 w-32 rounded-lg bg-surface" />
            <div className="h-10 w-32 rounded-lg bg-surface" />
          </div>
        </div>
      </div>
    </div>
  )
}
